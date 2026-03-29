import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Scale, FileCheck, ClipboardList, ChevronDown, ChevronUp, Check, Info, ArrowRight, Shield, Calculator, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { generateTaxReport } from "@/lib/pdf-service";

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ── Tax slab data ── */
const oldSlabs = [
  { range: "₹0 – ₹2.5L", rate: "Nil" },
  { range: "₹2.5L – ₹5L", rate: "5%" },
  { range: "₹5L – ₹10L", rate: "20%" },
  { range: "Above ₹10L", rate: "30%" },
];
const newSlabs = [
  { range: "₹0 – ₹3L", rate: "Nil" },
  { range: "₹3L – ₹7L", rate: "5%" },
  { range: "₹7L – ₹10L", rate: "10%" },
  { range: "₹10L – ₹12L", rate: "15%" },
  { range: "₹12L – ₹15L", rate: "20%" },
  { range: "Above ₹15L", rate: "30%" },
];

/* ── Deduction sections ── */
const deductionSections = [
  {
    title: "Section 80C",
    limit: 150000,
    items: [
      { id: "elss", label: "ELSS Mutual Funds", typical: 50000 },
      { id: "ppf", label: "PPF Contribution", typical: 50000 },
      { id: "lic", label: "Life Insurance Premium", typical: 25000 },
      { id: "tuition", label: "Children Tuition Fees", typical: 25000 },
    ],
  },
  {
    title: "Section 80D",
    limit: 75000,
    items: [
      { id: "health_self", label: "Health Insurance (Self & Family)", typical: 25000 },
      { id: "health_parents", label: "Health Insurance (Parents)", typical: 50000 },
    ],
  },
  {
    title: "Other Deductions",
    limit: 200000,
    items: [
      { id: "nps", label: "NPS – 80CCD(1B)", typical: 50000 },
      { id: "hra", label: "HRA Exemption", typical: 100000 },
      { id: "home_loan", label: "Home Loan Interest – 24(b)", typical: 200000 },
      { id: "education_loan", label: "Education Loan Interest – 80E", typical: 40000 },
    ],
  },
];

/* ── Filing checklist ── */
const filingChecklist = [
  { id: "f1", label: "Collect Form 16 from employer", category: "Documents" },
  { id: "f2", label: "Download AIS / TIS from Income Tax portal", category: "Documents" },
  { id: "f3", label: "Gather investment proofs (80C, 80D, NPS)", category: "Documents" },
  { id: "f4", label: "Verify Form 26AS for TDS credits", category: "Verification" },
  { id: "f5", label: "Reconcile bank interest with TDS", category: "Verification" },
  { id: "f6", label: "Choose Old vs New regime", category: "Decision" },
  { id: "f7", label: "Compute tax liability / refund", category: "Computation" },
  { id: "f8", label: "File ITR on income tax portal", category: "Filing" },
  { id: "f9", label: "E-verify return within 30 days", category: "Post-Filing" },
  { id: "f10", label: "Save acknowledgement (ITR-V)", category: "Post-Filing" },
];

const categoryColors: Record<string, string> = {
  Documents: "bg-primary/10 text-primary",
  Verification: "bg-warning/10 text-warning",
  Decision: "bg-accent text-accent-foreground",
  Computation: "bg-success/10 text-success",
  Filing: "bg-primary/10 text-primary",
  "Post-Filing": "bg-muted text-muted-foreground",
};

/* ── Helpers ── */
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const calcOldTax = (income: number, deductions: number) => {
  const taxable = Math.max(0, income - deductions - 50000); // std deduction
  if (taxable <= 250000) return 0;
  if (taxable <= 500000) return (taxable - 250000) * 0.05;
  if (taxable <= 1000000) return 12500 + (taxable - 500000) * 0.2;
  return 112500 + (taxable - 1000000) * 0.3;
};

const calcNewTax = (income: number) => {
  const taxable = Math.max(0, income - 75000); // new std deduction
  if (taxable <= 300000) return 0;
  if (taxable <= 700000) return (taxable - 300000) * 0.05;
  if (taxable <= 1000000) return 20000 + (taxable - 700000) * 0.1;
  if (taxable <= 1200000) return 50000 + (taxable - 1000000) * 0.15;
  if (taxable <= 1500000) return 80000 + (taxable - 1200000) * 0.2;
  return 140000 + (taxable - 1500000) * 0.3;
};

const Tax = () => {
  const { profile, loading } = useProfile();
  const annualIncome = (profile?.monthly_income ?? 50000) * 12;

  /* Deduction tracker state */
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>("Section 80C");

  const totalDeductions = deductionSections.reduce((sum, sec) => {
    const sectionTotal = sec.items
      .filter((i) => claimed[i.id])
      .reduce((s, i) => s + i.typical, 0);
    return sum + Math.min(sectionTotal, sec.limit);
  }, 0);

  const oldTax = calcOldTax(annualIncome, totalDeductions);
  const newTax = calcNewTax(annualIncome);
  const betterRegime = oldTax <= newTax ? "Old" : "New";
  const savings = Math.abs(oldTax - newTax);

  /* Filing checklist state */
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const filingProgress = Math.round((checkedCount / filingChecklist.length) * 100);

  const handleDownloadReport = () => {
    const claimedList = deductionSections.flatMap(sec => 
      sec.items
        .filter(i => claimed[i.id])
        .map(i => ({ label: i.label, amount: i.typical }))
    );

    generateTaxReport({
      name: profile?.full_name || "User",
      annualIncome,
      totalDeductions,
      oldTax,
      newTax,
      betterRegime,
      savings,
      claimedDeductions: claimedList,
      aiInsight: betterRegime === "Old"
        ? `With ${fmt(totalDeductions)} in deductions, the Old Regime saves you ${fmt(Math.round(savings))}. Consider maximizing Section 80C to its ₹1.5L limit for even greater savings.`
        : `The New Regime is simpler and saves you ${fmt(Math.round(savings))} at your current deduction level. If you increase deductions beyond ${fmt(Math.round(newTax * 3))}, re-evaluate the Old Regime.`
    });
  };

  // Break-even analysis data
  const breakEvenData = useMemo(() => {
    const points = [];
    const maxDeduction = 450000; // 1.5L (80C) + 50k (80D) + 2L (Interest) + 50k (NPS)
    for (let d = 0; d <= maxDeduction; d += 50000) {
      points.push({
        deduction: d / 1000,
        oldTax: calcOldTax(annualIncome, d),
        newTax: calcNewTax(annualIncome),
      });
    }
    return points;
  }, [annualIncome]);

  const currentDeductionK = totalDeductions / 1000;

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">

          {/* ── Hero Banner ── */}
          <motion.div variants={fadeUp} className="card-et overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-[10px] font-body font-semibold text-primary uppercase tracking-wider mb-1">Tax Planning Centre</p>
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-foreground">FY 2025-26 Tax Optimizer</h1>
                <p className="text-xs font-body text-muted-foreground mt-1">Annual Income: <span className="font-semibold text-foreground">{fmt(annualIncome)}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 rounded-lg bg-secondary">
                  <p className="text-[10px] font-body text-muted-foreground">Deductions Claimed</p>
                  <p className="text-lg font-heading font-bold text-foreground">{fmt(totalDeductions)}</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg bg-primary/5 border border-primary/15">
                  <p className="text-[10px] font-body text-primary">Best Regime</p>
                  <p className="text-lg font-heading font-bold text-primary">{betterRegime}</p>
                </div>
                <Button variant="outline" size="sm" className="h-10 px-4 flex items-center gap-2 border-primary/20 hover:bg-primary/5 text-primary" onClick={handleDownloadReport}>
                  <Download size={16} />
                  <span className="hidden sm:inline">Export PDF</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── Regime Comparison ── */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3">
              <Scale size={16} className="text-primary" />
              <h2 className="font-heading text-base font-bold text-foreground">Old vs New Regime</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old Regime */}
              <div className={`card-et relative ${betterRegime === "Old" ? "ring-2 ring-primary/30" : ""}`}>
                {betterRegime === "Old" && (
                  <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[9px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Recommended</span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-muted-foreground" />
                  <h3 className="font-heading text-sm font-bold text-foreground">Old Regime</h3>
                </div>
                <div className="space-y-1.5 mb-4">
                  {oldSlabs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-body">
                      <span className="text-muted-foreground">{s.range}</span>
                      <span className="font-semibold text-foreground">{s.rate}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body text-muted-foreground">Estimated Tax</span>
                    <span className="text-lg font-heading font-bold text-foreground">{fmt(Math.round(oldTax))}</span>
                  </div>
                  <p className="text-[10px] font-body text-muted-foreground mt-1">After {fmt(totalDeductions)} deductions + ₹50K std deduction</p>
                </div>
              </div>

              {/* New Regime */}
              <div className={`card-et relative ${betterRegime === "New" ? "ring-2 ring-primary/30" : ""}`}>
                {betterRegime === "New" && (
                  <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[9px] font-body font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Recommended</span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <Calculator size={14} className="text-muted-foreground" />
                  <h3 className="font-heading text-sm font-bold text-foreground">New Regime</h3>
                </div>
                <div className="space-y-1.5 mb-4">
                  {newSlabs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-body">
                      <span className="text-muted-foreground">{s.range}</span>
                      <span className="font-semibold text-foreground">{s.rate}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-body text-muted-foreground">Estimated Tax</span>
                    <span className="text-lg font-heading font-bold text-foreground">{fmt(Math.round(newTax))}</span>
                  </div>
                  <p className="text-[10px] font-body text-muted-foreground mt-1">₹75K standard deduction only</p>
                </div>
              </div>
            </div>

            {/* Savings callout */}
            <div className="mt-3 p-3 rounded-lg bg-primary/[0.04] border border-primary/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <IndianRupee size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-body font-semibold text-foreground">
                  You save <span className="text-primary">{fmt(Math.round(savings))}</span> with the <span className="text-primary font-bold">{betterRegime} Regime</span>
                </p>
                <p className="text-[10px] font-body text-muted-foreground">Toggle deductions below to see how your recommendation changes</p>
              </div>
            </div>

            {/* Break-even Chart */}
            <div className="mt-4 card-et p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-primary" />
                <h3 className="font-heading text-sm font-bold text-foreground">Regime Break-even Analysis</h3>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={breakEvenData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="deduction" 
                      label={{ value: "Deductions (₹k)", position: "insideBottom", offset: -5, fontSize: 10 }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      formatter={(v: any) => [`₹${v.toLocaleString()}`, ""]}
                      labelFormatter={(l) => `Deductions: ₹${l}k`}
                      contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="oldTax" name="Old Regime" stroke="#2563eb" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="newTax" name="New Regime" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <ReferenceLine x={currentDeductionK} stroke="#ef4444" label={{ value: "Current", position: "top", fontSize: 10, fill: "#ef4444" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] font-body text-muted-foreground mt-2 text-center italic">
                The red line shows your current deduction level of {fmt(totalDeductions)}.
              </p>
            </div>
          </motion.div>

          {/* ── Deduction Tracker ── */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                <h2 className="font-heading text-base font-bold text-foreground">Deduction Optimization</h2>
              </div>
              <div className="text-[10px] font-body font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">
                Max Limit: {fmt(425000)}
              </div>
            </div>

            {/* Optimization Progress Meter */}
            <div className="card-et mb-4 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body text-muted-foreground">Total Potential Deductions</span>
                <span className="text-xs font-body font-bold text-foreground">{fmt(totalDeductions)} / {fmt(425000)}</span>
              </div>
              <Progress value={(totalDeductions / 425000) * 100} className="h-2 mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body font-bold text-foreground uppercase tracking-wider mb-0.5">Opportunity</p>
                    <p className="text-[11px] font-body text-muted-foreground">Invest ₹{(150000 - (deductionSections[0].items.filter(i => claimed[i.id]).reduce((s, i) => s + i.typical, 0))).toLocaleString()} more in 80C to maximize tax benefits.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Shield size={14} className="text-success" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body font-bold text-success uppercase tracking-wider mb-0.5">Tax Saved</p>
                    <p className="text-[11px] font-body text-muted-foreground">Your current deductions save you approximately {fmt(totalDeductions * 0.2)} in tax liability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {deductionSections.map((sec) => {
                const isOpen = expandedSection === sec.title;
                const sectionClaimed = sec.items.filter((i) => claimed[i.id]).reduce((s, i) => s + i.typical, 0);
                const utilization = Math.min(100, Math.round((sectionClaimed / sec.limit) * 100));
                return (
                  <div key={sec.title} className="card-et">
                    <button
                      onClick={() => setExpandedSection(isOpen ? null : sec.title)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading text-sm font-bold text-foreground">{sec.title}</h3>
                        <span className="text-[10px] font-body text-muted-foreground">Limit: {fmt(sec.limit)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 w-32">
                          <Progress value={utilization} className="h-1.5" />
                          <span className="text-[10px] font-body text-muted-foreground w-8">{utilization}%</span>
                        </div>
                        {isOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2.5">
                        {sec.items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                          >
                            <Checkbox
                              checked={!!claimed[item.id]}
                              onCheckedChange={(v) => setClaimed((p) => ({ ...p, [item.id]: !!v }))}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-body font-medium text-foreground">{item.label}</p>
                            </div>
                            <span className="text-xs font-body font-semibold text-foreground">{fmt(item.typical)}</span>
                          </label>
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-[10px] font-body text-muted-foreground">Section total</span>
                          <span className="text-sm font-heading font-bold text-foreground">{fmt(Math.min(sectionClaimed, sec.limit))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Filing Checklist ── */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-primary" />
                <h2 className="font-heading text-base font-bold text-foreground">ITR Filing Checklist</h2>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={filingProgress} className="w-24 h-1.5" />
                <span className="text-[10px] font-body font-semibold text-muted-foreground">{checkedCount}/{filingChecklist.length}</span>
              </div>
            </div>
            <div className="card-et">
              <div className="space-y-1">
                {filingChecklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                      checked[item.id] ? "bg-success/[0.04]" : "hover:bg-secondary/50"
                    }`}
                  >
                    <Checkbox
                      checked={!!checked[item.id]}
                      onCheckedChange={(v) => setChecked((p) => ({ ...p, [item.id]: !!v }))}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-body font-medium ${checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {item.label}
                      </p>
                    </div>
                    <span className={`text-[9px] font-body font-semibold px-2 py-0.5 rounded-full ${categoryColors[item.category] ?? "bg-muted text-muted-foreground"}`}>
                      {item.category}
                    </span>
                  </label>
                ))}
              </div>
              {filingProgress === 100 && (
                <div className="mt-4 p-3 rounded-lg bg-success/[0.06] border border-success/15 flex items-center gap-2">
                  <Check size={14} className="text-success" />
                  <p className="text-xs font-body font-semibold text-success">All steps complete — you're ready to file!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI tip */}
          <motion.div variants={fadeUp} className="p-4 rounded-lg bg-foreground text-background flex items-start gap-3">
            <Info size={14} className="mt-0.5 shrink-0 opacity-60" />
            <div>
              <p className="text-xs font-body font-semibold mb-0.5">AI Tax Insight</p>
              <p className="text-[11px] font-body opacity-80">
                {betterRegime === "Old"
                  ? `With ${fmt(totalDeductions)} in deductions, the Old Regime saves you ${fmt(Math.round(savings))}. Consider maximizing Section 80C to its ₹1.5L limit for even greater savings.`
                  : `The New Regime is simpler and saves you ${fmt(Math.round(savings))} at your current deduction level. If you increase deductions beyond ${fmt(Math.round(newTax * 3))}, re-evaluate the Old Regime.`}
              </p>
            </div>
          </motion.div>

        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Tax;
