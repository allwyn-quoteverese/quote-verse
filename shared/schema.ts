import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Quote model
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  authorId: integer("author_id").notNull(),
  source: text("source"),
  isFeatured: boolean("is_featured").default(false),
});

// Author model
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  quoteCount: integer("quote_count").default(0),
});

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Tag model
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Many-to-many relationship between quotes and categories
export const quoteCategories = pgTable("quote_categories", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").notNull(),
  categoryId: integer("category_id").notNull(),
});

// Many-to-many relationship between quotes and tags
export const quoteTags = pgTable("quote_tags", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

// Create insert schemas
export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
});

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
});

// Define types
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Author = typeof authors.$inferSelect;
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type QuoteWithAuthor = Quote & {
  author: Author;
  categories?: Category[];
  tags?: Tag[];
};

// Search parameters
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
