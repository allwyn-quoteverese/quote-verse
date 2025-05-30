import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import AdSenseHead from "@/components/AdSenseHead";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <AdSenseHead />
      <GoogleAnalytics />
      <Helmet>
        <title>404 Page Not Found | AllwynQuotes.com</title>
        <meta 
          name="description" 
          content="The page you are looking for could not be found. Please check the URL and try again." 
        />
        {/* Ensure search engines don't index 404 pages */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
