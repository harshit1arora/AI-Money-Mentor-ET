# 💰 AI Money Mentor

**Your Intelligent Financial Sidekick.** AI Money Mentor is a high-performance, full-stack financial command center designed to give you absolute clarity over your wealth. Built with a modern tech stack and powered by Groq's high-speed AI, it transforms complex financial data into actionable growth plans.

---

## 🚀 Key Features

### 🏦 **Financial Command Center**
A real-time dashboard that tracks your KPIs, including income, expenses, and a proprietary **Financial Health Score**. It auto-refreshes every 30 seconds to keep you synced with your goals.

### 🧠 **AI Wealth Assistant**
Powered by **Groq (Llama 3.1)**, our chatbot isn't just a basic bot—it's a financial mentor. Ask about SIPs, emergency funds, or tax planning, and get professional-grade advice instantly.

### 📊 **Tax Optimizer (FY 2025-26)**
- **Regime Comparison**: Live break-even analysis between Old and New Tax Regimes.
- **Optimization Meter**: Real-time tracking of Section 80C and other deductions.
- **PDF Reports**: Generate and download a professional Tax Optimization Report with one click.

### 📈 **Dynamic Roadmap**
Automatically generates financial milestones based on your specific profile. Whether it's building an emergency fund or planning for retirement, your roadmap evolves as your finances do.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Python (FastAPI) + SQLAlchemy + SQLite
- **AI Intelligence**: Groq API (Llama 3.1 8B)
- **Data Visualization**: Recharts
- **PDF Engine**: jsPDF + jspdf-autotable
- **State Management**: TanStack Query (React Query)

---

## 🏃‍♂️ Getting Started (Locally)

Follow these steps to get the project running on your machine from scratch.

### **1. Prerequisites**
Ensure you have **Node.js** and **Python 3.10+** installed.

### **2. Setup Backend (FastAPI)**
```powershell
cd backend
pip install -r requirement.txt
# Create a .env file in the backend folder and add:
# GROQ_API_KEY=your_key_here
uvicorn main:app --port 8000 --host 127.0.0.1 --access-log
```

### **3. Setup Frontend (Vite)**
```powershell
cd frontend
npm install
# Create a .env file in the frontend folder and add:
# VITE_GROQ_API_KEY=your_key_here
npm run dev
```

---

## 📂 Project Structure

```text
├── backend/                # FastAPI Server & AI Logic
│   ├── ai/                 # LLM prompts and Groq integration
│   ├── routes/             # API Endpoints (Tax, Finance, User)
│   └── models/             # SQLAlchemy Database Models
├── frontend/               # React Dashboard
│   ├── src/components/     # UI & Dashboard Modules
│   ├── src/lib/            # PDF Service & AI Sync
│   └── src/pages/          # Dashboard, Tax, & Insights
└── vercel.json             # Deployment Configuration
```

---

## 📜 Integration & Health
We maintain a continuous health monitor to ensure the frontend and backend are always communicating perfectly. You can check the current status of all API endpoints in our [INTEGRATION_AUDIT.md](./INTEGRATION_AUDIT.md).

---

## 🤝 Contributing
Contributions are welcome! If you have suggestions for new AI prompts or UI enhancements, feel free to open an issue or a PR.

---

## ⚖️ Disclaimer
*AI Money Mentor provides automated financial insights for educational purposes. Please consult a certified Chartered Accountant (CA) or Financial Planner for official filing and investment decisions.*

---
Made with ❤️ by [Harshit Arora](https://github.com/harshit1arora)
