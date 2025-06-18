import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  const fetchUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch profile:', error.message);
      toast({ title: "Error", description: "Could not load profile.", variant: "destructive" });
      return null;
    }
  };

  // Session handling
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error.message);
      setUser(session?.user || null);
      if (session?.user) await fetchUserProfile(session.user.id);
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) await fetchUserProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fixed: Grant premium access
  const grantPremiumAccess = async (userId, tier, duration, unit) => {
    try {
      const expiresAt = new Date();
      if (unit === 'months') expiresAt.setMonth(expiresAt.getMonth() + duration);
      else if (unit === 'years') expiresAt.setFullYear(expiresAt.getFullYear() + duration);

      const { error } = await supabase
        .from('profiles')
        .update({
          has_premium_access: true,
          premium_tier: tier,
          premium_expires_at: expiresAt.toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: "Success", description: `Premium access granted until ${expiresAt.toLocaleDateString()}` });
    } catch (error) {
      toast({ title: "Error", description: `Grant failed: ${error.message}`, variant: "destructive" });
      throw error;
    }
  };

  // Fixed: Extend premium access
  const extendPremiumAccess = async (userId, currentExpiry, tier, duration, unit) => {
    try {
      let expiresAt = currentExpiry ? new Date(currentExpiry) : new Date();
      if (expiresAt < new Date()) expiresAt = new Date(); // Reset if expired

      if (unit === 'months') expiresAt.setMonth(expiresAt.getMonth() + duration);
      else if (unit === 'years') expiresAt.setFullYear(expiresAt.getFullYear() + duration);

      const { error } = await supabase
        .from('profiles')
        .update({
          premium_tier: tier,
          premium_expires_at: expiresAt.toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: "Success", description: `Premium extended until ${expiresAt.toLocaleDateString()}` });
    } catch (error) {
      toast({ title: "Error", description: `Extension failed: ${error.message}`, variant: "destructive" });
      throw error;
    }
  };

  // Revoke premium
  const revokePremiumAccess = async (userId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          has_premium_access: false,
          premium_tier: null,
          premium_expires_at: null,
        })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: "Success", description: "Premium access revoked" });
    } catch (error) {
      toast({ title: "Error", description: `Revoke failed: ${error.message}`, variant: "destructive" });
      throw error;
    }
  };

  // ... (keep other methods like login, logout, register, etc.)

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isAdmin: profile?.is_admin || false,
      hasPremiumAccess: profile?.has_premium_access || false,
      grantPremiumAccess,
      revokePremiumAccess,
      extendPremiumAccess,
      // ... other methods
    }}>
      {children}
    </AuthContext.Provider>
  );
};
