
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

  const grantPremiumAccess = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ has_premium_access: true, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to grant premium: ${error.message}`, variant: "destructive" });
      throw error;
    }
    if (profile && profile.id === userId) {
      setProfile(prev => ({ ...prev, has_premium_access: true }));
    }
  };

  const revokePremiumAccess = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ has_premium_access: false, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to revoke premium: ${error.message}`, variant: "destructive" });
      throw error;
    }
     if (profile && profile.id === userId) {
      setProfile(prev => ({ ...prev, has_premium_access: false }));
    }
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
    const { error } = await supabase
      .from('profiles')
      .update({ 
          is_admin: makeAdmin, 
          has_premium_access: makeAdmin ? true : false, // Admins always get premium
          updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (error) {
      toast({ title: "Error", description: `Failed to update admin status: ${error.message}`, variant: "destructive" });
      throw error;
    }
    toast({ title: "Success", description: `User role updated successfully.` });
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
      hasPremiumAccess: profile?.is_admin || profile?.has_premium_access || false,
      grantPremiumAccess,
      revokePremiumAccess,
      getAllUsers,
      getUserById,
      markWhatsappJoined,
      toggleAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
