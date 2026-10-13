"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BookOpen, Camera, ChefHat, ChevronRight, CircleHelp, Clock3, Heart, Home, Menu, Mic, Plus, Search, Settings, Sparkles, Star, UserRound, WandSparkles, X, Zap } from "lucide-react";
import { ingredients, nutrition, savedRecipes } from "@/lib/data";
import type { RecipeResponse } from "@/lib/ai";

const navItems = [{ label: "Generate recipe", icon: WandSparkles }, { label: "Saved recipes", icon: BookOpen }, { label: "Favorites", icon: Heart }, { label: "Profile", icon: UserRound }, { label: "Settings", icon: Settings }];
const filters = ["Vegetarian", "High protein", "Low carb", "Italian", "Indian"];

export default function ChefDashboard() {
  const [activeNav, setActiveNav] = useState("Generate recipe");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(["Egg", "Tomato", "Onion"]);
  const [activeFilters, setActiveFilters] = useState(["Vegetarian"]);
  const [toast, setToast] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeResponse | null>(null);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState("Ready to call /api/recipes");

  const suggestions = useMemo(() => ingredients.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && !selected.includes(item.name)).slice(0, 4), [query, selected]);
  const addIngredient = (name: string) => { if (!selected.includes(name)) setSelected((items) => [...items, name]); setQuery(""); };
  const removeIngredient = (name: string) => setSelected((items) => items.filter((item) => item !== name));
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2400); };
  const generate = async () => {
    console.groupCollapsed("[ChefAI] Generate recipe");
    console.log("[ChefAI] Step 1: ingredients", selected);
    console.log("[ChefAI] Step 2: filters", activeFilters);
    setIsGenerating(true);
    setApiStatus("Calling /api/recipes...");
    try {
      const response = await fetch("/api/recipes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ingredients: selected, filters: activeFilters }) });
      console.log("[ChefAI] Step 3: API status", response.status);
      const responseText = await response.text();
      let data: { mode?: string; recipe?: RecipeResponse; error?: string } = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.error("[ChefAI] Step 4: API returned non-JSON content", responseText.slice(0, 200));
        throw new Error(`API returned ${response.status} without valid JSON`);
      }
      console.log("[ChefAI] Step 4: API response", data);
      if (!response.ok) throw new Error(data.error || "Recipe request failed");
      if (data.mode === "live" && data.recipe) {
        setGeneratedRecipe(data.recipe);
        setIsRecipeOpen(false);
        setApiStatus("Live Gemini recipe received");
        flash("Gemini created a new recipe");
      } else {
        setApiStatus("API route reached, demo mode active");
        flash("API reached, but GEMINI_API_KEY is not active");
      }
    } catch (error) {
      console.error("[ChefAI] Generation failed", error);
      setApiStatus("API request failed - check terminal logs");
      flash(error instanceof Error ? error.message : "Recipe request failed");
    } finally {
      setIsGenerating(false);
      console.log("[ChefAI] Step 5: generation finished");
      console.groupEnd();
    }
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><span>✦</span></div>ChefAI</div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); if (label !== "Generate recipe") flash(`${label} view is ready to connect`); }}><Icon />{label}</button>)}</nav>
      <div className="sidebar-footer"><div className="mini-profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Home kitchen</span></div><ChevronRight size={15} color="#a8b4af" /></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><p className="eyebrow">Tuesday, October 13, 2026</p><h1 className="page-title">Good morning, Alex.</h1></div><div className="top-actions"><button className="icon-button mobile-menu" aria-label="Open menu"><Menu size={18} /></button><button className="icon-button" aria-label="Notifications"><Bell size={17} /></button><button className="profile-button"><span className="avatar">AM</span><span>Alex Morgan</span><ChevronRight size={14} /></button></div></header>
      <div className="content-grid">
        <section className="workspace-card">
          <div className="workspace-heading"><div><h2>What do you have on hand?</h2><p>Tell us what is in your kitchen. We will handle the rest.</p></div><Sparkles color="#e98765" size={22} /></div>
          <div className="ingredient-box"><div className="search-row"><Search size={18} /><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ingredients..." aria-label="Search ingredients" /><button className="voice-button" onClick={() => flash("Voice capture is ready for browser permission")} aria-label="Use voice input"><Mic size={15} /></button></div><div className="chips">{selected.map((name) => { const ingredient = ingredients.find((item) => item.name === name); return <span className="chip" key={name}>{ingredient?.emoji} {name}<button onClick={() => removeIngredient(name)} aria-label={`Remove ${name}`}><X size={12} /></button></span>; })}</div>{query && <div className="suggestions">{suggestions.length ? suggestions.map((item) => <button className="suggestion" key={item.id} onClick={() => addIngredient(item.name)}>{item.emoji} {item.name}</button>) : <span className="suggestion">No matching ingredients yet</span>}</div>}</div>
          <div className="tool-row"><button className="tool-button" onClick={() => flash("Fridge scanner opened") }><Camera size={15} /> Scan fridge</button><button className="tool-button" onClick={() => flash("Voice capture is ready") }><Mic size={15} /> Use my voice</button><button className="tool-button" onClick={() => flash("300+ ingredients available") }><Plus size={15} /> Browse all</button></div>
          <div className="section-label"><h3>Personalize your plate</h3><span>{activeFilters.length} selected</span></div>
          <div className="tool-row">{filters.map((filter) => <button key={filter} className={`tool-button ${activeFilters.includes(filter) ? "active-filter" : ""}`} onClick={() => setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter])}>{activeFilters.includes(filter) ? "✓" : "+"} {filter}</button>)}</div>
          <button className="generate-button" onClick={generate} disabled={isGenerating}>{isGenerating ? <><Zap size={16} /> Thinking like a chef...</> : <><WandSparkles size={16} /> Find my next meal</>}</button>
          <p className={`api-status ${apiStatus.includes("failed") ? "error" : ""}`}>{apiStatus}</p>
          <div className="section-label"><h3>Made for your kitchen</h3><span>{generatedRecipe ? "1 Gemini recipe" : "Waiting for your ingredients"}</span></div>
          <div className="recipe-list">{generatedRecipe ? <motion.article className="recipe-card generated-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><div className="generated-art"><Sparkles size={22} /></div><div className="recipe-copy"><span className="match-pill">Fresh from Gemini</span><h4>{generatedRecipe.name}</h4><p>{generatedRecipe.story}</p><div className="recipe-meta"><span><Clock3 size={13} /> {generatedRecipe.prepTime + generatedRecipe.cookTime} min</span><span><ChefHat size={13} /> {generatedRecipe.difficulty}</span><span>{generatedRecipe.nutrition.calories} kcal</span></div></div><button className="icon-button" onClick={() => setIsRecipeOpen(true)} aria-label={`Open ${generatedRecipe.name}`}><ChevronRight size={16} /></button></motion.article> : <div className="empty-results"><Sparkles size={20} /><p>Your Gemini recipe will appear here.</p><span>Choose ingredients, then find your next meal.</span></div>}</div>
          {generatedRecipe && isRecipeOpen && <motion.section className="recipe-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="detail-header"><div><span className="match-pill">Full recipe</span><h3>{generatedRecipe.name}</h3><p>{generatedRecipe.cuisine} · Serves {generatedRecipe.servings} · {generatedRecipe.prepTime + generatedRecipe.cookTime} min total</p></div><button className="icon-button" onClick={() => setIsRecipeOpen(false)} aria-label="Close recipe details"><X size={17} /></button></div><div className="detail-grid"><div><h4>Ingredients</h4><ul>{generatedRecipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>Instructions</h4><ol>{generatedRecipe.instructions.map((step) => <li key={step}>{step}</li>)}</ol></div></div><div className="detail-footer"><div><strong>Nutrition</strong><span>{generatedRecipe.nutrition.calories} kcal · {generatedRecipe.nutrition.protein}g protein · {generatedRecipe.nutrition.carbs}g carbs · {generatedRecipe.nutrition.fat}g fat</span></div><div><strong>Chef tips</strong><span>{generatedRecipe.tips.join(" ")}</span></div></div></motion.section>}
        </section>
        <aside className="side-column">
          <section className="progress-card"><h3>Your kitchen rhythm</h3><p>You are building a delicious habit.</p><div className="progress-stats"><strong className="progress-number">12</strong><span>recipes cooked this month</span></div><div className="progress-track"><div className="progress-fill" /></div></section>
          <section className="nutrition-card"><div className="card-heading"><div><h3>Nutrition at a glance</h3><p>Based on your latest recipe</p></div><Zap size={19} /></div><div className="nutrition-bars">{nutrition.map((item) => <div className="nutrient-row" key={item.label}><span>{item.label}</span><div className="bar"><i style={{ width: `${item.percent}%`, background: item.color }} /></div><strong>{item.value}</strong></div>)}</div></section>
          <section className="saved-card"><div className="card-heading"><div><h3>Saved for later</h3><p>Your personal recipe box</p></div><Star size={18} color="#e9b75d" /></div><div className="saved-list">{savedRecipes.map((recipe) => <div className="saved-item" key={recipe.id}><img src={recipe.image} alt="" /><div><strong>{recipe.name}</strong><span>{recipe.time} · {recipe.cuisine}</span></div><button onClick={() => flash("Removed from favorites")} aria-label="Remove favorite"><Heart size={14} fill="currentColor" /></button></div>)}</div></section>
        </aside>
      </div>
    </main>
    <button className="assistant-fab" onClick={() => setAssistantOpen((value) => !value)} aria-label="Open cooking assistant"><CircleHelp size={22} /></button>
    <AnimatePresence>{assistantOpen && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}><strong>ChefAI assistant</strong><br /><span>Ask me how to adapt any recipe.</span></motion.div>}</AnimatePresence>
    {toast && <div className="toast">{toast}</div>}
    <AnimatePresence>{isGenerating && <motion.div className="cooking-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="cooking-loader" initial={{ scale: .94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .96, y: 8 }}><motion.div className="cooking-icon" animate={{ rotate: [0, -7, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}><ChefHat size={30} /></motion.div><p className="cooking-kicker">ChefAI kitchen</p><h2>Cooking with love</h2><p className="cooking-copy">We are turning your ingredients into something worth gathering around.</p><div className="cooking-dots" aria-label="Generating recipe"><i /><i /><i /></div><span className="cooking-note">Your personalized meal plan is on its way</span></motion.div></motion.div>}</AnimatePresence>
  </div>;
}
