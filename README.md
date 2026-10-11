# Smart Recipe Recommendation Agent

This project provides a lightweight recommendation system that suggests recipes from available ingredients using logic-matching techniques.

## What it does
- Compares user-provided ingredients against a dish dataset
- Scores dishes by ingredient overlap (match ratio)
- Returns top recipe suggestions with matched and missing ingredients

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
