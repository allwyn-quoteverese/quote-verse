import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteImageGeneratorProps {
  quote: string;
  author: string;
}

export default function QuoteImageGenerator({ quote, author }: QuoteImageGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateImage = () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Set canvas dimensions
      canvas.width = 1200;
      canvas.height = 630;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1e40af");  // Blue color from our theme
      gradient.addColorStop(1, "#3b82f6");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add decorative elements
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 100, 150, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(100, canvas.height - 100, 100, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add quote text
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      
      // Quote marks
      ctx.font = "bold 120px serif";
      ctx.fillText('"', 150, 200);
      ctx.fillText('"', canvas.width - 150, canvas.height - 200);
      
      // Quote text
      ctx.font = "bold 36px Inter, sans-serif";
      
      const maxWidth = 900;
      const lineHeight = 54;
      const words = quote.split(" ");
      let line = "";
      let y = canvas.height / 2 - 60;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, canvas.width / 2, y);
          line = words[i] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, y);
      
      // Author attribution
      ctx.font = "italic 24px Inter, sans-serif";
      ctx.fillText(`— ${author}`, canvas.width / 2, y + 60);
      
      // Add site branding
      ctx.font = "bold 18px Inter, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText("allwynquotes.com", canvas.width / 2, canvas.height - 40);
      
      // Save as data URL
      const imageUrl = canvas.toDataURL("image/png");
      setQuoteImage(imageUrl);
      
      toast({
        title: "Image Generated",
        description: "Your quote image is ready to download or share",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quote image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadImage = () => {
    if (!quoteImage) return;
    
    const link = document.createElement("a");
    link.href = quoteImage;
    link.download = `quote-${author.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your quote image is downloading",
    });
  };
  
  const shareImage = async () => {
    if (!quoteImage) return;
    
    try {
      // Convert base64 to blob for sharing
      const response = await fetch(quoteImage);
      const blob = await response.blob();
      
      // Try native sharing first
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'quote.png', { type: 'image/png' })] })) {
        try {
          await navigator.share({
            title: `Quote by ${author}`,
            text: `"${quote}" - ${author}`,
            files: [new File([blob], 'quote.png', { type: 'image/png' })],
          });
          return;
        } catch (shareError) {
          // Fall through to clipboard copy
        }
      }
      
      // Fallback: Copy image to clipboard
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast({
          title: "Image copied to clipboard",
          description: "The quote image has been copied. You can now paste it anywhere to share.",
        });
      } catch (clipboardError) {
        // Final fallback: Show instructions
        toast({
          title: "Download to share",
          description: "Click Download to save the image, then share it manually from your device.",
        });
      }
    } catch (error) {
      toast({
        title: "Error preparing image",
        description: "Please try downloading the image instead.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="mt-6 bg-slate-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Image className="h-5 w-5 mr-2 text-primary" />
        Generate Quote Image for Sharing
      </h3>
      
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {quoteImage ? (
        <div className="space-y-4">
          <div className="relative aspect-[1200/630] border border-slate-200 rounded-md overflow-hidden shadow-md">
            <img src={quoteImage} alt="Generated Quote" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none"
              onClick={downloadImage}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              className="flex-1 sm:flex-none bg-primary"
              onClick={shareImage}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Image
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center my-8">
          <p className="mb-4 text-slate-600">
            Create a beautiful image of this quote to share on social media or download for personal use.
          </p>
          <Button 
            onClick={generateImage} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-800"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}