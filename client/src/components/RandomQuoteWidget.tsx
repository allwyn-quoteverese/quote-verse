import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { type QuoteWithAuthor } from "@shared/schema";
import { Link } from "wouter";

export default function RandomQuoteWidget() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: quote, isLoading } = useQuery<QuoteWithAuthor>({
    queryKey: [`/api/quotes/random?_key=${refreshKey}`],
  });

  const getAnotherQuote = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-primary to-blue-700 text-white mb-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
      <CardContent className="p-6 relative z-10">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Random Quote
        </h3>
        
        {isLoading || !quote ? (
          <div className="animate-pulse">
            <div className="h-20 bg-white/20 rounded-md mb-4"></div>
            <div className="h-5 w-32 bg-white/20 rounded-md mb-2"></div>
            <div className="h-4 w-24 bg-white/20 rounded-md"></div>
          </div>
        ) : (
          <>
            <blockquote className="mb-4 relative pl-6">
              <span className="absolute top-0 left-0 text-4xl leading-none text-white/30 font-serif">"</span>
              <p className="text-lg leading-relaxed font-medium">{quote.text}</p>
              <span className="absolute bottom-0 right-0 text-4xl leading-none text-white/30 font-serif">"</span>
            </blockquote>
            <div className="mt-4">
              <Link href={`/authors/${quote.author.id}`}>
                <span className="font-medium hover:underline cursor-pointer">— {quote.author.name}</span>
              </Link>
              {quote.author.bio && (
                <div className="text-sm text-primary-100">{quote.author.bio}</div>
              )}
            </div>
          </>
        )}
        
        <Button
          className="mt-4 w-full bg-white text-primary hover:bg-primary-50 hover:shadow-md font-medium transition-all transform hover:translate-y-[-2px]"
          onClick={getAnotherQuote}
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Get Another Random Quote
        </Button>
      </CardContent>
    </Card>
  );
}
