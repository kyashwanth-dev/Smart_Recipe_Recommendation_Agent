"""AI-powered recipe recommendation client using a free Hugging Face model."""

from __future__ import annotations

import argparse
import json
import os
from typing import Any
from urllib import error, request

DEFAULT_MODEL = "google/flan-t5-large"
HF_API_URL = "https://api-inference.huggingface.co/models/{model}"


def _build_prompt(user_request: str) -> str:
    return (
        "You are a recipe assistant. "
        "Give 3 practical recipe suggestions with short steps and required ingredients.\n"
        f"User request: {user_request.strip()}"
    )


def _extract_generated_text(response_payload: Any) -> str:
    if isinstance(response_payload, list) and response_payload:
        first = response_payload[0]
        if isinstance(first, dict):
            text = first.get("generated_text")
            if isinstance(text, str):
                return text.strip()

    if isinstance(response_payload, dict):
        if isinstance(response_payload.get("generated_text"), str):
            return response_payload["generated_text"].strip()
        if isinstance(response_payload.get("error"), str):
            raise RuntimeError(response_payload["error"])

    raise RuntimeError("Unexpected response format from AI model.")


def query_model(user_request: str, model: str, timeout: int = 90) -> str:
    payload = {"inputs": _build_prompt(user_request), "options": {"wait_for_model": True}}
    data = json.dumps(payload).encode("utf-8")

    headers = {"Content-Type": "application/json"}
    hf_token = os.getenv("HF_TOKEN")
    if hf_token:
        headers["Authorization"] = "Bearer " + hf_token

    req = request.Request(
        url=HF_API_URL.format(model=model),
        data=data,
        headers=headers,
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=timeout) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except error.HTTPError as exc:
        message = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Model request failed ({exc.code}): {message}") from exc
    except error.URLError as exc:
        raise RuntimeError(f"Could not reach model API: {exc.reason}") from exc

    return _extract_generated_text(response_data)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Get recipe suggestions from a free AI model.")
    parser.add_argument(
        "--request",
        help="Direct request to send to the AI model.",
    )
    parser.add_argument(
        "--ingredients",
        help="Comma-separated ingredients to convert into an AI request.",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Hugging Face model ID (default: {DEFAULT_MODEL}).",
    )
    return parser


def main() -> None:
    parser = _build_parser()
    args = parser.parse_args()

    if not args.request and not args.ingredients:
        parser.error("Provide either --request or --ingredients.")
        return

    user_request = args.request
    if not user_request:
        normalized_ingredients = ",".join(part.strip() for part in args.ingredients.split(",") if part.strip())
        user_request = (
            "Suggest recipes I can make with these ingredients: "
            f"{normalized_ingredients}. Keep the response concise."
        )

    try:
        response_text = query_model(user_request=user_request, model=args.model)
    except RuntimeError as exc:
        print(f"Error: {exc}")
        return

    print("AI recipe recommendations:")
    print(response_text)


if __name__ == "__main__":
    main()
