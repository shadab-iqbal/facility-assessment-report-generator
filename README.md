# Medelite Facility Assessment Report Generator

A full-stack web application that allows Medelite directors to instantly pull public CMS nursing home data by CCN, combine it with internal operational inputs, and download a polished PDF or Word report — all in one click.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [How It Works](#how-it-works)
  - [Data Flow](#data-flow)
  - [API Endpoints](#api-endpoints)
  - [CMS Data Sources](#cms-data-sources)
- [Features](#features)
  - [Core MVP](#core-mvp)
  - [Bonus Features Implemented](#bonus-features-implemented)
- [Branding Requirements](#branding-requirements)
- [Data Field Reference](#data-field-reference)
  - [CMS API Fields](#cms-api-fields)
  - [Manual Input Fields](#manual-input-fields)
  - [Claims Metrics (12 Bonus Fields)](#claims-metrics-12-bonus-fields)
- [Engineering Assumptions & Decisions](#engineering-assumptions--decisions)
- [Known Limitations](#known-limitations)
- [Test Case](#test-case)

---

## Project Overview

Medelite directors routinely evaluate skilled nursing facilities before initiating partnership discussions. This tool eliminates manual data gathering by:

1. Accepting a facility's **CMS Certification Number (CCN)**
2. Fetching real-time public data from the **CMS Provider Data Catalog API**
3. Combining it with internal operational inputs entered by the user
4. Generating a **downloadable PDF or Word (.docx) report** with one click

---

## Tech Stack

| Layer                  | Technology                             |
| ---------------------- | -------------------------------------- |
| Frontend               | Next.js (React), TypeScript            |
| Backend                | Python, FastAPI                        |
| PDF Generation         | jsPDF + jspdf-autotable                |
| Word Generation        | docx (JS library) + file-saver         |
| HTTP Client (frontend) | Axios                                  |
| HTTP Client (backend)  | requests                               |
| Data Validation        | Pydantic                               |
| Data Source            | CMS Provider Data Catalog (public API) |

---

## Project Structure

```
Healthcare-Data-Automation/
├── backend/
│   ├── main.py                        # FastAPI app entry point
│   ├── config/
│   │   └── settings.py                # CMS API URLs and constants
│   ├── models/
│   │   └── facility.py                # Pydantic response schemas
│   ├── routers/
│   │   └── facility.py                # Route: GET /api/facility/{ccn}
│   ├── services/
│   │   ├── cms_client.py              # All raw HTTP calls to CMS APIs
│   │   └── facility_service.py        # Business logic and data mapping
│   └── venv/                          # Python virtual environment
│
└── frontend/
    └── my-app/
        ├── app/
        │   └── page.tsx
        ├── components/
        │   ├── ManualInputsForm.tsx
        │   └── PageHeader.tsx
        ├── hooks/
        │   ├── useFacility.ts
        │   └── useManualInputs.ts
        ├── types/
        │   └── facility.ts
        └── utils/
            ├── generatePDF.ts
            └── generateWordDoc.ts
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install fastapi uvicorn requests pydantic

# Start the server
uvicorn main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

You can explore the auto-generated API docs at: `http://127.0.0.1:8000/docs`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend runs at `http://localhost:3000`.

> **Important:** Make sure the backend is running before using the frontend. The frontend calls `http://127.0.0.1:8000` directly.

---

## How It Works

### Data Flow

```
User enters CCN
      ↓
Frontend sends GET /api/facility/{ccn}
      ↓
Backend calls 3 CMS APIs in parallel:
  1. Core facility data (name, location, beds, star ratings)
  2. Provider-level LT/STR claims metrics
  3. National and state-level averages
      ↓
Backend assembles and returns a clean JSON response
      ↓
Frontend renders the facility name, then shows manual input fields
      ↓
User fills in internal fields and clicks Download
      ↓
PDF or Word report is generated client-side and downloaded instantly
```

---

### API Endpoints

#### `GET /api/facility/{ccn}`

Fetches full facility assessment data for a given CCN.

**Example Request:**

```
GET http://127.0.0.1:8000/api/facility/686123
```

**Example Response:**

```json
{
  "name_of_facility": "Kendall Lakes Healthcare and Rehab Center",
  "location": "11969 SW 8th St, Miami, FL 33184",
  "state_code": "FL",
  "census_capacity": "180",
  "star_ratings": {
    "overall": "4",
    "health_inspection": "4",
    "staffing": "3",
    "quality_care": "5"
  },
  "claims_metrics": {
    "short_term_hospitalization": "...",
    "str_national_avg_hospitalization": "...",
    "str_state_avg_hospitalization": "...",
    "str_ed_visit": "...",
    "str_ed_visits_national_avg": "...",
    "str_ed_visits_state_avg": "...",
    "lt_hospitalization": "...",
    "lt_national_avg_hospitalization": "...",
    "lt_state_avg_hospitalization": "...",
    "lt_ed_visit": "...",
    "lt_ed_visits_national_avg": "...",
    "lt_ed_visits_state_avg": "..."
  }
}
```

---

### CMS Data Sources

The backend queries three separate CMS Datastore endpoints:

| Purpose                          | Dataset ID  | URL                                                                    |
| -------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Core facility data               | `4pq5-n9py` | `https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0` |
| National/state LT & STR averages | `xcdc-v8bm` | `https://data.cms.gov/provider-data/api/1/datastore/query/xcdc-v8bm/0` |
| Provider-level LT & STR metrics  | `ijh5-nb2v` | `https://data.cms.gov/provider-data/api/1/datastore/query/ijh5-nb2v/0` |

---

## Features

### Core MVP

| Feature                                                     | Status |
| ----------------------------------------------------------- | ------ |
| CCN lookup input                                            | ✅     |
| Fetch facility from CMS API                                 | ✅     |
| Facility name override (manual input)                       | ✅     |
| Manual operational inputs (EMR, Census, Patient Type, etc.) | ✅     |
| PDF export with one click                                   | ✅     |
| Medicare Care Compare hyperlink in PDF                      | ✅     |
| Dynamic CCN in Medicare URL                                 | ✅     |

---

### Bonus Features Implemented

| Feature                                     | Status |
| ------------------------------------------- | ------ |
| All 12 LT/STR hospitalization & ED metrics  | ✅     |
| State and national averages for each metric | ✅     |
| Word (.docx) export                         | ✅     |
| Corporate branding header in both exports   | ✅     |
| Logo image in PDF header                    | ✅     |

---

## Branding Requirements

Per Medelite's spec, the header in both the web UI and all generated exports must display:

```
INFINITE — Managed by MEDELITE
FACILITY ASSESSMENT SNAPSHOT
[STATE CODE]
```

> ⚠️ **Critical:** The word `INFINITE` is a static internal brand name. It is never replaced by the facility name. The facility name only appears in the report body under "Name of Facility".

---

## Data Field Reference

### CMS API Fields

| Report Label             | CMS Field                                              | Source                |
| ------------------------ | ------------------------------------------------------ | --------------------- |
| Name of Facility         | `provider_name`                                        | Core facility dataset |
| Location                 | `provider_address` + `citytown` + `state` + `zip_code` | Core facility dataset |
| Census Capacity          | `number_of_certified_beds`                             | Core facility dataset |
| State Code               | `state`                                                | Core facility dataset |
| Overall Star Rating      | `overall_rating`                                       | Core facility dataset |
| Health Inspection        | `health_inspection_rating`                             | Core facility dataset |
| Staffing                 | `staffing_rating`                                      | Core facility dataset |
| Quality of Resident Care | `qm_rating`                                            | Core facility dataset |

---

### Manual Input Fields

These fields are not available in public CMS data. They are entered by the user in the web UI and included directly in the generated report.

| Field                           | Input Type        | Example                    |
| ------------------------------- | ----------------- | -------------------------- |
| Facility Name Override          | Text              | "Kendall Lakes Rehab"      |
| EMR                             | Text              | "PCC", "MatrixCare"        |
| Current Census                  | Number            | 112                        |
| Type of Patient                 | Text              | "Long-term & Short-term"   |
| Previous Coverage from Medelite | Dropdown (Yes/No) | "Yes"                      |
| Previous Provider Performance   | Text              | "About 30 patients/day"    |
| Medical Coverage                | Text              | "Optometry, PCP, Podiatry" |

---

### Claims Metrics (12 Bonus Fields)

These map CMS "STR" (Short-Stay) and "LT" (Long-Stay) claims-based measures to user-friendly labels.

| Report Label                          | Response Key                       | Source                           |
| ------------------------------------- | ---------------------------------- | -------------------------------- |
| Short Term Hospitalization            | `short_term_hospitalization`       | Provider row 0: `adjusted_score` |
| STR National Avg. for Hospitalization | `str_national_avg_hospitalization` | National avg dataset             |
| STR State Avg. for Hospitalization    | `str_state_avg_hospitalization`    | State avg dataset                |
| STR ED Visit                          | `str_ed_visit`                     | Provider row 1: `adjusted_score` |
| STR ED Visits National Avg.           | `str_ed_visits_national_avg`       | National avg dataset             |
| STR ED Visits State Avg.              | `str_ed_visits_state_avg`          | State avg dataset                |
| LT Hospitalization                    | `lt_hospitalization`               | Provider row 2: `adjusted_score` |
| LT National Avg. for Hospitalization  | `lt_national_avg_hospitalization`  | National avg dataset             |
| LT State Avg. for Hospitalization     | `lt_state_avg_hospitalization`     | State avg dataset                |
| LT ED Visit                           | `lt_ed_visit`                      | Provider row 3: `adjusted_score` |
| LT ED Visits National Avg.            | `lt_ed_visits_national_avg`        | National avg dataset             |
| LT ED Visits State Avg.               | `lt_ed_visits_state_avg`           | State avg dataset                |

---

## Engineering Assumptions & Decisions

1. **Provider metrics row ordering:** The CMS ijh5-nb2v dataset contains multiple claims-based quality measures for each provider, each identified by a unique measure_code. Rather than relying on the order of the returned rows, the backend locates each metric by its measure_code and retrieves the corresponding adjusted_score. If a measure is missing or the requested field is unavailable, the helper function returns "N/A" instead of raising an error, ensuring the report is generated reliably even when CMS data is incomplete.

2. **PDF and Word generation are client-side:** Both exports are generated entirely in the browser using JavaScript libraries (jsPDF, docx.js). No file is written to the server. This keeps the backend stateless and avoids file storage concerns.

3. **CORS is fully open (`allow_origins=["*"]`):** This is acceptable for a local development/internal tool. For a production deployment, origins should be restricted to the deployed frontend domain.

---

## Known Limitations

- **No authentication:** The app is designed as an internal micro-tool. There is no login or user management.
- **No caching:** Each CCN lookup makes 3 live CMS API calls. CMS APIs are rate-limited; repeated rapid lookups for the same CCN may slow down temporarily.

---

## Test Case

Use the following to validate the full data pipeline:

| Field            | Value                                                                               |
| ---------------- | ----------------------------------------------------------------------------------- |
| Facility Name    | Kendall Lakes Healthcare and Rehab Center                                           |
| CCN              | `686123`                                                                            |
| Medicare Profile | https://www.medicare.gov/care-compare/details/nursing-home/686123/view-all?state=FL |

Enter `686123` in the CCN input, click **Fetch Facility**, fill in any manual fields, and click **Download PDF Report** or **Download Word (.docx)** to verify the output.
