"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Wand2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateDescriptionAction } from "@/app/sell-my-property/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  propertyType: z.string().min(1, "Property type is required"),
  area: z.string().min(1, "Area is required"),
  numberOfRooms: z.coerce.number().min(1, "Number of rooms is required"),
  numberOfBathrooms: z.coerce.number().min(1, "Number of bathrooms is required"),
  finishingLevel: z.string().min(1, "Finishing level is required"),
  sellingType: z.string().min(1, "Selling type is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  specialFeatures: z.string().min(1, "Please list at least one special feature"),
  paymentPlan: z.string().min(1, "Payment plan details are required"),
  locationDescription: z.string().min(1, "Location description is required"),
  amenities: z.string().min(1, "Please list at least one amenity"),
  description: z.string().optional(),
  summary: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function SellPropertyForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "",
      area: "",
      numberOfRooms: 1,
      numberOfBathrooms: 1,
      finishingLevel: "",
      sellingType: "",
      deliveryDate: "",
      specialFeatures: "",
      paymentPlan: "",
      locationDescription: "",
      amenities: "",
      description: "",
      summary: "",
    },
  });

  const handleGenerateDescription = () => {
    const values = form.getValues();
    const {
      description,
      summary,
      ...generationValues
    } = values;

    startTransition(async () => {
      const result = await generateDescriptionAction(generationValues);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        form.setValue("description", result.description);
        form.setValue("summary", result.summary);
        toast({
          title: "Success!",
          description: "Property description and summary have been generated.",
        });
      }
    });
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Property Submitted!",
      description: "Our team will review your submission and get in touch.",
    });
    form.reset();
  };
  
  const submitViaWhatsApp = () => {
    const values = form.getValues();
    const message = `I'd like to sell my property. Here are the details:
- Property Type: ${values.propertyType}
- Area: ${values.area} sqm
- Rooms: ${values.numberOfRooms}
- Bathrooms: ${values.numberOfBathrooms}
- Finishing: ${values.finishingLevel}
- Selling Type: ${values.sellingType}
- Delivery: ${values.deliveryDate}
- Features: ${values.specialFeatures}
- Payment Plan: ${values.paymentPlan}
- Location: ${values.locationDescription}
- Amenities: ${values.amenities}
- Description: ${values.description}
- Summary: ${values.summary}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select property type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Chalet">Chalet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sqm)</FormLabel>
                    <FormControl><Input placeholder="e.g., 150" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rooms</FormLabel>
                    <FormControl><Input type="number" min="1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfBathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Bathrooms</FormLabel>
                    <FormControl><Input type="number" min="1" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finishingLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finishing Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select finishing level" /></SelectTrigger></FormControl>
                       <SelectContent>
                        <SelectItem value="Fully Finished">Fully Finished</SelectItem>
                        <SelectItem value="Semi-finished">Semi-finished</SelectItem>
                        <SelectItem value="Unfinished">Unfinished</SelectItem>
                       </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select selling type" /></SelectTrigger></FormControl>
                       <SelectContent>
                        <SelectItem value="Developer">Developer</SelectItem>
                        <SelectItem value="Resale">Resale</SelectItem>
                       </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date</FormLabel>
                  <FormControl><Input placeholder="e.g., Q4 2025" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the property's location, nearby landmarks, etc." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Swimming Pool, Gym, 24/7 Security" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Features</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Rooftop terrace, private garden, sea view" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Plan</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 10% down payment, installments over 7 years" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button type="button" onClick={handleGenerateDescription} disabled={isPending} variant="secondary" size="lg">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate with AI
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI-Generated Description</FormLabel>
                  <FormControl><Textarea rows={6} placeholder="The AI-generated property description will appear here." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI-Generated Summary</FormLabel>
                  <FormControl><Textarea rows={4} placeholder="The AI-generated summary of key features will appear here." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-4 justify-end pt-4">
               <Button type="button" onClick={submitViaWhatsApp} variant="outline" size="lg" className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600">
                <MessageCircle className="mr-2 h-4 w-4" /> Submit via WhatsApp
              </Button>
              <Button type="submit" size="lg">Submit Property</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
