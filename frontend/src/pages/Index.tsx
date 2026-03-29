import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Sparkles, ArrowRight, BarChart3, Target, Bot, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate("/onboarding");
  };

  const features = [
    { icon: BarChart3, title: "Smart Dashboard", desc: "See your complete financial picture at a glance with health scores and insights" },
    { icon: Target, title: "Action Plans", desc: "Get personalized monthly action items to grow your wealth systematically" },
    { icon: Bot, title: "AI Advisor", desc: "Ask questions about SIPs, tax saving, insurance — get instant answers" },
    { icon: Shield, title: "Tax Optimization", desc: "Never miss a deduction. Save lakhs with smart tax planning strategies" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[hsl(var(--et-gold))]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-[hsl(var(--et-gold))] to-primary shadow-sm z-50" />

      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative z-40 bg-background/50 backdrop-blur-md sticky top-0 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <TrendingUp size={18} className="text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground">AI Money Mentor</span>
        </div>
        <Button variant="hero" size="sm" onClick={handleCTA}>
          Get Started
          <ArrowRight size={14} />
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left max-w-3xl lg:max-w-none mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-body font-bold px-4 py-2 rounded-full mb-8 shadow-sm backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-primary animate-pulse" />
              Built for Indian middle-class users
            </motion.div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl lg:leading-[1.1] font-extrabold text-foreground leading-[1.1] mb-8 tracking-tight">
              Your Personal AI Advisor for{" "}
              <span className="text-gradient-red relative inline-block">
                Smarter Money
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[hsl(var(--et-gold))]/20 -z-10 rounded-full blur-sm" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl font-body text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
              No jargon. No confusing charts. Just clear, actionable financial advice
              tailored to your income, expenses, and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <Button variant="hero" size="lg" className="h-14 px-10 text-base shadow-glow hover:shadow-lg transition-all duration-300 relative group overflow-hidden" onClick={handleCTA}>
                <span className="relative z-10 flex items-center gap-2">Start Free — No Card Needed <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
              <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <Shield size={13} />
                <span>Bank-grade security</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <Sparkles size={13} />
                <span>AI-powered insights</span>
              </div>
              <span className="text-border hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <TrendingUp size={13} />
                <span>100% free</span>
              </div>
            </div>
          </motion.div>

          {/* Right Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex-1 w-full max-w-md lg:max-w-none mx-auto relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
            <img 
              src="/hero-image.png" 
              alt="AI Money Mentor 3D Cyber" 
              className="w-full h-auto drop-shadow-2xl rounded-2xl animate-[slide-up_4s_ease-in-out_infinite_alternate]"
            />
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Everything You Need to Win Financially
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              Simple tools that make complex money decisions easy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-et group hover:border-primary/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
                    <Icon size={100} />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">{f.title}</h3>
                  <p className="text-base font-body text-muted-foreground leading-relaxed relative z-10">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/40 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-body font-medium px-3 py-1.5 rounded-full mb-4">
                <Target size={12} />
                Simple 3-Step Process
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
                How It Works
              </h2>
              <p className="text-sm font-body text-muted-foreground max-w-md mx-auto">
                Get a personalized financial plan in under 2 minutes — no expertise required
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector lines (desktop only) */}
              <div className="hidden md:block absolute top-16 left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px border-t-2 border-dashed border-primary/20" />

              {[
                {
                  step: "01",
                  title: "Share Your Details",
                  desc: "Enter your income, expenses, and age. We only ask what's needed — no bank linking required.",
                  icon: User,
                },
                {
                  step: "02",
                  title: "Get AI Analysis",
                  desc: "Our AI calculates your health score, savings potential, tax optimization, and ideal SIP allocation.",
                  icon: Bot,
                },
                {
                  step: "03",
                  title: "Follow Your Plan",
                  desc: "A clear monthly action checklist — invest, save, cut spending — with projected growth over 10 years.",
                  icon: BarChart3,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                    className="relative text-center"
                  >
                    {/* Step number circle */}
                    <div className="mx-auto w-14 h-14 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mb-5 relative z-10">
                      <Icon size={22} className="text-primary" />
                    </div>

                    <div className="card-et p-6 hover-lift">
                      <span className="inline-block text-xs font-body font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
                        Step {item.step}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm font-body text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA below steps */}
            <div className="text-center mt-12">
              <Button variant="hero" size="lg" className="h-12 px-8" onClick={handleCTA}>
                Start Now — It's Free <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
