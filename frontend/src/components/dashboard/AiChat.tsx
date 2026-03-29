import { useState, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { chatWithAi } from "@/lib/ai-service";
import { useProfile } from "@/hooks/useProfile";

interface Props {
  income: number;
  expenses: number;
  sipAmount: number;
}

const AiChat = ({ income, expenses, sipAmount }: Props) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState([
    { role: "ai" as const, text: "Hi! I'm your AI Wealth Assistant. Ask me anything about your SIPs, savings, or tax planning!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const send = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user" as const, text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await chatWithAi(userMessage, profile as any);
      setMessages((prev) => [...prev, { role: "ai" as const, text: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "ai" as const, text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="card-et flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <Sparkles size={13} className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-base font-bold text-foreground">Wealth Assistant</h2>
          <p className="text-[10px] font-body text-success font-medium">● LIVE AI SESSION</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={10} className="text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] px-3 py-2.5 text-xs font-body leading-relaxed whitespace-pre-line ${
              msg.role === "user"
                ? "bg-foreground text-background rounded-2xl rounded-br-sm"
                : "bg-primary/[0.06] text-foreground rounded-2xl rounded-bl-sm border border-primary/10"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 justify-start">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={10} className="text-primary" />
            </div>
            <div className="bg-primary/[0.06] text-foreground rounded-2xl rounded-bl-sm border border-primary/10 px-3 py-2.5 text-xs font-body animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your finances..."
          className="flex-1 h-9 px-3 rounded-lg bg-secondary border border-border text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <button onClick={send} className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
          <Send size={13} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AiChat;
