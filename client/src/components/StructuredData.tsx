import React from 'react';
import { Helmet } from 'react-helmet';

// Homepage structured data
export const HomePageStructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://allwynquotes.com/",
    "name": "Allwyn Quotes",
    "description": "Discover over 100,000 inspirational quotes from famous authors, categorized by topics and themes.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://allwynquotes.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Single quote structured data
interface QuoteStructuredDataProps {
  quoteText: string;
  quoteAuthor: string;
  authorUrl: string;
  datePublished?: string;
  categories?: string[];
  tags?: string[];
}

export const QuoteStructuredData: React.FC<QuoteStructuredDataProps> = ({ 
  quoteText, 
  quoteAuthor, 
  authorUrl,
  datePublished = "2024-01-01", // Default if not provided
  categories = [],
  tags = []
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quotation",
    "text": quoteText,
    "author": {
      "@type": "Person",
      "name": quoteAuthor,
      "url": authorUrl
    },
    "datePublished": datePublished,
    "about": [...categories, ...tags]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Author structured data
interface AuthorStructuredDataProps {
  authorName: string;
  authorBio?: string;
  authorUrl: string;
}

export const AuthorStructuredData: React.FC<AuthorStructuredDataProps> = ({
  authorName,
  authorBio,
  authorUrl
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": authorName,
    "description": authorBio || `Quotes by ${authorName}`,
    "url": authorUrl
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

// Category structured data
interface CategoryStructuredDataProps {
  categoryName: string;
  categoryUrl: string;
  quoteCount: number;
}

export const CategoryStructuredData: React.FC<CategoryStructuredDataProps> = ({
  categoryName,
  categoryUrl,
  quoteCount
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${categoryName} Quotes`,
    "description": `Browse our collection of ${quoteCount} ${categoryName.toLowerCase()} quotes.`,
    "url": categoryUrl,
    "numberOfItems": quoteCount
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};