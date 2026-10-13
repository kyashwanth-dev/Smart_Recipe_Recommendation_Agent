import { NextResponse } from "next/server";
import { buildRecipePrompt, generateRecipe } from "@/lib/ai";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  console.log(`[ChefAI API][${requestId}] Step 1: request received`);
  const body = await request.json().catch(() => ({}));
  const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
  const filters = Array.isArray(body.filters) ? body.filters : [];
  console.log(`[ChefAI API][${requestId}] Step 2: ingredients=${JSON.stringify(ingredients)} filters=${JSON.stringify(filters)}`);
  if (!ingredients.length) {
    console.warn(`[ChefAI API][${requestId}] Step 3: rejected because no ingredients were provided`);
    return NextResponse.json({ error: "Add at least one ingredient." }, { status: 400 });
  }
  const prompt = buildRecipePrompt(ingredients, filters);
  console.log(`[ChefAI API][${requestId}] Step 3: prompt built (${prompt.length} characters)`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn(`[ChefAI API][${requestId}] Step 4: GEMINI_API_KEY missing, returning demo mode`);
    return NextResponse.json({ mode: "demo", prompt, message: "Add GEMINI_API_KEY to enable live generation." });
  }
  try {
    console.log(`[ChefAI API][${requestId}] Step 4: calling Gemini model ${process.env.GEMINI_MODEL || "gemini-3.8-flash"}`);
    const recipe = await generateRecipe(ingredients, filters);
    console.log(`[ChefAI API][${requestId}] Step 5: Gemini response validated: ${recipe.name}`);
    return NextResponse.json({ mode: "live", recipe });
  } catch (error) {
    console.error(`[ChefAI API][${requestId}] Step 5: Gemini generation failed`, error);
    const message = error instanceof Error ? error.message : "Unknown Gemini provider error";
    return NextResponse.json({ error: `Gemini request failed: ${message}` }, { status: 502 });
  }
}
