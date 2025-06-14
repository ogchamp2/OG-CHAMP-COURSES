import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, UserX, ShieldCheck, ShieldOff } from 'lucide-react';

const ManageUserRoles = ({ users, isLoading, currentUser, isAdmin, fetchUsers }) => {
  const { grantPremiumAccess, revokePremiumAccess, toggleAdminStatus } = useAuth();

  const handleTogglePremiumAccess = async (userId) => {
    if (!isAdmin) return;
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      try {
        if (targetUser.has_premium_access) {
          await revokePremiumAccess(userId);
          toast({ title: "Success", description: `Premium access revoked for ${targetUser.email}`});
        } else {
          await grantPremiumAccess(userId);
          toast({ title: "Success", description: `Premium access granted to ${targetUser.email}`});
        }
        fetchUsers();
      } catch (error) {
        toast({ title: "Error", description: `Failed to toggle premium access: ${error.message}`, variant: "destructive" });
      }
    }
  };

  const handleToggleAdminStatus = async (userId) => {
    if (!isAdmin) return;
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
        if (targetUser.email === 'ogchamptech@gmail.com') {
            toast({ title: "Action Forbidden", description: "Cannot change the role of the primary admin.", variant: "destructive" });
            return;
        }
        await toggleAdminStatus(userId, !targetUser.is_admin);
        fetchUsers();
    }
  };

  return (
    <Card className="hologram neon-glow">
      <CardHeader><CardTitle className="text-green-300">Manage User Roles</CardTitle><CardDescription className="text-green-400/80">Grant or revoke premium and admin access.</CardDescription></CardHeader>
      <CardContent>
        {isLoading && <p className="text-purple-400/70 text-center">Loading users...</p>}
        {!isLoading && users.length === 0 && <p className="text-purple-400/70 text-center py-4">No users found.</p>}
        {!isLoading && users.map(u => (
          <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 my-2 bg-black/30 rounded-lg border border-purple-500/30">
            <div className="flex-1">
                <h3 className="text-purple-300 font-semibold flex items-center gap-2 flex-wrap">
                    <span>{u.name || 'N/A'} ({u.email})</span>
                    {u.is_admin && <span className="text-xs font-bold text-purple-300 bg-purple-500/30 px-2 py-0.5 rounded-full">ADMIN</span>}
                </h3>
                <p className={`text-xs ${u.has_premium_access || u.is_admin ? 'text-yellow-400' : 'text-purple-400/60'}`}>Premium Access: {u.has_premium_access || u.is_admin ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="flex gap-2 self-stretch sm:self-auto flex-col sm:flex-row">
                {!u.is_admin && (
                    <Button size="sm" onClick={() => handleTogglePremiumAccess(u.id)} className={`${u.has_premium_access ? "bg-red-500/80 hover:bg-red-600" : "bg-green-500/80 hover:bg-green-600"} text-white min-w-[150px] justify-center`}>
                        {u.has_premium_access ? <UserX className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                        {u.has_premium_access ? 'Revoke Premium' : 'Grant Premium'}
                    </Button>
                )}
                {currentUser.id !== u.id && u.email !== 'ogchamptech@gmail.com' && (
                    <Button size="sm" onClick={() => handleToggleAdminStatus(u.id)} className={`${u.is_admin ? "bg-orange-500/80 hover:bg-orange-600" : "bg-purple-500/80 hover:bg-purple-600"} text-white min-w-[150px] justify-center`}>
                        {u.is_admin ? <ShieldOff className="w-4 h-4 mr-1" /> : <ShieldCheck className="w-4 h-4 mr-1" />}
                        {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                    </Button>
                )}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManageUserRoles;