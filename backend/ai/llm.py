import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

def ask_llama(query):
    # Optimized prompt for structured response with metadata
    prompt = f"""
    You are an expert financial advisor for Indian users.
    Generate a JSON report for: {query}
    
    Response MUST be valid JSON with this exact schema:
    {{
      "score": number,
      "insights": [{{ "type": "spending"|"portfolio"|"tax", "title": "string", "desc": "string" }}],
      "actionPlan": [{{ "label": "string", "sub": "string", "done": false }}],
      "commentary": "string",
      "metadata": {{
        "sipAmount": number,
        "taxSavings": number,
        "emergencyTarget": number,
        "milestones": [{{ "label": "string", "target": number, "category": "SHORT"|"MID"|"LONG" }}]
      }}
    }}
    """

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )

        data = response.json()

        # 🔍 DEBUG PRINT (VERY IMPORTANT)
        print("LLM RAW RESPONSE:", data)

        # ✅ Safe parsing
        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        elif "error" in data:
            return f"LLM Error: {data['error']['message']}"

        else:
            return f"Unexpected response: {data}"

    except Exception as e:
        return f"Exception: {str(e)}"