import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type QuoteWithAuthor } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteStructuredData } from "@/components/StructuredData";
import { Helmet } from "react-helmet";
import SocialShareMenu from "@/components/SocialShareMenu";
import QuoteImageGenerator from "@/components/QuoteImageGenerator";
import AdSenseHead from "@/components/AdSenseHead";

export default function QuoteSingle() {
  const { id } = useParams<{ id: string }>();
  const quoteId = parseInt(id);

  const { data: quote, isLoading, error } = useQuery<QuoteWithAuthor>({
    queryKey: [`/api/quotes/${quoteId}`],
    enabled: !isNaN(quoteId)
  });

  if (isNaN(quoteId)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Invalid Quote ID</h1>
        <p>The quote ID provided is not valid.</p>
        <Link href="/">
          <span className="inline-block">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </span>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Error Loading Quote</h1>
        <p>There was an error loading the quote. Please try again later.</p>
        <Link href="/">
          <span className="inline-block">
            <Button className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/">
        <span className="inline-block">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </span>
      </Link>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ) : quote ? (
        <>
          <AdSenseHead />
          <Helmet>
            <title>{`${quote.text.substring(0, 60)}... - ${quote.author.name} | AllwynQuotes.com`}</title>
            <meta name="description" content={`${quote.text.substring(0, 160)}... Quote by ${quote.author.name}`} />
            
            {/* OpenGraph tags for better social sharing */}
            <meta property="og:title" content={`Quote by ${quote.author.name} | AllwynQuotes.com`} />
            <meta property="og:description" content={`"${quote.text.substring(0, 200)}..." - ${quote.author.name}`} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={`https://allwynquotes.com/quotes/${quote.id}`} />
            <meta property="og:site_name" content="AllwynQuotes.com" />
            <meta property="og:image" content={`https://allwynquotes.com/api/og-image/quote/${quote.id}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`Quote by ${quote.author.name}`} />
            
            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`Quote by ${quote.author.name} | AllwynQuotes.com`} />
            <meta name="twitter:description" content={`"${quote.text.substring(0, 200)}..." - ${quote.author.name}`} />
            <meta name="twitter:image" content={`https://allwynquotes.com/api/og-image/quote/${quote.id}`} />
          </Helmet>
          
          <QuoteStructuredData 
            quoteText={quote.text}
            quoteAuthor={quote.author.name}
            authorUrl={`https://allwynquotes.com/authors/${quote.author.id}`}
            categories={quote.categories?.map(c => c.name) || []}
            tags={quote.tags?.map(t => t.name) || []}
          />
          
          <Card className="overflow-hidden shadow-lg border-primary/10">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <blockquote className="text-2xl font-serif italic leading-relaxed mb-6 pr-4">
                  "{quote.text}"
                </blockquote>
                
                <div className="hidden sm:block">
                  <SocialShareMenu 
                    quote={quote.text}
                    author={quote.author.name}
                    quoteId={quote.id}
                    variant="default"
                    className="bg-primary text-white hover:bg-primary/90"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Link href={`/authors/${quote.author.id}`}>
                      <span className="text-xl font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">
                        — {quote.author.name}
                      </span>
                    </Link>
                    
                    {quote.author.bio && (
                      <p className="text-gray-600 mt-2">{quote.author.bio}</p>
                    )}
                  </div>
                  
                  <div className="sm:hidden">
                    <SocialShareMenu 
                      quote={quote.text}
                      author={quote.author.name}
                      quoteId={quote.id}
                      variant="default"
                      className="bg-primary text-white hover:bg-primary/90"
                    />
                  </div>
                </div>
              </div>

              {quote.source && (
                <div className="mt-4 text-sm text-gray-500">
                  <span className="font-medium">Source:</span> {quote.source}
                </div>
              )}

              {quote.categories && quote.categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {quote.categories.map((category) => (
                      <Link key={category.id} href={`/categories/${category.slug}`}>
                        <span className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors cursor-pointer">
                          {category.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {quote.tags && quote.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {quote.tags.map((tag) => (
                      <Link key={tag.id} href={`/search?tag=${tag.slug}`}>
                        <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm transition-colors cursor-pointer">
                          {tag.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Add the quote image generator */}
          <QuoteImageGenerator 
            quote={quote.text}
            author={quote.author.name}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Quote Not Found</h2>
          <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <span className="inline-block">
              <Button>Return to Home</Button>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}