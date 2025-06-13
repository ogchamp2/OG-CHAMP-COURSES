
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { BellRing } from 'lucide-react';

// This component is being deprecated as its functionality is merged into NotificationBell.jsx
// Keeping it for now to avoid breaking imports immediately, but it should be removed in a future cleanup.
const NotificationListener = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return () => {};

    console.warn("NotificationListener.jsx is deprecated and its functionality has been moved to NotificationBell.jsx. This component will be removed in a future update.");
    
    // The actual listener logic has been moved to NotificationBell.
    // This is just a placeholder to prevent errors if it's still imported somewhere,
    // though App.jsx has been updated to remove its direct usage.

    // Example of how the channel was structured, now in NotificationBell:
    /*
    const channel = supabase
      .channel('public:notifications:toast_only') // Use a different channel name if needed to avoid conflict
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          // This toast logic is now duplicated in NotificationBell.
          // Ideally, toasts should only be triggered once.
          // This is a temporary measure during refactoring.
          const { title, message } = payload.new;
          toast({
            title: (
              <div className="flex items-center gap-2">
                <BellRing className="h-5 w-5 text-yellow-400" />
                <span className="font-bold text-yellow-300">{title}</span>
              </div>
            ),
            description: <p className="text-green-200">{message}</p>,
            className: 'hologram neon-glow border-yellow-500/50',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
   return () => {};
  }, [isAuthenticated, toast]);

  return null;
};

export default NotificationListener;
