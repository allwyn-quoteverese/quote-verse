import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdSenseHead from "@/components/AdSenseHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real application, we would send this data to the server
    console.log(values);
    alert("Thank you for your message! We'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <AdSenseHead />
      <Helmet>
        <title>Contact Us | AllwynQuotes.com</title>
        <meta 
          name="description" 
          content="Contact the team at AllwynQuotes.com. We're here to help with any questions or feedback you may have about our quote discovery platform." 
        />
      </Helmet>

      <Link href="/">
        <span className="inline-block">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </span>
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Have a question, suggestion, or just want to say hello? We'd love to hear from you!</p>
              <ul className="space-y-2">
                <li><strong>Email:</strong> info@allwynquotes.com</li>
                <li><strong>Hours:</strong> Monday-Friday, 9AM-5PM EST</li>
                <li><strong>Address:</strong> 123 Quote Street, Suite 456, Inspiration City, IC 98765</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy">
                    <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms">
                    <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                  </Link>
                </li>
                <li>
                  <Link href="/authors">
                    <span className="text-primary hover:underline cursor-pointer">Authors</span>
                  </Link>
                </li>
                <li>
                  <Link href="/categories">
                    <span className="text-primary hover:underline cursor-pointer">Categories</span>
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Copyright Concerns & DMCA Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              AllwynQuotes.com respects the intellectual property rights of others. If you believe that any content on our site infringes upon your copyright, please submit a notice containing the following information:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>A description of the copyrighted work you claim has been infringed</li>
              <li>The exact location of the allegedly infringing content on our site</li>
              <li>Your contact information (name, address, phone number, email)</li>
              <li>A statement that you have a good faith belief that the use is not authorized</li>
              <li>A statement that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner</li>
            </ul>
            <p className="mb-4">
              <strong>For DMCA notices, please email:</strong> dmca@allwynquotes.com
            </p>
            <p>
              <strong>For general copyright concerns:</strong> copyright@allwynquotes.com
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this regarding?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message here..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 AllwynQuotes.com</p>
        </div>
      </div>
    </div>
  );
}