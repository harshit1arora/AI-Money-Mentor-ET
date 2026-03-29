import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProfile, saveProfile } from "@/hooks/useProfile";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Save, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, refresh } = useProfile();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    income: "",
    expenses: "",
    savings: "",
    debt: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name ?? "",
        age: profile.age?.toString() ?? "",
        income: profile.monthly_income?.toString() ?? "",
        expenses: profile.monthly_expenses?.toString() ?? "",
        savings: profile.savings?.toString() ?? "",
        debt: profile.debt?.toString() ?? "",
      });
    }
  }, [profile]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await saveProfile({
      full_name: form.fullName,
      age: form.age ? parseInt(form.age) : null,
      monthly_income: form.income ? parseFloat(form.income) : null,
      monthly_expenses: form.expenses ? parseFloat(form.expenses) : null,
      savings: form.savings ? parseFloat(form.savings) : null,
      debt: form.debt ? parseFloat(form.debt) : null,
    });
    refresh();
    toast.success("Profile updated successfully!");
    setSaving(false);
  };

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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
          <motion.div variants={fadeUp}>
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 className="font-heading text-2xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-sm font-body text-muted-foreground mt-1">Update your financial details to get better recommendations</p>
          </motion.div>

          <motion.div variants={fadeUp} className="card-et">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-heading text-lg font-bold text-foreground">{profile?.full_name || "User"}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Full Name</label>
                  <Input value={form.fullName} onChange={update("fullName")} className="font-body h-11 bg-secondary/50 border-border" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Age</label>
                  <Input type="number" value={form.age} onChange={update("age")} className="font-body h-11 bg-secondary/50 border-border" placeholder="Age" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Monthly Income (₹)</label>
                  <Input type="number" value={form.income} onChange={update("income")} className="font-body h-11 bg-secondary/50 border-border" placeholder="e.g. 50,000" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Monthly Expenses (₹)</label>
                  <Input type="number" value={form.expenses} onChange={update("expenses")} className="font-body h-11 bg-secondary/50 border-border" placeholder="e.g. 30,000" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Current Savings (₹)</label>
                  <Input type="number" value={form.savings} onChange={update("savings")} className="font-body h-11 bg-secondary/50 border-border" placeholder="Total savings" />
                </div>
                <div>
                  <label className="block text-xs font-body font-medium text-foreground mb-1.5 uppercase tracking-wider">Total Debt (₹)</label>
                  <Input type="number" value={form.debt} onChange={update("debt")} className="font-body h-11 bg-secondary/50 border-border" placeholder="Total debt" />
                </div>
              </div>

              {form.income && form.expenses && (
                <div className="p-4 bg-primary/[0.04] border border-primary/15 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span className="text-xs font-body font-medium text-foreground uppercase tracking-wider">Quick Preview</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs font-body text-muted-foreground">Savings</p>
                      <p className="text-sm font-body font-bold text-foreground">
                        ₹{(parseFloat(form.income) - parseFloat(form.expenses)).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-body text-muted-foreground">Rate</p>
                      <p className="text-sm font-body font-bold text-foreground">
                        {Math.round(((parseFloat(form.income) - parseFloat(form.expenses)) / parseFloat(form.income)) * 100)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-body text-muted-foreground">Yearly</p>
                      <p className="text-sm font-body font-bold text-gradient-red">
                        ₹{((parseFloat(form.income) - parseFloat(form.expenses)) * 12).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="hero" className="h-11 px-6" disabled={saving}>
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Save size={15} /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
