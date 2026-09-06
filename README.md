# JoharSetu (जोहारसेतु) 🌉

> **Autonomous Digital Bridge Connecting Jharkhand's Grassroots Challenges with 44 Higher Education Institutions (HEIs) under NEP 2020**  
> **Smart India Hackathon (SIH 2026)** | **Problem Statement ID:** SIH26043  
> **Target Ministry:** Department of Higher & Technical Education, Government of Jharkhand  
> **Architecture:** Progressive Web App (PWA) • Agentic AI & Spatial ML • PostGIS Relational SSOT • Cryptographic Ledger

---

## 🏛️ Executive Summary

Across Jharkhand’s 24 districts—from the coalfields of Dhanbad to the tribal agricultural clusters of Khunti, Dumka, and West Singhbhum—citizens face acute local infrastructure deficits (arsenic leaching, solar microgrid inverter failures, washed-out monsoon culverts, paddy bacterial blight). Concurrently, 44 premier engineering and technical institutions (including **IIT (ISM) Dhanbad**, **NIT Jamshedpur**, **BIT Mesra**, and **Birsa Agricultural University**) seek authentic, locally-grounded capstone projects under **NEP 2020 experiential learning mandates (4 Academic Credits)**.

**JoharSetu (जोहारसेतु)** is the digital bridge connecting these worlds:
1. **Low-Bandwidth Multilingual Citizen Reporting:** Offline-first PWA with vernacular speech-to-text in Hindi, Santhali, Mundari, and Ho, one-touch GPS capture, and camera uploads.
2. **Reddit/Twitter-Style Social Civic Feed:** Algorithmic Hype score ranking prioritizing urgent community challenges with upvotes, discussion threads, and shareable permalinks.
3. **Citizen Privacy Protocol (DPDP 2023):** Default masking of citizen names and phone numbers with privileged reveal for authorized government officers and academic mentors.
4. **Autonomous AI & Geodesic Routing:** Spatial and domain-calibrated ML engine assigning problems to the nearest specialized university department among 44 mapped Jharkhand HEIs.
5. **NSS Student Work & NEP 2020 Academic Credits:** Field hours tracking (60 hours requirement), student volunteer rosters, and tamper-proof academic credit conferral with Before/After resolution evidence.
6. **CSR Co-Financing & 80G Crowdfunding:** Direct corporate matching grants (Tata Steel, Coal India, NTPC) held in milestone-locked escrow.
7. **Cryptographic SHA-256 Audit Trail:** Block-level integrity ledger guaranteeing zero tampering in fund dispersal and academic credits.
8. **Statewide GIS Command Center:** Real-time 24-district spatial heatmaps, category filters, and resolution analytics.

---

## 🎨 Design System (Sohrai Cultural Heritage Palette)

| Token Name | Hex Code | Purpose & Function |
|---|---|---|
| **Terracotta Rust** | `#D87A53` | Primary Brand Accent: Active navigation, main CTAs, action buttons |
| **Warm Sand Gold** | `#D4A86A` | Secondary Accent: Badges, stats chips, highlight borders, verified tags |
| **Off-White Canvas** | `#FAF8F5` | Background Canvas: Low-fatigue natural earthy background |
| **Surface White** | `#FFFFFF` | Card Containers: Elevated surfaces with soft border styling |
| **Charcoal Typography** | `#1E1E1E` | High-contrast primary headings and legibility |
| **Muted Slate** | `#555555` | Secondary captions and helper text |

---

## 🏗️ System Architecture & Data Topology

```
JoharSetu/
├── src/
│   ├── app/
│   │   ├── portal/
│   │   │   ├── citizen/page.tsx   # Social Civic Feed, Hype Engine, Dual-Mode Reporting
│   │   │   ├── hei/page.tsx       # Capstone Workspace, NSS Credit & Hours Manager
│   │   │   ├── csr/page.tsx       # Corporate CSR Co-Financing & Trending Crowdfunds
│   │   │   └── admin/page.tsx     # Statewide 24-District GIS Directorate
│   │   ├── api/
│   │   │   ├── tickets/route.ts   # REST API for tickets & Prisma persistence
│   │   │   ├── tickets/submit/    # Background sync & offline report ingestion
│   │   │   ├── auth/              # JWT & session authentication
│   │   │   ├── location/          # IP & coordinate reverse geocoding
│   │   │   └── upload/            # Evidence media pipeline
│   │   ├── layout.tsx             # PWA metadata, manifest links, theme tokens
│   │   └── globals.css            # Custom CSS & Sohrai tokens
│   ├── components/
│   │   ├── SocialCivicCard.tsx    # Twitter/Reddit civic card with Hype & DPDP masking
│   │   ├── SahayakChatbot.tsx     # Multilingual voice & conversational filing assistant
│   │   ├── HeiPortal.tsx          # Capstone workspace, NSS tracker, credit conferral
│   │   ├── CsrPortal.tsx          # CSR sponsorship marketplace & crowdfunding match
│   │   ├── GovtAdminPortal.tsx    # Statewide GIS heatmap & cryptographic audit viewer
│   │   ├── AgencyMapView.tsx      # Google Maps GIS with heatmaps & 44 HEI markers
│   │   ├── LocationPickerModal.tsx# Interactive satellite/terrain coordinate picker
│   │   └── PWAInstaller.tsx       # Service worker manager & install prompts
│   └── lib/
│       ├── apiConfig.ts           # Centralized service URLs & environment endpoints
│       ├── rankingEngine.ts       # Hype velocity formula & DPDP privacy masking
│       ├── heiRegistry.ts         # 44 Jharkhand HEIs with GPS & NIRF scoring
│       ├── offlineDb.ts           # IndexedDB offline store with background sync
│       ├── prisma.ts              # Prisma client instance for PostgreSQL SSOT
│       └── mockData.ts            # Seeded statewide tickets & audit blocks
├── backend/                       # Python FastAPI AI & Spatial Microservice (Port 8000)
│   ├── main.py                    # FastAPI entry point (/api/v1/tickets/process)
│   ├── requirements.txt           # Python dependencies
│   ├── agent/router.py            # Spatial routing & multi-criteria decision engine
│   ├── ml/                        # Multilingual TF-IDF & HEI recommender models
│   └── ledger/audit_chain.py      # Cryptographic SHA-256 ledger engine
├── temp_friend_backend/           # Express.js Groq Multilingual Chat Service (Port 5000)
│   ├── index.js                   # Express server entry point
│   ├── controllers/               # Chat and challenge routes
│   └── config/                    # Cloud connectors (Redis, Pinecone)
├── prisma/
│   └── schema.prisma              # PostgreSQL + PostGIS schema (Single Source of Truth)
├── public/
│   ├── icons/                     # PWA Icons (192x192, 512x512, apple-touch-icon)
│   ├── manifest.json              # Web App Manifest specification
│   ├── sw.js                      # Service Worker (precaching & background sync)
│   └── offline.html               # Offline fallback screen
├── Dockerfile.frontend            # Multi-stage Next.js PWA container
├── Dockerfile.backend             # Python 3.11 FastAPI ML container
├── Dockerfile.chat                # Express Groq chat container
└── docker-compose.yml             # Full-stack container orchestration
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js 18+ or 20+
- Python 3.10+ or 3.11+
- Git

### 1. Run Next.js Frontend (PWA)
```bash
npm install
npm run dev
```
Open **[http://localhost:3000/portal/citizen](http://localhost:3000/portal/citizen)** in your browser.

### 2. Run AI Microservice (FastAPI on Port 8000)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API Documentation will be live at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 3. Run Multilingual Chat Service (Express on Port 5000 - Optional)
```bash
cd temp_friend_backend
npm install
node index.js
```

---

## 🐳 Running via Docker Compose

```bash
docker compose up --build
```
This boots up:
- **Next.js PWA**: `http://localhost:3000`
- **FastAPI AI Microservice**: `http://localhost:8000`
- **Express Chat Service**: `http://localhost:5000`
- **PostgreSQL 16 + PostGIS**: Port `5432`
- **Qdrant Vector Engine**: Port `6333`

---

## 📱 Progressive Web App (PWA) Capabilities

- **Installable Native Experience**: Add to home screen on Android, iOS, Windows, and macOS.
- **Zero Data Loss (Offline-First)**: When disconnected from the internet, submissions are queued locally in browser **IndexedDB** (`JoharSetu_OfflineStore`).
- **Automatic Background Sync**: Once connectivity is restored, the Service Worker automatically transmits queued reports to `/api/tickets/submit`.
- **Precached Assets**: Offline screen, PWA manifest, and app icons are precached for instantaneous load times.

---

## 🛡️ License & Acknowledgements

Developed for the **Smart India Hackathon (SIH 2026)** — Ministry of Higher & Technical Education, Government of Jharkhand.
