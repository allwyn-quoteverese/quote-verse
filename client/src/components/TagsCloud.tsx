import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Tag } from "@shared/schema";

export default function TagsCloud() {
  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Popular Tags</h3>
        
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 14 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Link key={tag.id} href={`/search?tag=${tag.slug}`}>
                <span className="px-3 py-1 bg-slate-100 hover:bg-primary/10 rounded-full text-sm text-slate-700 hover:text-primary transition-colors cursor-pointer inline-block">
                  {tag.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
