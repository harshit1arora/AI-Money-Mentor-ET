# AI Money Mentor

AI Money Mentor is a premium, AI-driven financial advisory platform designed specifically for the modern user. By merging a state-of-the-art glassmorphic UI with dynamic, contextual financial intelligence powered by Google Gemini, the platform acts as your personal CFO.

## 🚀 Features
- **Dynamic AI Intelligence**: Powered by Google Generative AI to provide tailored financial insights, custom Action Plans, and context-aware advice based on your explicit income, expenses, and age.
- **Smart Dashboard & Growth Chart**: Track your precise savings potential and visualize 10-year growth trajectories under optimized SIP investments.
- **Data Persistence**: Architected to support Supabase for robust, cross-device profile syncing while flawlessly utilizing deeply localized caching for a zero-latency experience. 
- **Tax Optimization**: Dedicated tools engineered to aggressively cut down on tax liabilities via Indian Section 80C, 80D, etc.
- **Interactive AI Chat**: 1-on-1 natural language Financial UI designed for nuanced and deeply personalized financial probing.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Shadcn UI
- **Typography & Aesthetics**: Plus Jakarta Sans, Outfit, Glassmorphism, CSS dynamic glowing
- **AI Engine**: `@google/generative-ai` (Gemini API)

## 🏃‍♂️ Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment (Create a `.env` file):
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_GEMINI_API_KEY=your_api_key  # (Backend instantly falls back to advanced simulation if key is missing)
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 🤝 Developed By
**MafiaVIT**
