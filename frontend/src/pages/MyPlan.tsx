import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { generateFinancialIntelligence, getBankTransactions } from "@/lib/ai-service";
import { TrendingUp, Target, Heart, GraduationCap, Home, CheckCircle2, Plus, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const MyPlan = () => {
  const { profile, loading: profileLoading } = useProfile();

  const { data: aiData, isLoading: loadingAi } = useQuery({
    queryKey: ["financialIntelligence", profile?.id],
    queryFn: async () => {
      const txs = await getBankTransactions();
      return await generateFinancialIntelligence(profile as any, txs);
    },
    enabled: !!profile && !profileLoading,
  });

  if (profileLoading || loadingAi || !aiData) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-body text-muted-foreground">Architecting Your Roadmap...</p>
        </div>
      </div>
    );
  }

  const income = profile?.monthly_income ?? 0;
  const expenses = profile?.monthly_expenses ?? 0;
  const savings = income - expenses;
  const planScore = aiData.score;

  const milestones = aiData.metadata?.milestones?.map((m: any) => ({
    icon: m.category === "SHORT" ? Target : m.category === "MID" ? GraduationCap : Home,
    label: m.label,
    category: `${m.category} TERM`,
    target: m.target,
    saved: Math.round(m.target * (Math.random() * 0.5 + 0.1)), // Mocking saved progress
    pct: Math.round(Math.random() * 40 + 10),
    tip: aiData.insights.find((i: any) => i.type === "portfolio")?.desc || ""
  })) || [
    { icon: Target, label: "Emergency Fund", category: "SHORT TERM", target: aiData.metadata?.emergencyTarget || 100000, saved: 0, pct: 0, tip: "Prioritize this first." }
  ];

  const allocation = [
    { name: "Equity", value: 58, color: "hsl(358 79% 49%)" },
    { name: "Debt", value: 20, color: "hsl(0 0% 30%)" },
    { name: "Gold", value: 12, color: "hsl(38 92% 50%)" },
    { name: "Cash", value: 10, color: "hsl(0 0% 80%)" },
  ];

  const quarterActions = [
    { label: "Increase SIP for Index Fund by 10%", sub: "Due: April 15 · To combat inflation strategy", done: true },
    { label: "Review Term Insurance Nominee", sub: "Due: May 01 · Annual recommendation check", done: false },
    { label: "Lump sum Gold ETF purchase", sub: "Due: June 30 · Rebalance target allocation", done: false },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">

          {/* Hero */}
          <motion.div variants={fadeUp}>
            <p className="text-[10px] font-body text-primary uppercase tracking-widest font-medium mb-1">Strategic Roadmap 2024–2045</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                  Building Your <span className="italic">Legacy</span>.
                </h1>
                <p className="text-sm font-body text-muted-foreground mt-2 italic max-w-md">
                  "Wealth is not just what you earn, but the clarity of the path you carve through time."
                </p>
              </div>
              <div className="card-et p-4 sm:min-w-[200px]">
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">Plan Health Score</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-heading font-bold text-foreground">{planScore}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${planScore}%` }} />
                </div>
                <p className="text-[10px] font-body text-muted-foreground mt-1">Updated via AI Insight Engine</p>
              </div>
            </div>
          </motion.div>

          {/* Milestones + Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Milestones */}
            <motion.div variants={fadeUp} className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-foreground">Financial Milestones</h2>
                <button className="flex items-center gap-1 text-xs font-body font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={13} /> Add New Goal
                </button>
              </div>

              {milestones.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="card-et relative">
                    {/* Timeline dot */}
                    <div className="absolute left-[-20px] top-6 w-3 h-3 rounded-full border-2 border-primary bg-card hidden lg:block" />
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{m.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Icon size={16} className="text-primary" />
                          <h3 className="font-heading text-base font-bold text-foreground">{m.label}</h3>
                        </div>
                      </div>
                      <p className="text-lg font-heading font-bold text-foreground">₹{m.target.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${m.pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-body text-muted-foreground">
                      <span>{m.pct}% Complete</span>
                      <span>₹{m.saved.toLocaleString("en-IN")} Saved</span>
                    </div>
                    {m.tip && (
                      <div className="mt-3 p-2.5 bg-primary/[0.04] rounded border border-primary/10">
                        <p className="text-[10px] font-body text-muted-foreground">
                          <span className="text-primary font-semibold">AI Tip:</span> {m.tip}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* Right column */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
              {/* Allocation */}
              <div className="card-et">
                <h2 className="font-heading text-base font-bold text-foreground mb-4">Current Allocation</h2>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={allocation} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={2} stroke="hsl(0 0% 100%)">
                          {allocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-body text-muted-foreground">EQUITY</span>
                      <span className="text-lg font-heading font-bold text-foreground">58%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {allocation.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
                        <span className="text-xs font-body text-foreground">{a.name}</span>
                        <span className="text-xs font-body font-semibold text-muted-foreground ml-auto">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-4 py-2 text-xs font-body font-medium text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                  Rebalance Portfolio
                </button>
              </div>

              {/* Quarterly action */}
              <div className="card-et">
                <h2 className="font-heading text-base font-bold text-foreground mb-3">Q2 Action Plan</h2>
                <div className="space-y-2.5">
                  {quarterActions.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        a.done ? "bg-success border-success" : "border-border"
                      }`}>
                        {a.done && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-foreground" /></svg>}
                      </div>
                      <div>
                        <p className={`text-xs font-body font-medium ${a.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{a.label}</p>
                        <p className="text-[10px] font-body text-muted-foreground">{a.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Editorial Commentary */}
          <motion.div variants={fadeUp}>
            <div className="bg-foreground rounded-xl p-6 sm:p-8 text-background">
              <p className="text-[10px] font-body uppercase tracking-widest text-background/50 mb-3">Editorial Commentary</p>
              <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight mb-3">
                The Power of Compound Discipline:<br />
                Why your plan is ahead of the curve.
              </h3>
              <p className="text-sm font-body text-background/70 leading-relaxed max-w-2xl mb-4">
                Your adherence to the 'Debt-First' strategy in Q1 has reduced your interest liability by 14%. This 'silent gain' is now being funneled into high-alpha assets, effectively accelerating your education fund by 8 months.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-body font-semibold text-background">AI Money Mentor</p>
                  <p className="text-[10px] font-body text-background/50">Daily Wealth Intelligence Report</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPlan;
