-- AllwynQuotes.com Database Dump
-- Generated: 2025-05-12T14:05:31.273Z

-- Truncate tables
TRUNCATE quote_tags, quote_categories, quotes, tags, categories, authors CASCADE;

-- Reset sequences
ALTER SEQUENCE authors_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE tags_id_seq RESTART WITH 1;
ALTER SEQUENCE quotes_id_seq RESTART WITH 1;
ALTER SEQUENCE quote_categories_id_seq RESTART WITH 1;
ALTER SEQUENCE quote_tags_id_seq RESTART WITH 1;

-- Insert authors

-- Insert categories

-- Insert tags

-- Insert quotes

-- Insert quote-category relationships

-- Insert quote-tag relationships

-- Update sequences
SELECT SETVAL('authors_id_seq', (SELECT MAX(id) FROM authors));
SELECT SETVAL('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT SETVAL('tags_id_seq', (SELECT MAX(id) FROM tags));
SELECT SETVAL('quotes_id_seq', (SELECT MAX(id) FROM quotes));
SELECT SETVAL('quote_categories_id_seq', (SELECT MAX(id) FROM quote_categories));
SELECT SETVAL('quote_tags_id_seq', (SELECT MAX(id) FROM quote_tags));
