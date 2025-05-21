import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Category, type QuoteWithAuthor } from "@shared/schema";
import QuoteCard from "@/components/QuoteCard";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { CategoryStructuredData } from "@/components/StructuredData";
import AdSenseHead from "@/components/AdSenseHead";

export default function Categories() {
  const [, params] = useRoute("/categories/:slug");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const quotesPerPage = 10;

  // Fetch all categories with count
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<(Category & { quoteCount: number })[]>({
    queryKey: ["/api/categories?count=true"],
  });

  // If a category slug is provided, fetch quotes for that category
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery<{
    category: Category;
    quotes: QuoteWithAuthor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: [`/api/categories/${params?.slug}?page=${currentPage}&limit=${quotesPerPage}`],
    enabled: !!params?.slug,
  });

  if (isCategoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // If no category is selected, show the list of categories
  if (!params?.slug) {
    return (
      <div className="container mx-auto px-4 py-12">
        <AdSenseHead />
        <Helmet>
          <title>Browse Quote Categories | AllwynQuotes.com</title>
          <meta 
            name="description" 
            content="Explore quotes by categories like motivation, success, love, wisdom, and more. Discover inspirational quotes organized by topic." 
          />
        </Helmet>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-red-600 to-primary bg-clip-text text-transparent">Browse Quotes by Category</h1>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">Explore our extensive collection of {categories?.reduce((total, cat) => total + cat.quoteCount, 0).toLocaleString()} quotes across various categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories?.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <a className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/20 relative overflow-hidden group flex flex-col justify-between h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="font-semibold text-lg text-primary block mb-3">{category.name}</span>
                  <span className="text-sm text-gray-500 inline-block px-4 py-1.5 bg-slate-100 rounded-full mx-auto">{category.quoteCount.toLocaleString()} quotes</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If a category is selected, show the quotes for that category
  return (
    <div className="container mx-auto px-4 py-12">
      <AdSenseHead />
      {!isCategoryLoading && categoryData && (
        <>
          <Helmet>
            <title>{`${categoryData.category.name} Quotes | AllwynQuotes.com`}</title>
            <meta 
              name="description" 
              content={`Explore ${categoryData.pagination.total} ${categoryData.category.name.toLowerCase()} quotes. Find inspirational and thought-provoking quotes about ${categoryData.category.name.toLowerCase()}.`} 
            />
          </Helmet>
          <CategoryStructuredData
            categoryName={categoryData.category.name}
            categoryUrl={`https://allwynquotes.com/categories/${categoryData.category.slug}`}
            quoteCount={categoryData.pagination.total}
          />
        </>
      )}
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="flex justify-start mb-8">
            <Link href="/categories">
              <Button variant="outline" className="hover:bg-red-50 hover:text-red-600 transition-colors border-slate-200 shadow-sm">
                ← All Categories
              </Button>
            </Link>
          </div>
          
          {isCategoryLoading ? (
            <div className="w-40 h-9 bg-slate-200 rounded animate-pulse"></div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-primary bg-clip-text text-transparent">
                {categoryData?.category.name} Quotes
              </h1>
              <div className="inline-block px-5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {categoryData?.pagination.total.toLocaleString()} quotes in this category
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-primary mx-auto mt-8 rounded-full"></div>
            </div>
          )}
        </div>

        <div className="flex justify-end mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium text-slate-600">View as:</span>
            <div className="flex gap-3">
              <Button
                variant={viewType === "list" ? "secondary" : "outline"}
                size="icon"
                className={`p-2 rounded-lg ${viewType === "list" ? "bg-red-50 text-red-600 border-red-200" : "border-slate-200"}`}
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
                className={`p-2 rounded-lg ${viewType === "grid" ? "bg-red-50 text-red-600 border-red-200" : "border-slate-200"}`}
                onClick={() => setViewType("grid")}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {isCategoryLoading ? (
          <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-8`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-slate-100 animate-pulse">
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
            <div className={`grid ${viewType === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-8`}>
              {categoryData?.quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <PaginationControls
                currentPage={currentPage}
                totalPages={categoryData?.pagination.totalPages || 1}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
