
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Settings, MessageCircle, Youtube, Phone } from 'lucide-react';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleWhatsAppChannel = () => {
    window.open('https://whatsapp.com/channel/0029VaAqUqGCJOuXdE0YqV1H', '_blank');
  };

  const handleYouTube = () => {
    window.open('https://youtube.com/@ogchamp', '_blank');
  };

  const handleContact = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-green-500/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="brand-font text-2xl md:text-3xl neon-text"
            whileHover={{ scale: 1.05 }}
          >
            〔𝗢𝗚 𝗖𝗛𝗔𝗠𝗣〕√ COURSE
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleContact}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWhatsAppChannel}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleYouTube}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </Button>
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="text-green-300">{user.name}</span>
                  {isAdmin && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
