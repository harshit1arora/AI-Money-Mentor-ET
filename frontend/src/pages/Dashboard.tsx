import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import HeroSummary from "@/components/dashboard/HeroSummary";
import ActionPlan from "@/components/dashboard/ActionPlan";
import GrowthChart from "@/components/dashboard/GrowthChart";
import AiChat from "@/components/dashboard/AiChat";
import TaxSavings from "@/components/dashboard/TaxSavings";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { generateFinancialIntelligence, getBankTransactions } from "@/lib/ai-service";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Dashboard = () => {
  const { profile, loading: profileLoading } = useProfile();
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  // Live Data Fetching with TanStack Query
  const { 
    data: aiData, 
    isLoading: loadingAi, 
    isError, 
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["financialIntelligence", profile?.id],
    queryFn: async () => {
      if (!profile) throw new Error("Profile not loaded");
      const txs = await getBankTransactions();
      return await generateFinancialIntelligence(profile as any, txs);
    },
    enabled: !!profile && !profileLoading,
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    meta: {
      onSuccess: () => setLastUpdated(new Date())
    }
  });

  // Handle errors gracefully
  useEffect(() => {
    if (isError) {
      toast.error("Failed to sync live data. Using cached intelligence.", {
        description: (error as Error).message
      });
    }
  }, [isError, error]);

  if (profileLoading || (loadingAi && !aiData)) {
    return (
      <div className="min-h-screen bg-secondary/30 flex flex-col" role="status" aria-label="Loading Dashboard">
        <DashboardNavbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
          <div className="h-48 glass-panel rounded-xl animate-pulse flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="font-body text-sm text-muted-foreground">Syncing Secure Financial Data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-white/50 rounded-xl animate-pulse" />
            <div className="h-32 bg-white/50 rounded-xl animate-pulse" />
            <div className="h-32 bg-white/50 rounded-xl animate-pulse" />
          </div>
          <div className="h-64 bg-white/50 rounded-xl animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  const income = profile?.monthly_income ?? 0;
  const expenses = profile?.monthly_expenses ?? 0;
  const savings = income - expenses;
  
  // Dynamic extraction from metadata
  const sipAmount = aiData?.metadata?.sipAmount ?? Math.round(savings * 0.4);
  const emergencyFund = aiData?.metadata?.emergencyTarget ?? Math.round(savings * 0.2);
  const score = aiData?.score ?? 0;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col relative overflow-hidden font-body">
      {/* WCAG Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white">
        Skip to main content
      </a>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <DashboardNavbar />
      
      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Financial Command Center</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
              Last synced: {lastUpdated.toLocaleTimeString()} (Auto-refreshes every 30s)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => refetch()}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp}>
             <HeroSummary score={score} savings={savings} sipAmount={sipAmount} name={profile?.full_name ?? "User"} aiInsight={aiData?.commentary} />
          </motion.div>
          
          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActionPlan sipAmount={sipAmount} emergencyFund={emergencyFund} savings={savings} customActions={aiData?.actionPlan} />
            </div>
            <div>
              <TaxSavings income={income} />
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeUp} className="h-full">
               <GrowthChart savings={savings} sipAmount={sipAmount} />
            </motion.div>
            <motion.div variants={fadeUp} className="h-full">
              <AiChat income={income} expenses={expenses} sipAmount={sipAmount} />
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
