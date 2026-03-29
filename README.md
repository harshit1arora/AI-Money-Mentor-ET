# 💼 AI Money Mentor v1

An intelligent full-stack financial assistant that helps users manage finances, calculate SIP returns, estimate taxes, and get AI-powered financial advice using Google Gemini AI.

---

## 🚀 Features

* 📊 **Financial Health Score**
  Analyze income, expenses, savings, and debt

* 🤖 **AI Financial Advisor**
  Personalized advice powered by Google Gemini AI

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

* React (Vite)
* Tailwind CSS
* Shadcn UI
* Framer Motion

### Backend

* FastAPI
* SQLAlchemy (ORM)
* SQLite

### AI Layer

* Google Gemini AI (via Google Generative AI Python SDK)

---

## 📁 Project Structure

```
project-root/
│
├── backend/
│   ├── main.py
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── ai/
│   ├── schemas/
│   ├── services/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## ⚙️ Backend Setup (FastAPI)

### 1. Navigate to backend

```bash
cd backend
```

### 2. Install dependencies

```bash
pip install -r requirement.txt
```

### 3. Run Backend

```bash
uvicorn main:app --reload
```

---

## 🔐 Environment Variables

Create a `.env` file in `/backend`:

```
GEMINI_API_KEY=your_api_key_here
```

👉 Add `.env` to `.gitignore`

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

---

## 👨‍💻 Author

**Harshit Arora** & **Team MafiaVIT**

---

## 📄 License

This project is for educational / hackathon use.
