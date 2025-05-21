/**
 * AllwynQuotes.com Quote Batch Generator
 * 
 * This script generates SQL files for quotes in manageable batches
 * that can be imported to a PostgreSQL database. It follows the same
 * logic as the in-memory data generation but outputs direct SQL.
 * 
 * Usage: node quotes-batch-generator.js [start_batch] [end_batch]
 * 
 * Each batch contains 1000 quotes
 * Example: node quotes-batch-generator.js 1 10 (generates batches 1-10, 10,000 quotes)
 */

const fs = require('fs');
const path = require('path');

// Constants
const BATCH_SIZE = 1000;
const TOTAL_QUOTES = 100000;
const TOTAL_BATCHES = Math.ceil(TOTAL_QUOTES / BATCH_SIZE);

// Define sample phrases for procedural generation
const INSPIRATIONAL_PREFIXES = [
  "Always remember that", "Never forget that", "The key to success is", 
  "The secret of happiness is", "Life teaches us that", "Remember that",
  "True wisdom comes from", "Success is achieved when", "The journey of life is",
  "Greatness is found in", "The foundation of progress is", "Your potential is",
  "The heart of leadership is", "The essence of courage is", "Transformation begins with",
  "The path to wisdom is", "The source of joy is", "The root of excellence is",
  "The spirit of innovation is", "The power of perseverance is", "The value of friendship is",
  "The beauty of love is", "The strength of character is", "The purpose of knowledge is",
  "The art of living is", "The science of achievement is", "The miracle of growth is",
  "The wonder of creativity is", "The magic of believing is", "The discipline of success is",
  "The practice of mindfulness is", "The habit of excellence is", "The gift of presence is",
  "The reward of patience is", "The benefit of challenge is", "The advantage of adversity is",
  "The opportunity in failure is", "The lesson in struggle is", "The wisdom in silence is",
  "The insight from reflection is", "The truth about happiness is", "The reality of success is"
];

const INSPIRATIONAL_CORES = [
  "finding joy in the small things", "persisting through difficulties", 
  "maintaining a positive attitude", "embracing change as opportunity",
  "cultivating gratitude daily", "pursuing your passion relentlessly",
  "building strong relationships", "learning from every experience",
  "challenging your own limitations", "accepting yourself completely",
  "helping others along the way", "staying true to your values",
  "exploring new possibilities", "balancing work and personal life",
  "focusing on solutions not problems", "practicing mindfulness daily",
  "adapting to changing circumstances", "investing in personal growth",
  "celebrating small victories", "maintaining physical wellbeing",
  "nurturing your mental health", "finding purpose in service",
  "standing up for your beliefs", "respecting diverse perspectives",
  "growing through discomfort", "embracing vulnerability courageously",
  "practicing forgiveness freely", "seeking wisdom continuously",
  "acting with integrity always", "building habits intentionally",
  "managing time effectively", "communicating authentically",
  "valuing quality over quantity", "thinking critically and creatively",
  "developing emotional intelligence", "practicing patience in adversity",
  "cultivating a growth mindset", "living in the present moment",
  "taking calculated risks", "finding balance in all things"
];

const INSPIRATIONAL_SUFFIXES = [
  "that defines true character", "that leads to lasting fulfillment", 
  "that transforms ordinary into extraordinary", "that makes all the difference",
  "that creates meaningful change", "that builds a remarkable legacy",
  "that brings sustainable success", "that nurtures authentic happiness",
  "that develops resilient spirit", "that unlocks unlimited potential",
  "that shapes your destiny", "that creates positive impact",
  "that drives continuous improvement", "that fosters genuine connections",
  "that sustains you through hardship", "that reveals your true purpose",
  "that defines your unique journey", "that strengthens inner peace",
  "that expands your perspective", "that cultivates wisdom over time",
  "that builds unshakable confidence", "that creates meaningful momentum",
  "that brings enduring satisfaction", "that shapes a life without regrets",
  "that leads to profound insight", "that carries you through challenges",
  "that turns obstacles into opportunities", "that reveals hidden strengths",
  "that generates lasting influence", "that fuels continual growth",
  "that empowers authentic living", "that produces remarkable results",
  "that ensures continued relevance", "that creates positive ripple effects",
  "that develops exceptional capability", "that nurtures meaningful contribution",
  "that leads to genuine fulfillment", "that unlocks creative solutions",
  "that builds enduring relationships", "that creates an inspiring legacy"
];

// Get command line arguments
const args = process.argv.slice(2);
const startBatch = parseInt(args[0]) || 1;
const endBatch = parseInt(args[1]) || TOTAL_BATCHES;

console.log(`Generating quote batches ${startBatch} to ${endBatch} (${(endBatch - startBatch + 1) * BATCH_SIZE} quotes max)`);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'quote_batches');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Generate quotes in batches
for (let batchNum = startBatch; batchNum <= endBatch; batchNum++) {
  const startQuoteId = (batchNum - 1) * BATCH_SIZE + 1;
  const endQuoteId = Math.min(batchNum * BATCH_SIZE, TOTAL_QUOTES);
  const batchSize = endQuoteId - startQuoteId + 1;
  
  console.log(`Generating batch ${batchNum}/${TOTAL_BATCHES} (quotes ${startQuoteId}-${endQuoteId})...`);
  
  let batchContent = `-- AllwynQuotes.com Quote Batch ${batchNum}\n`;
  batchContent += `-- Quotes ${startQuoteId} to ${endQuoteId}\n\n`;
  batchContent += `BEGIN;\n\n`;
  
  // Generate quotes for this batch
  for (let i = 0; i < batchSize; i++) {
    const quoteId = startQuoteId + i;
    
    // Generate procedural quote
    const quote = generateProceduralQuote();
    
    // Determine random author ID (between 1 and 65)
    const authorId = Math.floor(Math.random() * 65) + 1;
    
    // Determine if featured (10% chance)
    const isFeatured = Math.random() < 0.1;
    
    // Generate the SQL for the quote
    batchContent += `-- Quote ${quoteId}\n`;
    batchContent += `INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (${quoteId}, '${escapeSql(quote)}', ${authorId}, NULL, ${isFeatured ? 'TRUE' : 'FALSE'});\n\n`;
    
    // Generate 1-3 random categories for this quote
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const categoryIds = getRandomUniqueIds(1, 12, numCategories);
    
    for (let j = 0; j < categoryIds.length; j++) {
      const quoteCategoryId = getQuoteCategoryId(quoteId, j);
      batchContent += `INSERT INTO quote_categories (id, quote_id, category_id) VALUES (${quoteCategoryId}, ${quoteId}, ${categoryIds[j]});\n`;
    }
    
    // Generate 2-4 random tags for this quote
    const numTags = Math.floor(Math.random() * 3) + 2;
    const tagIds = getRandomUniqueIds(1, 14, numTags);
    
    for (let j = 0; j < tagIds.length; j++) {
      const quoteTagId = getQuoteTagId(quoteId, j);
      batchContent += `INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (${quoteTagId}, ${quoteId}, ${tagIds[j]});\n`;
    }
    
    batchContent += '\n';
  }
  
  // Update sequences at the end
  batchContent += `-- Update sequences for this batch\n`;
  batchContent += `SELECT setval('quotes_id_seq', (SELECT MAX(id) FROM quotes));\n`;
  batchContent += `SELECT setval('quote_categories_id_seq', (SELECT MAX(id) FROM quote_categories));\n`;
  batchContent += `SELECT setval('quote_tags_id_seq', (SELECT MAX(id) FROM quote_tags));\n\n`;
  
  batchContent += `COMMIT;\n`;
  
  // Write batch file
  const batchFileName = path.join(outputDir, `quotes_batch_${batchNum.toString().padStart(3, '0')}.sql`);
  fs.writeFileSync(batchFileName, batchContent);
  
  console.log(`Batch ${batchNum} saved to ${batchFileName}`);
}

console.log('Done generating all requested batches.');

// Helper function to generate procedural quotes
function generateProceduralQuote() {
  const prefix = INSPIRATIONAL_PREFIXES[Math.floor(Math.random() * INSPIRATIONAL_PREFIXES.length)];
  const core = INSPIRATIONAL_CORES[Math.floor(Math.random() * INSPIRATIONAL_CORES.length)];
  const suffix = INSPIRATIONAL_SUFFIXES[Math.floor(Math.random() * INSPIRATIONAL_SUFFIXES.length)];
  
  // 50% chance to include suffix
  const includeSuffix = Math.random() > 0.5;
  
  return includeSuffix ? `${prefix} ${core} ${suffix}` : `${prefix} ${core}`;
}

// Helper function to get random unique IDs within a range
function getRandomUniqueIds(min, max, count) {
  const ids = [];
  const available = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    ids.push(available[randomIndex]);
    available.splice(randomIndex, 1);
  }
  
  return ids;
}

// Helper function to generate quote_categories IDs
function getQuoteCategoryId(quoteId, index) {
  // A formula that ensures uniqueness based on quote ID and index
  return (quoteId - 1) * 3 + index + 1;
}

// Helper function to generate quote_tags IDs
function getQuoteTagId(quoteId, index) {
  // A formula that ensures uniqueness based on quote ID and index
  return (quoteId - 1) * 4 + index + 1;
}

// Helper function to escape SQL strings
function escapeSql(str) {
  return str.replace(/'/g, "''");
}