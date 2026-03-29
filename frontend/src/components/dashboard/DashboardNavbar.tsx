import { TrendingUp, User, Settings, Search, Moon, Sun, AlertTriangle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const tabs = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Plan", path: "/my-plan" },
  { label: "Insights", path: "/insights" },
  { label: "Tax", path: "/tax" },
];

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { dark, toggle } = useTheme();
  const { isError } = useQuery({ queryKey: ["financialIntelligence"] });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Red top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-[hsl(var(--et-gold))] to-primary w-full shadow-sm" />
      <nav className="bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <TrendingUp size={13} className="text-primary-foreground" />
                </div>
                <span className="font-heading text-sm font-bold text-foreground">AI Money Mentor</span>
              </div>

              {/* Tabs */}
              <div className="hidden sm:flex items-center gap-0.5">
                {tabs.map((tab) => {
                  const isActive = location.pathname === tab.path;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => navigate(tab.path)}
                      className={`px-3 py-1.5 text-xs font-body font-medium rounded-full transition-all duration-300 relative ${
                        isActive
                          ? "text-primary font-bold bg-primary/10 shadow-inner"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isError && (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-body font-bold text-amber-700 uppercase tracking-wider animate-pulse">
                  <AlertTriangle size={10} />
                  Simulated Mode
                </div>
              )}
              <div className="hidden md:flex items-center gap-1.5 bg-secondary rounded-md px-2.5 py-1.5">
                <Search size={13} className="text-muted-foreground" />
                <input
                  placeholder="Search insights..."
                  className="bg-transparent text-xs font-body text-foreground placeholder:text-muted-foreground outline-none w-28"
                />
              </div>

              <button
                onClick={toggle}
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={13} className="text-warning" /> : <Moon size={13} className="text-muted-foreground" />}
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                >
                  <User size={13} className="text-muted-foreground" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-lg shadow-lg py-1 z-50 animate-scale-in">
                    <button onClick={() => { setShowMenu(false); navigate("/profile"); }} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-body text-foreground hover:bg-secondary transition-colors">
                      <Settings size={13} /> Profile Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavbar;
