import csv
import json
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "jharkhand_heis.csv")
JSON_PATH = os.path.join(os.path.dirname(__file__), "jharkhand_heis_enriched.json")

# Standardized domain specializations mapping based on institute character
def derive_specializations_and_depts(row):
    name = row["name"].lower()
    t = row["type"]
    code = row["code"]
    dist = row["districtId"]

    specializations = []
    departments = []

    # Premier National & University Institutes
    if "iit" in code.lower() or "iitism" in code.lower():
        specializations = ["WATER_MANAGEMENT", "ROAD_INFRASTRUCTURE", "SANITATION_WASTE", "FORESTRY_ENVIRONMENT"]
        departments = [
            {"name": "Department of Environmental Science & Engineering", "focus": ["Groundwater Arsenic Remediation", "Mine Drainage Filtration", "Industrial Effluent Triage"], "active_capacity": 10},
            {"name": "Department of Civil Engineering", "focus": ["Pavement Durability", "Rural Culvert Scour Analysis", "Disaster Resilient Structures"], "active_capacity": 8}
        ]
        nirf_score = 0.98
    elif "nit" in code.lower() or "nitjsr" in code.lower():
        specializations = ["RURAL_ELECTRIFICATION_SOLAR", "ROAD_INFRASTRUCTURE", "WATER_MANAGEMENT"]
        departments = [
            {"name": "Department of Electrical Engineering", "focus": ["Solar Microgrid Inverters", "Transformer Thermal Faults", "Rural Biomass Hybrid Grids"], "active_capacity": 9},
            {"name": "Department of Civil & Infrastructure Engineering", "focus": ["Low-cost Concrete Culverts", "Monsoon Road Stabilization"], "active_capacity": 7}
        ]
        nirf_score = 0.92
    elif "bitmesra" in code.lower():
        specializations = ["WATER_MANAGEMENT", "HEALTHCARE_DELIVERY", "PRIMARY_EDUCATION_DIGITAL", "RURAL_ELECTRIFICATION_SOLAR"]
        departments = [
            {"name": "Department of Remote Sensing & Geoinformatics", "focus": ["Hydrological Watershed Mapping", "Aquifer Depletion Telemetry", "Drone Land Survey"], "active_capacity": 9},
            {"name": "Department of Bioengineering", "focus": ["Point-of-Care Water Pathogen Kits", "Telemedicine Diagnostic Kiosks"], "active_capacity": 6}
        ]
        nirf_score = 0.94
    elif "niamt" in code.lower():
        specializations = ["ROAD_INFRASTRUCTURE", "RURAL_ELECTRIFICATION_SOLAR", "SUSTAINABLE_AGRICULTURE"]
        departments = [
            {"name": "Department of Manufacturing & Materials Engineering", "focus": ["Corrosion-Resistant Handpump Valves", "Agricultural Harvester Spares", "Solar Structure Fabrication"], "active_capacity": 8}
        ]
        nirf_score = 0.86
    elif "iiit" in code.lower():
        specializations = ["PRIMARY_EDUCATION_DIGITAL", "HEALTHCARE_DELIVERY", "RURAL_ELECTRIFICATION_SOLAR"]
        departments = [
            {"name": "Department of Computer Science & AI", "focus": ["Multilingual Tribal EdTech Platforms", "Rural Health Tele-Consultation", "Smart Energy IoT"], "active_capacity": 8}
        ]
        nirf_score = 0.84
    elif "bitsindri" in code.lower():
        specializations = ["ROAD_INFRASTRUCTURE", "WATER_MANAGEMENT", "SANITATION_WASTE", "RURAL_ELECTRIFICATION_SOLAR"]
        departments = [
            {"name": "Department of Civil Engineering", "focus": ["Rural PWD Road Audits", "Erosion Control", "Masonry Culvert Retrofitting"], "active_capacity": 9},
            {"name": "Department of Chemical & Metallurgical Engineering", "focus": ["Water Desalination & Iron Stripping", "Waste Slag Utilization"], "active_capacity": 7}
        ]
        nirf_score = 0.82
    elif "engineering college" in name or "faculty of engineering" in name or "ucet" in code.lower() or "cec" in code.lower() or "rec" in code.lower() or "dec" in code.lower():
        # State & Govt-PPP Engineering Colleges (Chaibasa, Ramgarh, Dumka, UCET Hazaribagh, KU Engg)
        specializations = ["ROAD_INFRASTRUCTURE", "WATER_MANAGEMENT", "RURAL_ELECTRIFICATION_SOLAR", "SANITATION_WASTE"]
        departments = [
            {"name": "Department of Civil & Rural Infrastructure", "focus": ["Village Connectivity Roads", "Community Handpump Remediation", "Check Dams"], "active_capacity": 8},
            {"name": "Department of Electrical Engineering", "focus": ["Solar Streetlight Microgrids", "Transformer Earthing", "Panchayat Solar Power"], "active_capacity": 7}
        ]
        nirf_score = 0.78
    elif "polytechnic" in name or "gp-" in code.lower() or "gwp-" in code.lower() or "alkabir" in code.lower():
        # Polytechnic Institutes - Grassroots Rapid Deployment
        if "mining" in name:
            specializations = ["WATER_MANAGEMENT", "SANITATION_WASTE", "ROAD_INFRASTRUCTURE", "FORESTRY_ENVIRONMENT"]
            departments = [
                {"name": "Department of Mining & Environmental Technology", "focus": ["Mine Dust Suppression", "Subsidence Monitoring", "Groundwater Quality"], "active_capacity": 7}
            ]
        elif "women" in name or "gwp" in code.lower():
            specializations = ["PRIMARY_EDUCATION_DIGITAL", "HEALTHCARE_DELIVERY", "WATER_MANAGEMENT", "SANITATION_WASTE"]
            departments = [
                {"name": "Department of Applied Electronics & Community Welfare", "focus": ["Rural Digital Literacy", "Diagnostic Health Testing Kits", "Sanitation Awareness"], "active_capacity": 8}
            ]
        else:
            specializations = ["WATER_MANAGEMENT", "ROAD_INFRASTRUCTURE", "RURAL_ELECTRIFICATION_SOLAR", "SANITATION_WASTE"]
            departments = [
                {"name": "Department of Civil & Mechanical Technology", "focus": ["Handpump Mechanical Overhaul", "Road Pothole Cold-Mix Repair", "Rural Drainage Channels"], "active_capacity": 8},
                {"name": "Department of Electrical Engineering", "focus": ["Off-Grid Solar Inverter Repair", "Panchayat Wiring", "Submersible Motor Rewinding"], "active_capacity": 7}
            ]
        nirf_score = 0.72
    else:
        # Private Engineering Colleges (CIT, RVSCET, RTCIT, KKCEM, GGSESTC, Arka Jain, Usha Martin, MITM, BACET)
        specializations = ["ROAD_INFRASTRUCTURE", "PRIMARY_EDUCATION_DIGITAL", "RURAL_ELECTRIFICATION_SOLAR", "WATER_MANAGEMENT"]
        departments = [
            {"name": "Department of Engineering Innovations", "focus": ["Rural Smart Infrastructure", "Digital Village Survey", "Solar Water Pumping"], "active_capacity": 6}
        ]
        nirf_score = 0.70

    return specializations, departments, nirf_score

heis = []
with open(CSV_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        coords_raw = row["coordinates"].strip('"').split(",")
        lat = float(coords_raw[0].strip())
        lon = float(coords_raw[1].strip())
        
        nirf_raw = row["nirfRank"].strip()
        nirf_rank = int(nirf_raw) if nirf_raw and nirf_raw.isdigit() else None
        
        specs, depts, base_nirf_score = derive_specializations_and_depts(row)
        
        # If explicit NIRF rank exists, calculate normalized nirf_score
        if nirf_rank:
            calculated_score = round(max(0.60, 1.0 - (nirf_rank / 250.0)), 3)
        else:
            calculated_score = base_nirf_score

        # Capitalize district neatly
        district_formatted = row["districtId"].replace("-", " ").title()

        hei_obj = {
            "id": row["id"],
            "code": row["code"],
            "name": row["name"].strip('"'),
            "type": row["type"],
            "district": district_formatted,
            "district_id": row["districtId"],
            "lat": lat,
            "lon": lon,
            "nirf_rank": nirf_rank,
            "nirf_score": calculated_score,
            "established_year": int(row["establishedYear"]) if row["establishedYear"] else None,
            "address": row["address"].strip('"'),
            "website": row["website"],
            "specializations": specs,
            "departments": depts
        }
        heis.append(hei_obj)

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(heis, f, indent=2, ensure_ascii=False)

print(f"Successfully enriched and saved {len(heis)} HEIs to {JSON_PATH}")
