"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/lib/api";
import { PageContent } from "@/lib/types";

interface ContactClientProps {
  cmsData: PageContent | null;
}

export function ContactClient({ cmsData }: ContactClientProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      message: formData.get('message') as string,
    };

    try {
      await submitContactForm(data);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = {
    address: cmsData?.metadata?.address || "123 Real Estate St, Cairo, Egypt",
    email: cmsData?.metadata?.email || "contact@4seasons.com",
    phone: cmsData?.metadata?.phone || "+20 123 456 7890",
    map_url: cmsData?.metadata?.map_url || "",
  };

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      <div className="text-center mb-12">
        <div className="overflow-hidden py-1">
            <h1 className="text-4xl md:text-5xl font-bold font-headline animate-title-reveal">
              {cmsData?.title || "Get In Touch"}
            </h1>
        </div>
        <div className="overflow-hidden py-1">
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
              {cmsData?.subtitle || "Have a question or ready to start your property journey? We're here to help."}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-lg border-primary/5 bg-surface-low/30 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>Fill out the form and we'll get back to you shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" placeholder="Your Name" required className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="bg-background/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+20 123 456 7890" className="bg-background/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Type your message here..." rows={5} required className="bg-background/50" />
                        </div>
                        <Button type="submit" className="w-full h-12 font-black uppercase tracking-widest text-[10px]" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div>
                 <div className="overflow-hidden py-1">
                    <h2 className="text-2xl font-bold font-headline mb-4 animate-title-reveal">Contact Information</h2>
                 </div>
                <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Our Office</h3>
                            <p>{contactInfo.address}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Email Us</h3>
                            <p>{contactInfo.email}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full mt-1">
                            <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Call Us</h3>
                            <p>{contactInfo.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Map Section */}
             <div>
                <div className="overflow-hidden py-1">
                    <h2 className="text-2xl font-bold font-headline mb-4 animate-title-reveal">Find Us On The Map</h2>
                </div>
                {contactInfo.map_url ? (
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md border border-primary/10">
                    <iframe 
                      src={contactInfo.map_url} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md bg-primary/5 flex items-center justify-center border border-primary/10">
                    <div className="text-center p-6">
                      <MapPin className="w-12 h-12 text-primary/40 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">Find us in Cairo, Egypt</p>
                      <p className="text-sm text-muted-foreground/60 mt-1">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
