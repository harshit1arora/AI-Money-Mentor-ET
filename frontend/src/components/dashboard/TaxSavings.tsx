import { useState, useEffect } from "react";
import { IndianRupee, ArrowUpRight, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  income: number;
}

interface TaxData {
  income: number;
  old_regime_tax: number;
  new_regime_tax: number;
  recommendation: "Old" | "New";
  savings: number;
}

const TaxSavings = ({ income }: Props) => {
  const [taxData, setTaxData] = useState<TaxData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTax = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tax/basic?income=${income * 12}`);
        if (response.ok) {
          const data = await response.json();
          setTaxData(data);
        }
      } catch (err) {
        console.error("Failed to fetch tax data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTax();
  }, [income]);

  const savingsValue = taxData ? taxData.savings : (income > 80000 ? 75000 : 50000);

  const suggestions = [
    { title: "Invest in ELSS", desc: "Section 80C tax-saving mutual fund" },
    { title: "Claim HRA", desc: "Reduction in rent exemption" },
    { title: "Use NPS Tier I", desc: "Additional 80CCD(1B) deduction" },
  ];

  return (
    <div className="card-et flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
          <IndianRupee size={13} className="text-primary-foreground" />
        </div>
        <h2 className="font-heading text-base font-bold text-foreground">Tax Pulse</h2>
      </div>

      {/* Alert banner */}
      <div className="bg-primary/[0.06] border border-primary/15 rounded-lg p-3.5 mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertTriangle size={12} className="text-primary" />
          <span className="text-[10px] font-body font-semibold text-primary uppercase tracking-wider">Alert</span>
        </div>
        <p className="text-[10px] font-body text-muted-foreground mb-0.5">Potential Annual Tax Savings:</p>
        <p className={`text-2xl font-heading font-bold text-gradient-red ${loading ? 'animate-pulse' : ''}`}>
          {loading ? '...' : `₹${savingsValue.toLocaleString("en-IN")}`}
        </p>
        {taxData && (
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-body text-primary font-medium">
            <CheckCircle2 size={10} />
            Recommended: {taxData.recommendation} Regime
          </div>
        )}
      </div>

      <div className="space-y-3 mb-5">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group cursor-default">
            <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
              <IndianRupee size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-body font-semibold text-foreground leading-tight mb-0.5">{s.title}</p>
              <p className="text-[10px] font-body text-muted-foreground leading-snug">{s.desc}</p>
            </div>
            <ArrowUpRight size={12} className="text-muted-foreground/50 mt-1" />
          </div>
        ))}
      </div>

      <Link to="/tax">
        <Button className="w-full h-11 font-body font-bold text-xs uppercase tracking-wider gap-2 shadow-lg shadow-primary/20">
          <FileText size={14} />
          Optimize My Taxes
        </Button>
      </Link>
    </div>
  );
};

export default TaxSavings;
