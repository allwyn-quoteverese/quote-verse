import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdSenseHead from "@/components/AdSenseHead";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AdSenseHead />
      <Helmet>
        <title>Privacy Policy | AllwynQuotes.com</title>
        <meta 
          name="description" 
          content="Privacy Policy for AllwynQuotes.com - Learn how we collect, use, and protect your information when using our quote discovery platform." 
        />
      </Helmet>

      <Link href="/">
        <span className="inline-block">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </span>
      </Link>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last updated: April 14, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            This Privacy Policy describes how AllwynQuotes.com ("we", "us", or "our") collects, uses, and shares your personal information when you visit our website at https://allwynquotes.com (the "Site").
          </p>
          <p>
            By using the Site, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
          <p>
            When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
          <p>
            Additionally, as you browse the Site, we collect information about the individual web pages that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
          </p>
          <h3 className="text-xl font-semibold mb-3 mt-4">Log Data</h3>
          <p>
            We collect information that your browser sends whenever you visit our Site ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics.
          </p>
          <h3 className="text-xl font-semibold mb-3 mt-4">Quote Content</h3>
          <p>
            AllwynQuotes.com is a quote aggregation platform. We collect quotes from public sources on the web and display them for educational and informational purposes. The quote data we collect includes the text of the quote and attribution to the original author. We do not claim ownership of the quotes themselves, which remain the intellectual property of their original authors or rights holders.
          </p>
          <p>
            Our quote collection process does not involve collecting personal information beyond what is publicly available. If you believe your content has been collected inappropriately, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you to provide updates and other information relating to the website</li>
            <li>Find and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
          <p>
            Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.
          </p>
          <p>
            We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Google AdSense & Analytics</h2>
          <p>
            We may use third-party Service Providers to show advertisements to you to help support and maintain our Service.
          </p>
          <p>
            We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our Site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our Site and other sites on the Internet. You may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
          </p>
          <p>
            We also use Google Analytics to track and analyze usage data from visitors to our website. Google Analytics may capture your IP address, but no other personal information is captured by Google Analytics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p>
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p>
            The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Attribution and Copyright</h2>
          <p>
            AllwynQuotes.com is committed to proper attribution of all quotes displayed on our site. We make every reasonable effort to accurately credit the original authors of the quotes we collect. If you find a quote that is incorrectly attributed or if you are the copyright holder of content that appears on our site without proper attribution, please contact us to address the issue.
          </p>
          <p>
            Our use of quotes falls under fair use principles as defined in copyright law:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Our use is transformative in nature, as we provide a platform for discovery, education, and inspiration;</li>
            <li>We display quotes for non-commercial, educational purposes;</li>
            <li>We use only the necessary amount of content (the quote itself) with proper attribution; and</li>
            <li>Our use does not negatively affect the market value of the original works.</li>
          </ul>
          <p>
            If you have concerns regarding content on our site, please see our Terms of Service for information on our DMCA compliance and takedown procedures.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes To This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>By email: contact@allwynquotes.com</li>
            <li>By visiting the contact page on our website: <Link href="/contact"><span className="text-primary hover:underline">Contact Us</span></Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}