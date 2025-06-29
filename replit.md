# AllwynQuotes - Replit Development Guide

## Overview

AllwynQuotes is a web application that provides users with access to over 100,000 inspirational quotes organized by authors, categories, and tags. The application serves as a quote discovery platform with features including search, filtering, social sharing, and quote image generation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state management
- **UI Components**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js 20 with Express framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints serving JSON responses
- **Request Handling**: Express middleware for JSON parsing and request logging

### Database Architecture
- **Database**: PostgreSQL (configured for Replit environment)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Relational design with quotes, authors, categories, and tags
- **Relationships**: Many-to-many relationships between quotes and categories/tags

## Key Components

### Database Schema
The application uses a normalized PostgreSQL schema with the following main tables:
- `quotes`: Core quote content with text, author reference, and metadata
- `authors`: Author information including name, bio, and quote count
- `categories`: Quote categorization (Motivation, Success, Happiness, etc.)
- `tags`: Flexible tagging system for additional classification
- `quote_categories` and `quote_tags`: Junction tables for many-to-many relationships

### API Endpoints
- `/api/quotes` - Paginated quote listing with filtering options
- `/api/quotes/featured` - Featured quotes for homepage
- `/api/quotes/random` - Random quote generator
- `/api/quotes/:id` - Individual quote details
- `/api/authors` - Author listing and individual author pages
- `/api/categories` - Category browsing and filtering
- `/api/search` - Full-text search across quotes and authors

### Frontend Pages
- **Home**: Featured quotes, search functionality, and navigation
- **Categories**: Browse quotes by category with filtering
- **Authors**: Author listings and individual author quote collections
- **Search**: Advanced search with multiple filter options
- **Quote Details**: Individual quote pages with sharing capabilities
- **Static Pages**: Privacy policy, terms of service, and contact

### Special Features
- **Quote Image Generation**: Canvas-based quote image creation for social sharing
- **Social Sharing**: Integration with Facebook, Twitter, LinkedIn, and email
- **SEO Optimization**: Structured data markup and meta tag management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Ad Integration**: Google AdSense implementation

## Data Flow

### Quote Data Management
1. **Data Initialization**: Sample data is loaded from predefined arrays in the data initialization module
2. **Storage Layer**: Abstract storage interface allows switching between in-memory and database storage
3. **API Layer**: Express routes handle HTTP requests and delegate to storage layer
4. **Frontend State**: React Query manages server state with caching and synchronization

### Search and Filtering
1. **User Input**: Search queries and filters collected from UI components
2. **API Processing**: Backend processes search parameters and constructs database queries
3. **Results**: Formatted results returned with pagination metadata
4. **UI Updates**: React Query automatically updates UI components with new data

## External Dependencies

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **ESBuild**: Production bundling for server code

### Runtime Dependencies
- **Database**: Neon PostgreSQL with serverless driver
- **UI Libraries**: Radix UI primitives for accessible components
- **Utility Libraries**: Canvas for image generation, Axios for HTTP requests
- **Form Handling**: React Hook Form with Zod validation

### Third-Party Services
- **Google AdSense**: Monetization through display advertising
- **Google Analytics**: User behavior tracking and analytics
- **Social Media APIs**: Native sharing integrations

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 environment
- **Database**: PostgreSQL 16 module for data persistence
- **Build Process**: Two-stage build (frontend with Vite, backend with ESBuild)
- **Deployment Target**: Autoscale deployment for production traffic

### Environment Setup
- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Production**: `npm run build` followed by `npm run start` for optimized deployment
- **Database**: Drizzle migrations handle schema updates and data seeding

### Performance Considerations
- **Caching**: React Query provides client-side caching with configurable stale times
- **Pagination**: Server-side pagination reduces payload sizes for large datasets
- **Image Optimization**: Canvas-based image generation happens client-side
- **Static Assets**: Vite handles asset optimization and bundling

## Changelog
- June 16, 2025. Initial setup
- June 28, 2025. Authors page functionality completely removed, simplified navigation to focus on quotes and categories only
- June 28, 2025. Standardized all email addresses to contact@allwynquotes.com across all pages

## User Preferences

Preferred communication style: Simple, everyday language.