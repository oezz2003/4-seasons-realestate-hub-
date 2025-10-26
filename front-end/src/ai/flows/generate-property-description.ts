'use server';

/**
 * @fileOverview A flow for generating property descriptions and summarizing key features.
 *
 * - generatePropertyDescription - A function that generates property descriptions.
 * - GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * - GeneratePropertyDescriptionOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z.string().describe('The type of property (e.g., apartment, villa, townhouse).'),
  area: z.string().describe('The area of the property in square meters.'),
  numberOfRooms: z.number().describe('The number of rooms in the property.'),
  numberOfBathrooms: z.number().describe('The number of bathrooms in the property.'),
  finishingLevel: z.string().describe('The finishing level of the property (e.g., fully finished, semi-finished, unfinished).'),
  sellingType: z.string().describe('The selling type (e.g., Developer, Resale).'),
  deliveryDate: z.string().describe('The delivery date of the property.'),
  specialFeatures: z.string().describe('Special features of the property (e.g., Rooftop, Garden).'),
  paymentPlan: z.string().describe('The payment plan for the property (e.g., installments over N years, down payment amount, monthly payments).'),
  locationDescription: z.string().describe('Description of the properties location'),
  amenities: z.string().describe('A list of amenities of the property'),
});

export type GeneratePropertyDescriptionInput = z.infer<typeof GeneratePropertyDescriptionInputSchema>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated property description.'),
  summary: z.string().describe('A summary of the key features of the property.'),
});

export type GeneratePropertyDescriptionOutput = z.infer<typeof GeneratePropertyDescriptionOutputSchema>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are an expert real estate copywriter. Generate an engaging and informative property description and a summary of key features based on the following data:

Property Type: {{{propertyType}}}
Area: {{{area}}} square meters
Number of Rooms: {{{numberOfRooms}}}
Number of Bathrooms: {{{numberOfBathrooms}}}
Finishing Level: {{{finishingLevel}}}
Selling Type: {{{sellingType}}}
Delivery Date: {{{deliveryDate}}}
Special Features: {{{specialFeatures}}}
Payment Plan: {{{paymentPlan}}}
Location Description: {{{locationDescription}}}
Amenities: {{{amenities}}}

Description:
Summary:`, // Ensure the prompt requests both description and summary.
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
