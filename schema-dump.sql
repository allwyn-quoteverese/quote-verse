-- AllwynQuotes.com Database Schema Dump (without data)
-- Generated: 2025-05-12

-- Create tables

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  quote_count INTEGER DEFAULT 0
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  source TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Quote-Categories relationship table
CREATE TABLE IF NOT EXISTS quote_categories (
  id SERIAL PRIMARY KEY,
  quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(quote_id, category_id)
);

-- Quote-Tags relationship table
CREATE TABLE IF NOT EXISTS quote_tags (
  id SERIAL PRIMARY KEY,
  quote_id INTEGER NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(quote_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_author_id ON quotes(author_id);
CREATE INDEX IF NOT EXISTS idx_quotes_is_featured ON quotes(is_featured);
CREATE INDEX IF NOT EXISTS idx_quote_categories_quote_id ON quote_categories(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_categories_category_id ON quote_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_quote_tags_quote_id ON quote_tags(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_tags_tag_id ON quote_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_authors_name ON authors(name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Add full text search index for quotes text
CREATE INDEX IF NOT EXISTS idx_quotes_text_search ON quotes USING gin(to_tsvector('english', text));

-- Comments explaining the structure

-- authors: Stores information about quote authors
COMMENT ON TABLE authors IS 'Stores information about the authors of quotes';
COMMENT ON COLUMN authors.id IS 'Primary key for authors';
COMMENT ON COLUMN authors.name IS 'Author name';
COMMENT ON COLUMN authors.bio IS 'Author biography';
COMMENT ON COLUMN authors.quote_count IS 'Number of quotes by this author';

-- categories: Stores quote categories like "Motivation", "Success", etc.
COMMENT ON TABLE categories IS 'Categories for quotes (Motivation, Success, etc.)';
COMMENT ON COLUMN categories.id IS 'Primary key for categories';
COMMENT ON COLUMN categories.name IS 'Category display name';
COMMENT ON COLUMN categories.slug IS 'URL-friendly version of the category name';

-- tags: Stores quote tags for more specific classification
COMMENT ON TABLE tags IS 'Tags for more specific quote classification';
COMMENT ON COLUMN tags.id IS 'Primary key for tags';
COMMENT ON COLUMN tags.name IS 'Tag display name';
COMMENT ON COLUMN tags.slug IS 'URL-friendly version of the tag name';

-- quotes: Stores the actual quotes
COMMENT ON TABLE quotes IS 'The quotes collection';
COMMENT ON COLUMN quotes.id IS 'Primary key for quotes';
COMMENT ON COLUMN quotes.text IS 'The quote text';
COMMENT ON COLUMN quotes.author_id IS 'Foreign key to authors table';
COMMENT ON COLUMN quotes.source IS 'Original source of the quote if known';
COMMENT ON COLUMN quotes.is_featured IS 'Whether this quote should be featured on the homepage';

-- quote_categories: Many-to-many relationship between quotes and categories
COMMENT ON TABLE quote_categories IS 'Many-to-many relationship between quotes and categories';
COMMENT ON COLUMN quote_categories.id IS 'Primary key';
COMMENT ON COLUMN quote_categories.quote_id IS 'Foreign key to quotes table';
COMMENT ON COLUMN quote_categories.category_id IS 'Foreign key to categories table';

-- quote_tags: Many-to-many relationship between quotes and tags
COMMENT ON TABLE quote_tags IS 'Many-to-many relationship between quotes and tags';
COMMENT ON COLUMN quote_tags.id IS 'Primary key';
COMMENT ON COLUMN quote_tags.quote_id IS 'Foreign key to quotes table';
COMMENT ON COLUMN quote_tags.tag_id IS 'Foreign key to tags table';

-- Notes on data insertion
-- Initial quotes include ~100,000 entries
-- Categories include: Motivation, Success, Happiness, Love, Wisdom, Inspiration, Life, Philosophy, Friendship, Leadership, Education, Hope
-- Authors include notable figures like Albert Einstein, Maya Angelou, Oscar Wilde, etc.
-- Tags include: motivational, wisdom, success, life, inspiration, love, happiness, philosophy, courage, hope, attitude, leadership, education, friendship