
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Users, Crown, ShieldAlert, BellRing } from 'lucide-react';
import ManageCourses from '@/components/AdminPanel/ManageCourses';
import ManagePremiumOffers from '@/components/AdminPanel/ManagePremiumOffers';
import ManageUserRoles from '@/components/AdminPanel/ManageUserRoles';
import ManageNotifications from '@/components/AdminPanel/ManageNotifications';
import ViewPremiumUsers from '@/components/AdminPanel/ViewPremiumUsers';
import ViewAdminUsers from '@/components/AdminPanel/ViewAdminUsers';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const { courses } = useCourses();
  const { user, isAdmin, getAllUsers } = useAuth();
  
  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [premiumOffers, setPremiumOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const fetchAdminPanelData = useCallback(async () => {
    if (!isAdmin) return;

    setIsLoadingUsers(true);
    const usersData = await getAllUsers();
    setUsersList(usersData || []);
    setIsLoadingUsers(false);
    
    setIsLoadingOffers(true);
    try {
        const { data, error } = await supabase.from('premium_offers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setPremiumOffers(data || []);
    } catch(error) {
        toast({ title: "Error loading premium offers", description: error.message, variant: "destructive"});
    } finally {
        setIsLoadingOffers(false);
    }

    await fetchAdminNotifications();
  }, [isAdmin, getAllUsers]);

  const fetchAdminNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllNotifications(data || []);
    } catch (error) {
      toast({ title: "Error loading notifications", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchAdminPanelData();
  }, [fetchAdminPanelData]);

  const activePremiumUsersCount = usersList.filter(u => {
    if (u.is_admin && u.premium_tier === 'admin_perk') return true;
    if (u.has_premium_access) {
      if (!u.premium_expires_at && u.premium_tier !== 'admin_perk') return true;
      if (u.premium_expires_at) return new Date(u.premium_expires_at) > new Date();
    }
    return false;
  }).length;

  const adminUsersCount = usersList.filter(u => u.is_admin).length;


  const stats = {
    totalCourses: courses.length,
    totalUsers: usersList.length,
    premiumUsers: activePremiumUsersCount,
    adminUsers: adminUsersCount,
    activeNotifications: allNotifications.filter(n => !n.deleted_at && (!n.expires_at || new Date(n.expires_at) > new Date())).length,
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-300 brand-font neon-text">Admin Dashboard</h1>
          <p className="text-green-400/80 mt-2">Manage courses, premium offers, users, and notifications</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: <BookOpen className="w-6 h-6 text-green-400" /> },
          { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-400" /> },
          { title: 'Premium Users', value: stats.premiumUsers, icon: <Crown className="w-6 h-6 text-yellow-400" /> },
          { title: 'Admin Users', value: stats.adminUsers, icon: <ShieldAlert className="w-6 h-6 text-purple-400" /> },
          { title: 'Active Notifications', value: stats.activeNotifications, icon: <BellRing className="w-6 h-6 text-pink-400" /> }
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * (idx + 1) }}>
            <Card className="hologram neon-glow h-full"><CardContent className="p-6 flex flex-col justify-between h-full"><div className="flex items-center gap-4"><div className="p-3 bg-black/30 rounded-full">{stat.icon}</div><div><p className="text-green-400/80 text-sm">{stat.title}</p><p className="text-2xl font-bold text-green-300">{stat.value}</p></div></div></CardContent></Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewPremiumUsers users={usersList} isLoading={isLoadingUsers} />
        <ViewAdminUsers users={usersList} isLoading={isLoadingUsers} />
      </div>

      <ManageNotifications 
        notifications={allNotifications} 
        isLoading={isLoadingNotifications} 
        fetchNotifications={fetchAdminNotifications} 
        isAdmin={isAdmin} 
      />
      
      <ManageCourses isAdmin={isAdmin} />

      <ManagePremiumOffers 
        offers={premiumOffers} 
        isLoading={isLoadingOffers} 
        fetchOffers={fetchAdminPanelData} 
        isAdmin={isAdmin}
      />

      <ManageUserRoles 
        users={usersList} 
        isLoading={isLoadingUsers} 
        currentUser={user} 
        isAdmin={isAdmin} 
        fetchUsers={fetchAdminPanelData} 
      />
    </div>
  );
};

export default AdminPanel;
            
