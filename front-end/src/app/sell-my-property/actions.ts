"use server";

import {
  generatePropertyDescription,
  type GeneratePropertyDescriptionInput,
} from "@/ai/flows/generate-property-description";
import { z } from "zod";

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z.string(),
  area: z.string(),
  numberOfRooms: z.coerce.number(),
  numberOfBathrooms: z.coerce.number(),
  finishingLevel: z.string(),
  sellingType: z.string(),
  deliveryDate: z.string(),
  specialFeatures: z.string(),
  paymentPlan: z.string(),
  locationDescription: z.string(),
  amenities: z.string(),
});

export async function generateDescriptionAction(
  input: GeneratePropertyDescriptionInput
) {
  const parsedInput = GeneratePropertyDescriptionInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      error: "Invalid input.",
      description: "",
      summary: "",
    };
  }

  try {
    const result = await generatePropertyDescription(parsedInput.data);
    return {
      error: null,
      description: result.description,
      summary: result.summary,
    };
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to generate description. Please try again.",
      description: "",
      summary: "",
    };
  }
}
