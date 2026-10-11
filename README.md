# Smart Recipe Recommendation Agent

This project provides a lightweight AI-powered recommendation system that sends your request to a free Hugging Face model and returns recipe suggestions.

## What it does
- Sends your prompt (or ingredient list) to a free AI model
- Gets recipe recommendations in natural language
- Supports choosing a different Hugging Face model from CLI

## Building and implementation flow (step-by-step)
1. **Collect request input**  
   Accept either a direct prompt (`--request`) or a comma-separated ingredient list (`--ingredients`).
2. **Build AI prompt**  
   Convert input into a clear recipe request prompt for the model.
3. **Call Hugging Face Inference API**  
   Send the prompt to `https://api-inference.huggingface.co/models/{model}`.
4. **Authenticate optionally**  
   If `HF_TOKEN` is set, include it in the request header for better reliability/rate limits.
5. **Parse model response**  
   Extract generated text from the API response.
6. **Print final recommendation text**  
   Display the AI response directly in the terminal.

## Project structure
- `/home/runner/work/Smart_Recipe_Recommendation_Agent/Smart_Recipe_Recommendation_Agent/recipe_recommender.py` – recommendation logic and CLI

## Run
From `/home/runner/work/Smart_Recipe_Recommendation_Agent/Smart_Recipe_Recommendation_Agent`:

```bash
python recipe_recommender.py --request "I have tomato, onion, garlic. Suggest dinner ideas."
```

Optional arguments:
- `--ingredients` comma-separated ingredients (alternative to `--request`)
- `--model` custom Hugging Face model ID (default: `google/flan-t5-large`)

Optional env var:
- `HF_TOKEN` Hugging Face access token (recommended for stable API access)

## Example output
```text
AI recipe recommendations:
1) Tomato Garlic Pasta ...
2) Shakshuka ...
3) Roasted Tomato Soup ...
```

This approach is directly applicable to AI-powered recommendation assistants.
