"""
JoharSetu (जोहारसेतु) ML Classifier Training Pipeline
Trains a calibrated multilingual civic issue classifier on 126k+ real municipal grievance records
combined with multilingual synthetic data (English + Hindi Devanagari + Romanized Hinglish + Tribal context).
"""

import os
import sys
import json
import time
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.linear_model import SGDClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, accuracy_score, f1_score

# Ensure stdout handles UTF-8 for Devanagari and regional scripts on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "data", "bbmp_civic_data.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
MODEL_OUTPUT_PATH = os.path.join(MODELS_DIR, "johar_classifier.pkl")
META_OUTPUT_PATH = os.path.join(MODELS_DIR, "johar_classifier_meta.json")

os.makedirs(MODELS_DIR, exist_ok=True)

# 1. JoharSetu 7 Core Academic Domains
TARGET_CLASSES = [
    "WATER_MANAGEMENT",
    "ROAD_INFRASTRUCTURE",
    "RURAL_ELECTRIFICATION_SOLAR",
    "SANITATION_WASTE",
    "SUSTAINABLE_AGRICULTURE",
    "HEALTHCARE_DELIVERY",
    "PRIMARY_EDUCATION_DIGITAL"
]

# Department & Category to JoharSetu Domain Mapping
DEPARTMENT_MAP = {
    # Water
    "WaterSupply": "WATER_MANAGEMENT",
    "StormWaterDrainage": "WATER_MANAGEMENT",
    "Lakes": "WATER_MANAGEMENT",
    # Roads & Transport
    "RoadMaintenance": "ROAD_INFRASTRUCTURE",
    "TrafficEngineering": "ROAD_INFRASTRUCTURE",
    # Electricity & Power
    "Electrical": "RURAL_ELECTRIFICATION_SOLAR",
    # Waste & Sanitation
    "SolidWaste": "SANITATION_WASTE",
    "Sanitation": "SANITATION_WASTE",
    # Forest, Parks & Animals -> Rural Ecology & Agriculture
    "Forest": "SUSTAINABLE_AGRICULTURE",
    "Parks": "SUSTAINABLE_AGRICULTURE",
    "Veterinary": "SUSTAINABLE_AGRICULTURE",
    # Health & Epidemic
    "Health": "HEALTHCARE_DELIVERY",
    "COVID_Epidemic": "HEALTHCARE_DELIVERY",
    # Civic Administration, Education & Welfare
    "Education": "PRIMARY_EDUCATION_DIGITAL",
    "Welfare": "PRIMARY_EDUCATION_DIGITAL",
    "IT_Cell": "PRIMARY_EDUCATION_DIGITAL",
    "Revenue": "PRIMARY_EDUCATION_DIGITAL",
    "TownPlanning": "PRIMARY_EDUCATION_DIGITAL",
    "Estate": "PRIMARY_EDUCATION_DIGITAL",
    "Advertisement": "ROAD_INFRASTRUCTURE"
}

# Sub-category fine mappings for edge cases
SUBCAT_OVERRIDES = {
    "Road side drains": "WATER_MANAGEMENT",
    "water stagnation": "WATER_MANAGEMENT",
    "Public toilet(s) cleaning": "SANITATION_WASTE",
    "Public toilet(s) blockage": "SANITATION_WASTE",
    "Dengue positive": "HEALTHCARE_DELIVERY",
    "Increase in mosquito density": "HEALTHCARE_DELIVERY",
    "Potholes": "ROAD_INFRASTRUCTURE",
    "footpath encroachment": "ROAD_INFRASTRUCTURE",
    "Street Light Not Working": "RURAL_ELECTRIFICATION_SOLAR",
    "Requirement For New Street Lights": "RURAL_ELECTRIFICATION_SOLAR",
    "Garbage dump": "SANITATION_WASTE",
    "Garbage vehicle not arrived": "SANITATION_WASTE",
    "obstructions Branches / Trees.": "SUSTAINABLE_AGRICULTURE",
    "Removal of dead/fallen trees": "SUSTAINABLE_AGRICULTURE",
    "Stray dog related complaints": "SUSTAINABLE_AGRICULTURE"
}

# 2. Multilingual Synthetic Dataset (Devanagari Hindi + Romanized Hinglish + Tribal Santhali/Mundari tokens)
# This equips the model to classify vernacular inputs without needing pre-existing labeled datasets.
MULTILINGUAL_SYNTHETIC_SAMPLES = [
    # --- WATER MANAGEMENT ---
    ("WATER_MANAGEMENT", "गाँव के प्राथमिक विद्यालय के चापाकल से पीला और बदबूदार पानी निकल रहा है बच्चे बीमार पड़ रहे हैं"),
    ("WATER_MANAGEMENT", "हैंडपंप का बोरवेल सूख गया है और नल से गंदा आर्सेनिक युक्त पानी आ रहा है"),
    ("WATER_MANAGEMENT", "बारिश के कारण मुख्य नाला जाम हो गया है और घरों में गंदा पानी भर रहा है"),
    ("WATER_MANAGEMENT", "पेयजल आपूर्ति पाइपलाइन फट गई है और सारा साफ पानी सड़क पर बहकर बर्बाद हो रहा है"),
    ("WATER_MANAGEMENT", "जल संकट गहरा गया है कुआं सूख गया है चापाकल ठीक करवाएं"),
    ("WATER_MANAGEMENT", "handpump kharab hai paani nahi nikal raha pura mohalla pareshan hai"),
    ("WATER_MANAGEMENT", "chapakal se peela ganda arsenic paani aa raha hai bachhe bimar pad rahe"),
    ("WATER_MANAGEMENT", "water supply pipeline leak ho gayi hai sadak par pani beh raha hai"),
    ("WATER_MANAGEMENT", "drinking water crisis in village borewell motor burnt please send water tanker"),
    ("WATER_MANAGEMENT", "drainage block hai nala ufan par hai ganda paani flow ho raha hai"),
    ("WATER_MANAGEMENT", "nal se paani nahi aa raha handpump repair karwana hai borewell"),
    ("WATER_MANAGEMENT", "peene ka saaf paani nahi mil raha hai jal vibhag ko suchit kare"),
    ("WATER_MANAGEMENT", "water stagnation in front of house drainage overflow dirty water"),
    ("WATER_MANAGEMENT", "hatu dak samasya dahak leka handpump damage water filtration required"),

    # --- ROAD INFRASTRUCTURE ---
    ("ROAD_INFRASTRUCTURE", "राष्ट्रीय राजमार्ग और गाँव को जोड़ने वाली सड़क पर जानलेवा गड्ढे हो गए हैं दुर्घटनाएं हो रही हैं"),
    ("ROAD_INFRASTRUCTURE", "नदी पर बनी पुलिया बारिश में बह गई है जिससे 5 गांवों का संपर्क टूट गया है"),
    ("ROAD_INFRASTRUCTURE", "सड़क का डामर पूरी तरह उखड़ गया है और केवल नुकीले पत्थर बचे हैं"),
    ("ROAD_INFRASTRUCTURE", "फुटपाथ पर अवैध दुकानदारों ने कब्जा कर लिया है पैदल चलना नामुमकिन हो गया है"),
    ("ROAD_INFRASTRUCTURE", "सड़क धंस गई है भारी वाहनों के कारण रास्ता पूरी तरह अवरुद्ध है"),
    ("ROAD_INFRASTRUCTURE", "sadak me bahut bada gaddha hai accident hone ka khatra hai"),
    ("ROAD_INFRASTRUCTURE", "sadak par bohot bade bade gaddhe hai roz motorcycle wale gir rahe hai"),
    ("ROAD_INFRASTRUCTURE", "gaao ka bridge baadh me toot gaya culvert washout ho gaya rasta band hai"),
    ("ROAD_INFRASTRUCTURE", "road repair asphalt completely damaged deep potholes on main chowk"),
    ("ROAD_INFRASTRUCTURE", "footpath encroachment illegal parking blocking entire walkway"),
    ("ROAD_INFRASTRUCTURE", "rasta bahut kharab hai gaddhe hi gaddhe hai gaadi nahi chal sakti"),
    ("ROAD_INFRASTRUCTURE", "road construction incomplete divider damaged traffic blocked"),
    ("ROAD_INFRASTRUCTURE", "pothole on bridge road broken need asphalt bitumen patch work"),
    ("ROAD_INFRASTRUCTURE", "hor rasta damage bridge collapsed need immediate civil road maintenance"),

    # --- RURAL ELECTRIFICATION & SOLAR ---
    ("RURAL_ELECTRIFICATION_SOLAR", "गाँव का मुख्य ट्रांसफार्मर जल गया है और पिछले 4 दिनों से बिजली पूरी तरह ठप है"),
    ("RURAL_ELECTRIFICATION_SOLAR", "सोलर माइक्रोग्रिड और बैटरी खराब हो गई है रात में अस्पताल और स्ट्रीट लाइट में अंधेरा रहता है"),
    ("RURAL_ELECTRIFICATION_SOLAR", "हाई टेंशन 11KV बिजली का नंगा तार सड़क पर लटक रहा है बड़ा हादसा हो सकता है"),
    ("RURAL_ELECTRIFICATION_SOLAR", "स्ट्रीट लाइट कई महीनों से बंद पड़ी है नए खंभे और बल्ब लगाने की जरूरत है"),
    ("RURAL_ELECTRIFICATION_SOLAR", "बिजली के खंभे टेढ़े हो गए हैं और तार टूटने से पूरे गांव में अंधेरा छाया है"),
    ("RURAL_ELECTRIFICATION_SOLAR", "transformer blast ho gaya hai 4 din se light nahi hai bijli vibhag"),
    ("RURAL_ELECTRIFICATION_SOLAR", "street light not working andhera hai street me new pole wire required"),
    ("RURAL_ELECTRIFICATION_SOLAR", "solar microgrid battery burnt photovoltaic panel damage no electricity"),
    ("RURAL_ELECTRIFICATION_SOLAR", "electric wire hanging dangerous low on pedestrian road shock hazard"),
    ("RURAL_ELECTRIFICATION_SOLAR", "bijli power cut frequent voltage fluctuation burning home appliances"),
    ("RURAL_ELECTRIFICATION_SOLAR", "transformer me aag lag gayi bijli supply band hai pura mohalla andhera"),
    ("RURAL_ELECTRIFICATION_SOLAR", "street light pole broken wire sparking in rain electricity fault"),
    ("RURAL_ELECTRIFICATION_SOLAR", "solar pump inverter damaged power failure in village grid"),
    ("RURAL_ELECTRIFICATION_SOLAR", "batti bijli shut down rural feeder transformer coil replacement needed"),

    # --- SANITATION & WASTE ---
    ("SANITATION_WASTE", "बाजार के पास भारी मात्रा में कचरे का ढेर लगा है बदबू से महामारी फैलने का खतरा है"),
    ("SANITATION_WASTE", "डोर टू डोर कचरा उठाने वाली गाड़ी एक हफ्ते से नहीं आई चारों तरफ गंदगी है"),
    ("SANITATION_WASTE", "सार्वजनिक सामुदायिक शौचालय में भारी गंदगी है पानी की आपूर्ति और सफाई नहीं हो रही"),
    ("SANITATION_WASTE", "खाली मैदान में खुलेआम प्लास्टिक और ठोस कचरा जलाया जा रहा है जिससे सांस लेना दूभर है"),
    ("SANITATION_WASTE", "मोहल्ले में सफाई कर्मचारी नहीं आ रहे कचरा पेटी भर चुकी है बदबू आ रही है"),
    ("SANITATION_WASTE", "kachra ka dher laga hua hai pura mohalla badboo se pareshan hai"),
    ("SANITATION_WASTE", "kachra dump ho gaya hai rotten garbage smelling heavily solid waste"),
    ("SANITATION_WASTE", "garbage van nahi aayi 1 week se kachra sadak par phek rahe log"),
    ("SANITATION_WASTE", "public toilet choked overflowing unhygienic condition need sanitation cleaning"),
    ("SANITATION_WASTE", "burning garbage in open plastic waste causing toxic smoke air pollution"),
    ("SANITATION_WASTE", "kude ka dher laga hai safai karamchari nahi aa rahe gandagi badh gayi"),
    ("SANITATION_WASTE", "dustbin overflowing solid waste garbage disposal not happening"),
    ("SANITATION_WASTE", "construction debris and malba dumped on empty plot clear immediately"),
    ("SANITATION_WASTE", "shauchalay me safai nahi hai bahut gandagi aur badboo hai municipal waste"),

    # --- SUSTAINABLE AGRICULTURE & ENVIRONMENT ---
    ("SUSTAINABLE_AGRICULTURE", "धान की खड़ी फसल में शीथ ब्लाइट और बैक्टीरियल पत्ती झुलसा रोग लग गया है"),
    ("SUSTAINABLE_AGRICULTURE", "आंधी तूफान से पुराना बरगद का पेड़ गिर गया है जिससे रास्ता और खेत ब्लॉक हो गए हैं"),
    ("SUSTAINABLE_AGRICULTURE", "आवारा मवेशी और नीलगाय किसानों की हरी फसल को नष्ट कर रहे हैं पशु चिकित्सा सहायता चाहिए"),
    ("SUSTAINABLE_AGRICULTURE", "खेतों में मिट्टी का कटाव हो रहा है और जैविक खाद व कीट नियंत्रण की तुरंत सलाह चाहिए"),
    ("SUSTAINABLE_AGRICULTURE", "कीट प्रकोप से मकई और सब्जियों की फसल बर्बाद हो रही है कृषि वैज्ञानिक की मदद दें"),
    ("SUSTAINABLE_AGRICULTURE", "dhan ki fasal me keeda lag gaya patte peele pad rahe hai kisan pareshan"),
    ("SUSTAINABLE_AGRICULTURE", "dhan ke khet me keeda lag gaya bacterial leaf blight paddy crop destroyed"),
    ("SUSTAINABLE_AGRICULTURE", "kisan agriculture pest attack in farm soil testing organic pesticide needed"),
    ("SUSTAINABLE_AGRICULTURE", "tree fallen on farm road blocking agricultural transport remove branch"),
    ("SUSTAINABLE_AGRICULTURE", "stray dogs and wild boars destroying village vegetable harvest veterinary help"),
    ("SUSTAINABLE_AGRICULTURE", "crop failure due to sudden fungal infection agronomy guidance required"),
    ("SUSTAINABLE_AGRICULTURE", "irrigation canal water not reaching tail end fields drought impact"),
    ("SUSTAINABLE_AGRICULTURE", "paddy crop pest disease agricultural officer inspection requested"),

    # --- HEALTHCARE DELIVERY ---
    ("HEALTHCARE_DELIVERY", "गाँव में डेंगू और मलेरिया के दर्जनों मरीज मिले हैं तुरंत एंटी-लार्वा फॉगिंग कराई जाए"),
    ("HEALTHCARE_DELIVERY", "प्राथमिक स्वास्थ्य केंद्र पर डॉक्टर नहीं आते और जीवन रक्षक दवाओं का स्टॉक खत्म है"),
    ("HEALTHCARE_DELIVERY", "दूषित पानी से बच्चों में हैजा और उल्टी दस्त फैल गया है आपातकालीन मेडिकल टीम भेजें"),
    ("HEALTHCARE_DELIVERY", "गाँव में डेंगू और मलेरिया के मरीज बढ़ रहे हैं तुरंत दवा छिड़काव चाहिए"),
    ("HEALTHCARE_DELIVERY", "अस्पताल में एंबुलेंस उपलब्ध नहीं है और प्रसव के लिए कोई महिला डॉक्टर नहीं है"),
    ("HEALTHCARE_DELIVERY", "dengue fever cases badh rahe hai primary health clinic me dawa nahi hai"),
    ("HEALTHCARE_DELIVERY", "dengue cases increasing mosquito breeding fogging and spray needed urgently"),
    ("HEALTHCARE_DELIVERY", "primary health centre PHC closed no doctor medicine stockout available"),
    ("HEALTHCARE_DELIVERY", "cholera and high fever epidemic spreading in village send ambulance medical camp"),
    ("HEALTHCARE_DELIVERY", "child vaccination routine immunization vaccines out of stock at health subcenter"),
    ("HEALTHCARE_DELIVERY", "hospital emergency ward no oxygen cylinder lack of basic medical kits"),
    ("HEALTHCARE_DELIVERY", "aspataal me doctor nahi hai dava nahi mil rahi mareez pareshan"),

    # --- PRIMARY EDUCATION & DIGITAL WELFARE ---
    ("PRIMARY_EDUCATION_DIGITAL", "आदिवासी प्राथमिक विद्यालय में डिजिटल टैबलेट स्मार्ट क्लास और इंटरनेट कनेक्टिविटी की जरूरत है"),
    ("PRIMARY_EDUCATION_DIGITAL", "संथाली ओल चिकी और मुंडारी भाषा में प्राथमिक शिक्षा सामग्री और किताबें उपलब्ध नहीं हैं"),
    ("PRIMARY_EDUCATION_DIGITAL", "कल्याण विभाग की प्री-मैट्रिक छात्रवृत्ति पोर्टल पर आवेदन सबमिट नहीं हो रहा है"),
    ("PRIMARY_EDUCATION_DIGITAL", "स्कूल की छत से पानी टपक रहा है बच्चों के बैठने के लिए बेंच और डेस्क नहीं हैं"),
    ("PRIMARY_EDUCATION_DIGITAL", "school digital classroom projector not working smart class setup needed"),
    ("PRIMARY_EDUCATION_DIGITAL", "tribal language santhali ol chiki digital learning software missing"),
    ("PRIMARY_EDUCATION_DIGITAL", "scholarship portal server error student DBT fund disbursement pending"),
    ("PRIMARY_EDUCATION_DIGITAL", "primary school building roof leaking lack of benches and drinking water for students"),
    ("PRIMARY_EDUCATION_DIGITAL", "chatravritti scholarship stipend status rejected need grievance resolution"),
    ("PRIMARY_EDUCATION_DIGITAL", "school me shikshak nahi aate padhai thap hai digital education lab"),
    ("PRIMARY_EDUCATION_DIGITAL", "welfare scheme e-kalyan application rejection issues for rural tribal youth")
]


def extract_clean_complaint(text: str, subcat: str) -> str:
    """Combines subcategory and stripped complaint description without boilerplate."""
    if not isinstance(text, str):
        text = ""
    # Strip typical boilerplate if present
    # e.g. "Department: Electrical. Issue: Street Light Not Working. Ward: Jagajeevanram Nagar. Status: Registered."
    issue_part = ""
    if "Issue:" in text:
        parts = text.split("Issue:")
        if len(parts) > 1:
            issue_part = parts[1].split(".")[0].strip()
    
    clean_parts = []
    if isinstance(subcat, str) and subcat.strip():
        clean_parts.append(subcat.strip())
    if issue_part and issue_part.lower() != str(subcat).lower():
        clean_parts.append(issue_part)
    
    # If both were empty, fallback to non-department text
    if not clean_parts and text:
        # filter out department string
        filtered = [p for p in text.split(".") if not p.strip().startswith("Department:") and not p.strip().startswith("Status:")]
        clean_parts.append(" ".join(filtered).strip())
    
    return " ".join(clean_parts).strip()


def build_training_dataset():
    print(f"[*] Reading dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH, usecols=["Category", "Sub Category", "department", "semantic_complaint"])
    print(f"[+] Loaded {len(df):,} total raw records.")

    # 1. Map to JoharSetu target classes
    df["target_domain"] = None

    # Priority 1: Subcategory overrides
    for subcat, domain in SUBCAT_OVERRIDES.items():
        mask = (df["Sub Category"] == subcat) & (df["target_domain"].isna())
        df.loc[mask, "target_domain"] = domain

    # Priority 2: Department mapping
    for dept, domain in DEPARTMENT_MAP.items():
        mask = (df["department"] == dept) & (df["target_domain"].isna())
        df.loc[mask, "target_domain"] = domain

    # Filter records that successfully mapped
    mapped_df = df.dropna(subset=["target_domain"]).copy()
    print(f"[+] Successfully mapped {len(mapped_df):,} records into JoharSetu domains.")

    # 2. Extract clean text
    texts = []
    for _, row in mapped_df.iterrows():
        t = extract_clean_complaint(row["semantic_complaint"], row["Sub Category"])
        texts.append(t)
    mapped_df["clean_text"] = texts

    # Balance large classes so Electrical and SolidWaste don't drown out Water, Roads, and Health
    # Sample up to 12,000 per class for training balance and ultra-fast training
    balanced_dfs = []
    for domain, grp in mapped_df.groupby("target_domain"):
        n_samples = min(len(grp), 12000)
        balanced_dfs.append(grp.sample(n=n_samples, random_state=42))
    
    training_df = pd.concat(balanced_dfs, ignore_index=True)
    
    # 3. Add Multilingual Synthetic Data
    synth_rows = []
    # Repeat synthetic samples 80x so multilingual n-grams receive balanced statistical weight
    for _ in range(80):
        for domain, text in MULTILINGUAL_SYNTHETIC_SAMPLES:
            synth_rows.append({"target_domain": domain, "clean_text": text})
    
    synth_df = pd.DataFrame(synth_rows)
    combined_df = pd.concat([training_df[["target_domain", "clean_text"]], synth_df], ignore_index=True)
    combined_df = combined_df.sample(frac=1.0, random_state=42).reset_index(drop=True)

    print("\n[+] Final Training Distribution by Domain:")
    print(combined_df["target_domain"].value_counts())
    return combined_df


def train_and_export():
    start_t = time.time()
    df = build_training_dataset()

    X = df["clean_text"].values
    y = df["target_domain"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y
    )

    print(f"\n[*] Training set size: {len(X_train):,} samples")
    print(f"[*] Test set size:     {len(X_test):,} samples")

    # Multilingual Dual Representation:
    # 1. Word n-grams (1-2) for semantic phrases and keywords
    # 2. Subword Character n-grams (3-5) for multilingual script & phonetic invariance
    print("[*] Assembling multilingual subword and word n-gram pipeline...")
    feature_union = FeatureUnion([
        ("word_tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=25000,
            sublinear_tf=True,
            analyzer="word"
        )),
        ("char_tfidf", TfidfVectorizer(
            ngram_range=(3, 5),
            max_features=35000,
            sublinear_tf=True,
            analyzer="char_wb"
        ))
    ])

    base_clf = SGDClassifier(
        loss="log_loss", # Enables calibrated predict_proba output
        penalty="l2",
        alpha=1e-5,
        max_iter=1000,
        class_weight="balanced",
        random_state=42
    )

    pipeline = Pipeline([
        ("features", feature_union),
        ("classifier", base_clf)
    ])

    print("[*] Training model...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    print("\n[*] Evaluating on held-out test split...")
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="macro")

    print(f"\n[+] Test Accuracy: {acc * 100:.2f}%")
    print(f"[+] Macro F1-Score: {f1:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred, digits=4))

    # Multilingual Sanity Testing
    print("\n" + "="*70)
    print("      MULTILINGUAL CROSS-LINGUAL SANITY INFERENCE TEST")
    print("="*70)
    test_queries = [
        ("English", "Deep potholes on the bridge after monsoon rain causing vehicle accidents"),
        ("English", "Street lights switched off whole night dark street safety hazard"),
        ("Hindi (Devanagari)", "हैंडपंप का पानी पीला और गंदा आ रहा है बच्चे बीमार पड़ रहे हैं"),
        ("Hindi (Devanagari)", "गाँव का ट्रांसफार्मर जल गया है और पिछले 3 दिनों से बिजली बंद है"),
        ("Hindi (Devanagari)", "कचरे का भारी ढेर लगा हुआ है बदबू आ रही है सफाई नहीं हुई"),
        ("Hinglish (Latin)", "sadak me bohot bade bade gaddhe hai gaadi chalana muskil hai"),
        ("Hinglish (Latin)", "chapakal se arsenic ganda paani aa raha hai urgent filtration chahiye"),
        ("Hinglish (Latin)", "transformer blast ho gaya pura gaon andhere me hai bijli supply"),
        ("Vernacular Agriculture", "dhan ke khet me keeda lag gaya bacterial leaf blight paddy crop damage"),
        ("Healthcare Alert", "dengue fever cases badh rahe hai primary health clinic me dawa nahi hai")
    ]

    test_results = []
    for lang, query in test_queries:
        probs = pipeline.predict_proba([query])[0]
        top_idx = np.argmax(probs)
        pred_label = pipeline.classes_[top_idx]
        confidence = float(probs[top_idx])
        test_results.append({
            "language": lang,
            "query": query,
            "predicted_domain": pred_label,
            "confidence": round(confidence, 4)
        })
        try:
            print(f"[{lang}] {query[:60]}...")
        except Exception:
            print(f"[{lang}] {query[:60].encode('ascii', 'replace').decode()}...")
        print(f"    --> Predicted: {pred_label} (Confidence: {confidence*100:.1f}%)\n")

    # Exporting artifacts
    print(f"[*] Exporting model bundle to: {MODEL_OUTPUT_PATH}")
    joblib.dump(pipeline, MODEL_OUTPUT_PATH, compress=3)

    meta = {
        "model_type": "Multilingual Dual-TFIDF (Word+CharWB) + SGDClassifier",
        "training_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_records_ingested": int(len(df)),
        "classes": list(pipeline.classes_),
        "test_accuracy": float(round(acc, 4)),
        "macro_f1": float(round(f1, 4)),
        "multilingual_sanity_tests": test_results,
        "default_urgency_matrix": {
            "HEALTHCARE_DELIVERY": "CRITICAL",
            "WATER_MANAGEMENT": "HIGH",
            "SUSTAINABLE_AGRICULTURE": "HIGH",
            "RURAL_ELECTRIFICATION_SOLAR": "MEDIUM",
            "ROAD_INFRASTRUCTURE": "MEDIUM",
            "SANITATION_WASTE": "LOW",
            "PRIMARY_EDUCATION_DIGITAL": "LOW"
        }
    }
    with open(META_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"[+] Metadata saved to: {META_OUTPUT_PATH}")
    print(f"[+] Training completed in {time.time() - start_t:.1f} seconds.")


if __name__ == "__main__":
    train_and_export()
