# Architecture Overview

## Overview

AllwynQuotes is a web application that provides users with a collection of quotes organized by authors, categories, and tags. The application follows a client-server architecture with a React frontend and Node.js/Express backend. It uses PostgreSQL for data storage, accessed through Drizzle ORM.

The application is designed to be deployed on Replit, with specific configuration for that environment, but can be deployed elsewhere as well.

## System Architecture

The system follows a modern web application architecture with the following key components:

### Frontend

- **Technology**: React with TypeScript
- **UI Framework**: Custom components built on top of Radix UI primitives with Tailwind CSS for styling
- **State Management**: React Query for server state management
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend

- **Technology**: Node.js with Express and TypeScript
- **API Style**: RESTful API endpoints
- **Server-Side Rendering**: No SSR; the app uses client-side rendering

### Database

- **Technology**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database access
- **Schema**: Structured around quotes, authors, categories, and tags

### Development Environment

- **Runtime**: Node.js 20
- **Package Manager**: npm
- **Containerization**: Replit environment

## Key Components

### Client Components

1. **Pages**:
   - `Home.tsx`: Main landing page with featured quotes
   - `QuoteSingle.tsx`: Detailed view of a single quote
   - `Authors.tsx`: Lists authors and their quotes
   - `Categories.tsx`: Organizes quotes by categories
   - `Search.tsx`: Search functionality for quotes
   - `Privacy.tsx` and `Terms.tsx`: Static content pages

2. **Core Components**:
   - `Layout.tsx`: Main layout wrapper with header and footer
   - `QuoteCard.tsx`: Reusable component for displaying quotes
   - `RandomQuoteWidget.tsx`: Widget for displaying random quotes
   - `PaginationControls.tsx`: Navigation between pages of results
   - `SearchBar.tsx`: Component for searching quotes

3. **UI Components**:
   - Extensive set of UI components built on Radix UI primitives
   - Components follow the Shadcn UI pattern

### Server Components

1. **API Routes** (in `server/routes.ts`):
   - Quote-related endpoints (`/api/quotes`, `/api/quotes/featured`, etc.)
   - Author-related endpoints
   - Category and tag-related endpoints
   - Search functionality

2. **Storage** (in `server/storage.ts`):
   - Abstraction layer for database operations
   - Implementation for in-memory storage (likely for development/fallback)

3. **Data Initialization** (in `server/data/quotes.ts`):
   - Seed data for bootstrapping the application

### Shared Components

1. **Database Schema** (in `shared/schema.ts`):
   - Defines database tables and relationships:
     - `quotes`: Stores quote text and metadata
     - `authors`: Information about quote authors
     - `categories`: Quote categorization
     - `tags`: Additional tagging for quotes
     - Join tables for many-to-many relationships

## Data Flow

1. **Quote Retrieval Flow**:
   - Client requests quotes through React Query
   - Request hits backend API endpoint
   - Backend retrieves data from database using Drizzle ORM
   - Data is returned to client as JSON
   - React Query caches the response
   - UI components render the data

2. **Search Flow**:
   - User enters search term in SearchBar component
   - Client navigates to search page with query parameters
   - Search page loads and requests search results from API
   - Backend performs search query against database
   - Results are returned to client and displayed

3. **Social Sharing Flow**:
   - User clicks share button on a quote
   - SocialShareMenu component opens with sharing options
   - User selects sharing method (Facebook, Twitter, etc.)
   - Quote is shared to the selected platform using their respective sharing APIs

## External Dependencies

### Frontend Dependencies

1. **UI and Styling**:
   - Radix UI: Accessible UI primitives
   - Tailwind CSS: Utility-first CSS framework
   - Lucide React: Icon set

2. **State Management and Data Fetching**:
   - Tanstack React Query: Data fetching and caching
   - Zod: Schema validation

3. **Miscellaneous**:
   - React Helmet: Document head management for SEO
   - Class Variance Authority: Component styling variations

### Backend Dependencies

1. **Web Server**:
   - Express: Web framework for Node.js

2. **Database**:
   - Drizzle ORM: Type-safe ORM for PostgreSQL
   - Neon Database Serverless Driver: Serverless PostgreSQL client

3. **Image Generation**:
   - Canvas: Node.js canvas implementation for quote image generation

### Development Dependencies

1. **Build Tools**:
   - Vite: Build tool and development server
   - TypeScript: Type checking
   - ESBuild: JavaScript bundler

2. **Replit-specific**:
   - Replit Vite plugins for error overlays and theme support

## Deployment Strategy

The application is configured for deployment on Replit with the following strategy:

1. **Development Mode**:
   - Run with `npm run dev` command
   - Uses tsx to execute TypeScript directly
   - Vite dev server provides hot module replacement

2. **Production Build**:
   - Client code is built with Vite (`vite build`)
   - Server code is bundled with ESBuild
   - Output is placed in the `dist` directory

3. **Production Runtime**:
   - Served with `NODE_ENV=production node dist/index.js`
   - Static assets served from `dist/public`

4. **Database Management**:
   - Schema migrations with Drizzle Kit
   - `db:push` npm script to update database schema

5. **Replit Configuration**:
   - Defined in `.replit` file
   - Uses Node.js 20, PostgreSQL 16
   - Exposes port 5000 (mapped to 80 externally)

## SEO and Social Media Strategy

The application implements several SEO and social media sharing optimizations:

1. **Meta Tags**:
   - Open Graph tags for Facebook
   - Twitter Card tags
   - Standard meta description and title tags

2. **Structured Data**:
   - JSON-LD implementation for rich search results
   - Separate structured data components for quotes, authors, etc.

3. **Image Generation**:
   - Dynamic quote image generation for social sharing
   - Custom canvas-based rendering

4. **SEO Files**:
   - robots.txt with crawler instructions
   - sitemap.xml with site structure

## Analytics and Monetization

1. **Analytics**:
   - Google Analytics integration

2. **Monetization**:
   - Google AdSense integration with ad placement components