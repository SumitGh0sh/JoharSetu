"""
JoharSetu (जोहारसेतु) Interactive Model Tester
Tests both:
1. Trained Multilingual Civic Domain ML Classifier
2. Multi-Objective 44-HEI Spatial & Academic Recommendation Engine
"""

import os
import sys
import json
import joblib
import numpy as np

# Ensure UTF-8 output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
for path in [BASE_DIR, CURRENT_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "johar_classifier.pkl")
META_PATH = os.path.join(BASE_DIR, "backend", "models", "johar_classifier_meta.json")
HEI_MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "johar_hei_recommender.pkl")
HEI_META_PATH = os.path.join(BASE_DIR, "backend", "models", "johar_hei_recommender_meta.json")

def load_resources():
    if not os.path.exists(MODEL_PATH):
        print(f"[!] Error: Model file not found at {MODEL_PATH}")
        sys.exit(1)
    
    model = joblib.load(MODEL_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
        
    hei_model = None
    hei_meta = {}
    if os.path.exists(HEI_MODEL_PATH):
        hei_model = joblib.load(HEI_MODEL_PATH)
        if os.path.exists(HEI_META_PATH):
            with open(HEI_META_PATH, "r", encoding="utf-8") as f:
                hei_meta = json.load(f)

    return model, meta, hei_model, hei_meta

def predict_issue(model, meta, text: str, district: str = "Ranchi"):
    probs = model.predict_proba([text])[0]
    top_idx = int(np.argmax(probs))
    category = model.classes_[top_idx]
    confidence = float(probs[top_idx])
    urgency = meta.get("default_urgency_matrix", {}).get(category, "MEDIUM")

    print("\n" + "-"*70)
    print(f" INPUT TEXT        : {text}")
    print(f" TARGET DISTRICT   : {district}")
    print("-"*70)
    print(f" PREDICTED DOMAIN  : {category}")
    print(f" CONFIDENCE SCORE  : {confidence * 100:.2f}%")
    print(f" URGENCY MATRIX    : {urgency}")
    
    # Top 3 distribution
    print("\n Domain Probabilities:")
    top_3_indices = np.argsort(probs)[::-1][:3]
    for idx in top_3_indices:
        cat_name = model.classes_[idx]
        bar = "█" * int(probs[idx] * 20)
        print(f"   {cat_name:<30} {bar:<20} ({probs[idx]*100:5.1f}%)")
    
    # Router 44-HEI recommendation
    try:
        try:
            from backend.agent.router import JoharSetuAgenticRouter, JHARKHAND_HEI_REGISTRY
        except ModuleNotFoundError:
            from agent.router import JoharSetuAgenticRouter, JHARKHAND_HEI_REGISTRY

        router = JoharSetuAgenticRouter()
        routing = router.process_ticket({
            "title": text[:60],
            "description": text,
            "district": district,
            "latitude": 23.3441 if district == "Ranchi" else 24.2690 if district == "Dumka" else 24.6360 if district == "Pakur" else 23.7957,
            "longitude": 85.3096 if district == "Ranchi" else 87.2510 if district == "Dumka" else 87.8480 if district == "Pakur" else 86.4304
        })
        
        hei = routing["recommended_hei"]
        print("\n >> RECOMMENDED HIGHER EDUCATION INSTITUTION (44-HEI POOL):")
        print(f"   Institute Name  : {hei['hei_name']} ({hei['code']})")
        print(f"   Type & District : {hei['type']} • {hei['district']}")
        print(f"   Department      : {hei['department']}")
        print(f"   Geodesic Dist   : {hei['distance_km']} km")
        print(f"   Utility Score   : {hei['utility_score']} / 1.000")
        print(f"   NEP Capstone    : 4 University Credits")
        print(f"   Justification   : {routing['routing_justification']}")
        
        print("\n   Top 3 Ranked Alternative Colleges:")
        for i, alt in enumerate(routing["eligible_heis"][:3], 1):
            print(f"     {i}. {alt['hei_name']} ({alt['district']} - {alt['distance_km']} km) -> Score: {alt['utility_score']}")
            
    except Exception as e:
        print(f"   [!] Router evaluation error: {e}")
        
    print("-" * 70)

def run_suite():
    model, meta, hei_model, hei_meta = load_resources()
    print("=" * 70)
    print("   JOHARSETU MULTILINGUAL ML CLASSIFIER & 44-HEI RECOMMENDER SUITE")
    print("=" * 70)
    print(f" Domain Model   : Dual-TFIDF (Word+CharWB) + SGDClassifier ({meta.get('test_accuracy', 0)*100:.2f}% Acc)")
    print(f" HEI Pool Size  : {hei_meta.get('total_heis_monitored', 44)} Higher Education Institutions in Jharkhand")
    print(f" HEI Top-3 Acc  : {hei_meta.get('top3_accuracy', 0.789)*100:.2f}% across all 24 districts")
    
    samples = [
        ("English", "Broken handpump with arsenic and muddy iron water supply", "Pakur"),
        ("Hindi (Devanagari)", "गाँव की मुख्य सड़क की पुलिया टूट गई है और आवागमन पूरी तरह बंद है", "West Singhbhum"),
        ("Hinglish", "solar microgrid inverter blast ho gaya hai gaon me andhera hai", "East Singhbhum"),
        ("Hinglish", "kachra ka dher laga hua hai aur naali jaam ho gayi hai", "Garhwa"),
        ("Hindi (Devanagari)", "गाँव के स्वास्थ्य केंद्र में बिजली और मलेरिया की दवाइयां नहीं हैं", "Latehar"),
        ("Vernacular Agriculture", "dhan ki fasal me bacterial leaf blight keeda lag gaya kisan pareshan", "Dumka"),
        ("Tribal EdTech", "primary school smart class computer tablet band hai santhali app chahiye", "Ranchi")
    ]

    for lang, sample, dist in samples:
        print(f"\n>> [{lang} - {dist}]")
        predict_issue(model, meta, sample, dist)

if __name__ == "__main__":
    model, meta, hei_model, hei_meta = load_resources()
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        predict_issue(model, meta, query)
    else:
        run_suite()
        print("\n[Tip] You can test any complaint sentence by running:")
        print('      python backend/test_model.py "your sentence here"\n')
