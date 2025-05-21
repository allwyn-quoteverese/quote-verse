import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type QuoteWithAuthor, type SearchParams } from "@shared/schema";
import QuoteCard from "@/components/QuoteCard";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import AdSenseHead from "@/components/AdSenseHead";

export default function Search() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  
  // Parse search params from URL
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const query = urlParams.get("q") || "";
  const author = urlParams.get("author") || "";
  const category = urlParams.get("category") || "";
  const tag = urlParams.get("tag") || "";
  const page = parseInt(urlParams.get("page") || "1");
  
  // Set initial search query from URL
  useEffect(() => {
    setSearchQuery(query);
    setCurrentPage(page);
  }, [query, page]);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useQuery<{
    quotes: QuoteWithAuthor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: [`/api/search?q=${query}&author=${author}&category=${category}&tag=${tag}&page=${currentPage}`],
    enabled: !!(query || author || category || tag),
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (author) params.set("author", author);
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    params.set("page", newPage.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AdSenseHead />
      <Helmet>
        <title>{query ? `${query} - Quote Search Results` : 'Search Quotes'} | AllwynQuotes.com</title>
        <meta 
          name="description" 
          content={query ? `Search results for '${query}' quotes. Find inspirational and thought-provoking quotes matching your search.` : 'Search our collection of over 100,000 quotes by keywords, authors, categories, or tags.'}
        />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Search Quotes</h1>
      
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Input
          type="text"
          placeholder="Search quotes or authors..."
          className="w-full px-5 py-6 rounded-lg text-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          className="absolute right-2 top-2 bg-primary hover:bg-primary/90 p-2 rounded-full"
          onClick={handleSearch}
        >
          <SearchIcon className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Active filters display */}
      {(query || author || category || tag) && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Active filters:</h2>
          <div className="flex flex-wrap gap-2">
            {query && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                <span>Query: {query}</span>
                <button
                  className="ml-2"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (author) params.set("author", author);
                    if (category) params.set("category", category);
                    if (tag) params.set("tag", tag);
                    navigate(`/search?${params.toString()}`);
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            {author && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                <span>Author: {author}</span>
                <button
                  className="ml-2"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (query) params.set("q", query);
                    if (category) params.set("category", category);
                    if (tag) params.set("tag", tag);
                    navigate(`/search?${params.toString()}`);
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            {category && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                <span>Category: {category}</span>
                <button
                  className="ml-2"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (query) params.set("q", query);
                    if (author) params.set("author", author);
                    if (tag) params.set("tag", tag);
                    navigate(`/search?${params.toString()}`);
                  }}
                >
                  &times;
                </button>
              </div>
            )}
            {tag && (
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                <span>Tag: {tag}</span>
                <button
                  className="ml-2"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (query) params.set("q", query);
                    if (author) params.set("author", author);
                    if (category) params.set("category", category);
                    navigate(`/search?${params.toString()}`);
                  }}
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {isSearching
            ? "Searching..."
            : searchResults
            ? `${searchResults.pagination.total} results found`
            : "Enter a search term"}
        </h2>
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

      {isSearching ? (
        <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
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
      ) : searchResults && searchResults.quotes.length > 0 ? (
        <>
          <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
            {searchResults.quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={searchResults.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : query || author || category || tag ? (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">No quotes found matching your search criteria.</p>
          <p className="text-slate-500 mt-2">Try different keywords or remove some filters.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">Enter a search term to find quotes.</p>
          <p className="text-slate-500 mt-2">You can search by quote text, author name, or both.</p>
        </div>
      )}
    </div>
  );
}
