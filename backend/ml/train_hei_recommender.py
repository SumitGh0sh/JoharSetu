"""
JoharSetu (जोहारसेतु) HEI Recommendation ML Training Pipeline
Trains a calibrated machine learning recommender model to suggest the most suitable
Higher Education Institution (HEI) out of all 44 Jharkhand colleges.
"""

import os
import sys
import json
import time
import math
import random
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "data", "jharkhand_heis_enriched.json")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "johar_hei_recommender.pkl")
META_OUTPUT_PATH = os.path.join(MODELS_DIR, "johar_hei_recommender_meta.json")

os.makedirs(MODELS_DIR, exist_ok=True)

# Load 44 HEIs
with open(DATA_PATH, "r", encoding="utf-8") as f:
    HEI_LIST = json.load(f)

print(f"[+] Ingested {len(HEI_LIST)} Jharkhand HEIs from {DATA_PATH}")

CATEGORIES = [
    "WATER_MANAGEMENT",
    "ROAD_INFRASTRUCTURE",
    "RURAL_ELECTRIFICATION_SOLAR",
    "SANITATION_WASTE",
    "SUSTAINABLE_AGRICULTURE",
    "HEALTHCARE_DELIVERY",
    "PRIMARY_EDUCATION_DIGITAL"
]

JHARKHAND_DISTRICTS = [
    "Dhanbad", "East Singhbhum", "Ranchi", "Hazaribagh", "West Singhbhum",
    "Ramgarh", "Dumka", "Pakur", "Seraikela Kharsawan", "Gumla", "Latehar",
    "Koderma", "Khunti", "Simdega", "Sahibganj", "Garhwa", "Bokaro",
    "Deoghar", "Giridih", "Chatra", "Palamu", "Lohardaga", "Jamtara", "Godda"
]

DISTRICT_COORDS = {
    "Ranchi": (23.3441, 85.3096),
    "Dhanbad": (23.7957, 86.4304),
    "East Singhbhum": (22.8046, 86.2029),
    "West Singhbhum": (22.5487, 85.8118),
    "Bokaro": (23.6693, 86.1511),
    "Hazaribagh": (23.9937, 85.3611),
    "Ramgarh": (23.6260, 85.5126),
    "Dumka": (24.2690, 87.2510),
    "Pakur": (24.6360, 87.8480),
    "Seraikela Kharsawan": (22.7915, 86.0465),
    "Gumla": (23.0480, 84.5420),
    "Latehar": (23.7430, 84.4980),
    "Koderma": (24.4350, 85.5290),
    "Khunti": (23.0780, 85.2760),
    "Simdega": (22.6160, 84.5050),
    "Sahibganj": (25.2420, 87.6430),
    "Garhwa": (24.1610, 83.8090),
    "Deoghar": (24.4826, 86.7001),
    "Giridih": (24.1855, 86.3090),
    "Chatra": (24.2092, 84.8718),
    "Palamu": (24.0436, 84.0736),
    "Lohardaga": (23.4354, 84.6823),
    "Jamtara": (23.9602, 86.8027),
    "Godda": (24.8267, 87.2139)
}

PROBLEM_TEMPLATES = {
    "WATER_MANAGEMENT": [
        "Handpump pumping contaminated yellow water with high iron and arsenic content in {village}, {district}.",
        "Deep borehole pipeline broken and drinking water supply disrupted for the entire village of {village}, {district}.",
        "गाँव {village}, जिला {district} के चापाकल से गंदा लाल और बदबूदार पानी आ रहा है, पानी पीने योग्य नहीं है।",
        "विद्यालय के समीप जल निकासी बंद है और दूषित पानी जमा होने से बीमारी फैल रही है {village}, {district}।",
        "humare gaon {village} me handpump lever toota hua hai aur ganda pani nikal raha hai {district}.",
        "{village} block me drinking water supply 4 din se band hai submersible pump kharab ho gaya hai {district}."
    ],
    "ROAD_INFRASTRUCTURE": [
        "Monsoon rain has completely washed away the road culvert bridge near {village}, {district}, blocking vehicle traffic.",
        "Large dangerous potholes and eroded road edges on the main connecting road of {village}, {district}.",
        "{village} में मुख्य सड़क पर भारी गड्ढे हो गए हैं और पुलिया की दीवार ढह गई है जिला {district}।",
        "बारिश के कारण {village}, जिला {district} की सड़क पूरी तरह कट गई है, बच्चे स्कूल नहीं जा पा रहे हैं।",
        "{village} me road aur culvert tooti hui hai monsoon ki wajah se aana jana mushkil ho gaya hai {district}.",
        "highway se {village} ko jodne wali sadak me bahut bade gaddhe hain accident ho rahe hain {district}."
    ],
    "RURAL_ELECTRIFICATION_SOLAR": [
        "Off-grid community solar microgrid inverter damaged by voltage surge in {village}, {district}.",
        "Street lights and solar batteries not charging properly, whole street remains in darkness at {village}, {district}.",
        "{village}, जिला {district} में सोलर स्ट्रीट लाइट का इन्वर्टर जल गया है और रात में अंधेरा रहता है।",
        "गाँव {village} में बिजली का ट्रांसफार्मर खराब हो गया है और तीन दिनों से बिजली गुल है जिला {district}।",
        "{village} me solar panel microgrid ka battery inverter kharab ho gaya hai street lights off hain {district}.",
        "transformer spark kar raha hai aur wire latak rahe hain {village}, {district} me bijli supply band hai."
    ],
    "SANITATION_WASTE": [
        "Open drainage overflow and heavy garbage accumulation creating severe foul odor in {village}, {district}.",
        "Community sanitation toilet pit blocked and waste water seeping into ground near {village}, {district}.",
        "{village} में नाली का गंदा पानी सड़क पर बह रहा है और कचरे का ढेर लगा है, सफाई की जरूरत है {district}।",
        "सार्वजनिक शौचालय की टंकी जाम हो गई है और बदबू से {village}, जिला {district} के लोग परेशान हैं।",
        "{village} me kachra ka dher laga hua hai naali blocked hai pura mohalla pareshan hai {district}.",
        "solid waste disposal ki vyavastha nahi hai {village} me gandagi badh rahi hai {district}."
    ],
    "SUSTAINABLE_AGRICULTURE": [
        "Paddy rice crop attacked by bacterial leaf blight and pest infestation across farms in {village}, {district}.",
        "Canal irrigation gate broken and water unable to reach agricultural fields of {village}, {district}.",
        "धान की फसल में कीट प्रकोप हो गया है और पत्तियां पीली पड़कर सूख रही हैं {village}, {district} में।",
        "सिंचाई नहर की दीवार टूटने से {village} के खेतों में पानी नहीं पहुंच पा रहा है, किसान परेशान हैं जिला {district}।",
        "dhan ke khet me keeda lag gaya hai patte peele pad rahe hain {village}, {district} me fasal bachani hai.",
        "micro irrigation drip pipe phat gaya hai {village} me kheti ke liye paani nahi mil raha hai {district}."
    ],
    "HEALTHCARE_DELIVERY": [
        "Primary health sub-center lacking power backup and essential fever medication in {village}, {district}.",
        "Spike in seasonal malaria and waterborne diarrhea cases requiring diagnostic testing in {village}, {district}.",
        "{village} के स्वास्थ्य उप-केंद्र में दवाइयों की कमी है और मलेरिया के मरीज बढ़ रहे हैं जिला {district}।",
        "प्राथमिक स्वास्थ्य केंद्र में बिजली और साफ पानी नहीं है, मरीजों को परेशानी हो रही है {village}, {district}।",
        "health clinic me dawa aur testing kit nahi hai dengue malaria badh raha hai {village}, {district}.",
        "sub-center me telemedicine aur doctor ki zaroorat hai {village} ke log bimar hain {district}."
    ],
    "PRIMARY_EDUCATION_DIGITAL": [
        "Rural primary school smart classroom tablet lab damaged with no internet connectivity in {village}, {district}.",
        "Primary school lacks digital learning materials in Santhali and Mundari tribal languages at {village}, {district}.",
        "प्राथमिक विद्यालय {village} में डिजिटल क्लासरूम का कंप्यूटर खराब है जिला {district}।",
        "स्कूल के बच्चों के लिए संथाली और मुंडारी भाषा में डिजिटल शिक्षा की आवश्यकता है {village}, {district}।",
        "school me smart class computer lab band hai tribal students ke liye learning app chahiye {village}, {district}.",
        "{village} primary school me digital tablet aur internet connectivity ki zaroorat hai {district}."
    ]
}

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

random.seed(42)
np.random.seed(42)

records = []

villages = [
    "Baghmara", "Topchanchi", "Nirsa", "Gamharia", "Tatisilwai", "Silli", "Ormanjhi",
    "Adityapur", "Chandil", "Chas", "Jainamore", "Kandra", "Murubanda", "Gola",
    "Barkipona", "Bistumpur", "Jhinkpani", "Kurwa", "Sweet City", "Baghabari",
    "Chandali", "Jhumri Telaiya", "Galudih", "Ghatshila", "Ghutia", "Mahulia",
    "Edalbera", "Kanke", "Namkum", "Hatia", "Bariatu", "Dhurwa", "Ratu",
    "Chitarpur", "Bermo", "Govindpur", "Katras", "Mango", "Jugsalai"
]

print("[*] Generating targeted samples for all 44 HEIs...")

# 1. Ensure EVERY single HEI has at least 30 targeted instances matching its district and specializations
for hei in HEI_LIST:
    hei_id = hei["id"]
    hei_district = hei["district"]
    hei_specs = hei["specializations"]
    hei_lat = hei["lat"]
    hei_lon = hei["lon"]

    for spec in hei_specs:
        templates = PROBLEM_TEMPLATES.get(spec, PROBLEM_TEMPLATES["WATER_MANAGEMENT"])
        for template in templates:
            for _ in range(2):
                village = random.choice(villages)
                lat = hei_lat + random.uniform(-0.05, 0.05)
                lon = hei_lon + random.uniform(-0.05, 0.05)
                text = template.format(village=village, district=hei_district)
                records.append({
                    "text": f"{text} | District: {hei_district} | Category: {spec}",
                    "district": hei_district,
                    "category": spec,
                    "lat": lat,
                    "lon": lon,
                    "target_hei_id": hei_id
                })

# 2. Add District-Wide multi-objective instances
for district, (lat_base, lon_base) in DISTRICT_COORDS.items():
    # Find closest HEIs in or near this district
    district_heis = [h for h in HEI_LIST if district.lower() in h["district"].lower() or h["district"].lower() in district.lower()]
    if not district_heis:
        # Fallback to physically closest HEIs
        district_heis = sorted(HEI_LIST, key=lambda h: haversine_distance(lat_base, lon_base, h["lat"], h["lon"]))[:3]

    for category in CATEGORIES:
        # Find best matching HEI among local ones
        matching_heis = [h for h in district_heis if category in h["specializations"]]
        if not matching_heis:
            matching_heis = district_heis
        
        target_hei = matching_heis[0]

        templates = PROBLEM_TEMPLATES[category]
        for template in templates:
            village = random.choice(villages)
            lat = lat_base + random.uniform(-0.06, 0.06)
            lon = lon_base + random.uniform(-0.06, 0.06)
            text = template.format(village=village, district=district)
            records.append({
                "text": f"{text} | District: {district} | Category: {category}",
                "district": district,
                "category": category,
                "lat": lat,
                "lon": lon,
                "target_hei_id": target_hei["id"]
            })

df = pd.DataFrame(records)
print(f"[+] Total generated training instances: {len(df)}")
print(f"[+] Unique target HEIs represented: {df['target_hei_id'].nunique()} / {len(HEI_LIST)}")

# Verify minimum count per class
counts = df["target_hei_id"].value_counts()
min_count = counts.min()
print(f"[+] Minimum samples per HEI class: {min_count}")

# Train/Test Split
X = df["text"].values
y = df["target_hei_id"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42, stratify=y)

print(f"[*] Training Calibrated TF-IDF + SGD Classifier on {len(X_train)} samples across {len(counts)} HEIs...")
start_t = time.time()

vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=15000,
    sublinear_tf=True
)

base_clf = SGDClassifier(
    loss="log_loss",
    penalty="l2",
    alpha=1e-4,
    max_iter=2500,
    random_state=42
)

calibrated_clf = CalibratedClassifierCV(estimator=base_clf, method="sigmoid", cv=3)

model_pipeline = Pipeline([
    ("tfidf", vectorizer),
    ("clf", calibrated_clf)
])

model_pipeline.fit(X_train, y_train)
y_pred = model_pipeline.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"[+] Model Training Complete in {time.time() - start_t:.2f}s")
print(f"[+] Top-1 Test Accuracy: {acc * 100:.2f}%")

# Top-3 Accuracy Check
probs = model_pipeline.predict_proba(X_test)
top3_hits = 0
classes = list(model_pipeline.classes_)
for i, true_label in enumerate(y_test):
    top3_idx = np.argsort(probs[i])[::-1][:3]
    top3_classes = [classes[idx] for idx in top3_idx]
    if true_label in top3_classes:
        top3_hits += 1

top3_acc = top3_hits / len(y_test)
print(f"[+] Top-3 Recommendation Accuracy: {top3_acc * 100:.2f}%")

# Export model bundle
joblib.dump(model_pipeline, MODEL_OUTPUT_PATH, compress=3)
print(f"[+] Exported HEI recommender model to {MODEL_OUTPUT_PATH}")

# Metadata
hei_dict = {h["id"]: h for h in HEI_LIST}
sample_predictions = []
sample_queries = [
    ("Water problem in Baghmara Dhanbad with broken handpump", "Dhanbad", "WATER_MANAGEMENT"),
    ("Road culvert bridge damaged in Chaibasa West Singhbhum", "West Singhbhum", "ROAD_INFRASTRUCTURE"),
    ("Solar microgrid inverter failed in Gamharia Jamshedpur East Singhbhum", "East Singhbhum", "RURAL_ELECTRIFICATION_SOLAR"),
    ("Drinking water handpump broken in Dumka engineering zone", "Dumka", "WATER_MANAGEMENT"),
    ("Monsoon road washed away in Latehar district", "Latehar", "ROAD_INFRASTRUCTURE"),
    ("Primary school digital tablet lab in Silli Ranchi", "Ranchi", "PRIMARY_EDUCATION_DIGITAL"),
    ("Agricultural paddy crop pest attack in Pakur", "Pakur", "SUSTAINABLE_AGRICULTURE"),
    ("Transformer burnt out in Garhwa rural grid", "Garhwa", "RURAL_ELECTRIFICATION_SOLAR"),
    ("School sanitation facility clogged in Simdega", "Simdega", "SANITATION_WASTE")
]

for q, dist, cat in sample_queries:
    full_q = f"{q} | District: {dist} | Category: {cat}"
    prob = model_pipeline.predict_proba([full_q])[0]
    top_indices = np.argsort(prob)[::-1][:3]
    top_recs = []
    for idx in top_indices:
        h_id = classes[idx]
        h_meta = hei_dict.get(h_id, {})
        top_recs.append({
            "hei_id": h_id,
            "name": h_meta.get("name"),
            "district": h_meta.get("district"),
            "code": h_meta.get("code"),
            "probability": round(float(prob[idx]), 4)
        })
    sample_predictions.append({
        "query": q,
        "recommendations": top_recs
    })

meta = {
    "model_name": "JoharSetu Multilingual HEI Recommender V2",
    "trained_date": time.strftime("%Y-%m-%d %H:%M:%S"),
    "total_heis_monitored": len(HEI_LIST),
    "classes": classes,
    "top1_accuracy": round(float(acc), 4),
    "top3_accuracy": round(float(top3_acc), 4),
    "sample_evaluations": sample_predictions
}

with open(META_OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(meta, f, indent=2, ensure_ascii=False)

print(f"[+] Saved metadata to {META_OUTPUT_PATH}")
print("[✓] HEI Recommendation ML Pipeline Finished Successfully!")
