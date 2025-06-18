
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, UserCircle } from 'lucide-react';

const ViewPremiumUsers = ({ users, isLoading }) => {
  const premiumUsers = users.filter(user => {
    if (user.is_admin && user.premium_tier === 'admin_perk') return true;
    if (user.has_premium_access) {
      if (!user.premium_expires_at && user.premium_tier !== 'admin_perk') return true; 
      if (user.premium_expires_at) return new Date(user.premium_expires_at) > new Date();
    }
    return false;
  });

  return (
    <Card className="hologram neon-glow">
      <CardHeader>
        <CardTitle className="text-yellow-300 flex items-center gap-2">
          <Crown className="w-6 h-6" /> Premium Users
        </CardTitle>
        <CardDescription className="text-yellow-400/80">
          List of all users with active premium access. Current count: {premiumUsers.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-yellow-400/70 text-center">Loading users...</p>}
        {!isLoading && premiumUsers.length === 0 && (
          <p className="text-yellow-400/70 text-center py-4">No active premium users found.</p>
        )}
        {!isLoading && premiumUsers.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {premiumUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-yellow-500/30"
              >
                <UserCircle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-yellow-200 font-semibold">{user.name || 'N/A'}</p>
                  <p className="text-xs text-yellow-400/70">{user.email}</p>
                  <p className="text-xs text-yellow-500/90">
                    Tier: {user.premium_tier || 'N/A'}
                    {user.premium_expires_at && user.premium_tier !== 'admin_perk' && ` (Expires: ${new Date(user.premium_expires_at).toLocaleDateString()})`}
                    {user.premium_tier === 'admin_perk' && ' (Admin Perk)'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewPremiumUsers;
