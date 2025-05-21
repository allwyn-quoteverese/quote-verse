import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRandomQuote = async () => {
    try {
      toast({
        title: "Loading random quote...",
      });
      
      const response = await fetch("/api/quotes/random");
      if (!response.ok) throw new Error("Failed to fetch random quote");
      
      const quote = await response.json();
      
      toast({
        title: "Quote loaded",
        description: "Random quote has been loaded",
      });
      
      navigate(`/quotes/${quote.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch random quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="w-full bg-slate-800 py-1">
        <div className="container mx-auto px-4">
          <p className="text-xs text-white text-right">An <span className="text-red-600">Allwyn Group</span> Initiative</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between mb-3 md:mb-0">
          <Link href="/">
            <div className="flex flex-col">
              <div className="flex items-center cursor-pointer group">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-2 rounded-lg transition-all duration-300 group-hover:shadow-md group-hover:scale-105">
                  <MessageSquareQuote className="h-6 w-6" />
                </div>
                <div className="ml-2 flex flex-col">
                  <span className="text-2xl font-bold tracking-tight">
                    <span className="text-red-600 font-extrabold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text">Allwyn</span>
                    <span className="text-slate-800">quotes.com</span>
                  </span>

                </div>
              </div>
            </div>
          </Link>
          <button 
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex md:items-center`}>
          <ul className="flex flex-col md:flex-row md:items-center">
            <li className="mb-2 md:mb-0 md:mr-6">
              <Link href="/">
                <span className={`${location === "/" ? "text-primary font-medium" : "text-slate-600"} hover:text-primary-600 cursor-pointer`}>
                  Home
                </span>
              </Link>
            </li>
            <li className="mb-2 md:mb-0 md:mr-6">
              <Link href="/categories">
                <span className={`${location.startsWith("/categories") ? "text-primary font-medium" : "text-slate-600"} hover:text-primary-600 cursor-pointer`}>
                  Categories
                </span>
              </Link>
            </li>
            <li className="mb-2 md:mb-0 md:mr-6">
              <Link href="/authors">
                <span className={`${location.startsWith("/authors") ? "text-primary font-medium" : "text-slate-600"} hover:text-primary-600 cursor-pointer`}>
                  Authors
                </span>
              </Link>
            </li>
            <li>
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-sm hover:shadow transition-all duration-300"
                onClick={handleRandomQuote}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Random Quote
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
