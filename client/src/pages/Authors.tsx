import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Author, type QuoteWithAuthor } from "@shared/schema";
import QuoteCard from "@/components/QuoteCard";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";
import { AuthorStructuredData } from "@/components/StructuredData";
import AdSenseHead from "@/components/AdSenseHead";

export default function Authors() {
  const [, params] = useRoute("/authors/:id");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const itemsPerPage = 10;

  // Fetch all authors
  const { data: authorsData, isLoading: isAuthorsLoading } = useQuery<Author[]>({
    queryKey: [`/api/authors?page=${currentPage}&limit=${itemsPerPage}`],
    enabled: !params?.id,
  });

  // If an author ID is provided, fetch quotes for that author
  const { data: authorData, isLoading: isAuthorLoading } = useQuery<{
    author: Author;
    quotes: QuoteWithAuthor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: [`/api/authors/${params?.id}?page=${currentPage}&limit=${itemsPerPage}`],
    enabled: !!params?.id,
  });

  if (!params?.id) {
    // Author listing page
    return (
      <div className="container mx-auto px-4 py-8">
        <AdSenseHead />
        <Helmet>
          <title>Browse Quote Authors | AllwynQuotes.com</title>
          <meta 
            name="description" 
            content="Discover quotes from famous authors, philosophers, leaders, and visionaries. Browse our collection of authors and their inspirational quotes." 
          />
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Browse Authors</h1>
        
        {isAuthorsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-slate-100 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                  <div>
                    <div className="w-32 h-5 bg-slate-200 rounded mb-1"></div>
                    <div className="w-20 h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorsData?.map((author) => (
                <Link key={author.id} href={`/authors/${author.id}`}>
                  <a className="bg-white hover:bg-slate-50 rounded-lg shadow-md p-6 border border-slate-100 flex items-center transition-colors">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {author.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{author.name}</h3>
                      <p className="text-slate-500">{author.quoteCount} quotes</p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil((authorsData?.length || 0) / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    );
  }

  // Author detail page with their quotes
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/authors">
          <Button variant="outline" className="mb-4">
            ← All Authors
          </Button>
        </Link>
        
        {isAuthorLoading ? (
          <div className="animate-pulse">
            <div className="w-40 h-9 bg-slate-200 rounded mb-2"></div>
            <div className="w-64 h-5 bg-slate-200 rounded"></div>
          </div>
        ) : (
          <div>
            <AdSenseHead />
            <Helmet>
              <title>{`Quotes by ${authorData?.author.name} | AllwynQuotes.com`}</title>
              <meta 
                name="description" 
                content={`Discover ${authorData?.author.quoteCount} inspirational quotes by ${authorData?.author.name}. ${authorData?.author.bio?.substring(0, 100) || ''}`} 
              />
            </Helmet>
            
            {authorData && (
              <AuthorStructuredData 
                authorName={authorData.author.name}
                authorBio={authorData.author.bio || undefined}
                authorUrl={`https://allwynquotes.com/authors/${authorData.author.id}`}
              />
            )}
            
            <div className="flex items-center mb-2">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {authorData?.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold">{authorData?.author.name}</h1>
            </div>
            {authorData?.author.bio && (
              <p className="text-slate-600 mb-4">{authorData.author.bio}</p>
            )}
            <p className="text-slate-500">{authorData?.author.quoteCount} quotes</p>
          </div>
        )}
      </div>

      <div className="flex justify-end mb-6">
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

      {isAuthorLoading ? (
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
      ) : (
        <>
          <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
            {authorData?.quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={authorData?.pagination.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
