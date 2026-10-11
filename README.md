# Smart Recipe Recommendation Agent

This project provides a lightweight recommendation system that suggests recipes from available ingredients using logic-matching techniques.

## What it does
- Compares user-provided ingredients against a dish dataset
- Scores dishes by ingredient overlap (match ratio)
- Returns top recipe suggestions with matched and missing ingredients

## Building and implementation flow (step-by-step)
1. **Prepare recipe dataset**  
   Create a JSON file (`data/dishes.json`) where each recipe has a `name` and an `ingredients` list.
2. **Collect user ingredients**  
   Accept available ingredients from the CLI using `--ingredients` as a comma-separated list.
3. **Normalize inputs**  
   Convert ingredient text to lowercase and trim spaces so comparisons are consistent.
4. **Load and parse dishes**  
   Read the dataset and convert each valid entry into a structured dish object.
5. **Match ingredients**  
   For each dish, compute:
   - matched ingredients (`required ∩ available`)
   - missing ingredients (`required - available`)
6. **Score each dish**  
   Calculate `match_ratio = matched_count / total_required_count`.
7. **Filter low matches**  
   Keep only dishes meeting the minimum threshold (`--min-match`).
8. **Rank recommendations**  
   Sort dishes by highest match ratio and return only top results (`--top`).
9. **Show final output**  
   Print recipe name, match percentage, matched ingredients, and missing ingredients.

## Project structure
- `/home/runner/work/Smart_Recipe_Recommendation_Agent/Smart_Recipe_Recommendation_Agent/recipe_recommender.py` – recommendation logic and CLI
- `/home/runner/work/Smart_Recipe_Recommendation_Agent/Smart_Recipe_Recommendation_Agent/data/dishes.json` – sample dish dataset

## Run
From `/home/runner/work/Smart_Recipe_Recommendation_Agent/Smart_Recipe_Recommendation_Agent`:

```bash
python recipe_recommender.py --ingredients "tomato,onion,garlic,olive oil,salt"
```

Optional arguments:
- `--dataset` custom dataset path
- `--top` number of recommendations (default: 5)
- `--min-match` minimum match ratio (default: 0.4)

## Example output
```text
Recommended recipes:
- Tomato Pasta (match: 100%)
  Matched: garlic, olive oil, pasta, salt, tomato
- Veg Omelette (match: 60%)
  Matched: onion, salt, tomato
  Missing: eggs, pepper
```

This matching approach is directly applicable to recommendation engines and data-matching pipelines.
