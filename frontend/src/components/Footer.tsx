import { TrendingUp, Mail, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const platformLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Plan", path: "/my-plan" },
  { label: "AI Advisor", path: "/dashboard" },
  { label: "Tax Optimization", path: "/dashboard" },
];

const resourceLinks = [
  { label: "How It Works", path: "/" },
  { label: "Financial Glossary", path: "/" },
  { label: "SIP Calculator", path: "/" },
  { label: "User Guide", path: "/" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                <TrendingUp size={14} className="text-primary-foreground" />
              </div>
              <span className="font-heading text-base font-bold text-foreground">AI Money Mentor</span>
            </div>
            <p className="text-sm font-body text-muted-foreground leading-relaxed">
              Empowering Indian users with AI-driven financial planning and actionable money insights.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm font-body text-primary hover:text-primary/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm font-body text-primary hover:text-primary/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground mb-4">Connect</h3>
            <div className="flex items-center gap-2 mb-4">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <button
                    key={social.label}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary/30 hover:bg-primary/5 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={15} className="text-muted-foreground" />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-body text-muted-foreground">Developed by</p>
            <p className="text-sm font-heading font-bold text-primary">MafiaVIT</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-muted-foreground">
            © 2026 AI Money Mentor – Economic Times. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <button key={item} className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
