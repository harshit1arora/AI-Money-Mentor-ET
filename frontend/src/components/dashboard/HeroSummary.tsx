import { PiggyBank, TrendingUp, Shield, ArrowUp } from "lucide-react";

interface Props {
  score: number;
  savings: number;
  sipAmount: number;
  name: string;
  aiInsight?: string;
}

const HeroSummary = ({ score, savings, sipAmount, name, aiInsight }: Props) => {
  const riskLevel = score > 70 ? "Low" : score > 45 ? "Moderate" : "High";
  const scoreColor = score > 70 ? "text-success" : score > 45 ? "text-warning" : "text-primary";

  return (
    <div className="card-et p-0 overflow-hidden relative group">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Red header band */}
      <div className="bg-gradient-to-r from-primary to-[hsl(var(--et-gold))] px-6 py-4 sm:px-8 sm:py-5 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
        <p className="text-primary-foreground/80 text-[10px] font-body uppercase tracking-widest mb-1 shadow-sm">Current Assessment</p>
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground drop-shadow-md">
          Your Money<br />Health Score
        </h2>
      </div>

      <div className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Score */}
          <div className="flex-shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-heading font-bold text-foreground">{score}</span>
              <span className="text-xl font-heading text-muted-foreground">/100</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUp size={12} className="text-success" />
              <span className="text-xs font-body text-success font-medium">Up 4 points since last month</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-20 bg-border self-center" />

          {/* Stats row */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">Monthly Savings</p>
              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">₹{savings.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">Investment SIP</p>
              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">₹{sipAmount.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-1">Risk Appetite</p>
              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">{riskLevel}</p>
            </div>
          </div>
        </div>

        {/* AI insight */}
        <div className="mt-6 p-4 bg-gradient-to-r from-secondary/80 to-secondary/40 backdrop-blur-sm rounded-xl border border-border/60 shadow-inner relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-[hsl(var(--et-gold))]" />
          <p className="text-xs font-body text-muted-foreground leading-relaxed pl-2">
            <span className="font-semibold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-[hsl(var(--et-gold))] mr-1">AI Insight:</span>
             {aiInsight || "Your current trajectory suggests a healthy buffer for emergencies, but your equity exposure is slightly below the recommended curve for your age group."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSummary;
