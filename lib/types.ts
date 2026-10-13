export type IngredientCategory = "vegetable" | "fruit" | "dairy" | "protein" | "grain" | "spice";

export interface Ingredient { id: string; name: string; emoji: string; category: IngredientCategory; }
export interface Recipe { id: string; name: string; description: string; image: string; time: string; difficulty: string; calories: number; match: number; cuisine: string; }
export interface NutritionItem { label: string; value: string; percent: number; color: string; }
