import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  full_name: string | null;
  age: number | null;
  monthly_income: number | null;
  monthly_expenses: number | null;
  savings: number | null;
  debt: number | null;
}

const getDeviceId = () => {
  if (typeof window === "undefined") return "server-side";
  let id = localStorage.getItem("aimm_device_id");
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 11) + "-" + Date.now().toString(36).substring(2, 6);
    localStorage.setItem("aimm_device_id", id);
  }
  return id;
};

const GUEST_ID = getDeviceId();

const BACKEND_URL = "http://localhost:8000";

export const saveProfile = async (profile: Partial<Profile>) => {
  // 1. Sync with Supabase (current logic)
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      user_id: GUEST_ID,
      full_name: profile.full_name,
      age: profile.age,
      monthly_income: profile.monthly_income,
      monthly_expenses: profile.monthly_expenses,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  // 2. Sync with Python Backend
  try {
      console.log("Syncing with Python Backend...");
      
      // Create User
      await fetch(`${BACKEND_URL}/user/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id: GUEST_ID,
              name: profile.full_name || "Guest",
              age: profile.age || 25
          })
      });

      // Add Finance Data
      await fetch(`${BACKEND_URL}/finance/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              user_id: GUEST_ID,
              income: profile.monthly_income || 0,
              expenses: profile.monthly_expenses || 0,
              savings: profile.savings || (profile.monthly_income ? profile.monthly_income - (profile.monthly_expenses || 0) : 0),
              debt: profile.debt || 0
          })
      });
      console.log("Python Backend Sync Successful!");
  } catch (err) {
      console.warn("Python Backend sync failed, but Supabase/Local storage is updated.", err);
  }

  if (error) {
    console.error("Error saving profile to Supabase:", error);
    // Fallback to local storage if DB fails
    localStorage.setItem("aimm_profile", JSON.stringify(profile));
    return profile;
  }

  return data;
};

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    
    // Try Supabase first
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", GUEST_ID)
      .maybeSingle();

    if (data) {
      setProfile(data);
    } else {
      // Fallback to local storage
      const stored = localStorage.getItem("aimm_profile");
      if (stored) setProfile(JSON.parse(stored));
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refresh: fetchProfile };
};
