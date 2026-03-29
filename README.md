# 💼 Finance AI Advisor

An intelligent full-stack financial assistant that helps users manage finances, calculate SIP returns, estimate taxes, and get AI-powered financial advice using LLaMA 3.

---

## 🚀 Features

* 📊 **Financial Health Score**
  Analyze income, expenses, savings, and debt

* 🤖 **AI Financial Advisor**
  Personalized advice powered by LLaMA 3 (via Groq API)

* 💬 **Ask AI (Free Query)**
  Users can ask any financial or general question

* 📈 **SIP Planner**
  Calculates future value of investments based on user data

* 🧾 **Tax Calculator**
  Estimates tax based on income

* 👤 **User-Based System**
  Data stored per user with unique `user_id`

---

## 🧱 Tech Stack

### Frontend

* React (Vite / Next.js compatible)
* Tailwind CSS
* Fetch API

### Backend

* FastAPI
* SQLAlchemy (ORM)
* SQLite / PostgreSQL

### AI Layer

* LLaMA 3 via Groq API

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── database/
│   │   └── db.py
│   ├── models/
│   │   └── finance.py
│   ├── routes/
│   │   ├── user.py
│   │   ├── finance.py
│   │   ├── tax.py
│   │   └── ai.py
│   ├── ai/
│   │   ├── llm.py
│   │   └── prompts.py
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/api.js
│   │   ├── components/
│   │   │   ├── AskAI.jsx
│   │   │   ├── SIPPlanner.jsx
│   │   │   ├── TaxCalculator.jsx
│   │   │   ├── FinanceForm.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   └── ChatUI.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Backend Setup (FastAPI)

### 1. Navigate to backend

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

### 3. Activate environment

**Windows:**

```bash
venv\Scripts\activate
```

**Mac/Linux:**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in `/backend`:

```
GROQ_API_KEY=your_api_key_here
```

👉 Add `.env` to `.gitignore`

---

## ▶️ Run Backend

```bash
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## 🎨 Frontend Setup (React)

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

### 👤 User

* `POST /user/create`

### 💰 Finance

* `POST /finance/add`
* `GET /finance/score/{user_id}`

### 📈 SIP

* `GET /finance/sip/{user_id}`

### 🧾 Tax

* `GET /tax/basic/{user_id}`

### 🤖 AI

* `GET /advisor/chat/{user_id}`
* `POST /ai/ask`

---

## 🧠 AI Integration

* Uses **LLaMA 3 (8B)** via Groq API
* Prompt-engineered for financial advice
* Supports:

  * Structured advice
  * Free-form queries

---

## 🔄 Application Flow

```
Frontend → API Layer → FastAPI Backend → DB / LLM → Response → UI
```

---

## 🛡️ Security Practices

* API keys stored in `.env`
* `.env` excluded via `.gitignore`
* No sensitive data exposed to frontend

---

## 🧪 Testing

### Backend Testing

* Use Swagger UI: `/docs`
* Use Postman for endpoint testing

### Frontend Testing

* Verify API calls in browser console
* Check network tab for request/response

---

## 🚨 Common Issues & Fixes

### ❌ "Not Found"

* Check API route prefix (`/api` vs `/`)
* Match frontend BASE_URL

### ❌ LLM Error (`choices`)

* Invalid API key or rate limit
* Check `.env` loading

### ❌ CORS Error

* Add middleware in FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware
```

---

## 🌟 Unique Feature (Hackathon Edge)

> 💡 **Dual AI Mode**

* Structured financial advisor (based on user data)
* Free query AI (Ask Anything)

---

## 👨‍💻 Author

**Team MafiaVIT**

---

## 📄 License

This project is for educational / hackathon use.
