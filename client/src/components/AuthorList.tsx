import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { type Author } from "@shared/schema";

export default function AuthorList() {
  const { data: authors, isLoading } = useQuery<Author[]>({
    queryKey: ["/api/authors/popular"],
  });

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Popular Authors</h3>
        
        {isLoading ? (
          <ul className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex items-center py-2 border-b border-slate-100">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {authors?.map((author) => (
              <li key={author.id} className="flex items-center py-2 border-b border-slate-100">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/authors/${author.id}`} className="author-link">
                    <span className="author-name font-medium text-slate-800 cursor-pointer">
                      {author.name}
                    </span>
                  </Link>
                  <div className="text-sm text-slate-500">{author.quoteCount} quotes</div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <Link href="/authors">
          <span className="block text-center mt-4 text-primary hover:text-primary/80 font-medium cursor-pointer">
            View All Authors
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
