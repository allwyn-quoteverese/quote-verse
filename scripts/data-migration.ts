import { storage } from "../server/storage.js";
import fs from "fs";
import path from "path";

// Main function to export data
async function exportDataToSql() {
  try {
    // Get all data
    const authors = await storage.getAuthors(1, 10000); // Get all authors with a large limit
    const categories = await storage.getCategories();
    const tags = await storage.getTags();
    
    // Get all quotes with a large limit
    const totalQuotes = await storage.getTotalQuotes();
    const quotesPerPage = 1000;
    const totalPages = Math.ceil(totalQuotes / quotesPerPage);
    
    let allQuotes = [];
    for (let page = 1; page <= totalPages; page++) {
      const quotes = await storage.getQuotes(page, quotesPerPage);
      allQuotes = [...allQuotes, ...quotes];
      console.log(`Fetched quotes page ${page}/${totalPages}, ${quotes.length} quotes`);
    }
    
    // Create SQL dump
    let sqlContent = "-- AllwynQuotes.com Database Dump\n";
    sqlContent += `-- Generated: ${new Date().toISOString()}\n\n`;
    
    // Truncate tables first (in reverse order of dependencies)
    sqlContent += "-- Truncate tables\n";
    sqlContent += "TRUNCATE quote_tags, quote_categories, quotes, tags, categories, authors CASCADE;\n\n";
    
    // Reset sequences
    sqlContent += "-- Reset sequences\n";
    sqlContent += "ALTER SEQUENCE authors_id_seq RESTART WITH 1;\n";
    sqlContent += "ALTER SEQUENCE categories_id_seq RESTART WITH 1;\n";
    sqlContent += "ALTER SEQUENCE tags_id_seq RESTART WITH 1;\n";
    sqlContent += "ALTER SEQUENCE quotes_id_seq RESTART WITH 1;\n";
    sqlContent += "ALTER SEQUENCE quote_categories_id_seq RESTART WITH 1;\n";
    sqlContent += "ALTER SEQUENCE quote_tags_id_seq RESTART WITH 1;\n\n";
    
    // Authors data
    sqlContent += "-- Insert authors\n";
    for (const author of authors) {
      sqlContent += `INSERT INTO authors (id, name, bio, quote_count) VALUES (${author.id}, '${escapeSql(author.name)}', ${author.bio ? `'${escapeSql(author.bio)}'` : 'NULL'}, ${author.quoteCount || 0});\n`;
    }
    sqlContent += "\n";
    
    // Categories data
    sqlContent += "-- Insert categories\n";
    for (const category of categories) {
      sqlContent += `INSERT INTO categories (id, name, slug) VALUES (${category.id}, '${escapeSql(category.name)}', '${escapeSql(category.slug)}');\n`;
    }
    sqlContent += "\n";
    
    // Tags data
    sqlContent += "-- Insert tags\n";
    for (const tag of tags) {
      sqlContent += `INSERT INTO tags (id, name, slug) VALUES (${tag.id}, '${escapeSql(tag.name)}', '${escapeSql(tag.slug)}');\n`;
    }
    sqlContent += "\n";
    
    // Quotes data
    sqlContent += "-- Insert quotes\n";
    for (const quote of allQuotes) {
      sqlContent += `INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (${quote.id}, '${escapeSql(quote.text)}', ${quote.authorId}, ${quote.source ? `'${escapeSql(quote.source)}'` : 'NULL'}, ${quote.isFeatured ? 'TRUE' : 'FALSE'});\n`;
    }
    sqlContent += "\n";
    
    // Quote-Category relationships
    sqlContent += "-- Insert quote-category relationships\n";
    let quoteCategoryId = 1;
    for (const quote of allQuotes) {
      if (quote.categories && quote.categories.length > 0) {
        for (const category of quote.categories) {
          sqlContent += `INSERT INTO quote_categories (id, quote_id, category_id) VALUES (${quoteCategoryId++}, ${quote.id}, ${category.id});\n`;
        }
      }
    }
    sqlContent += "\n";
    
    // Quote-Tag relationships
    sqlContent += "-- Insert quote-tag relationships\n";
    let quoteTagId = 1;
    for (const quote of allQuotes) {
      if (quote.tags && quote.tags.length > 0) {
        for (const tag of quote.tags) {
          sqlContent += `INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (${quoteTagId++}, ${quote.id}, ${tag.id});\n`;
        }
      }
    }
    
    // Update sequences
    sqlContent += "\n-- Update sequences\n";
    sqlContent += `SELECT SETVAL('authors_id_seq', (SELECT MAX(id) FROM authors));\n`;
    sqlContent += `SELECT SETVAL('categories_id_seq', (SELECT MAX(id) FROM categories));\n`;
    sqlContent += `SELECT SETVAL('tags_id_seq', (SELECT MAX(id) FROM tags));\n`;
    sqlContent += `SELECT SETVAL('quotes_id_seq', (SELECT MAX(id) FROM quotes));\n`;
    sqlContent += `SELECT SETVAL('quote_categories_id_seq', (SELECT MAX(id) FROM quote_categories));\n`;
    sqlContent += `SELECT SETVAL('quote_tags_id_seq', (SELECT MAX(id) FROM quote_tags));\n`;
    
    // Write to file
    fs.writeFileSync(path.join(process.cwd(), 'database-dump.sql'), sqlContent);
    
    console.log('Data exported successfully to database-dump.sql');
    
    // Output statistics
    console.log(`
Export Summary:
- ${authors.length} authors
- ${categories.length} categories
- ${tags.length} tags
- ${allQuotes.length} quotes total
    `);
    
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

// Escape SQL strings
function escapeSql(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

// Run the export function
exportDataToSql();