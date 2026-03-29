import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { generateFinancialIntelligence, getBankTransactions, Transaction } from "@/lib/ai-service";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Sparkles, TrendingUp, ArrowRight, AlertCircle, BarChart3, Send, ArrowUpRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Insights = () => {
  const { profile, loading: profileLoading } = useProfile();

  const { data: txs, isLoading: loadingTxs } = useQuery({
    queryKey: ["transactions"],
    queryFn: getBankTransactions
  });

  const { data: aiData, isLoading: loadingAi } = useQuery({
    queryKey: ["financialIntelligence", profile?.id],
    queryFn: async () => {
      if (!txs) return null;
      return await generateFinancialIntelligence(profile as any, txs);
    },
    enabled: !!profile && !profileLoading && !!txs,
  });

  const spendingData = useMemo(() => {
    if (!txs) return [];
    const categories: Record<string, number> = {};
    txs.forEach((t: Transaction) => {
      if (t.type === "debit") {
        const cat = t.category || "Others";
        categories[cat] = (categories[cat] || 0) + t.amount;
      }
    });
    
    const colors = ["hsl(358 79% 49%)", "hsl(0 0% 25%)", "hsl(0 0% 45%)", "hsl(0 0% 60%)", "hsl(0 0% 78%)"];
    return Object.entries(categories).map(([name, amount], i) => ({
      name,
      amount,
      fill: colors[i % colors.length]
    }));
  }, [txs]);

  if (profileLoading || loadingTxs || loadingAi || !aiData) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-body text-muted-foreground">Analyzing Financial Patterns...</p>
        </div>
      </div>
    );
  }

  const income = profile?.monthly_income ?? 0;
  const expenses = spendingData.reduce((s, item) => s + item.amount, 0);
  const savings = income - expenses;
  const savingsRate = Math.round((savings / (income || 1)) * 100);
  const debtExposure = Math.round(((profile?.debt || 0) / (income * 12 || 1)) * 100);

  const aiInsights = aiData.insights;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">

          {/* Header */}
          <motion.div variants={fadeUp}>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground italic">Insights & Trends</h1>
            <p className="text-sm font-body text-muted-foreground mt-1">
              An intelligent deep-dive into your financial habits. We've analyzed <span className="font-semibold text-foreground">142 transactions</span> from October to curate these patterns for you.
            </p>
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Spending + Peer */}
            <div className="lg:col-span-3 space-y-6">
              {/* Spending Composition */}
              <motion.div variants={fadeUp} className="card-et">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">Spending Composition</h2>
                    <p className="text-xs font-body text-muted-foreground">Monthly breakdown by primary category</p>
                  </div>
                  <div className="flex bg-secondary rounded-md p-0.5">
                    <button className="px-2.5 py-1 text-[10px] font-body font-medium bg-card text-foreground rounded shadow-sm">Monthly</button>
                    <button className="px-2.5 py-1 text-[10px] font-body font-medium text-muted-foreground">Quarterly</button>
                  </div>
                </div>

                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingData} barSize={40}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: 'hsl(0 0% 50%)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: 'hsl(0 0% 60%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid hsl(0 0% 90%)' }} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, '']} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {spendingData.map((entry, i) => (
                          <motion.rect key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {[
                    { label: "Food & Dining", color: "bg-primary" },
                    { label: "Housing", color: "bg-foreground" },
                    { label: "Lifestyle", color: "bg-muted-foreground" },
                    { label: "Utilities", color: "bg-et-gray" },
                  ].map((l, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground">
                      <span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Peer Comparison */}
              <motion.div variants={fadeUp} className="card-et">
                <h2 className="font-heading text-lg font-bold text-foreground mb-1">Peer Comparison</h2>
                <p className="text-xs font-body text-muted-foreground mb-4">How your portfolio stacks up against similar earners in your region.</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-heading font-bold text-success">{savingsRate}%</span>
                      <span className="text-[10px] font-body text-success font-medium uppercase">Your Status</span>
                    </div>
                    <p className="text-xs font-body font-semibold text-foreground">Savings Rate</p>
                    <p className="text-[10px] font-body text-success">Above Average</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: `${Math.min(100, savingsRate * 3)}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] font-body text-muted-foreground">
                      <span>Typical 15%</span>
                      <span>High Earners 30%+</span>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-heading font-bold text-foreground">{debtExposure}%</span>
                      <span className="text-[10px] font-body text-success font-medium uppercase">Your Status</span>
                    </div>
                    <p className="text-xs font-body font-semibold text-foreground">Debt Exposure</p>
                    <p className="text-[10px] font-body text-success">Low Risk</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-foreground rounded-full" style={{ width: `${debtExposure * 3}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] font-body text-muted-foreground">
                      <span>Low Risk {"<"} 10%</span>
                      <span>Reduced Avg 25%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Passive Income projection */}
              <motion.div variants={fadeUp} className="bg-foreground rounded-xl p-6 text-background">
                <p className="text-[10px] font-body uppercase tracking-widest text-background/40 mb-2">Evidence-Field Tracking</p>
                <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight mb-3">
                  Your passive income is projected to grow by <span className="text-gradient-red">14%</span> this fiscal year.
                </h3>
                <p className="text-sm font-body text-background/60 leading-relaxed mb-4">
                  Based on your recent rebalancing into high-yield REITs and the dividend history of your blue-chip holdings, we anticipate an additional inflow of ₹2,400 monthly starting from January.
                </p>
                <button className="flex items-center gap-1.5 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors">
                  View Projections <ArrowRight size={14} />
                </button>
              </motion.div>
            </div>

            {/* Right: AI Insights */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div variants={fadeUp}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles size={13} className="text-primary-foreground" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-foreground">AI Insights</h2>
                </div>

                <div className="space-y-3">
                  {aiInsights.map((insight, i) => (
                    <div key={i} className="card-et p-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${insight.color}`} />
                        <span className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-wider">{insight.type === "spending" ? "Spending Alert" : insight.type === "portfolio" ? "Portfolio Optimization" : "Tax Saving"}</span>
                      </div>
                      <h3 className="text-sm font-heading font-bold text-foreground mb-1">{insight.title}</h3>
                      <p className="text-xs font-body text-muted-foreground leading-relaxed">{insight.desc}</p>
                      {insight.type === "portfolio" && (
                        <button className="mt-2 text-xs font-body font-medium text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
                          Compare Funds <ArrowUpRight size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Weekly Brief */}
              <motion.div variants={fadeUp} className="bg-primary rounded-xl p-5">
                <h3 className="font-heading text-base font-bold text-primary-foreground mb-1">Weekly Brief</h3>
                <p className="text-xs font-body text-primary-foreground/70 mb-3">
                  Get curated financial editorial content delivered to your inbox every Sunday.
                </p>
                <div className="flex gap-2">
                  <input
                    placeholder="email@example.com"
                    className="flex-1 h-8 px-3 rounded-md bg-primary-foreground/10 text-xs font-body text-primary-foreground placeholder:text-primary-foreground/40 border border-primary-foreground/20 outline-none focus:border-primary-foreground/40"
                  />
                  <button className="w-8 h-8 rounded-md bg-primary-foreground flex items-center justify-center">
                    <Send size={12} className="text-primary" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Insights;
