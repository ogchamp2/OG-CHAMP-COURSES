import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Menu, BookOpen, Crown, Tv2, Info, Phone, Settings } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import ThemeToggle from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navMenuItems = [
    { path: '/courses', icon: <BookOpen className="w-4 h-4 mr-2" />, label: 'Courses', color: 'text-green-500 dark:text-green-400' },
    { path: '/premium', icon: <Crown className="w-4 h-4 mr-2" />, label: 'Premium', color: 'text-yellow-500 dark:text-yellow-400' },
    { path: '/channels', icon: <Tv2 className="w-4 h-4 mr-2" />, label: 'Channels', color: 'text-cyan-500 dark:text-cyan-400' },
    { path: '/about', icon: <Info className="w-4 h-4 mr-2" />, label: 'About', color: 'text-sky-500 dark:text-sky-400' },
    { path: '/contact', icon: <Phone className="w-4 h-4 mr-2" />, label: 'Contact', color: 'text-pink-500 dark:text-pink-400' },
  ];

  if (isAdmin) {
    navMenuItems.push({ path: '/admin', icon: <Settings className="w-4 h-4 mr-2" />, label: 'Admin Panel', color: 'text-purple-500 dark:text-purple-400' });
  }

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-green-500/30 dark:border-purple-500/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            className="brand-font text-xl sm:text-2xl md:text-3xl neon-text dark:neon-text-purple cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/courses')}
          >
            〔𝗢𝗚 𝗖𝗛𝗔𝗠𝗣〕√ COURSE
          </motion.div>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeToggle />
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-green-400 dark:text-purple-400 hover:bg-green-500/20 dark:hover:bg-purple-500/20">
                    <Menu className="w-6 h-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-morphism border-green-500/30 dark:border-purple-500/30">
                  {user && (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-foreground dark:text-neutral-100">{user.name || user.email.split('@')[0]}</p>
                          <p className="text-xs leading-none text-muted-foreground dark:text-neutral-400">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 dark:bg-purple-600/30 dark:text-purple-300 rounded-full text-xs font-semibold self-start">
                              Admin
                            </span>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-green-500/30 dark:bg-purple-500/30"/>
                    </>
                  )}
                  <DropdownMenuGroup>
                    {navMenuItems.map((item) => (
                      <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className={`cursor-pointer ${item.color} focus:bg-green-500/10 dark:focus:bg-purple-500/10 focus:${item.color}`}>
                        {item.icon}
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-green-500/30 dark:bg-purple-500/30"/>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 dark:text-red-400 focus:bg-red-500/10 dark:focus:bg-red-500/10 focus:text-red-500 dark:focus:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
