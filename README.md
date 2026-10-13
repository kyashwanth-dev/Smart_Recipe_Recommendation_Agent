# ChefAI

ChefAI is a full-stack-ready recipe intelligence workspace that turns the ingredients in your kitchen into achievable, personalized meals.

## Included

- Responsive dashboard UI with ingredient search, voice capture affordance, fridge scan affordance, dietary filters, AI recommendations, nutrition panel, saved recipes, and assistant launcher.
- Typed recipe domain models and Zod response validation.
- Gemini prompt builder and `/api/recipes` route using the official `@google/genai` interactions API, with a credential-free demo mode.
- Supabase schema for recipes, meal plans, and shopping lists.
- Visual system built with Next.js App Router, TypeScript, CSS, Lucide, Framer Motion-ready structure, and Recharts-ready data.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The dashboard works without credentials using local demo data. Add `GEMINI_API_KEY` to enable live generation through `ai.interactions.create(...)`; `GEMINI_MODEL` defaults to `gemini-3.8-flash` and can be overridden in `.env.local`. Clerk middleware and Supabase client initialization can be added when project credentials are available.

## Deployment

Import the repository into Vercel, add the values from `.env.example`, and deploy. Run `supabase/schema.sql` in the Supabase SQL editor, then add Clerk's Next.js middleware and RLS policies for your production user model.
