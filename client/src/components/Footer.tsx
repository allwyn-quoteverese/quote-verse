import { Link } from "wouter";
import { MessageSquareQuote } from "lucide-react";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 text-white flex items-center">
              <MessageSquareQuote className="h-6 w-6 mr-2" />
              <span className="text-red-600">Allwyn</span>
              <span className="text-white">quotes.com</span>
            </h4>
            <p className="mb-4 text-slate-400">
              Discover wisdom from over 100,000 quotes by renowned thinkers, leaders, and creators throughout history.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Popular Quotes</span>
                </Link>
              </li>
              <li>
                <Link href="/quotes/random">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Quote of the Day</span>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Categories</span>
                </Link>
              </li>
              <li>
                <Link href="/authors">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Authors</span>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Search</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">API Documentation</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Developers</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Submit a Quote</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Report Issues</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">FAQs</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Copyright Info</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-500">
          <p className="mb-2">A product of <span className="font-medium">Allwyn Group</span></p>
          <p>&copy; {new Date().getFullYear()} <span className="text-red-600">Allwyn</span><span>quotes.com</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
