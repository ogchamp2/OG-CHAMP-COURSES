import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_NOTIFICATIONS_DISPLAYED = 10;

const NotificationBell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`lastReadTimestamp_${user?.id}`) || new Date(0).toISOString();
    }
    return new Date(0).toISOString();
  });

  const fetchInitialNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data: unreadData, error: unreadError, count: unreadMessagesCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: false })
        .gt('created_at', lastReadTimestamp)
        .order('created_at', { ascending: false });

      if (unreadError) throw unreadError;
      setUnreadCount(unreadMessagesCount || 0);

      const { data: recentData, error: recentError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(MAX_NOTIFICATIONS_DISPLAYED);
      
      if (recentError) throw recentError;
      setNotifications(recentData || []);

    } catch (error) {
      console.error('Error fetching initial notifications:', error);
      toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
    }
  }, [user, lastReadTimestamp, toast]);

  useEffect(() => {
    fetchInitialNotifications();
  }, [fetchInitialNotifications]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:notifications:bell-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newNotification = payload.new;
          
          setNotifications((prevNotifications) => 
            [newNotification, ...prevNotifications].slice(0, MAX_NOTIFICATIONS_DISPLAYED)
          );

          if (new Date(newNotification.created_at) > new Date(lastReadTimestamp)) {
            setUnreadCount((prevCount) => prevCount + 1);
          }
          
          toast({
            title: (
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-yellow-300">{newNotification.title}</span>
              </div>
            ),
            description: <p className="text-green-200">{newNotification.message}</p>,
            className: 'hologram neon-glow border-yellow-500/50',
          });
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to notifications channel!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Channel error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.warn('Subscription timed out');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, lastReadTimestamp, toast]);

  useEffect(() => {
    if(user && typeof window !== 'undefined') {
        localStorage.setItem(`lastReadTimestamp_${user.id}`, lastReadTimestamp);
    }
  }, [lastReadTimestamp, user]);

  const handleOpenNotifications = () => {
    if (unreadCount > 0) {
      setUnreadCount(0);
      const newTimestamp = new Date().toISOString();
      setLastReadTimestamp(newTimestamp);
      if (user && typeof window !== 'undefined') {
        localStorage.setItem(`lastReadTimestamp_${user.id}`, newTimestamp);
      }
    }
    // Re-fetch to ensure the list is up-to-date when opened, even if no new unread.
    fetchInitialNotifications();
  };
  
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  }


  if (!user) return null;

  return (
    <DropdownMenu onOpenChange={(open) => { if(open) handleOpenNotifications(); }}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-green-400 hover:text-green-300 hover:bg-green-500/20">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
              >
                {unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 bg-black/80 backdrop-blur-md border-green-500/30 text-green-300">
        <DropdownMenuLabel className="flex justify-between items-center text-green-200">
          <span>Notifications</span>
          {notifications.length > 0 && unreadCount === 0 && (
            <span className="text-xs text-green-500">All caught up!</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-500/30" />
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-green-400/70 italic focus:bg-green-500/10 focus:text-green-300 cursor-default">
            No new notifications.
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 focus:bg-green-500/10 focus:text-green-300 cursor-default">
              <div className="flex justify-between w-full items-center">
                <span className="font-semibold text-green-200">{notification.title}</span>
                <span className="text-xs text-green-500">{timeSince(notification.created_at)}</span>
              </div>
              <p className="text-sm text-green-400/90 whitespace-normal">{notification.message}</p>
            </DropdownMenuItem>
          ))
        )}
        {/* Placeholder for a "View All" link if you have many notifications */}
        {/* {notifications.length >= MAX_NOTIFICATIONS_DISPLAYED && (
           <DropdownMenuItem className="text-center text-green-400 hover:underline focus:bg-green-500/10 focus:text-green-300">
             View all notifications (coming soon)
           </DropdownMenuItem>
        )} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
