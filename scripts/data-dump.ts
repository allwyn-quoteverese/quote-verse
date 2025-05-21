import { storage } from "../server/storage";
import { initializeData } from "../server/data/quotes";
import fs from "fs";
import path from "path";

// Main function to export data
async function dumpDatabaseToFile() {
  try {
    console.log("Starting database initialization...");
    // First, ensure the data is initialized
    await initializeData(storage);
    
    console.log("Starting export process...");
    
    // Get all data
    console.log("Fetching authors...");
    const authors = await storage.getAuthors(1, 10000); // Get all authors with a large limit
    
    console.log("Fetching categories...");
    const categories = await storage.getCategories();
    
    console.log("Fetching tags...");
    const tags = await storage.getTags();
    
    // Get all quotes with pagination
    console.log("Getting total quote count...");
    const totalQuotes = await storage.getTotalQuotes();
    console.log(`Total quotes: ${totalQuotes}`);
    
    const quotesPerPage = 1000;
    const totalPages = Math.ceil(totalQuotes / quotesPerPage);
    
    console.log(`Will fetch quotes in ${totalPages} pages with ${quotesPerPage} per page`);
    
    let allQuotes = [];
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching quotes page ${page}/${totalPages}...`);
      const quotes = await storage.getQuotes(page, quotesPerPage);
      allQuotes = [...allQuotes, ...quotes];
      console.log(`Fetched ${quotes.length} quotes from page ${page}`);
    }
    
    console.log(`All data fetched. Creating SQL dump...`);
    
    // Create SQL dump
    let sqlContent = "-- AllwynQuotes.com Database Dump\n";
    sqlContent += `-- Generated: ${new Date().toISOString()}\n\n`;
    
    // Disable constraints for faster import
    sqlContent += "-- Disable constraints temporarily\n";
    sqlContent += "SET CONSTRAINTS ALL DEFERRED;\n\n";
    
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
    
    // Start transaction for faster import
    sqlContent += "-- Start transaction\n";
    sqlContent += "BEGIN;\n\n";
    
    // Authors data
    console.log(`Writing ${authors.length} authors to SQL file...`);
    sqlContent += "-- Insert authors\n";
    for (const author of authors) {
      sqlContent += `INSERT INTO authors (id, name, bio, quote_count) VALUES (${author.id}, '${escapeSql(author.name)}', ${author.bio ? `'${escapeSql(author.bio)}'` : 'NULL'}, ${author.quoteCount || 0});\n`;
    }
    sqlContent += "\n";
    
    // Categories data
    console.log(`Writing ${categories.length} categories to SQL file...`);
    sqlContent += "-- Insert categories\n";
    for (const category of categories) {
      sqlContent += `INSERT INTO categories (id, name, slug) VALUES (${category.id}, '${escapeSql(category.name)}', '${escapeSql(category.slug)}');\n`;
    }
    sqlContent += "\n";
    
    // Tags data
    console.log(`Writing ${tags.length} tags to SQL file...`);
    sqlContent += "-- Insert tags\n";
    for (const tag of tags) {
      sqlContent += `INSERT INTO tags (id, name, slug) VALUES (${tag.id}, '${escapeSql(tag.name)}', '${escapeSql(tag.slug)}');\n`;
    }
    sqlContent += "\n";
    
    // Quotes data - write in chunks to handle large datasets
    const chunkSize = 5000;
    console.log(`Writing ${allQuotes.length} quotes to SQL file in chunks of ${chunkSize}...`);
    sqlContent += "-- Insert quotes\n";
    
    for (let i = 0; i < allQuotes.length; i += chunkSize) {
      console.log(`Writing quotes chunk ${Math.floor(i/chunkSize) + 1}/${Math.ceil(allQuotes.length/chunkSize)}...`);
      const quoteChunk = allQuotes.slice(i, i + chunkSize);
      
      for (const quote of quoteChunk) {
        sqlContent += `INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (${quote.id}, '${escapeSql(quote.text)}', ${quote.authorId}, ${quote.source ? `'${escapeSql(quote.source)}'` : 'NULL'}, ${quote.isFeatured ? 'TRUE' : 'FALSE'});\n`;
      }
      
      // Write the chunk to file to manage memory
      fs.appendFileSync(path.join(process.cwd(), 'database-dump.sql'), sqlContent);
      sqlContent = ""; // Reset for next chunk
    }
    
    // Map of quote categories and tags
    // We'll rebuild these relationships based on the enriched quotes
    console.log("Building quote-category and quote-tag relationships...");
    
    const quoteCategories = [];
    const quoteTags = [];
    
    for (const quote of allQuotes) {
      // Process categories
      if (quote.categories && quote.categories.length > 0) {
        for (const category of quote.categories) {
          quoteCategories.push({
            quoteId: quote.id,
            categoryId: category.id
          });
        }
      }
      
      // Process tags
      if (quote.tags && quote.tags.length > 0) {
        for (const tag of quote.tags) {
          quoteTags.push({
            quoteId: quote.id,
            tagId: tag.id
          });
        }
      }
    }
    
    // Quote-Category relationships
    console.log(`Writing ${quoteCategories.length} quote-category relationships...`);
    sqlContent += "-- Insert quote-category relationships\n";
    
    for (let i = 0; i < quoteCategories.length; i++) {
      const { quoteId, categoryId } = quoteCategories[i];
      sqlContent += `INSERT INTO quote_categories (id, quote_id, category_id) VALUES (${i + 1}, ${quoteId}, ${categoryId});\n`;
      
      // Write in chunks to manage memory
      if ((i + 1) % 10000 === 0 || i === quoteCategories.length - 1) {
        fs.appendFileSync(path.join(process.cwd(), 'database-dump.sql'), sqlContent);
        sqlContent = "";
      }
    }
    
    // Quote-Tag relationships
    console.log(`Writing ${quoteTags.length} quote-tag relationships...`);
    sqlContent += "-- Insert quote-tag relationships\n";
    
    for (let i = 0; i < quoteTags.length; i++) {
      const { quoteId, tagId } = quoteTags[i];
      sqlContent += `INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (${i + 1}, ${quoteId}, ${tagId});\n`;
      
      // Write in chunks to manage memory
      if ((i + 1) % 10000 === 0 || i === quoteTags.length - 1) {
        fs.appendFileSync(path.join(process.cwd(), 'database-dump.sql'), sqlContent);
        sqlContent = "";
      }
    }
    
    // Update sequences
    sqlContent = "\n-- Update sequences\n";
    sqlContent += `SELECT SETVAL('authors_id_seq', (SELECT MAX(id) FROM authors));\n`;
    sqlContent += `SELECT SETVAL('categories_id_seq', (SELECT MAX(id) FROM categories));\n`;
    sqlContent += `SELECT SETVAL('tags_id_seq', (SELECT MAX(id) FROM tags));\n`;
    sqlContent += `SELECT SETVAL('quotes_id_seq', (SELECT MAX(id) FROM quotes));\n`;
    sqlContent += `SELECT SETVAL('quote_categories_id_seq', (SELECT COUNT(*) FROM quote_categories));\n`;
    sqlContent += `SELECT SETVAL('quote_tags_id_seq', (SELECT COUNT(*) FROM quote_tags));\n\n`;
    
    // Commit transaction
    sqlContent += "-- Commit transaction\n";
    sqlContent += "COMMIT;\n\n";
    
    // Re-enable constraints
    sqlContent += "-- Re-enable constraints\n";
    sqlContent += "SET CONSTRAINTS ALL IMMEDIATE;\n";
    
    // Write the final part
    fs.appendFileSync(path.join(process.cwd(), 'database-dump.sql'), sqlContent);
    
    console.log('Database dump completed successfully!');
    console.log('Full SQL dump saved to database-dump.sql');
    
    // Output statistics
    console.log(`
Export Summary:
- ${authors.length} authors
- ${categories.length} categories
- ${tags.length} tags
- ${allQuotes.length} quotes total
- ${quoteCategories.length} quote-category relations
- ${quoteTags.length} quote-tag relations
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
console.log("Starting database dump process...");
dumpDatabaseToFile();