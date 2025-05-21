import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchParamsSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { initializeData } from "./data/quotes";
import { createCanvas, loadImage, registerFont } from "canvas";

// Helper function to set social media friendly headers for image responses
function setSocialMediaImageHeaders(res: express.Response) {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.setHeader('Content-Disposition', 'inline; filename="og-image.png"');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow cross-origin requests
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the database with quotes
  await initializeData(storage);

  // API routes
  app.get("/api/quotes", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const quotes = await storage.getQuotes(page, limit);
      const total = await storage.getTotalQuotes();
      
      res.json({ 
        quotes, 
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching quotes" });
    }
  });

  app.get("/api/quotes/featured", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const quotes = await storage.getFeaturedQuotes(limit);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured quotes" });
    }
  });

  app.get("/api/quotes/random", async (req, res) => {
    try {
      const quote = await storage.getRandomQuote();
      if (!quote) {
        return res.status(404).json({ message: "No quotes found" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Error fetching random quote" });
    }
  });

  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quote" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const parseResult = searchParamsSchema.safeParse(req.query);
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid search parameters" });
      }
      
      const params = parseResult.data;
      const { quotes, total } = await storage.searchQuotes(params);
      
      res.json({
        quotes,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error searching quotes" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const includeCount = req.query.count === 'true';
      
      if (includeCount) {
        const categoriesWithCount = await storage.getCategoriesWithCount();
        res.json(categoriesWithCount);
      } else {
        const categories = await storage.getCategories();
        res.json(categories);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Get quote count for this category
      const categoriesWithCount = await storage.getCategoriesWithCount();
      const categoryWithCount = categoriesWithCount.find(cat => cat.id === category.id);
      const totalQuotes = categoryWithCount?.quoteCount || 0;
      
      const quotes = await storage.getQuotesByCategory(slug, page, limit);
      
      res.json({
        category,
        quotes,
        pagination: {
          page,
          limit,
          total: totalQuotes,
          totalPages: Math.ceil(totalQuotes / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  app.get("/api/tags", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 14;
      const includeCount = req.query.count === 'true';
      
      if (includeCount) {
        const tagsWithCount = await storage.getTagsWithCount();
        // Still respect the limit parameter
        res.json(tagsWithCount.slice(0, limit));
      } else {
        const tags = await storage.getPopularTags(limit);
        res.json(tags);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching tags" });
    }
  });

  app.get("/api/tags/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const tag = await storage.getTagBySlug(slug);
      
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      // Get quote count for this tag
      const tagsWithCount = await storage.getTagsWithCount();
      const tagWithCount = tagsWithCount.find(t => t.id === tag.id);
      const totalQuotes = tagWithCount?.quoteCount || 0;
      
      const quotes = await storage.getQuotesByTag(slug, page, limit);
      
      res.json({
        tag,
        quotes,
        pagination: {
          page,
          limit,
          total: totalQuotes,
          totalPages: Math.ceil(totalQuotes / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching tag" });
    }
  });

  app.get("/api/authors", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const authors = await storage.getAuthors(page, limit);
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching authors" });
    }
  });

  app.get("/api/authors/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const authors = await storage.getPopularAuthors(limit);
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular authors" });
    }
  });

  app.get("/api/authors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const author = await storage.getAuthorById(id);
      
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Use author.quoteCount for total since it's already tracked
      const totalQuotes = author.quoteCount || 0;
      const quotes = await storage.getQuotesByAuthor(id, page, limit);
      
      res.json({
        author,
        quotes,
        pagination: {
          page,
          limit,
          total: totalQuotes,
          totalPages: Math.ceil(totalQuotes / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching author" });
    }
  });
  
  // Add an endpoint to check database status
  app.get('/api/status', async (req, res) => {
    try {
      const status = await storage.getQuotesStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Error getting database status" });
    }
  });
  
  // Open Graph image generation endpoint
  app.get('/api/og-image/quote/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const quote = await storage.getQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      // Set canvas dimensions (1200x630 is optimal for Open Graph images)
      const width = 1200;
      const height = 630;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add a subtle pattern/texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < width; i += 20) {
        for (let j = 0; j < height; j += 20) {
          if (Math.random() > 0.93) {
            ctx.fillRect(i, j, 10, 10);
          }
        }
      }
      
      // Add border elements
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      
      // Add quote text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      
      // Quote marks
      ctx.font = 'bold 120px serif';
      ctx.fillText('"', 150, 200);
      ctx.fillText('"', width - 150, height - 200);
      
      // Quote text
      ctx.font = 'bold 36px Arial, sans-serif';
      
      const maxWidth = 900;
      const lineHeight = 54;
      const words = quote.text.split(' ');
      let line = '';
      let y = height / 2 - 60;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, width / 2, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, y);
      
      // Author attribution
      ctx.font = 'italic 24px Arial, sans-serif';
      ctx.fillText('— ' + quote.author.name, width / 2, y + 60);
      
      // Add site branding
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      
      // Logo text with "Allwyn" in brand color
      const logoText = 'AllwynQuotes.com';
      const metrics = ctx.measureText(logoText);
      const logoX = width / 2 - metrics.width / 2;
      
      // Draw "Allwyn" in brand color
      ctx.fillStyle = '#ef4444'; // Red color for "Allwyn"
      ctx.fillText('Allwyn', logoX, height - 40);
      
      // Get width of "Allwyn" to position "Quotes.com"
      const allwynWidth = ctx.measureText('Allwyn').width;
      
      // Draw "Quotes.com" in white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Quotes.com', logoX + allwynWidth, height - 40);
      
      // Send image as PNG
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Disposition', 'inline; filename="quote-og-image.png"');
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      console.error('Error generating OG image:', error);
      res.status(500).json({ message: 'Error generating image' });
    }
  });
  
  // Generic Open Graph image generation for pages without a specific quote
  app.get('/api/og-image/page', async (req, res) => {
    try {
      const title = req.query.title as string || 'AllwynQuotes.com';
      const subtitle = req.query.subtitle as string || 'Discover over 100,000 inspirational quotes';
      
      // Set canvas dimensions (1200x630 is optimal for Open Graph images)
      const width = 1200;
      const height = 630;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add a subtle pattern/texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < width; i += 20) {
        for (let j = 0; j < height; j += 20) {
          if (Math.random() > 0.93) {
            ctx.fillRect(i, j, 10, 10);
          }
        }
      }
      
      // Add border elements
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, width - 60, height - 60);
      
      // Add title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillText(title, width / 2, height / 2 - 50);
      
      // Add subtitle
      ctx.font = '32px Arial, sans-serif';
      ctx.fillText(subtitle, width / 2, height / 2 + 50);
      
      // Add site branding
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      
      // Logo text with "Allwyn" in brand color
      const logoText = 'AllwynQuotes.com';
      const metrics = ctx.measureText(logoText);
      const logoX = width / 2 - metrics.width / 2;
      
      // Draw "Allwyn" in brand color
      ctx.fillStyle = '#ef4444'; // Red color for "Allwyn"
      ctx.fillText('Allwyn', logoX, height - 40);
      
      // Get width of "Allwyn" to position "Quotes.com"
      const allwynWidth = ctx.measureText('Allwyn').width;
      
      // Draw "Quotes.com" in white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('Quotes.com', logoX + allwynWidth, height - 40);
      
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Disposition', 'inline; filename="page-og-image.png"');
      // Send image as PNG
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      canvas.createPNGStream().pipe(res);
    } catch (error) {
      console.error('Error generating OG image:', error);
      res.status(500).json({ message: 'Error generating image' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
