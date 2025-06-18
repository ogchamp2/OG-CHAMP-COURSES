import React, { useState } from 'react';
import { Button, Input, Label } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, UserX, CalendarPlus } from 'lucide-react';

const ManageUserRoles = ({ users, fetchUsers, isAdmin }) => {
  const { grantPremiumAccess, revokePremiumAccess, extendPremiumAccess } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tier, setTier] = useState('monthly');
  const [duration, setDuration] = useState(1);

  // Handle grant/extend premium
  const handlePremiumAction = async () => {
    if (!selectedUser) return;
    try {
      if (selectedUser.has_premium_access) {
        await extendPremiumAccess(
          selectedUser.id,
          selectedUser.premium_expires_at,
          tier,
          duration,
          tier === 'monthly' ? 'months' : 'years'
        );
      } else {
        await grantPremiumAccess(
          selectedUser.id,
          tier,
          duration,
          tier === 'monthly' ? 'months' : 'years'
        );
      }
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Get premium status text
  const getPremiumStatus = (user) => {
    if (!user.has_premium_access) return 'Inactive';
    if (!user.premium_expires_at) return 'Active (Lifetime)';
    const expiry = new Date(user.premium_expires_at);
    return expiry > new Date() 
      ? `Active (${user.premium_tier}) - Expires: ${expiry.toLocaleDateString()}`
      : `Expired (${user.premium_tier})`;
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {users.filter(u => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ).map(user => (
        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{user.name || user.email}</p>
            <p className="text-sm text-muted-foreground">
              {getPremiumStatus(user)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedUser(user);
                setIsDialogOpen(true);
              }}
            >
              {user.has_premium_access ? <CalendarPlus size={16} /> : <UserCheck size={16} />}
              {user.has_premium_access ? 'Extend' : 'Grant'}
            </Button>
            {user.has_premium_access && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => revokePremiumAccess(user.id)}
              >
                <UserX size={16} />
                Revoke
              </Button>
            )}
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.has_premium_access ? 'Extend Premium' : 'Grant Premium'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration ({tier === 'monthly' ? 'Months' : 'Years'})</Label>
              <Input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, +e.target.value))}
              />
            </div>
            <Button onClick={handlePremiumAction} className="w-full">
              {selectedUser?.has_premium_access ? 'Extend Access' : 'Grant Access'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUserRoles;
