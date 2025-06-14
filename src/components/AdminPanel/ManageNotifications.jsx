import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Send, Trash2, Eye } from 'lucide-react'; // Changed EyeOff to Trash2 for permanent delete
import { supabase } from '@/lib/supabaseClient';

const ManageNotifications = ({ notifications, isLoading, fetchNotifications, isAdmin }) => {
  const [notificationFormData, setNotificationFormData] = useState({ title: '', message: '', expires_at: '' });
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  const activeNotifications = notifications.filter(n => !n.deleted_at);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!notificationFormData.title || !notificationFormData.message) {
        toast({ title: "Error", description: "Title and message are required.", variant: "destructive" });
        return;
    }
    setIsSendingNotification(true);
    try {
        const payload = { 
          title: notificationFormData.title, 
          message: notificationFormData.message,
          expires_at: notificationFormData.expires_at ? new Date(notificationFormData.expires_at).toISOString() : null,
          deleted_at: null 
        };
        const { error } = await supabase.from('notifications').insert([payload]);
        if (error) throw error;
        toast({ title: "Success", description: "Global notification sent!" });
        setNotificationFormData({ title: '', message: '', expires_at: '' });
        fetchNotifications();
    } catch (error) {
        toast({ title: "Error", description: `Failed to send notification: ${error.message}`, variant: "destructive" });
    } finally {
        setIsSendingNotification(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to permanently delete this notification? This action cannot be undone.')) {
        try {
            const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);
            if (error) throw error;
            toast({ title: "Success", description: `Notification permanently deleted.` });
            fetchNotifications();
        } catch (error) {
            toast({ title: "Error", description: `Failed to delete notification: ${error.message}`, variant: "destructive" });
        }
    }
  };


  return (
    <Card className="hologram neon-glow">
      <CardHeader><CardTitle className="text-green-300">Manage Notifications</CardTitle><CardDescription className="text-green-400/80">Broadcast messages and manage their visibility.</CardDescription></CardHeader>
      <CardContent>
          <form onSubmit={handleSendNotification} className="space-y-4 mb-6">
              <Input value={notificationFormData.title} onChange={(e) => setNotificationFormData(p => ({...p, title: e.target.value}))} placeholder="Notification Title *" className="bg-black/50 border-green-500/50 text-green-100"/>
              <Textarea value={notificationFormData.message} onChange={(e) => setNotificationFormData(p => ({...p, message: e.target.value}))} placeholder="Notification Message *" className="bg-black/50 border-green-500/50 text-green-100"/>
              <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                      <Label htmlFor="expires_at" className="text-green-400/80 text-sm">Expires At (Optional)</Label>
                      <Input 
                          id="expires_at"
                          type="datetime-local" 
                          value={notificationFormData.expires_at} 
                          onChange={(e) => setNotificationFormData(p => ({...p, expires_at: e.target.value}))} 
                          className="bg-black/50 border-green-500/50 text-green-100"
                          min={new Date().toISOString().slice(0, 16)}
                      />
                  </div>
                  <Button type="submit" disabled={isSendingNotification} className="w-full sm:w-auto self-end bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 neon-glow">
                      <Send className="w-4 h-4 mr-2" /> {isSendingNotification ? 'Sending...' : 'Send Notification'}
                  </Button>
              </div>
          </form>
          <h4 className="text-lg font-semibold text-green-200 mb-2">Active Notifications:</h4>
          {isLoading ? <p className="text-green-400/70">Loading notifications...</p> :
           activeNotifications.length === 0 ? <p className="text-green-400/70">No active notifications.</p> :
           <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {activeNotifications.map(notif => (
                  <div key={notif.id} className={'p-3 rounded-lg border border-green-500/30 bg-black/30'}>
                      <div className="flex justify-between items-start">
                          <div>
                              <h5 className={'font-semibold text-green-300'}>{notif.title}</h5>
                              <p className={'text-sm text-green-400/80'}>{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                  Sent: {new Date(notif.created_at).toLocaleString()}
                                  {notif.expires_at && ` | Expires: ${new Date(notif.expires_at).toLocaleString()}`}
                              </p>
                          </div>
                          <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteNotification(notif.id)}
                              className={"border-red-500/50 text-red-300 hover:bg-red-500/20"}
                              title="Delete Notification Permanently"
                          >
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  </div>
              ))}
           </div>
          }
      </CardContent>
    </Card>
  );
};

export default ManageNotifications;