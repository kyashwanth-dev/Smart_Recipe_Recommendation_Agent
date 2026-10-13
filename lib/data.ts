import { Ingredient, NutritionItem, Recipe } from "./types";

export const ingredients: Ingredient[] = [
  ["tomato", "Tomato", "🍅", "vegetable"], ["cherry-tomato", "Cherry Tomato", "🍅", "vegetable"], ["tomato-sauce", "Tomato Sauce", "🥫", "vegetable"], ["egg", "Egg", "🥚", "protein"], ["onion", "Onion", "🧅", "vegetable"], ["garlic", "Garlic", "🧄", "vegetable"], ["spinach", "Spinach", "🥬", "vegetable"], ["potato", "Potato", "🥔", "vegetable"], ["avocado", "Avocado", "🥑", "fruit"], ["lemon", "Lemon", "🍋", "fruit"], ["chicken", "Chicken", "🍗", "protein"], ["salmon", "Salmon", "🐟", "protein"], ["tofu", "Tofu", "◻️", "protein"], ["milk", "Milk", "🥛", "dairy"], ["parmesan", "Parmesan", "🧀", "dairy"], ["rice", "Rice", "🍚", "grain"], ["pasta", "Pasta", "🍝", "grain"], ["chickpeas", "Chickpeas", "🫘", "protein"], ["basil", "Basil", "🌿", "spice"], ["cumin", "Cumin", "🫙", "spice"], ["chili", "Chili", "🌶️", "spice"]
].map(([id, name, emoji, category]) => ({ id, name, emoji, category: category as Ingredient["category"] }));

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=85`;
export const recipes: Recipe[] = [
  { id: "shakshuka", name: "Garden Shakshuka", description: "Silky eggs nestled in a smoky tomato and pepper sauce.", image: photo("photo1590412200988-a436970781fa"), time: "25 min", difficulty: "Easy", calories: 382, match: 96, cuisine: "Middle Eastern" },
  { id: "omelette", name: "Herbed Tomato Omelette", description: "A soft, custardy omelette with bright herbs and feta.", image: photo("photo1565299507177-b0ac66763828"), time: "15 min", difficulty: "Easy", calories: 310, match: 91, cuisine: "French" },
  { id: "bhurji", name: "Weeknight Egg Bhurji", description: "Indian-style scrambled eggs with caramelized onion and spice.", image: photo("photo1601050690597-df0568f70950"), time: "20 min", difficulty: "Easy", calories: 344, match: 87, cuisine: "Indian" }
];
export const nutrition: NutritionItem[] = [
  { label: "Protein", value: "22g", percent: 76, color: "#83c7a9" }, { label: "Carbs", value: "31g", percent: 56, color: "#f2c269" }, { label: "Fat", value: "14g", percent: 44, color: "#e98d70" }, { label: "Fiber", value: "8g", percent: 62, color: "#9c9be0" }
];
export const savedRecipes = [recipes[0], recipes[2]];
