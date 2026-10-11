"""Simple logic-matching recipe recommendation engine."""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List


@dataclass(frozen=True)
class Dish:
    """Dish definition with required ingredients."""

    name: str
    ingredients: List[str]


@dataclass(frozen=True)
class Recommendation:
    """Recommendation output for a dish match."""

    dish: str
    match_ratio: float
    matched_ingredients: List[str]
    missing_ingredients: List[str]


def _normalize(ingredients: Iterable[str]) -> set[str]:
    return {item.strip().lower() for item in ingredients if item and item.strip()}


def load_dishes(dataset_path: Path) -> list[Dish]:
    """Load dish dataset from a JSON file."""

    with dataset_path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    dishes: list[Dish] = []
    for entry in data:
        ingredients = [ingredient.strip().lower() for ingredient in entry.get("ingredients", []) if ingredient]
        if entry.get("name") and ingredients:
            dishes.append(Dish(name=entry["name"], ingredients=ingredients))
    return dishes


def recommend_recipes(
    available_ingredients: Iterable[str],
    dishes: Iterable[Dish],
    top_n: int = 5,
    min_match_ratio: float = 0.4,
) -> list[Recommendation]:
    """Recommend recipes by matching available ingredients with dish ingredients."""

    available = _normalize(available_ingredients)
    recommendations: list[Recommendation] = []

    for dish in dishes:
        required = _normalize(dish.ingredients)
        if not required:
            continue

        matched = sorted(required & available)
        missing = sorted(required - available)
        match_ratio = len(matched) / len(required)

        if match_ratio >= min_match_ratio:
            recommendations.append(
                Recommendation(
                    dish=dish.name,
                    match_ratio=round(match_ratio, 2),
                    matched_ingredients=matched,
                    missing_ingredients=missing,
                )
            )

    recommendations.sort(key=lambda item: (item.match_ratio, len(item.matched_ingredients)), reverse=True)
    return recommendations[:top_n]


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Recommend recipes from available ingredients.")
    parser.add_argument(
        "--ingredients",
        required=True,
        help="Comma-separated list of available ingredients (e.g. 'tomato,onion,garlic').",
    )
    parser.add_argument(
        "--dataset",
        default="data/dishes.json",
        help="Path to dish dataset JSON file.",
    )
    parser.add_argument("--top", type=int, default=5, help="Maximum number of recommendations.")
    parser.add_argument("--min-match", type=float, default=0.4, help="Minimum match ratio required.")
    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    dishes = load_dishes(Path(args.dataset))
    ingredients = args.ingredients.split(",")
    recommendations = recommend_recipes(ingredients, dishes, top_n=args.top, min_match_ratio=args.min_match)

    if not recommendations:
        print("No recipes matched the provided ingredients.")
        return

    print("Recommended recipes:")
    for item in recommendations:
        print(f"- {item.dish} (match: {item.match_ratio:.0%})")
        print(f"  Matched: {', '.join(item.matched_ingredients)}")
        if item.missing_ingredients:
            print(f"  Missing: {', '.join(item.missing_ingredients)}")


if __name__ == "__main__":
    main()
