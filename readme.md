
# Bihar State Vegetable Cooperative ERP (VEGFED)

A comprehensive, 3-tier digital ecosystem designed for the **Bihar State Vegetable Processing & Marketing Co-operative Federation Ltd.**. This ERP streamlines the journey from the farmer's field to the consumer's plate.

## 🌟 Key Features

### 🚜 Tier 1: Farmer Empowerment
*   **DBT Integrated Registration**: Seamless onboarding using Aadhaar-linked DBT identifiers.
*   **AI Geo-Tagging**: Integrated **Google Maps Grounding (Gemini 2.5 Flash)** to verify land coordinates, evaluate agricultural potential, and identify nearby water resources.
*   **Digital ID**: Automated generation of VEGFED membership certificates.

### 🏢 Tier 2: PVCS (Primary Cooperative) Efficiency
*   **Procurement Gateway**: Strictly controlled inbound procurement (Farmers only) and outbound sales (Vendors/Unions).
*   **Quality Grading**: Digital grading system (A/B/C) with automated price calculations based on state-defined multipliers.
*   **Batch Traceability**: QR code generation for every procurement batch, ensuring "Farm-to-Table" transparency.

### 🏛️ Tier 3: State Federation & Union Control
*   **User Management**: State officials can create and authorize Level 2 (PVCS) and Union users.
*   **Master Price Control**: Centralized daily price setting for the entire state network.
*   **Scheme Impact Analytics**: Real-time tracking of budget utilization and cooperative performance.

## 🛠 Tech Stack
*   **Frontend**: React 19, Tailwind CSS (Lucide Icons, FontAwesome).
*   **AI**: Google GenAI SDK (Gemini 2.5 Flash, Gemini 3 Pro).
*   **Grounding**: Google Maps Grounding for geo-spatial verification.
*   **Charts**: Recharts for business intelligence visualization.

## 🚦 Getting Started
1.  **Login**: Use the "Tier Switcher" in the sidebar to simulate different roles (Farmer, PVCS, State).
2.  **Geo-Verify**: Go to **Land & Crops**, register a plot, and use the "Verify Geo-Tagging" button to see Gemini + Maps Grounding in action.
3.  **Procure**: As a PVCS user, use the **Procurement Gateway** to record intake from farmers and sales to vendors.
4.  **Manage**: As a State Official, use **User Management** to oversee the cooperative personnel network.

---
*Developed for the Cooperative Department, Government of Bihar.*
