# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import torch
from scraper import scrape_product_details
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize FastAPI app
app = FastAPI(
    title="EcoLens API",
    description="API to analyze product sustainability.",
    version="1.0.0"
)

# Allow CORS for the Chrome extension to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your extension's ID
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the zero-shot classification model once at startup
try:
    print("Loading Zero-Shot Classification model...")
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        device=0 if torch.cuda.is_available() else -1
    )
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    classifier = None

# 3. Define request and response models
class AnalyzeRequest(BaseModel):
    url: str

class AnalyzeResponse(BaseModel):
    score: float
    color: str
    breakdown: dict
    alternatives: list

# 4. Define the API endpoint
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_product(request: AnalyzeRequest):
    """
    Accepts a product URL, scrapes it, and returns a sustainability score.
    """
    print(f"Received request for URL: {request.url}")
    
    product_text = scrape_product_details(request.url)

    if not product_text:
        raise HTTPException(status_code=400, detail="Could not scrape product details from the URL.")

    if not classifier:
        raise HTTPException(status_code=500, detail="AI model is not available.")

    try:
        candidate_labels = ["eco-friendly", "unsustainable", "neutral"]
        result = classifier(product_text, candidate_labels)

        # Pick the first predicted label and its confidence
        predicted_label = result['labels'][0]
        confidence = result['scores'][0]

        # Map the predicted label to a score and color
        score_mapping = {
            "eco-friendly": {"score": 9.0, "color": "#2ecc71"},
            "neutral": {"score": 5.0, "color": "#f39c12"},
            "unsustainable": {"score": 2.0, "color": "#e74c3c"}
        }

        # Mock alternatives (can replace with real suggestions later)
        mock_alternatives = [
            {"name": "Reusable Bottle", "score": 9},
            {"name": "Eco Bag", "score": 8}
        ]

        return {
            "score": score_mapping[predicted_label]['score'],
            "color": score_mapping[predicted_label]['color'],
            "breakdown": {
                "predicted_label": predicted_label,
                "confidence": float(confidence)
            },
            "alternatives": mock_alternatives
        }

    except Exception as e:
        print(f"Error during zero-shot classification: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze product.")
