import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdSenseHead from "@/components/AdSenseHead";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <AdSenseHead />
      <Helmet>
        <title>Terms of Service | AllwynQuotes.com</title>
        <meta 
          name="description" 
          content="Terms of Service for AllwynQuotes.com - Understand the terms and conditions that govern your use of our quote discovery platform." 
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last updated: April 14, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            Welcome to AllwynQuotes.com ("we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of the AllwynQuotes.com website and services (the "Service").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of AllwynQuotes.com and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AllwynQuotes.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quote Content</h2>
          <p>
            The quotes displayed on AllwynQuotes.com are collected from various sources across the web and are believed to be in the public domain or used under fair use principles for educational and informational purposes. We do not claim ownership of the quotes themselves, as they represent the intellectual property of their respective authors or rights holders.
          </p>
          <p>
            If you are a copyright owner and believe that any content on our site constitutes copyright infringement of your work, please contact us immediately with the relevant information, and we will promptly review and address your concerns.
          </p>
          <p>
            AllwynQuotes.com operates as a quote aggregator and curator, providing a platform for discovering and sharing inspirational, educational, and thoughtful quotes. Our service falls under fair use as it is transformative, non-commercial in nature, educational, and does not negatively impact the market value of the original works.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Content</h2>
          <p>
            Our Service allows you to view and share quotes. You are responsible for the use of the Service and any content you provide, including compliance with applicable laws, rules, and regulations.
          </p>
          <p>
            You retain any and all of your rights to any content you submit, post, or display on or through the Service, and you are responsible for protecting those rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Links To Other Websites</h2>
          <p>
            Our Service may contain links to third-party websites or services that are not owned or controlled by AllwynQuotes.com.
          </p>
          <p>
            AllwynQuotes.com has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that AllwynQuotes.com shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </p>
          <p>
            We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation Of Liability</h2>
          <p>
            In no event shall AllwynQuotes.com, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">DMCA Compliance</h2>
          <p>
            AllwynQuotes.com respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). If you believe that material on our website infringes your copyright, you can request removal by following the procedure below:
          </p>
          <p>
            Send a written notice to dmca@allwynquotes.com with the following information:
          </p>
          <ol className="list-decimal ml-6 mb-4">
            <li>Your physical or electronic signature;</li>
            <li>Identification of the copyrighted work you believe to be infringed;</li>
            <li>Identification of the material you believe to be infringing with information about its location;</li>
            <li>Your contact information (address, telephone number, and email address);</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner, its agent, or the law;</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
          </ol>
          <p>
            Upon receipt of a valid DMCA notice, we will promptly remove or disable access to the content claimed to be infringing and will make a good-faith attempt to contact the party who submitted the content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>By email: terms@allwynquotes.com</li>
            <li>By visiting the contact page on our website: <Link href="/contact"><span className="text-primary hover:underline">Contact Us</span></Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}