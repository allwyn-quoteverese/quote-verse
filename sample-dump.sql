-- AllwynQuotes.com Database Dump Sample
-- Generated: 2025-05-12

-- Disable constraints temporarily
SET CONSTRAINTS ALL DEFERRED;

-- Truncate tables
TRUNCATE quote_tags, quote_categories, quotes, tags, categories, authors CASCADE;

-- Reset sequences
ALTER SEQUENCE authors_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE tags_id_seq RESTART WITH 1;
ALTER SEQUENCE quotes_id_seq RESTART WITH 1;
ALTER SEQUENCE quote_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE quote_tags_id_seq RESTART WITH 1;

-- Start transaction
BEGIN;

-- Insert authors
INSERT INTO authors (id, name, bio, quote_count) VALUES (1, 'Albert Einstein', 'Theoretical physicist who developed the theory of relativity', 432);
INSERT INTO authors (id, name, bio, quote_count) VALUES (2, 'Maya Angelou', 'American poet, memoirist, and civil rights activist', 318);
INSERT INTO authors (id, name, bio, quote_count) VALUES (3, 'Oscar Wilde', 'Irish poet and playwright', 271);
INSERT INTO authors (id, name, bio, quote_count) VALUES (4, 'Eleanor Roosevelt', 'Former First Lady of the United States', 189);
INSERT INTO authors (id, name, bio, quote_count) VALUES (5, 'Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer', 294);
-- And more authors...

-- Insert categories
INSERT INTO categories (id, name, slug) VALUES (1, 'Motivation', 'motivation');
INSERT INTO categories (id, name, slug) VALUES (2, 'Success', 'success');
INSERT INTO categories (id, name, slug) VALUES (3, 'Happiness', 'happiness');
INSERT INTO categories (id, name, slug) VALUES (4, 'Love', 'love');
INSERT INTO categories (id, name, slug) VALUES (5, 'Wisdom', 'wisdom');
INSERT INTO categories (id, name, slug) VALUES (6, 'Inspiration', 'inspiration');
INSERT INTO categories (id, name, slug) VALUES (7, 'Life', 'life');
INSERT INTO categories (id, name, slug) VALUES (8, 'Philosophy', 'philosophy');
INSERT INTO categories (id, name, slug) VALUES (9, 'Friendship', 'friendship');
INSERT INTO categories (id, name, slug) VALUES (10, 'Leadership', 'leadership');
INSERT INTO categories (id, name, slug) VALUES (11, 'Education', 'education');
INSERT INTO categories (id, name, slug) VALUES (12, 'Hope', 'hope');

-- Insert tags
INSERT INTO tags (id, name, slug) VALUES (1, 'motivational', 'motivational');
INSERT INTO tags (id, name, slug) VALUES (2, 'wisdom', 'wisdom');
INSERT INTO tags (id, name, slug) VALUES (3, 'success', 'success');
INSERT INTO tags (id, name, slug) VALUES (4, 'life', 'life');
INSERT INTO tags (id, name, slug) VALUES (5, 'inspiration', 'inspiration');
INSERT INTO tags (id, name, slug) VALUES (6, 'love', 'love');
INSERT INTO tags (id, name, slug) VALUES (7, 'happiness', 'happiness');
INSERT INTO tags (id, name, slug) VALUES (8, 'philosophy', 'philosophy');
INSERT INTO tags (id, name, slug) VALUES (9, 'courage', 'courage');
INSERT INTO tags (id, name, slug) VALUES (10, 'hope', 'hope');
INSERT INTO tags (id, name, slug) VALUES (11, 'attitude', 'attitude');
INSERT INTO tags (id, name, slug) VALUES (12, 'leadership', 'leadership');
INSERT INTO tags (id, name, slug) VALUES (13, 'education', 'education');
INSERT INTO tags (id, name, slug) VALUES (14, 'friendship', 'friendship');

-- Insert quotes
INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (1, 'The greatest glory in living lies not in never falling, but in rising every time we fall.', 6, NULL, TRUE);
INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (2, 'The future belongs to those who believe in the beauty of their dreams.', 4, NULL, TRUE);
INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (3, 'Success is not final, failure is not fatal: It is the courage to continue that counts.', 8, NULL, TRUE);
INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (4, 'Your time is limited, so don''t waste it living someone else''s life.', 7, NULL, FALSE);
INSERT INTO quotes (id, text, author_id, source, is_featured) VALUES (5, 'The only way to do great work is to love what you do. If you haven''t found it yet, keep looking. Don''t settle.', 7, NULL, FALSE);
-- ... and many more quotes (100,000+ in full dataset)

-- Insert quote-category relationships
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (1, 1, 1);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (2, 1, 7);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (3, 2, 6);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (4, 2, 12);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (5, 3, 2);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (6, 3, 1);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (7, 4, 7);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (8, 4, 5);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (9, 5, 2);
INSERT INTO quote_categories (id, quote_id, category_id) VALUES (10, 5, 6);
-- ... and many more quote-category relationships

-- Insert quote-tag relationships
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (1, 1, 1);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (2, 1, 4);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (3, 1, 10);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (4, 2, 5);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (5, 2, 10);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (6, 3, 3);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (7, 3, 9);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (8, 3, 1);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (9, 4, 4);
INSERT INTO quote_tags (id, quote_id, tag_id) VALUES (10, 4, 2);
-- ... and many more quote-tag relationships

-- Update sequences
SELECT SETVAL('authors_id_seq', (SELECT MAX(id) FROM authors));
SELECT SETVAL('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT SETVAL('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT SETVAL('quotes_id_seq', (SELECT MAX(id) FROM quotes));
SELECT SETVAL('quote_categories_id_seq', (SELECT COUNT(*) FROM quote_categories));
SELECT SETVAL('quote_tags_id_seq', (SELECT COUNT(*) FROM quote_tags));

-- Commit transaction
COMMIT;

-- Re-enable constraints
SET CONSTRAINTS ALL IMMEDIATE;

-- Note: Full dataset would contain 100,000+ quotes and corresponding relationships
-- The full SQL dump can be generated using the provided script: npx tsx scripts/data-dump.ts
-- This may take several minutes to generate due to the large dataset size