import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  // Don't show pagination if only one page
  if (totalPages <= 1) return null;

  // Create array of page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end of page range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis-start");
    }
    
    // Add page numbers around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-8 flex justify-center">
      <nav className="inline-flex shadow-sm rounded-md" aria-label="Pagination">
        {/* Previous page button */}
        <Button
          variant="outline"
          className="px-3 py-2 rounded-l-md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                className="px-4 py-2 border-slate-300 bg-white text-sm font-medium text-slate-500"
                disabled
              >
                ...
              </Button>
            );
          }
          
          return (
            <Button
              key={page}
              variant={currentPage === page ? "secondary" : "outline"}
              className={`px-4 py-2 ${
                currentPage === page
                  ? "bg-primary-50 text-primary"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          );
        })}
        
        {/* Next page button */}
        <Button
          variant="outline"
          className="px-3 py-2 rounded-r-md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  );
}
