import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ 
  className = '', 
  placeholder = "Search quotes or authors...",
  initialValue = ""
}: SearchBarProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full px-5 py-6 rounded-full text-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button
        className="absolute right-2 top-2 bg-primary hover:bg-primary/90 p-2 rounded-full"
        onClick={handleSearch}
      >
        <Search className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}
