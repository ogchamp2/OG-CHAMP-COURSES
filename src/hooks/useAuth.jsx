
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error.message);
          throw error;
        }
        setProfile(null);
        return null;
      }
      
      setProfile(data);
      return data;

    } catch (error) {
      console.error('Exception fetching user profile:', error.message);
      toast({ title: "Profile Error", description: "Could not load user profile.", variant: "destructive" });
      return null;
    }
  };

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error.message);
      } else if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        await fetchUserProfile(user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      throw error;
    }
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    setUser(null);
    setProfile(null);
    sessionStorage.clear();

    if (error && error.message !== 'Session from session_id claim in JWT does not exist') {
      toast({ title: "Logout Issue", description: "There was a problem signing out on the server, but you have been logged out locally.", variant: "destructive" });
      console.error("Logout error:", error.message);
    }
  };

  const register = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: { name: userData.name },
      },
    });
    
    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      throw error;
    }
    if (data.user) {
        await markWhatsappJoined(data.user.id);
    }
    return data.user;
  };

  const grantPremiumAccess = async (userId, tier, durationValue, durationUnit) => {
    let expiresAt = null;
    if (tier && durationValue && durationUnit) {
      const now = new Date();
      if (durationUnit === 'months') {
        expiresAt = new Date(now.setMonth(now.getMonth() + parseInt(durationValue, 10)));
      } else if (durationUnit === 'years') {
        expiresAt = new Date(now.setFullYear(now.getFullYear() + parseInt(durationValue, 10)));
      }
    }

    const updateData = { 
      has_premium_access: true, 
      premium_tier: tier,
      premium_expires_at: expiresAt ? expiresAt.toISOString() : null,
      updated_at: new Date().toISOString() 
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to grant premium: ${error.message}`, variant: "destructive" });
      throw error;
    }
    if (profile && profile.id === userId) {
      setProfile(prev => ({ ...prev, ...updateData }));
    }
    toast({ title: "Success", description: `Premium access (${tier}) granted until ${expiresAt ? expiresAt.toLocaleDateString() : 'N/A'}`});
  };
  
  const extendPremiumAccess = async (userId, currentExpiry, tier, durationValue, durationUnit) => {
    let newExpiresAt = null;
    const startDate = currentExpiry ? new Date(currentExpiry) : new Date(); // Start from current expiry or now if none
    
    if (startDate < new Date()) { // If current expiry is in the past, start from now
        startDate.setTime(new Date().getTime());
    }

    if (tier && durationValue && durationUnit) {
      if (durationUnit === 'months') {
        newExpiresAt = new Date(startDate.setMonth(startDate.getMonth() + parseInt(durationValue, 10)));
      } else if (durationUnit === 'years') {
        newExpiresAt = new Date(startDate.setFullYear(startDate.getFullYear() + parseInt(durationValue, 10)));
      }
    }

    const updateData = { 
      has_premium_access: true, 
      premium_tier: tier, // Could also update tier if needed
      premium_expires_at: newExpiresAt ? newExpiresAt.toISOString() : null,
      updated_at: new Date().toISOString() 
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to extend premium: ${error.message}`, variant: "destructive" });
      throw error;
    }
    if (profile && profile.id === userId) {
      setProfile(prev => ({ ...prev, ...updateData }));
    }
    toast({ title: "Success", description: `Premium access extended until ${newExpiresAt ? newExpiresAt.toLocaleDateString() : 'N/A'}`});
  };


  const revokePremiumAccess = async (userId) => {
    const updateData = { 
      has_premium_access: false, 
      premium_tier: null,
      premium_expires_at: null,
      updated_at: new Date().toISOString() 
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to revoke premium: ${error.message}`, variant: "destructive" });
      throw error;
    }
     if (profile && profile.id === userId) {
      setProfile(prev => ({ ...prev, ...updateData }));
    }
    toast({ title: "Success", description: `Premium access revoked.`});
  };
  
  const getAllUsers = async () => {
    if (!profile?.is_admin) {
        toast({ title: "Unauthorized", description: "You don't have permission to list users.", variant: "destructive" });
        return [];
    }
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      toast({ title: "Error", description: `Failed to get users: ${error.message}`, variant: "destructive" });
      return [];
    }
    return data;
  };

  const getUserById = async (userId) => {
     const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) {
      console.error(`Failed to get user ${userId}: ${error.message}`);
      return null;
    }
    return data;
  };

  const markWhatsappJoined = async (userId) => {
    if (!userId) return;
    const { error } = await supabase
      .from('profiles')
      .update({ whatsapp_joined_all: true })
      .eq('id', userId);
    if (error) {
      console.error("Error marking whatsapp joined:", error.message);
    } else {
       if (profile && profile.id === userId) {
        setProfile(prev => ({...prev, whatsapp_joined_all: true }));
      }
    }
  };

  const toggleAdminStatus = async (userId, makeAdmin) => {
    if (!profile?.is_admin) {
        toast({ title: "Unauthorized", description: "You don't have permission to change admin roles.", variant: "destructive" });
        return;
    }
    
    const updateData = { 
      is_admin: makeAdmin, 
      updated_at: new Date().toISOString() 
    };

    // If making admin, ensure they have indefinite premium
    if (makeAdmin) {
        updateData.has_premium_access = true;
        updateData.premium_tier = 'admin_perk';
        updateData.premium_expires_at = null; // Or a very far future date if null isn't handled as indefinite
    } else {
        // If revoking admin, their premium status might need re-evaluation based on prior subscriptions
        // For simplicity now, if admin is revoked, their special admin_perk premium is gone.
        // They would need a normal subscription.
        const targetUser = await getUserById(userId);
        if (targetUser && targetUser.premium_tier === 'admin_perk') {
            updateData.has_premium_access = false;
            updateData.premium_tier = null;
            updateData.premium_expires_at = null;
        }
    }


    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to update admin status: ${error.message}`, variant: "destructive" });
      throw error;
    }
    toast({ title: "Success", description: `User role updated successfully.` });
  };

  const checkPremiumAccess = (userProfile) => {
    if (!userProfile) return false;
    if (userProfile.is_admin) return true; // Admins always have access
    if (userProfile.has_premium_access) {
      if (!userProfile.premium_expires_at) return true; // No expiry date means indefinite (or old system)
      return new Date(userProfile.premium_expires_at) > new Date(); // Check if expiry is in the future
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      login,
      logout,
      register,
      isLoading,
      isAuthenticated: !!user && user.email_confirmed_at,
      isUnconfirmed: !!user && !user.email_confirmed_at,
      isAdmin: profile?.is_admin || false,
      hasPremiumAccess: checkPremiumAccess(profile),
      grantPremiumAccess,
      revokePremiumAccess,
      extendPremiumAccess,
      getAllUsers,
      getUserById,
      markWhatsappJoined,
      toggleAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
    
