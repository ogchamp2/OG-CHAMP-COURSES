
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { BellRing } from 'lucide-react';

const NotificationListener = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
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
  }, [isAuthenticated, toast]);

  return null;
};

export default NotificationListener;
