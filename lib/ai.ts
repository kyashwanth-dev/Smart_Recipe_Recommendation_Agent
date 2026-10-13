import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const recipeResponseSchema = z.object({
  name: z.string(), story: z.string(), cuisine: z.string(), difficulty: z.string(), prepTime: z.coerce.number(), cookTime: z.coerce.number(), servings: z.coerce.number(), ingredients: z.array(z.string()), instructions: z.array(z.string()), tips: z.array(z.string()), nutrition: z.object({ calories: z.coerce.number(), protein: z.coerce.number(), carbs: z.coerce.number(), fat: z.coerce.number(), fiber: z.coerce.number(), sugar: z.coerce.number(), sodium: z.coerce.number() })
});
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;

export const buildRecipePrompt = (ingredients: string[], filters: string[]) => `You are ChefAI, a precise and inventive culinary assistant. Create one achievable recipe using these ingredients: ${ingredients.join(", ")}. Apply these dietary and cuisine preferences: ${filters.join(", ") || "none"}. Return only valid JSON matching this shape: { name, story, cuisine, difficulty, prepTime, cookTime, servings, ingredients: string[], instructions: string[], tips: string[], nutrition: { calories, protein, carbs, fat, fiber, sugar, sodium } }. prepTime, cookTime, servings, and every nutrition value must be JSON numbers, never strings. Do not invent unavailable specialty ingredients unless essential.`;

const stripJsonFences = (output: string) => output.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

export async function generateRecipe(ingredients: string[], filters: string[]): Promise<RecipeResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  const interaction = await ai.interactions.create({
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    input: buildRecipePrompt(ingredients, filters),
  });

  if (!interaction.output_text) throw new Error("Gemini returned no recipe content.");
  const parsed = JSON.parse(stripJsonFences(interaction.output_text));
  return recipeResponseSchema.parse(parsed);
}
