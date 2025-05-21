import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuoteCard from "@/components/QuoteCard";
import RandomQuoteWidget from "@/components/RandomQuoteWidget";
import CategoryFilter from "@/components/CategoryFilter";
import AuthorList from "@/components/AuthorList";
import TagsCloud from "@/components/TagsCloud";
import PaginationControls from "@/components/PaginationControls";
import { Link, useLocation } from "wouter";
import { type QuoteWithAuthor } from "@shared/schema";
import { HomePageStructuredData } from "@/components/StructuredData";
import { Helmet } from "react-helmet";
import AdSenseHead from "@/components/AdSenseHead";

export default function Home() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const quotesPerPage = 10;

  // Fetch featured quotes
  const { data: featuredQuotes, isLoading: isFeaturedLoading } = useQuery<QuoteWithAuthor[]>({
    queryKey: ["/api/quotes/featured"],
  });

  // Fetch all quotes with pagination
  const { data: quotesData, isLoading: isQuotesLoading } = useQuery<{
    quotes: QuoteWithAuthor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: [`/api/quotes?page=${currentPage}&limit=${quotesPerPage}`],
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <AdSenseHead />
      <Helmet>
        <title>AllwynQuotes.com | Discover Over 100,000 Inspirational Quotes</title>
        <meta 
          name="description" 
          content="Discover wisdom from over 100,000 inspirational quotes by authors, philosophers, leaders, and visionaries throughout history. Find quotes by category, author, or topic." 
        />
        <meta name="keywords" content="quotes, inspirational quotes, motivational quotes, life quotes, wisdom quotes, famous quotes, love quotes" />
        
        {/* OpenGraph tags for better social sharing */}
        <meta property="og:title" content="AllwynQuotes.com | Discover Over 100,000 Inspirational Quotes" />
        <meta property="og:description" content="Discover wisdom from over 100,000 inspirational quotes by authors, philosophers, leaders, and visionaries throughout history." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://allwynquotes.com/" />
        <meta property="og:site_name" content="AllwynQuotes.com" />
        <meta property="og:image" content="https://allwynquotes.com/api/og-image/page?title=AllwynQuotes.com&subtitle=Discover%20Over%20100,000%20Inspirational%20Quotes" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="AllwynQuotes.com - Inspirational quotes website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AllwynQuotes.com | Discover Over 100,000 Inspirational Quotes" />
        <meta name="twitter:description" content="Discover wisdom from over 100,000 inspirational quotes by authors, philosophers, leaders, and visionaries throughout history." />
        <meta name="twitter:image" content="https://allwynquotes.com/api/og-image/page?title=AllwynQuotes.com&subtitle=Discover%20Over%20100,000%20Inspirational%20Quotes" />
      </Helmet>
      
      <HomePageStructuredData />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-500 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Wisdom in Words</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Browse through our collection of over 100,000 handpicked quotes from thinkers, leaders, and creators across history.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Search quotes or authors..."
                className="w-full px-5 py-6 rounded-full text-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                className="absolute right-2 top-2 bg-primary hover:bg-primary/90 p-2 rounded-full"
                onClick={handleSearch}
              >
                <Search className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <CategoryFilter />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Today's Featured Quotes</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewType === "list" ? "secondary" : "outline"}
                  size="icon"
                  className="p-2 rounded"
                  onClick={() => setViewType("list")}
                  title="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button
                  variant={viewType === "grid" ? "secondary" : "outline"}
                  size="icon"
                  className="p-2 rounded"
                  onClick={() => setViewType("grid")}
                  title="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Quote Grid */}
            {isFeaturedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-slate-100 animate-pulse">
                    <div className="w-8 h-8 bg-slate-200 rounded mb-4"></div>
                    <div className="w-full h-16 bg-slate-200 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="w-24 h-5 bg-slate-200 rounded mb-1"></div>
                        <div className="w-32 h-4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
                {featuredQuotes?.map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={quotesData?.pagination.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            {/* Random Quote Widget */}
            <RandomQuoteWidget />

            {/* Popular Authors */}
            <AuthorList />

            {/* Tags Cloud */}
            <TagsCloud />
          </div>
        </div>
      </main>
    </>
  );
}
