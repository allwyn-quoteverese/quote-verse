-- AllwynQuotes.com Initial Data Dump (Categories, Tags, and Sample Authors only)
-- Generated: 2025-05-12

-- Start transaction for faster import
BEGIN;

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

-- Insert sample authors (top 10 from original data)
INSERT INTO authors (id, name, bio, quote_count) VALUES (1, 'Albert Einstein', 'Theoretical physicist who developed the theory of relativity', 432);
INSERT INTO authors (id, name, bio, quote_count) VALUES (2, 'Maya Angelou', 'American poet, memoirist, and civil rights activist', 318);
INSERT INTO authors (id, name, bio, quote_count) VALUES (3, 'Oscar Wilde', 'Irish poet and playwright', 271);
INSERT INTO authors (id, name, bio, quote_count) VALUES (4, 'Eleanor Roosevelt', 'Former First Lady of the United States', 189);
INSERT INTO authors (id, name, bio, quote_count) VALUES (5, 'Mark Twain', 'American writer, humorist, entrepreneur, publisher, and lecturer', 294);
INSERT INTO authors (id, name, bio, quote_count) VALUES (6, 'Nelson Mandela', 'Former President of South Africa', 203);
INSERT INTO authors (id, name, bio, quote_count) VALUES (7, 'Steve Jobs', 'Co-founder of Apple Inc.', 156);
INSERT INTO authors (id, name, bio, quote_count) VALUES (8, 'Winston Churchill', 'Former British Prime Minister', 227);
INSERT INTO authors (id, name, bio, quote_count) VALUES (9, 'Robert Frost', 'American poet', 145);
INSERT INTO authors (id, name, bio, quote_count) VALUES (10, 'Mahatma Gandhi', 'Indian lawyer, anti-colonial nationalist, and political ethicist', 263);

-- Update sequences
SELECT SETVAL('authors_id_seq', (SELECT MAX(id) FROM authors));
SELECT SETVAL('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT SETVAL('tags_id_seq', (SELECT MAX(id) FROM tags));

-- Commit transaction
COMMIT;