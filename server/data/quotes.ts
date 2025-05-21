import fs from "fs/promises";
import path from "path";
import axios from "axios";
import { IStorage } from "../storage";
import { 
  InsertAuthor, 
  InsertQuote, 
  InsertCategory, 
  InsertTag 
} from "@shared/schema";

// Sample data to bootstrap the application with
// In a real application, this would be loaded from a database or external API
const initialCategories = [
  { name: "Motivation", slug: "motivation" },
  { name: "Success", slug: "success" },
  { name: "Happiness", slug: "happiness" },
  { name: "Love", slug: "love" },
  { name: "Wisdom", slug: "wisdom" },
  { name: "Inspiration", slug: "inspiration" },
  { name: "Life", slug: "life" },
  { name: "Philosophy", slug: "philosophy" },
  { name: "Friendship", slug: "friendship" },
  { name: "Leadership", slug: "leadership" },
  { name: "Education", slug: "education" },
  { name: "Hope", slug: "hope" }
];

const initialTags = [
  { name: "motivational", slug: "motivational" },
  { name: "wisdom", slug: "wisdom" },
  { name: "success", slug: "success" },
  { name: "life", slug: "life" },
  { name: "inspiration", slug: "inspiration" },
  { name: "love", slug: "love" },
  { name: "happiness", slug: "happiness" },
  { name: "philosophy", slug: "philosophy" },
  { name: "courage", slug: "courage" },
  { name: "hope", slug: "hope" },
  { name: "attitude", slug: "attitude" },
  { name: "leadership", slug: "leadership" },
  { name: "education", slug: "education" },
  { name: "friendship", slug: "friendship" }
];

const initialAuthors = [
  { name: "Albert Einstein", bio: "Theoretical physicist who developed the theory of relativity" },
  { name: "Maya Angelou", bio: "American poet, memoirist, and civil rights activist" },
  { name: "Oscar Wilde", bio: "Irish poet and playwright" },
  { name: "Eleanor Roosevelt", bio: "Former First Lady of the United States" },
  { name: "Mark Twain", bio: "American writer, humorist, entrepreneur, publisher, and lecturer" },
  { name: "Nelson Mandela", bio: "Former President of South Africa" },
  { name: "Steve Jobs", bio: "Co-founder of Apple Inc." },
  { name: "Winston Churchill", bio: "Former British Prime Minister" },
  { name: "Robert Frost", bio: "American poet" },
  { name: "Mahatma Gandhi", bio: "Indian lawyer, anti-colonial nationalist, and political ethicist" }
];

// Initial quotes to seed the database
const initialQuotes = [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    categories: ["Motivation", "Life"],
    tags: ["motivational", "life", "hope"]
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    categories: ["Inspiration", "Hope"],
    tags: ["inspiration", "hope", "dreams"]
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    categories: ["Success", "Motivation"],
    tags: ["success", "courage", "motivational"]
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "inspirational"]
  },
  {
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
    categories: ["Success", "Inspiration"],
    tags: ["success", "inspiration", "work"]
  },
  {
    text: "In three words I can sum up everything I've learned about life: it goes on.",
    author: "Robert Frost",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "hope"]
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "inspirational"]
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    categories: ["Success", "Motivation"],
    tags: ["success", "future", "inspirational"]
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "selfhood"]
  },
  {
    text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    author: "Albert Einstein",
    categories: ["Wisdom", "Humor"],
    tags: ["wisdom", "humor", "human nature"]
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    categories: ["Motivation", "Inspiration"],
    tags: ["motivation", "inspiration", "journey"]
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    categories: ["Happiness", "Life"],
    tags: ["happiness", "life", "purpose"]
  },
  {
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "living"]
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas Edison",
    categories: ["Success", "Perseverance"],
    tags: ["success", "perseverance", "failure"]
  },
  {
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "simplicity"]
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    categories: ["Motivation", "Success"],
    tags: ["motivation", "action", "beginning"]
  },
  {
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    categories: ["Education", "Wisdom"],
    tags: ["education", "learning", "wisdom"]
  },
  {
    text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    author: "Robert Louis Stevenson",
    categories: ["Life", "Wisdom"],
    tags: ["life", "wisdom", "patience"]
  },
  {
    text: "The real test is not whether you avoid this failure, because you won't. It's whether you let it harden or shame you into inaction, or whether you learn from it.",
    author: "Barack Obama",
    categories: ["Success", "Wisdom"],
    tags: ["success", "failure", "learning"]
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    categories: ["Motivation", "Hope"],
    tags: ["motivation", "hope", "doubts"]
  }
];

// Function to initialize the database with sample data
export async function initializeData(storage: IStorage): Promise<void> {
  console.log("Initializing database with sample data...");
  
  try {
    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();
    const authorMap = new Map<string, number>();

    // Create categories
    for (const cat of initialCategories) {
      const category = await storage.createCategory(cat as InsertCategory);
      categoryMap.set(cat.name, category.id);
    }

    // Create tags
    for (const tag of initialTags) {
      const createdTag = await storage.createTag(tag as InsertTag);
      tagMap.set(tag.name, createdTag.id);
    }

    // Create authors
    for (const author of initialAuthors) {
      const createdAuthor = await storage.createAuthor(author as InsertAuthor);
      authorMap.set(author.name, createdAuthor.id);
    }

    // Create quotes
    for (const quote of initialQuotes) {
      // Find or create author if doesn't exist
      let authorId = authorMap.get(quote.author);
      if (!authorId) {
        const author = await storage.createAuthor({
          name: quote.author,
          bio: null
        });
        authorId = author.id;
        authorMap.set(quote.author, authorId);
      }

      // Create quote
      const createdQuote = await storage.createQuote({
        text: quote.text,
        authorId,
        source: null,
        isFeatured: Math.random() > 0.5 // Randomly mark some quotes as featured
      } as InsertQuote);

      // Add categories
      for (const categoryName of quote.categories) {
        const categoryId = categoryMap.get(categoryName);
        if (categoryId) {
          await (storage as any).addQuoteCategory(createdQuote.id, categoryId);
        }
      }

      // Add tags
      for (const tagName of quote.tags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await (storage as any).addQuoteTag(createdQuote.id, tagId);
        }
      }
    }

    // Generate additional quotes for a larger dataset
    // In a real application, you would use an external API or a large dataset file
    await generateAdditionalQuotes(storage, authorMap, categoryMap, tagMap);

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// APIs for fetching quotes
const QUOTE_APIS = [
  {
    name: "ZenQuotes API",
    url: "https://zenquotes.io/api/quotes/",
    processResponse: (data: any[]) => {
      return data.map(item => ({
        text: item.q,
        author: item.a,
        source: "ZenQuotes",
        tags: ["wisdom", "inspiration"]
      }));
    }
  },
  {
    name: "Quotable API",
    url: "https://api.quotable.io/quotes?limit=150",
    processResponse: (data: { results: any[] }) => {
      return data.results.map(item => ({
        text: item.content,
        author: item.author,
        source: "Quotable",
        tags: item.tags || ["wisdom"],
        categories: getCategoriesFromTags(item.tags || [])
      }));
    }
  },
  {
    name: "Type.fit API",
    url: "https://type.fit/api/quotes",
    processResponse: (data: any[]) => {
      return data.map(item => ({
        text: item.text,
        author: item.author || "Unknown",
        source: "Type.fit",
        tags: ["inspiration", "wisdom"]
      }));
    }
  }
];

// Helper function to map tags to categories
function getCategoriesFromTags(tags: string[]): string[] {
  const tagToCategoryMap: Record<string, string> = {
    "love": "Love",
    "inspirational": "Inspiration",
    "wisdom": "Wisdom",
    "happiness": "Happiness",
    "success": "Success",
    "motivational": "Motivation",
    "life": "Life",
    "philosophy": "Philosophy",
    "friendship": "Friendship",
    "education": "Education",
    "hope": "Hope",
    "leadership": "Leadership"
  };

  const categories = tags
    .map(tag => tagToCategoryMap[tag.toLowerCase()])
    .filter(Boolean);

  // Ensure we return at least one category
  if (categories.length === 0) {
    return ["Wisdom"];
  }

  return Array.from(new Set(categories));
}

// Function to generate additional quotes
async function generateAdditionalQuotes(
  storage: IStorage, 
  authorMap: Map<string, number>,
  categoryMap: Map<string, number>,
  tagMap: Map<string, number>
): Promise<void> {
  console.log("Starting to fetch 100,000 quotes from public APIs...");
  
  // Target number of quotes to generate (100,000 = 1 lakh)
  const targetQuoteCount = 100000;
  let quotesAdded = 0;
  const batchSize = 1000; // Process in batches to prevent memory issues
  
  // Limit the number of API quote attempts to avoid rate limiting
  const maxApiQuotes = 100; // We'll only try to get a small number from APIs
  
  try {
    // First, try to get a small number of quotes from APIs to add variety
    if (maxApiQuotes > 0) {
      try {
        console.log(`Attempting to fetch a small sample of ${maxApiQuotes} quotes from APIs...`);
        const fetchedQuotes = await fetchQuotesFromAPIs();
        
        // Only process up to maxApiQuotes to avoid long processing times
        const quotesToProcess = fetchedQuotes.slice(0, maxApiQuotes);
        
        // Process the quotes in batches
        for (let i = 0; i < quotesToProcess.length && quotesAdded < targetQuoteCount; i++) {
          const quote = quotesToProcess[i];
          
          // Find or create author
          let authorId = authorMap.get(quote.author);
          if (!authorId) {
            const author = await storage.createAuthor({
              name: quote.author,
              bio: null
            });
            authorId = author.id;
            authorMap.set(quote.author, authorId);
          }
          
          // Create quote
          const createdQuote = await storage.createQuote({
            text: quote.text,
            authorId,
            source: quote.source || null,
            isFeatured: Math.random() > 0.9 // 10% chance of being featured
          } as InsertQuote);
          
          // Add categories
          const quoteCategories = quote.categories || ["Wisdom"];
          for (const categoryName of quoteCategories) {
            const categoryId = categoryMap.get(categoryName);
            if (categoryId) {
              await (storage as any).addQuoteCategory(createdQuote.id, categoryId);
            }
          }
          
          // Add tags
          const quoteTags = quote.tags || ["wisdom"];
          for (const tagName of quoteTags) {
            let tagId = tagMap.get(tagName);
            // Create tag if it doesn't exist
            if (!tagId && tagName) {
              const newTag = await storage.createTag({
                name: tagName.toLowerCase(),
                slug: tagName.toLowerCase().replace(/\s+/g, '-')
              });
              tagId = newTag.id;
              tagMap.set(tagName, tagId);
            }
            
            if (tagId) {
              await (storage as any).addQuoteTag(createdQuote.id, tagId);
            }
          }
          
          quotesAdded++;
        }
        
        console.log(`Added ${quotesAdded} quotes from APIs.`);
      } catch (apiError) {
        console.error("Error fetching from APIs, continuing with procedural generation:", apiError);
      }
    }
    
    // Generate the remaining quotes procedurally
    if (quotesAdded < targetQuoteCount) {
      const remainingQuotes = targetQuoteCount - quotesAdded;
      console.log(`Generating ${remainingQuotes} procedural quotes to reach the target of ${targetQuoteCount}...`);
      
      // Generate in batches
      for (let i = 0; i < remainingQuotes; i += batchSize) {
        const currentBatchSize = Math.min(batchSize, remainingQuotes - i);
        
        await generateProceduralQuotes(
          storage, 
          authorMap,
          categoryMap,
          tagMap,
          currentBatchSize
        );
        
        quotesAdded += currentBatchSize;
        console.log(`Added ${quotesAdded} quotes so far (${(quotesAdded / targetQuoteCount * 100).toFixed(2)}% complete)...`);
      }
    }
    
    console.log(`Successfully added ${quotesAdded} quotes to the database.`);
  } catch (error) {
    console.error("Error generating quotes:", error);
    
    // If API fetching fails, fallback to generating procedural quotes
    console.log("Falling back to generating quotes procedurally...");
    
    const remainingQuotes = targetQuoteCount - quotesAdded;
    if (remainingQuotes > 0) {
      await generateProceduralQuotes(storage, authorMap, categoryMap, tagMap, remainingQuotes);
      console.log(`Generated ${remainingQuotes} quotes procedurally.`);
    }
  }
}

// Function to fetch quotes from various APIs
async function fetchQuotesFromAPIs(): Promise<any[]> {
  const allQuotes: any[] = [];
  
  for (const api of QUOTE_APIS) {
    try {
      console.log(`Fetching quotes from ${api.name}...`);
      const response = await axios.get(api.url);
      const processedQuotes = api.processResponse(response.data);
      allQuotes.push(...processedQuotes);
      console.log(`Retrieved ${processedQuotes.length} quotes from ${api.name}`);
    } catch (error) {
      console.error(`Error fetching quotes from ${api.name}:`, error);
    }
  }
  
  // Shuffle the quotes to mix sources
  return shuffleArray(allQuotes);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Famous quotes to mix with generated content for more variety
const FAMOUS_QUOTES = [
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { text: "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.", author: "Oprah Winfrey" },
  { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "The future rewards those who press on. I don't have time to feel sorry for myself. I don't have time to complain. I'm going to press on.", author: "Barack Obama" },
  { text: "We cannot solve our problems with the same thinking we used when we created them.", author: "Albert Einstein" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" }
];

// Optimized function to generate quotes procedurally with reduced async operations
async function generateProceduralQuotes(
  storage: IStorage,
  authorMap: Map<string, number>,
  categoryMap: Map<string, number>,
  tagMap: Map<string, number>,
  count: number
): Promise<void> {
  const quoteTemplates = [
    "The key to %s is %s.",
    "%s is the foundation of %s.",
    "Never underestimate the power of %s in achieving %s.",
    "True %s comes from %s.",
    "The secret of %s lies in %s.",
    "To master %s, you must understand %s.",
    "Only through %s can you truly find %s.",
    "When you embrace %s, you discover %s.",
    "%s is not about being perfect; it's about %s.",
    "The journey to %s begins with %s.",
    "The greatest %s comes through %s.",
    "Seek %s through %s.",
    "Let your %s guide your %s.",
    "Cultivate %s to nurture your %s.",
    "Practice %s to enhance your %s.",
    "Your %s is directly proportional to your %s.",
    "Transform your %s through consistent %s.",
    "Remarkable %s requires extraordinary %s.",
    "Sustainable %s comes from authentic %s.",
    "Meaningful %s emerges from purposeful %s."
  ];
  
  const concepts = [
    "success", "happiness", "wisdom", "growth", "achievement", 
    "excellence", "purpose", "creativity", "innovation", "leadership",
    "courage", "kindness", "resilience", "patience", "perseverance",
    "transformation", "authenticity", "mindfulness", "integrity", "passion",
    "focus", "discipline", "ambition", "gratitude", "empathy",
    "insight", "harmony", "balance", "clarity", "simplicity",
    "abundance", "freedom", "peace", "strength", "vitality",
    "awareness", "presence", "compassion", "generosity", "humility"
  ];
  
  const qualities = [
    "hard work", "dedication", "commitment", "self-belief", "persistence",
    "continuous learning", "embracing failure", "taking risks", "adaptability", "self-discipline",
    "clear vision", "positive thinking", "authentic action", "helping others", "staying focused",
    "being present", "facing fears", "stepping outside comfort zones", "building relationships", "consistency",
    "daily practice", "reflection", "strategic planning", "emotional intelligence", "active listening",
    "regular review", "deep focus", "creative thinking", "critical analysis", "systematic approach",
    "intentional living", "mindful choices", "purposeful action", "genuine connection", "radical honesty",
    "continuous improvement", "embracing change", "celebrating progress", "spiritual growth", "daily rituals"
  ];
  
  const authorIds = Array.from(authorMap.values());
  const categoryIds = Array.from(categoryMap.values());
  const tagIds = Array.from(tagMap.values());
  
  // Use smaller batch size for faster processing
  const batchSize = 5000;
  const innerBatchSize = 100; // Process this many quotes in a single transaction
  
  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);
    console.log(`Generating quotes ${i + 1} to ${i + currentBatchSize}...`);
    
    for (let j = 0; j < currentBatchSize; j += innerBatchSize) {
      const currentInnerBatchSize = Math.min(innerBatchSize, currentBatchSize - j);
      const quoteBatch = [];
      
      for (let k = 0; k < currentInnerBatchSize; k++) {
        let quoteText, authorId;
        
        // Mix in some famous quotes (5% chance)
        if (Math.random() < 0.05 && FAMOUS_QUOTES.length > 0) {
          const randomFamousQuote = FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
          quoteText = randomFamousQuote.text;
          
          // Find or create author for famous quote
          let foundAuthorId = authorMap.get(randomFamousQuote.author);
          if (!foundAuthorId) {
            // We'll create this author outside the loop
            authorId = -1; // Temporary marker
          } else {
            authorId = foundAuthorId;
          }
        } else {
          // Generate a procedural quote
          const template = quoteTemplates[Math.floor(Math.random() * quoteTemplates.length)];
          const concept = concepts[Math.floor(Math.random() * concepts.length)];
          const quality = qualities[Math.floor(Math.random() * qualities.length)];
          
          quoteText = template.replace("%s", concept).replace("%s", quality);
          authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
        }
        
        // Create 1-3 random categories
        const numCategories = Math.floor(Math.random() * 3) + 1;
        const quoteCategories = [];
        const usedCategoryIds = new Set<number>();
        
        for (let m = 0; m < numCategories; m++) {
          let categoryId: number;
          do {
            categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
          } while (usedCategoryIds.has(categoryId));
          
          usedCategoryIds.add(categoryId);
          quoteCategories.push(categoryId);
        }
        
        // Create 2-4 random tags
        const numTags = Math.floor(Math.random() * 3) + 2;
        const quoteTags = [];
        const usedTagIds = new Set<number>();
        
        for (let m = 0; m < numTags; m++) {
          let tagId: number;
          do {
            tagId = tagIds[Math.floor(Math.random() * tagIds.length)];
          } while (usedTagIds.has(tagId));
          
          usedTagIds.add(tagId);
          quoteTags.push(tagId);
        }
        
        quoteBatch.push({
          text: quoteText,
          authorId,
          isFeatured: Math.random() > 0.95, // 5% chance of being featured
          categories: quoteCategories,
          tags: quoteTags
        });
      }
      
      // Now process the batch of quotes
      for (const quoteData of quoteBatch) {
        // If the authorId is -1, it's a new famous quote author we need to create
        if (quoteData.authorId === -1) {
          // Find the corresponding famous quote
          const matchingFamousQuote = FAMOUS_QUOTES.find(fq => fq.text === quoteData.text);
          if (matchingFamousQuote) {
            // Create the author
            const author = await storage.createAuthor({
              name: matchingFamousQuote.author,
              bio: null
            });
            quoteData.authorId = author.id;
            authorMap.set(matchingFamousQuote.author, author.id);
            
            // Add to authorIds array for future quotes
            authorIds.push(author.id);
          } else {
            // Fallback to a random existing author
            quoteData.authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
          }
        }
        
        // Create the quote
        const quote = await storage.createQuote({
          text: quoteData.text,
          authorId: quoteData.authorId,
          source: null,
          isFeatured: quoteData.isFeatured
        } as InsertQuote);
        
        // Add categories
        for (const categoryId of quoteData.categories) {
          await (storage as any).addQuoteCategory(quote.id, categoryId);
        }
        
        // Add tags
        for (const tagId of quoteData.tags) {
          await (storage as any).addQuoteTag(quote.id, tagId);
        }
      }
      
      // Log progress periodically
      if ((j + innerBatchSize) % 1000 === 0 || j + innerBatchSize >= currentBatchSize) {
        console.log(`  Generated ${i + j + Math.min(innerBatchSize, currentBatchSize - j)} quotes...`);
      }
    }
  }
}
