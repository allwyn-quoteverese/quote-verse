import { 
  IStorage, 
  SearchParams
} from "./storage";
import { 
  authors, 
  categories, 
  quotes, 
  quoteCategories, 
  quoteTags, 
  tags,
  type Author,
  type Category,
  type InsertAuthor,
  type InsertCategory,
  type InsertQuote,
  type InsertTag,
  type Quote,
  type QuoteWithAuthor,
  type Tag
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, and, desc, like, or, inArray } from "drizzle-orm";
import { PostgresError } from "@neondatabase/serverless";
import { alias } from "drizzle-orm/pg-core";

export class DatabaseStorage implements IStorage {
  // Quote methods
  async getQuotes(page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const offset = (page - 1) * limit;
    
    const results = await db.query.quotes.findMany({
      limit,
      offset,
      with: {
        author: true
      }
    });
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(results);
    
    return enrichedQuotes;
  }
  
  async getQuotesByCategory(categorySlug: string, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const offset = (page - 1) * limit;
    
    // First, get the category ID
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) {
      return [];
    }
    
    // Get quote IDs that belong to this category
    const quoteCategoriesResult = await db
      .select({ quoteId: quoteCategories.quoteId })
      .from(quoteCategories)
      .where(eq(quoteCategories.categoryId, category.id));
    
    const quoteIds = quoteCategoriesResult.map(row => row.quoteId);
    
    if (quoteIds.length === 0) {
      return [];
    }
    
    // Get quotes with these IDs
    const results = await db.query.quotes.findMany({
      where: inArray(quotes.id, quoteIds),
      limit,
      offset,
      with: {
        author: true
      }
    });
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(results);
    
    return enrichedQuotes;
  }
  
  async getQuotesByTag(tagSlug: string, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const offset = (page - 1) * limit;
    
    // First, get the tag ID
    const tag = await this.getTagBySlug(tagSlug);
    if (!tag) {
      return [];
    }
    
    // Get quote IDs that have this tag
    const quoteTagsResult = await db
      .select({ quoteId: quoteTags.quoteId })
      .from(quoteTags)
      .where(eq(quoteTags.tagId, tag.id));
    
    const quoteIds = quoteTagsResult.map(row => row.quoteId);
    
    if (quoteIds.length === 0) {
      return [];
    }
    
    // Get quotes with these IDs
    const results = await db.query.quotes.findMany({
      where: inArray(quotes.id, quoteIds),
      limit,
      offset,
      with: {
        author: true
      }
    });
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(results);
    
    return enrichedQuotes;
  }
  
  async getQuotesByAuthor(authorId: number, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const offset = (page - 1) * limit;
    
    const results = await db.query.quotes.findMany({
      where: eq(quotes.authorId, authorId),
      limit,
      offset,
      with: {
        author: true
      }
    });
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(results);
    
    return enrichedQuotes;
  }
  
  async getQuoteById(id: number): Promise<QuoteWithAuthor | undefined> {
    const result = await db.query.quotes.findFirst({
      where: eq(quotes.id, id),
      with: {
        author: true
      }
    });
    
    if (!result) {
      return undefined;
    }
    
    // Add categories and tags
    const [enrichedQuote] = await this.enrichQuotesWithRelations([result]);
    
    return enrichedQuote;
  }
  
  async getRandomQuote(): Promise<QuoteWithAuthor | undefined> {
    const totalQuotes = await this.getTotalQuotes();
    if (totalQuotes === 0) {
      return undefined;
    }
    
    const randomId = Math.floor(Math.random() * totalQuotes) + 1;
    
    const result = await db.query.quotes.findFirst({
      where: eq(quotes.id, randomId),
      with: {
        author: true
      }
    });
    
    if (!result) {
      return undefined;
    }
    
    // Add categories and tags
    const [enrichedQuote] = await this.enrichQuotesWithRelations([result]);
    
    return enrichedQuote;
  }
  
  async getFeaturedQuotes(limit: number = 6): Promise<QuoteWithAuthor[]> {
    const results = await db.query.quotes.findMany({
      where: eq(quotes.isFeatured, true),
      limit,
      with: {
        author: true
      }
    });
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(results);
    
    return enrichedQuotes;
  }
  
  async searchQuotes(params: SearchParams): Promise<{ quotes: QuoteWithAuthor[], total: number }> {
    const { q, author, category, tag, page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    
    // Text search
    if (q) {
      whereConditions.push(like(quotes.text, `%${q}%`));
    }
    
    // Filter by author name
    if (author) {
      const authorResults = await db
        .select({ id: authors.id })
        .from(authors)
        .where(like(authors.name, `%${author}%`));
      
      const authorIds = authorResults.map(row => row.id);
      if (authorIds.length > 0) {
        whereConditions.push(inArray(quotes.authorId, authorIds));
      } else {
        // No authors match, return empty result
        return { quotes: [], total: 0 };
      }
    }
    
    // Get IDs for filtered quotes by category
    let categoryQuoteIds: number[] = [];
    if (category) {
      const categoryResult = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category));
      
      if (categoryResult.length > 0) {
        const categoryId = categoryResult[0].id;
        const quoteCatsResult = await db
          .select({ quoteId: quoteCategories.quoteId })
          .from(quoteCategories)
          .where(eq(quoteCategories.categoryId, categoryId));
        
        categoryQuoteIds = quoteCatsResult.map(row => row.quoteId);
        
        if (categoryQuoteIds.length === 0) {
          return { quotes: [], total: 0 };
        }
      } else {
        return { quotes: [], total: 0 };
      }
    }
    
    // Get IDs for filtered quotes by tag
    let tagQuoteIds: number[] = [];
    if (tag) {
      const tagResult = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, tag));
      
      if (tagResult.length > 0) {
        const tagId = tagResult[0].id;
        const quoteTagsResult = await db
          .select({ quoteId: quoteTags.quoteId })
          .from(quoteTags)
          .where(eq(quoteTags.tagId, tagId));
        
        tagQuoteIds = quoteTagsResult.map(row => row.quoteId);
        
        if (tagQuoteIds.length === 0) {
          return { quotes: [], total: 0 };
        }
      } else {
        return { quotes: [], total: 0 };
      }
    }
    
    // Combine category and tag filters with other conditions
    if (categoryQuoteIds.length > 0) {
      whereConditions.push(inArray(quotes.id, categoryQuoteIds));
    }
    
    if (tagQuoteIds.length > 0) {
      whereConditions.push(inArray(quotes.id, tagQuoteIds));
    }
    
    // Build the WHERE clause
    let queryBuilder = db.select().from(quotes);
    
    if (whereConditions.length > 0) {
      const condition = whereConditions.reduce((acc, curr) => and(acc, curr));
      queryBuilder = queryBuilder.where(condition);
    }
    
    // Count total results for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(queryBuilder.as('filtered_quotes'));
    
    const total = countResult[0]?.count || 0;
    
    // Get the actual results with pagination
    let results = await queryBuilder
      .limit(limit)
      .offset(offset)
      .innerJoin(authors, eq(quotes.authorId, authors.id))
      .orderBy(quotes.id);
    
    // Convert to QuoteWithAuthor format
    const quotesWithAuthor: (Quote & { author: Author })[] = results.map(row => ({
      id: row.quotes.id,
      text: row.quotes.text,
      authorId: row.quotes.authorId,
      source: row.quotes.source,
      isFeatured: row.quotes.isFeatured,
      author: {
        id: row.authors.id,
        name: row.authors.name,
        bio: row.authors.bio,
        quoteCount: row.authors.quoteCount
      }
    }));
    
    // Add categories and tags to each quote
    const enrichedQuotes = await this.enrichQuotesWithRelations(quotesWithAuthor);
    
    return { quotes: enrichedQuotes, total };
  }
  
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [result] = await db
      .insert(quotes)
      .values(quote)
      .returning();
    
    return result;
  }
  
  async getTotalQuotes(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(quotes);
    
    return result[0]?.count || 0;
  }
  
  // Author methods
  async getAuthors(page: number = 1, limit: number = 10): Promise<Author[]> {
    const offset = (page - 1) * limit;
    
    const results = await db
      .select()
      .from(authors)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(authors.quoteCount));
    
    return results;
  }
  
  async getAuthorById(id: number): Promise<Author | undefined> {
    const result = await db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);
    
    return result[0];
  }
  
  async getAuthorByName(name: string): Promise<Author | undefined> {
    const result = await db
      .select()
      .from(authors)
      .where(eq(authors.name, name))
      .limit(1);
    
    return result[0];
  }
  
  async getPopularAuthors(limit: number = 5): Promise<Author[]> {
    const results = await db
      .select()
      .from(authors)
      .orderBy(desc(authors.quoteCount))
      .limit(limit);
    
    return results;
  }
  
  async createAuthor(author: InsertAuthor): Promise<Author> {
    const [result] = await db
      .insert(authors)
      .values(author)
      .returning();
    
    return result;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    
    return result[0];
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [result] = await db
      .insert(categories)
      .values(category)
      .returning();
    
    return result;
  }
  
  async getCategoriesWithCount(): Promise<(Category & { quoteCount: number })[]> {
    const results = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        quoteCount: sql<number>`count(${quoteCategories.id})`.as('quote_count')
      })
      .from(categories)
      .leftJoin(quoteCategories, eq(categories.id, quoteCategories.categoryId))
      .groupBy(categories.id)
      .orderBy(desc(sql<number>`count(${quoteCategories.id})`));
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      quoteCount: Number(row.quoteCount)
    }));
  }
  
  // Tag methods
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }
  
  async getTagsWithCount(): Promise<(Tag & { quoteCount: number })[]> {
    const results = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        quoteCount: sql<number>`count(${quoteTags.id})`.as('quote_count')
      })
      .from(tags)
      .leftJoin(quoteTags, eq(tags.id, quoteTags.tagId))
      .groupBy(tags.id)
      .orderBy(desc(sql<number>`count(${quoteTags.id})`));
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      quoteCount: Number(row.quoteCount)
    }));
  }
  
  async getPopularTags(limit: number = 14): Promise<Tag[]> {
    const results = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        quoteCount: sql<number>`count(${quoteTags.id})`.as('quote_count')
      })
      .from(tags)
      .leftJoin(quoteTags, eq(tags.id, quoteTags.tagId))
      .groupBy(tags.id)
      .orderBy(desc(sql<number>`count(${quoteTags.id})`))
      .limit(limit);
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug
    }));
  }
  
  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const result = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1);
    
    return result[0];
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const [result] = await db
      .insert(tags)
      .values(tag)
      .returning();
    
    return result;
  }
  
  // Helper methods for relationships
  async addQuoteCategory(quoteId: number, categoryId: number): Promise<void> {
    await db
      .insert(quoteCategories)
      .values({ quoteId, categoryId })
      .onConflictDoNothing();
  }
  
  async addQuoteTag(quoteId: number, tagId: number): Promise<void> {
    await db
      .insert(quoteTags)
      .values({ quoteId, tagId })
      .onConflictDoNothing();
  }
  
  // Helper method to enrich quotes with categories and tags
  private async enrichQuotesWithRelations(quotesList: (Quote & { author: Author })[]): Promise<QuoteWithAuthor[]> {
    if (quotesList.length === 0) return [];
    
    const quoteIds = quotesList.map(q => q.id);
    
    // Get all categories for these quotes
    const quoteCatsResults = await db
      .select({
        quoteId: quoteCategories.quoteId,
        categoryId: quoteCategories.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug
      })
      .from(quoteCategories)
      .innerJoin(categories, eq(quoteCategories.categoryId, categories.id))
      .where(inArray(quoteCategories.quoteId, quoteIds));
    
    // Get all tags for these quotes
    const quoteTagsResults = await db
      .select({
        quoteId: quoteTags.quoteId,
        tagId: quoteTags.tagId,
        tagName: tags.name,
        tagSlug: tags.slug
      })
      .from(quoteTags)
      .innerJoin(tags, eq(quoteTags.tagId, tags.id))
      .where(inArray(quoteTags.quoteId, quoteIds));
    
    // Create a map of quote ID to categories
    const quoteCategories = new Map<number, Category[]>();
    for (const row of quoteCatsResults) {
      if (!quoteCategories.has(row.quoteId)) {
        quoteCategories.set(row.quoteId, []);
      }
      quoteCategories.get(row.quoteId)?.push({
        id: row.categoryId,
        name: row.categoryName,
        slug: row.categorySlug
      });
    }
    
    // Create a map of quote ID to tags
    const quoteTags = new Map<number, Tag[]>();
    for (const row of quoteTagsResults) {
      if (!quoteTags.has(row.quoteId)) {
        quoteTags.set(row.quoteId, []);
      }
      quoteTags.get(row.quoteId)?.push({
        id: row.tagId,
        name: row.tagName,
        slug: row.tagSlug
      });
    }
    
    // Combine everything into enriched quotes
    return quotesList.map(quote => ({
      ...quote,
      categories: quoteCategories.get(quote.id) || [],
      tags: quoteTags.get(quote.id) || []
    }));
  }
}