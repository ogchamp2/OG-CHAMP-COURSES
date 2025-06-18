
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, UserX, ShieldCheck, ShieldOff, Search, Edit, CalendarPlus } from 'lucide-react';

const ManageUserRoles = ({ users, isLoading, currentUser, isAdmin, fetchUsers }) => {
  const { grantPremiumAccess, revokePremiumAccess, toggleAdminStatus, extendPremiumAccess } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [selectedUserForGrant, setSelectedUserForGrant] = useState(null);
  const [grantTier, setGrantTier] = useState('monthly'); 
  const [grantDuration, setGrantDuration] = useState(1); 

  const openGrantDialog = (user) => {
    setSelectedUserForGrant(user);
    setGrantTier('monthly');
    setGrantDuration(1);
    setIsGrantDialogOpen(true);
  };
  
  const openExtendDialog = (user) => {
    setSelectedUserForGrant(user);
    setGrantTier(user.premium_tier || 'monthly'); 
    setGrantDuration(1); 
    setIsExtendDialogOpen(true);
  };

  const handleGrantPremium = async () => {
    if (!isAdmin || !selectedUserForGrant) return;
    try {
      const durationUnit = grantTier === 'monthly' ? 'months' : 'years';
      await grantPremiumAccess(selectedUserForGrant.id, grantTier, grantDuration, durationUnit);
      fetchUsers();
      setIsGrantDialogOpen(false);
      setSelectedUserForGrant(null);
    } catch (error) {
      toast({ title: "Error", description: `Failed to grant premium: ${error.message}`, variant: "destructive" });
    }
  };
  
  const handleExtendPremium = async () => {
    if (!isAdmin || !selectedUserForGrant) return;
    try {
      const durationUnit = grantTier === 'monthly' ? 'months' : 'years';
      await extendPremiumAccess(selectedUserForGrant.id, selectedUserForGrant.premium_expires_at, grantTier, grantDuration, durationUnit);
      fetchUsers();
      setIsExtendDialogOpen(false);
      setSelectedUserForGrant(null);
    } catch (error) {
      toast({ title: "Error", description: `Failed to extend premium: ${error.message}`, variant: "destructive" });
    }
  };

  const handleRevokePremium = async (userId) => {
    if (!isAdmin) return;
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      if (window.confirm(`Are you sure you want to revoke premium access for ${targetUser.email}? This will remove their tier and expiry date.`)) {
        try {
          await revokePremiumAccess(userId);
          fetchUsers();
        } catch (error) {
          toast({ title: "Error", description: `Failed to revoke premium access: ${error.message}`, variant: "destructive" });
        }
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

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (user.name?.toLowerCase() || '').includes(term) || (user.email?.toLowerCase() || '').includes(term);
  });

  const isPremiumActive = (user) => {
    if (!user) return false;
    if (user.is_admin && user.premium_tier === 'admin_perk') return true; // Admins with admin_perk are always active
    if (user.has_premium_access) {
        if (!user.premium_expires_at && user.premium_tier !== 'admin_perk') return true; // Legacy premium without expiry
        if (user.premium_expires_at) return new Date(user.premium_expires_at) > new Date();
    }
    return false;
  };
  
  const getPremiumStatusText = (user) => {
    if (!user) return 'Inactive';
    if (user.is_admin && user.premium_tier === 'admin_perk') return 'Active (Admin Perk)';
    if (user.has_premium_access) {
        if (!user.premium_expires_at) return `Active (${user.premium_tier || 'Legacy'})`;
        if (new Date(user.premium_expires_at) > new Date()) {
            return `Active (${user.premium_tier || 'N/A'}) - Expires: ${new Date(user.premium_expires_at).toLocaleDateString()}`;
        }
        return `Expired (${user.premium_tier || 'N/A'}) - Expired: ${new Date(user.premium_expires_at).toLocaleDateString()}`;
    }
    return 'Inactive';
  };


  return (
    <Card className="hologram neon-glow">
      <CardHeader>
        <CardTitle className="text-green-300">Manage User Roles</CardTitle>
        <CardDescription className="text-green-400/80">Grant, extend, or revoke premium and admin access. Search by name or email.</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
          <Input 
            placeholder="Search users by name or email..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 bg-black/50 border-purple-500/50 text-purple-100 placeholder:text-purple-400/60"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-purple-400/70 text-center">Loading users...</p>}
        {!isLoading && filteredUsers.length === 0 && (
          <p className="text-purple-400/70 text-center py-4">
            {searchTerm ? 'No users match your search.' : 'No users found.'}
          </p>
        )}
        {!isLoading && filteredUsers.map(u => (
          <motion.div 
            key={u.id} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            layout
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 my-2 bg-black/30 rounded-lg border border-purple-500/30"
          >
            <div className="flex-1">
                <h3 className="text-purple-300 font-semibold flex items-center gap-2 flex-wrap">
                    <span>{u.name || 'N/A'} ({u.email})</span>
                    {u.is_admin && <span className="text-xs font-bold text-purple-300 bg-purple-500/30 px-2 py-0.5 rounded-full">ADMIN</span>}
                </h3>
                <p className={`text-xs ${isPremiumActive(u) ? 'text-yellow-400' : 'text-purple-400/60'}`}>
                  Premium: {getPremiumStatusText(u)}
                </p>
            </div>
            <div className="flex gap-2 self-stretch sm:self-auto flex-col sm:flex-row">
                {!u.is_admin && (
                  <>
                    {isPremiumActive(u) || (u.has_premium_access && u.premium_expires_at && new Date(u.premium_expires_at) <= new Date()) ? ( // Show extend/revoke if active or expired
                      <>
                        <Button size="sm" onClick={() => openExtendDialog(u)} className="bg-blue-500/80 hover:bg-blue-600 text-white min-w-[100px] justify-center">
                            <CalendarPlus className="w-4 h-4 mr-1" /> Extend
                        </Button>
                        <Button size="sm" onClick={() => handleRevokePremium(u.id)} className="bg-red-500/80 hover:bg-red-600 text-white min-w-[100px] justify-center">
                            <UserX className="w-4 h-4 mr-1" /> Revoke
                        </Button>
                      </>
                    ) : (
                        <Button size="sm" onClick={() => openGrantDialog(u)} className="bg-green-500/80 hover:bg-green-600 text-white min-w-[100px] justify-center">
                            <UserCheck className="w-4 h-4 mr-1" /> Grant
                        </Button>
                    )}
                  </>
                )}
                 {currentUser.id !== u.id && u.email !== 'ogchamptech@gmail.com' && (
                    <Button size="sm" onClick={() => handleToggleAdminStatus(u.id)} className={`${u.is_admin ? "bg-orange-500/80 hover:bg-orange-600" : "bg-purple-500/80 hover:bg-purple-600"} text-white min-w-[100px] justify-center`}>
                        {u.is_admin ? <ShieldOff className="w-4 h-4 mr-1" /> : <ShieldCheck className="w-4 h-4 mr-1" />}
                        {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                    </Button>
                )}
            </div>
          </motion.div>
        ))}
      </CardContent>

      {/* Grant/Extend Premium Dialog (Combined for simplicity, title changes) */}
      <Dialog open={isGrantDialogOpen || isExtendDialogOpen} onOpenChange={(open) => { if(!open) { setIsGrantDialogOpen(false); setIsExtendDialogOpen(false);}}}>
        <DialogContent className="hologram border-green-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-300">
              {isExtendDialogOpen ? 'Extend Premium for ' : 'Grant Premium to '} {selectedUserForGrant?.email}
            </DialogTitle>
            {isExtendDialogOpen && selectedUserForGrant?.premium_expires_at && (
                <p className="text-sm text-green-400/80 pt-1">Current Expiry: {new Date(selectedUserForGrant.premium_expires_at).toLocaleDateString()}</p>
            )}
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="grant-tier" className="text-green-400">Subscription Tier</Label>
              <Select onValueChange={setGrantTier} value={grantTier}>
                <SelectTrigger id="grant-tier" className="w-full mt-1 bg-black/50 border-green-500/50 text-green-100">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 border-green-500/50 text-green-100 backdrop-blur-md">
                  <SelectItem value="monthly" className="hover:bg-green-500/30 focus:bg-green-500/30">Monthly</SelectItem>
                  <SelectItem value="yearly" className="hover:bg-green-500/30 focus:bg-green-500/30">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grant-duration" className="text-green-400">Duration ({grantTier === 'monthly' ? 'Months' : 'Years'})</Label>
              <Input id="grant-duration" type="number" min="1" value={grantDuration} onChange={(e) => setGrantDuration(Math.max(1, parseInt(e.target.value,10) || 1))} className="mt-1 bg-black/50 border-green-500/50 text-green-100"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsGrantDialogOpen(false); setIsExtendDialogOpen(false);}} className="text-green-300 border-green-500/50 hover:bg-green-500/20">Cancel</Button>
            <Button onClick={isExtendDialogOpen ? handleExtendPremium : handleGrantPremium} className="bg-green-600 hover:bg-green-700">
              {isExtendDialogOpen ? 'Extend Access' : 'Grant Access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ManageUserRoles;
            
