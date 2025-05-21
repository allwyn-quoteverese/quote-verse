import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { type Category } from "@shared/schema";

export default function CategoryFilter() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Display up to 9 categories in the filter, with "View All" link if more
  const displayLimit = 9;
  const categoriesToDisplay = categories?.slice(0, displayLimit) || [];
  const hasMoreCategories = categories && categories.length > displayLimit;

  return (
    <section className="py-6 bg-white shadow-sm sticky top-16 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Categories</h2>
          {hasMoreCategories && (
            <Link href="/categories">
              <span className="text-primary hover:text-primary/90 text-sm font-medium flex items-center cursor-pointer">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isLoading ? (
            // Skeleton loader for categories
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-24 rounded-full" />
            ))
          ) : (
            categoriesToDisplay.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Button
                  variant="outline"
                  className="px-4 py-2 rounded-full bg-primary-50 text-primary border-primary-100 hover:bg-primary-100 transition-colors"
                >
                  {category.name}
                </Button>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
