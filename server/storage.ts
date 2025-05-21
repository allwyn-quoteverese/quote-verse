import { 
  quotes, type Quote, type InsertQuote, 
  authors, type Author, type InsertAuthor,
  categories, type Category, type InsertCategory,
  tags, type Tag, type InsertTag,
  type QuoteWithAuthor, type SearchParams
} from "@shared/schema";

// Define storage interface
export interface IStorage {
  // Quotes
  getQuotes(page: number, limit: number): Promise<QuoteWithAuthor[]>;
  getQuotesByCategory(categorySlug: string, page: number, limit: number): Promise<QuoteWithAuthor[]>;
  getQuotesByTag(tagSlug: string, page: number, limit: number): Promise<QuoteWithAuthor[]>;
  getQuotesByAuthor(authorId: number, page: number, limit: number): Promise<QuoteWithAuthor[]>;
  getQuoteById(id: number): Promise<QuoteWithAuthor | undefined>;
  getRandomQuote(): Promise<QuoteWithAuthor | undefined>;
  getFeaturedQuotes(limit: number): Promise<QuoteWithAuthor[]>;
  searchQuotes(params: SearchParams): Promise<{ quotes: QuoteWithAuthor[], total: number }>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  getTotalQuotes(): Promise<number>;
  
  // Authors
  getAuthors(page: number, limit: number): Promise<Author[]>;
  getAuthorById(id: number): Promise<Author | undefined>;
  getAuthorByName(name: string): Promise<Author | undefined>;
  getPopularAuthors(limit: number): Promise<Author[]>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  getCategoriesWithCount(): Promise<(Category & { quoteCount: number })[]>;
  
  // Tags
  getTags(): Promise<Tag[]>;
  getTagsWithCount(): Promise<(Tag & { quoteCount: number })[]>;
  getPopularTags(limit: number): Promise<Tag[]>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
}

export class MemStorage implements IStorage {
  private quotes: Map<number, Quote>;
  private authors: Map<number, Author>;
  private categories: Map<number, Category>;
  private tags: Map<number, Tag>;
  private quoteCategories: Map<number, { quoteId: number, categoryId: number }>;
  private quoteTags: Map<number, { quoteId: number, tagId: number }>;
  
  private quoteCurrentId: number;
  private authorCurrentId: number;
  private categoryCurrentId: number;
  private tagCurrentId: number;
  private quoteCategoryCurrentId: number;
  private quoteTagCurrentId: number;

  constructor() {
    this.quotes = new Map();
    this.authors = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.quoteCategories = new Map();
    this.quoteTags = new Map();
    
    this.quoteCurrentId = 1;
    this.authorCurrentId = 1;
    this.categoryCurrentId = 1;
    this.tagCurrentId = 1;
    this.quoteCategoryCurrentId = 1;
    this.quoteTagCurrentId = 1;
  }

  // Quote methods
  async getQuotes(page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    // Optimize for large datasets by avoiding Array.from() on the entire collection
    
    const skip = (page - 1) * limit;
    let count = 0;
    const paginatedQuotes: Quote[] = [];
    
    // Use regular forEach instead of iterator to avoid downlevelIteration issues
    this.quotes.forEach((quote) => {
      if (count >= skip && paginatedQuotes.length < limit) {
        paginatedQuotes.push(quote);
      }
      
      count++;
    });
    
    return paginatedQuotes.map(quote => this.enrichQuote(quote));
  }

  async getQuotesByCategory(categorySlug: string, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];

    // Get all quote-category associations for this category
    const quoteCategoryEntries = Array.from(this.quoteCategories.values())
      .filter(qc => qc.categoryId === category.id);
    
    // Get IDs of all quotes in this category
    const quoteIds = quoteCategoryEntries.map(qc => qc.quoteId);
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const paginatedQuoteIds = quoteIds.slice(startIndex, startIndex + limit);
    
    // Fetch only the paginated quotes
    const paginatedQuotes = paginatedQuoteIds.map(id => this.quotes.get(id))
      .filter((quote): quote is Quote => !!quote);
    
    // Enrich and return
    return paginatedQuotes.map(quote => this.enrichQuote(quote));
  }

  async getQuotesByTag(tagSlug: string, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    const tag = await this.getTagBySlug(tagSlug);
    if (!tag) return [];

    // Get all quote-tag associations for this tag
    const quoteTagEntries = Array.from(this.quoteTags.values())
      .filter(qt => qt.tagId === tag.id);
    
    // Get IDs of all quotes with this tag
    const quoteIds = quoteTagEntries.map(qt => qt.quoteId);
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const paginatedQuoteIds = quoteIds.slice(startIndex, startIndex + limit);
    
    // Fetch only the paginated quotes
    const paginatedQuotes = paginatedQuoteIds.map(id => this.quotes.get(id))
      .filter((quote): quote is Quote => !!quote);
    
    // Enrich and return
    return paginatedQuotes.map(quote => this.enrichQuote(quote));
  }

  async getQuotesByAuthor(authorId: number, page: number = 1, limit: number = 10): Promise<QuoteWithAuthor[]> {
    // This is more efficient than using Array.from and then filtering
    // for large datasets, as we only collect the quotes we need
    const quotesByAuthor: Quote[] = [];
    
    // Use regular Map.forEach instead of creating an array first
    this.quotes.forEach(quote => {
      if (quote.authorId === authorId) {
        quotesByAuthor.push(quote);
      }
    });
    
    // Apply pagination after collecting all quotes for this author
    const startIndex = (page - 1) * limit;
    const paginatedQuotes = quotesByAuthor.slice(startIndex, startIndex + limit);
    
    return paginatedQuotes.map(quote => this.enrichQuote(quote));
  }

  async getQuoteById(id: number): Promise<QuoteWithAuthor | undefined> {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;
    
    return this.enrichQuote(quote);
  }

  async getRandomQuote(): Promise<QuoteWithAuthor | undefined> {
    if (this.quotes.size === 0) return undefined;
    
    // Get a random ID between 1 and the total count
    // Note: This assumes IDs are sequential and there are no deleted quotes
    // In a production app, we would need a more robust solution
    const randomId = Math.floor(Math.random() * this.quotes.size) + 1;
    
    // Attempt to get a quote with that ID, or fallback to getting the first one
    const quote = this.quotes.get(randomId) || this.quotes.get(1);
    if (!quote) return undefined;
    
    return this.enrichQuote(quote);
  }

  async getFeaturedQuotes(limit: number = 6): Promise<QuoteWithAuthor[]> {
    const featuredQuotes = Array.from(this.quotes.values())
      .filter(quote => quote.isFeatured)
      .slice(0, limit);
    
    return featuredQuotes.map(quote => this.enrichQuote(quote));
  }

  async searchQuotes(params: SearchParams): Promise<{ quotes: QuoteWithAuthor[], total: number }> {
    let filteredQuotes = Array.from(this.quotes.values());
    
    // Apply filters
    if (params.q) {
      const searchTerm = params.q.toLowerCase();
      filteredQuotes = filteredQuotes.filter(quote => {
        const author = this.authors.get(quote.authorId);
        return (
          quote.text.toLowerCase().includes(searchTerm) || 
          (author && author.name.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    if (params.author) {
      const authorName = params.author.toLowerCase();
      const authorIds = Array.from(this.authors.values())
        .filter(author => author.name.toLowerCase().includes(authorName))
        .map(author => author.id);
      
      filteredQuotes = filteredQuotes.filter(quote => authorIds.includes(quote.authorId));
    }
    
    if (params.category) {
      const category = await this.getCategoryBySlug(params.category);
      if (category) {
        const quoteCategoryEntries = Array.from(this.quoteCategories.values())
          .filter(qc => qc.categoryId === category.id);
        
        const quoteIds = quoteCategoryEntries.map(qc => qc.quoteId);
        filteredQuotes = filteredQuotes.filter(quote => quoteIds.includes(quote.id));
      }
    }
    
    if (params.tag) {
      const tag = await this.getTagBySlug(params.tag);
      if (tag) {
        const quoteTagEntries = Array.from(this.quoteTags.values())
          .filter(qt => qt.tagId === tag.id);
        
        const quoteIds = quoteTagEntries.map(qt => qt.quoteId);
        filteredQuotes = filteredQuotes.filter(quote => quoteIds.includes(quote.id));
      }
    }
    
    const total = filteredQuotes.length;
    
    // Apply pagination
    const startIndex = (params.page - 1) * params.limit;
    const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + params.limit);
    
    return {
      quotes: paginatedQuotes.map(quote => this.enrichQuote(quote)),
      total
    };
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = this.quoteCurrentId++;
    // Explicitly set required properties to fix type issues
    const newQuote: Quote = {
      id,
      text: quote.text,
      authorId: quote.authorId,
      source: quote.source || null,
      isFeatured: quote.isFeatured || false
    };
    
    this.quotes.set(id, newQuote);
    
    // Update author's quote count
    const author = this.authors.get(quote.authorId);
    if (author) {
      const updatedAuthor = { ...author, quoteCount: (author.quoteCount || 0) + 1 };
      this.authors.set(author.id, updatedAuthor);
    }
    
    return newQuote;
  }

  async getTotalQuotes(): Promise<number> {
    return this.quotes.size;
  }
  
  async getQuotesStatus(): Promise<{ total: number, authors: number, categories: number, tags: number }> {
    return {
      total: this.quotes.size,
      authors: this.authors.size,
      categories: this.categories.size,
      tags: this.tags.size
    };
  }

  // Author methods
  async getAuthors(page: number = 1, limit: number = 10): Promise<Author[]> {
    const authors = Array.from(this.authors.values());
    const startIndex = (page - 1) * limit;
    return authors.slice(startIndex, startIndex + limit);
  }

  async getAuthorById(id: number): Promise<Author | undefined> {
    return this.authors.get(id);
  }

  async getAuthorByName(name: string): Promise<Author | undefined> {
    return Array.from(this.authors.values()).find(
      author => author.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getPopularAuthors(limit: number = 5): Promise<Author[]> {
    return Array.from(this.authors.values())
      .sort((a, b) => (b.quoteCount || 0) - (a.quoteCount || 0))
      .slice(0, limit);
  }

  async createAuthor(author: InsertAuthor): Promise<Author> {
    const id = this.authorCurrentId++;
    // Explicitly set required properties to fix type issues
    const newAuthor: Author = {
      id,
      name: author.name,
      bio: author.bio || null,
      quoteCount: 0
    };
    this.authors.set(id, newAuthor);
    return newAuthor;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      category => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async getCategoriesWithCount(): Promise<(Category & { quoteCount: number })[]> {
    const categories = Array.from(this.categories.values());
    
    // Count quotes for each category
    const categoryQuoteCounts = new Map<number, number>();
    
    // Get all quote-category associations
    Array.from(this.quoteCategories.values()).forEach(qc => {
      const count = categoryQuoteCounts.get(qc.categoryId) || 0;
      categoryQuoteCounts.set(qc.categoryId, count + 1);
    });
    
    // Add count to each category
    return categories.map(category => ({
      ...category,
      quoteCount: categoryQuoteCounts.get(category.id) || 0
    }));
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTagsWithCount(): Promise<(Tag & { quoteCount: number })[]> {
    const tags = Array.from(this.tags.values());
    
    // Count quotes for each tag
    const tagQuoteCounts = new Map<number, number>();
    
    // Get all quote-tag associations
    Array.from(this.quoteTags.values()).forEach(qt => {
      const count = tagQuoteCounts.get(qt.tagId) || 0;
      tagQuoteCounts.set(qt.tagId, count + 1);
    });
    
    // Add count to each tag
    return tags.map(tag => ({
      ...tag,
      quoteCount: tagQuoteCounts.get(tag.id) || 0
    }));
  }

  async getPopularTags(limit: number = 14): Promise<Tag[]> {
    // Get tag count
    const tagCounts = new Map<number, number>();
    Array.from(this.quoteTags.values()).forEach(qt => {
      const count = tagCounts.get(qt.tagId) || 0;
      tagCounts.set(qt.tagId, count + 1);
    });
    
    return Array.from(this.tags.values())
      .sort((a, b) => {
        const countA = tagCounts.get(a.id) || 0;
        const countB = tagCounts.get(b.id) || 0;
        return countB - countA;
      })
      .slice(0, limit);
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      tag => tag.slug === slug
    );
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const id = this.tagCurrentId++;
    const newTag = { ...tag, id };
    this.tags.set(id, newTag);
    return newTag;
  }

  // Helper methods for relationships
  async addQuoteCategory(quoteId: number, categoryId: number): Promise<void> {
    const id = this.quoteCategoryCurrentId++;
    this.quoteCategories.set(id, { quoteId, categoryId });
  }

  async addQuoteTag(quoteId: number, tagId: number): Promise<void> {
    const id = this.quoteTagCurrentId++;
    this.quoteTags.set(id, { quoteId, tagId });
  }

  private enrichQuote(quote: Quote): QuoteWithAuthor {
    const author = this.authors.get(quote.authorId) || { id: 0, name: "Unknown", bio: null, quoteCount: 0 };
    
    // Get categories
    const quoteCategoryEntries = Array.from(this.quoteCategories.values())
      .filter(qc => qc.quoteId === quote.id);
    
    const categoryIds = quoteCategoryEntries.map(qc => qc.categoryId);
    const categories = categoryIds.map(id => this.categories.get(id))
      .filter((category): category is Category => !!category);
    
    // Get tags
    const quoteTagEntries = Array.from(this.quoteTags.values())
      .filter(qt => qt.quoteId === quote.id);
    
    const tagIds = quoteTagEntries.map(qt => qt.tagId);
    const tags = tagIds.map(id => this.tags.get(id))
      .filter((tag): tag is Tag => !!tag);
    
    return {
      ...quote,
      author,
      categories,
      tags
    };
  }
}

export const storage = new MemStorage();
