import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Volume2, Paperclip, FileUp, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { chatWithAi } from "@/lib/ai-service";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI Money Mentor. How can I help you with your finances today? You can also upload bank statements for analysis!" }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported in this browser.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File details: Too large. Limit is 5MB.");
      return;
    }

    setMessages(prev => [...prev, { role: "user", text: `📎 Uploaded: ${file.name}` }]);
    setLoading(true);
    
    // Call AI with file context
    const aiResponse = await chatWithAi(`Please analyze this document: ${file.name}`, profile || { full_name: "User", age: null, monthly_income: 0, monthly_expenses: 0 }, { name: file.name, type: file.type });
    
    setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const aiResponse = await chatWithAi(userMsg, profile || { full_name: "User", age: null, monthly_income: 0, monthly_expenses: 0 });
    
    setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, rotate: 5, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100, rotate: 5, transition: { duration: 0.15 } }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="mb-4 w-[350px] sm:w-[420px] h-[580px] glass-panel rounded-[2rem] shadow-elevated flex flex-col overflow-hidden border-primary/20"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary to-primary/90 flex items-center justify-between text-primary-foreground shadow-lg relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner group">
                  <Zap size={24} className="fill-current animate-[pulse_2s_infinite] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base tracking-tight leading-none mb-1">AI Money Mentor</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    <span className="text-[11px] opacity-90 font-medium uppercase tracking-wider">Neural Engine Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setIsOpen(false);
                }} 
                className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/40 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1 border border-primary/5 shadow-sm">
                      <Bot size={16} className="text-primary" />
                    </div>
                  )}
                  <div className="relative group max-w-[85%]">
                    <div className={`px-4 py-3 rounded-2xl text-sm font-body leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none text-right"
                        : "bg-white border border-border/60 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === "ai" && (
                      <button 
                        onClick={() => speakText(msg.text)}
                        className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-secondary transition-all text-muted-foreground hover:text-primary"
                        title="Listen to response"
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-primary" />
                  </div>
                  <div className="bg-white border border-border/60 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center shadow-sm">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-border flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.csv"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-90"
                title="Upload document"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your mentor anything..."
                className="flex-1 bg-secondary border border-border/50 rounded-2xl px-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors text-foreground shadow-inner"
              />
              <button 
                onClick={handleSend} 
                className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground hover:shadow-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                disabled={loading}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary rounded-2xl shadow-glow flex items-center justify-center text-primary-foreground hover:scale-110 active:scale-95 transition-all duration-500 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
        
        {isOpen ? (
          <X size={28} />
        ) : (
          <div className="relative">
            <MessageSquare size={30} className="relative z-10" />
            <Sparkles size={16} className="absolute -top-3 -right-3 text-white fill-current animate-pulse delay-75" />
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingChatbot;
