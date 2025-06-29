import { useState } from "react";
import { MessageSquare, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { type QuoteWithAuthor } from "@shared/schema";
import SocialShareMenu from "./SocialShareMenu";
import QuoteImageGenerator from "./QuoteImageGenerator";

interface QuoteCardProps {
  quote: QuoteWithAuthor;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: !isFavorite ? "Added to favorites" : "Removed from favorites",
      description: !isFavorite ? "Quote has been added to your favorites" : "Quote has been removed from your favorites",
    });
  };

  // Social sharing is now handled by the SocialShareMenu component

  return (
    <Card className="quote-card overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:translate-y-[-2px]">
      <CardContent className="p-6">
        <div className="mb-4 text-primary/60">
          <MessageSquare className="h-8 w-8" />
        </div>
        <blockquote className="mb-4">
          <p className="text-lg leading-relaxed font-medium">{quote.text}</p>
        </blockquote>
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <span className="font-medium text-slate-800">
              {quote.author.name}
            </span>
            {quote.author.bio && (
              <div className="text-sm text-slate-500 truncate max-w-[200px] mt-1">
                {quote.author.bio}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 text-slate-400 hover:text-primary transition-colors ${isFavorite ? 'text-primary' : ''}`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary' : ''}`} />
            </Button>
            <SocialShareMenu 
              quote={quote.text}
              author={quote.author.name}
              quoteId={quote.id}
              variant="icon"
            />
          </div>
        </div>
        
        {/* Tags */}
        {quote.tags && quote.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {quote.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/search?tag=${tag.slug}`}
              >
                <span className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors cursor-pointer">
                  {tag.name}
                </span>
              </Link>
            ))}
          </div>
        )}
        
        {/* Generate Image Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Button
            variant={showImageGenerator ? "default" : "default"}
            size="sm"
            className="w-full bg-primary text-white hover:bg-primary/90 transition-all duration-200"
            onClick={() => setShowImageGenerator(!showImageGenerator)}
          >
            {showImageGenerator ? 'Hide Image Generator' : 'Generate Quote Image'}
          </Button>
        </div>
        
        {/* Image Generator */}
        {showImageGenerator && (
          <QuoteImageGenerator 
            quote={quote.text}
            author={quote.author.name}
          />
        )}
      </CardContent>
    </Card>
  );
}
