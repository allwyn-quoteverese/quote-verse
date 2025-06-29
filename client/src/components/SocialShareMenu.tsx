import { useState } from "react";
import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SocialShareMenuProps {
  quote: string;
  author: string;
  quoteId: number;
  variant?: "ghost" | "default" | "icon";
  className?: string;
}

export default function SocialShareMenu({ 
  quote, 
  author, 
  quoteId, 
  variant = "icon",
  className = "" 
}: SocialShareMenuProps) {
  const { toast } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Prepare the data for sharing
  const title = `Quote by ${author}`;
  const text = `"${quote}" - ${author}`;
  const url = `${window.location.origin}/quotes/${quoteId}`;
  
  // Encode for URLs
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0ARead more at: ${encodedUrl}`;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((error) => {
          toast({
            title: "Error sharing",
            description: "Failed to share quote.",
            variant: "destructive",
          });
        });
    } else {
      // If Web Share API is not available, open the dropdown
      setIsDropdownOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${text} - Find more at ${url}`);
    
    toast({
      title: "Copied to clipboard",
      description: "Quote has been copied to your clipboard",
    });
    
    setIsDropdownOpen(false);
  };

  const openShareLink = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=550,height=450');
    setIsDropdownOpen(false);
  };

  // Icon-only button for compact UI
  if (variant === "icon") {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 text-slate-400 hover:text-primary transition-colors ${className}`}
            title="Share quote"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => openShareLink(facebookShareUrl)} className="cursor-pointer flex items-center gap-2">
            <Facebook className="h-4 w-4 text-blue-600" />
            <span>Facebook</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(twitterShareUrl)} className="cursor-pointer flex items-center gap-2">
            <Twitter className="h-4 w-4 text-sky-500" />
            <span>Twitter</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(linkedinShareUrl)} className="cursor-pointer flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-blue-700" />
            <span>LinkedIn</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareLink(emailShareUrl)} className="cursor-pointer flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-500" />
            <span>Email</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-slate-500" />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Button with text for more visibility
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={className}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => openShareLink(facebookShareUrl)} className="cursor-pointer flex items-center gap-2">
          <Facebook className="h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(twitterShareUrl)} className="cursor-pointer flex items-center gap-2">
          <Twitter className="h-4 w-4 text-sky-500" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(linkedinShareUrl)} className="cursor-pointer flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openShareLink(emailShareUrl)} className="cursor-pointer flex items-center gap-2">
          <Mail className="h-4 w-4 text-slate-500" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-slate-500" />
          <span>Copy Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}