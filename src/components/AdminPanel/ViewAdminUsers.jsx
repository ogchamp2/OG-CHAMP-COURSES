
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, UserCircle } from 'lucide-react';

const ViewAdminUsers = ({ users, isLoading }) => {
  const adminUsers = users.filter(user => user.is_admin);

  return (
    <Card className="hologram neon-glow">
      <CardHeader>
        <CardTitle className="text-purple-300 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> Administrator Users
        </CardTitle>
        <CardDescription className="text-purple-400/80">
          List of all users with administrator privileges. Current count: {adminUsers.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-purple-400/70 text-center">Loading users...</p>}
        {!isLoading && adminUsers.length === 0 && (
          <p className="text-purple-400/70 text-center py-4">No admin users found.</p>
        )}
        {!isLoading && adminUsers.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {adminUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-purple-500/30"
              >
                <UserCircle className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-purple-200 font-semibold">{user.name || 'N/A'}</p>
                  <p className="text-xs text-purple-400/70">{user.email}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ViewAdminUsers;
