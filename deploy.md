# Presentation & Deployment: Bihar Vegetable ERP

This prototype demonstrates a **3-Tier Cooperative Framework** powered by **Gemini 2.5 Flash**.

## 🏗️ 3-Tier Presentation Logic
1.  **Tier 1 (Farmer)**: Focus on the "Land & Crops" module. Demo the **AI Geo-Tagging** feature. It uses Google Maps Grounding to verify agricultural land validity—a critical USP for the Bihar govt.
2.  **Tier 2 (PVCS/Block)**: Show the "Procurement Gateway". Explain how local cooperatives act as data hubs, grading produce (A/B/C) and generating **Traceability QR Codes**.
3.  **Tier 3 (Federation/State)**: Use the "Master Data" and "User Management" modules. Show how the State sets global pricing that flows down to the blocks instantly.

## 🐳 Docker Quickstart (For Presentation)
To show the app running in a clean containerized environment:
```bash
# Build the prototype image
docker build -t vegfed-prototype:v1 .

# Run the container
docker run -p 8080:80 -e API_KEY=YOUR_KEY vegfed-prototype:v1
```
Access the demo at `http://localhost:8080`.

## ☸️ Kubernetes Deployment
For a production-ready "Tier 3" pitch, show the `deployment.yml`:
- **Scalability**: 3 Replicas with Rolling Updates.
- **Security**: API Keys managed via K8s Secrets.
- **Health**: Liveness and Readiness probes for zero-downtime.

## 💡 AI Demo Highlights
- **Land Module**: Click "Verify Geo-Tagging". It calls Gemini + Maps to identify nearby water resources.
- **Advisory Module**: Show the "Generate with Gemini" button. It creates real-time, science-backed advice for Bihar farmers based on current seasons.
