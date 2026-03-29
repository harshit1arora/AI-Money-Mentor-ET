import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Shield, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    income: "",
    expenses: "",
    savings: "",
    debt: "",
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const age = parseInt(form.age);
    const income = parseFloat(form.income);
    const expenses = parseFloat(form.expenses);
    const savings = parseFloat(form.savings) || (income - expenses);
    const debt = parseFloat(form.debt) || 0;

    if (isNaN(age) || isNaN(income) || isNaN(expenses)) {
      toast.error("Please enter valid numbers for age, income, and expenses.");
      return;
    }

    if (age <= 0 || income < 0 || expenses < 0) {
      toast.error("Values cannot be negative. Please check your entries.");
      return;
    }

    try {
      await saveProfile({
        full_name: form.fullName,
        age: age,
        monthly_income: income,
        monthly_expenses: expenses,
        savings: savings,
        debt: debt,
      });
      toast.success("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Could not save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary z-0" />
      <div className="absolute top-20 right-10 opacity-[0.04] z-0">
        <TrendingUp size={300} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-[0.04] z-0">
        <TrendingUp size={200} strokeWidth={0.5} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 relative z-10">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <TrendingUp size={18} className="text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground tracking-tight">
              AI Money Mentor
            </span>
          </div>
        </div>

        <div className="card-et p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-1 flex-1 bg-primary rounded-full" />
            <div className="h-1 flex-1 bg-border rounded-full" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
              Tell Us About You
            </h1>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              We'll create a personalized financial plan based on your details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
              <Input placeholder="Enter your full name" value={form.fullName} onChange={update("fullName")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" required />
            </div>
            <div>
              <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Age</label>
              <Input type="number" placeholder="Your age" value={form.age} onChange={update("age")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Monthly Income (₹)</label>
                <Input type="number" placeholder="e.g. 50,000" value={form.income} onChange={update("income")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" required />
              </div>
              <div>
                <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Monthly Expenses (₹)</label>
                <Input type="number" placeholder="e.g. 30,000" value={form.expenses} onChange={update("expenses")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Current Savings (₹)</label>
                <Input type="number" placeholder="Optional" value={form.savings} onChange={update("savings")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" />
              </div>
              <div>
                <label className="block text-xs font-body font-bold text-foreground mb-1.5 uppercase tracking-wider">Total Debt (₹)</label>
                <Input type="number" placeholder="Optional" value={form.debt} onChange={update("debt")} className="font-body h-11 bg-white border-2 border-slate-200 focus:border-primary text-foreground" />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full h-12 rounded-lg mt-6">
              Get My Financial Plan <ArrowRight size={16} />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1.5 text-xs font-body">
                <Shield size={13} /><span>Built for Indian users</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-xs font-body">
                <Sparkles size={13} /><span>Actionable insights</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4 font-body">
          No jargon • Powered by AI • 100% free
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
