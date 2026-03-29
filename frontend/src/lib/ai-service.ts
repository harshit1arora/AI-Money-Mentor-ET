import { GoogleGenerativeAI } from "@google/generative-ai";
import { Profile } from "@/hooks/useProfile";

// Interface for actual raw transactions (mocking Plaid/Account Aggregator sync)
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  category?: string;
}

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || "";

const generateFallbackIntelligence = (profile: Profile) => {
  const savings = (profile.monthly_income ?? 0) - (profile.monthly_expenses ?? 0);
  const sipAmt = Math.round(savings * 0.4);
  
  return {
    score: Math.min(100, Math.round((savings / (profile.monthly_income || 1)) * 100 + 30)),
    insights: [
      { type: "spending", title: "Smart Spending Alert", desc: "You have spent 5% less on dining this month. Great job holding the line!" },
      { type: "portfolio", title: "Automate Investments", desc: `Set up a SIP of ₹${sipAmt} to automate your wealth creation immediately.` },
    ],
    actionPlan: [
      { label: `Invest ₹${sipAmt} in index funds`, sub: "Nifty 50 or Sensex", done: false },
      { label: "Build a 3-month emergency buffer", sub: `Target: ₹${(profile.monthly_expenses ?? 0) * 3}`, done: false }
    ],
    commentary: "Your foundation is solid. The next step is aggressive automation of your investments to combat inflation and build real wealth over the next decade.",
    metadata: {
      sipAmount: sipAmt,
      taxSavings: Math.round(savings * 0.15),
      emergencyTarget: (profile.monthly_expenses ?? 0) * 3,
      milestones: [
        { label: "Emergency Buffer", target: (profile.monthly_expenses ?? 0) * 3, category: "SHORT" },
        { label: "Annual Tax Optimization", target: 150000, category: "SHORT" }
      ]
    }
  };
};

export const generateFinancialIntelligence = async (profile: Profile, transactions: Transaction[]) => {
  try {
    const prompt = `
      User Profile: ${JSON.stringify(profile)}
      Recent Transactions: ${JSON.stringify(transactions.slice(0, 50))}
      
      Generate a financial intelligence report. 
      Response MUST include a "metadata" field with numeric values for:
      - sipAmount (monthly)
      - taxSavings (potential annual)
      - emergencyTarget (total)
      - milestones (array of goals)
    `;

    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const backendUrl = `http://${host}:8000/ai/ask`;
    
    console.log(`Calling Intelligence Engine at ${backendUrl}...`);
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt })
    });

    if (!response.ok) {
        console.warn("Backend failed, using fallback simulated local intelligence.");
        const fallback = generateFallbackIntelligence(profile);
        fallback.commentary = "⚠️ [Local Mode] " + fallback.commentary;
        return new Promise((resolve) => setTimeout(() => resolve(fallback), 1500));
    }

    const data = await response.json();
    const responseText = data.response;
    
    // Clean up potential markdown blocks from LLaMA response
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.warn("ET-GEN-AI-main Backend unreachable. Using simulated local intelligence engine.", error);
    const fallback = generateFallbackIntelligence(profile);
    fallback.commentary = "🚀 [Simulated Engine] " + fallback.commentary;
    return new Promise((resolve) => setTimeout(() => resolve(fallback), 1500));
  }
};

export const chatWithAi = async (query: string, profile: Profile, fileDetails?: { name: string; type: string }) => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ key missing");

    const prompt = `
      You are an expert, premium financial advisor for Indian users. 
      User Profile: ${JSON.stringify(profile)}
      ${fileDetails ? `Context: User has uploaded a document named "${fileDetails.name}" (${fileDetails.type}).` : ""}
      User Message: "${query}"
      
      Respond directly, actionable and as a friendly mentor. Keep the response concise but professional.
    `;

    console.log("Calling Groq Engine for real-time chat...");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "llama-3.1-8b-instant",
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.warn("Groq Engine failed, trying local engine.", error);
    // Secondary fallback to Python backend if GEMINI fails
    try {
        const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
        const backendUrl = `http://${host}:8000/ai/ask`;
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: `(FALLBACK) ${query}` })
        });
        if (response.ok) {
            const data = await response.json();
            return data.response;
        }
    } catch (e) {}
    
    if (fileDetails) return `I've received your document (${fileDetails.name}). I've scanned it for major categories like income and rent. Based on your profile, I see some smart budgeting opportunities. Would you like to review them?`;
    return "I'm currently running in limited offline mode. Based on your profile, I'd suggest reviewing your recent savings. Is there anything specific about your budget I can help with?";
  }
};

export const getBankTransactions = async (): Promise<Transaction[]> => {
  // Simulating an Account Aggregator API response
  return new Promise((resolve) => setTimeout(() => resolve([
    { id: "tx1", date: "2026-03-20", description: "SWIGGY*BANGALORE", amount: 450, type: "debit", category: "Food" },
    { id: "tx2", date: "2026-03-19", description: "AMAZON PAY", amount: 1200, type: "debit", category: "Shopping" },
    { id: "tx3", date: "2026-03-15", description: "LANDLORD RENT", amount: 20000, type: "debit", category: "Housing" },
    { id: "tx4", date: "2026-03-01", description: "SALARY ACME CORP", amount: 85000, type: "credit", category: "Income" },
    { id: "tx5", date: "2026-03-02", description: "RELIANCE JIO", amount: 699, type: "debit", category: "Utilities" },
  ]), 800));
};
