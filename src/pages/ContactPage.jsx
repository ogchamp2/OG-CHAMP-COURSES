import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Send, MessageSquare, User, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Message Not Sent (Yet!)",
      description: "This contact form isn't connected to a backend. For inquiries, please use the WhatsApp or Telegram links!",
      variant: "default",
      duration: 7000,
    });
  };
  
  const socialLinks = [
    { name: 'WhatsApp Direct', icon: <Phone className="w-5 h-5 mr-2"/>, href: 'https://wa.me/22896342434', color: 'green' },
    { name: 'Telegram Community', icon: <Send className="w-5 h-5 mr-2"/>, href: 'https://t.me/OGCHAMP2', color: 'blue' },
    { name: 'WhatsApp Channel', icon: <MessageSquare className="w-5 h-5 mr-2"/>, href: 'https://whatsapp.com/channel/0029VaAqUqGCJOuXdE0YqV1H', color: 'teal' },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      {/* Rest of your component remains the same */}
      <div className="text-center mb-12">
        <Mail className="w-16 h-16 text-green-400 dark:text-purple-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-5xl font-bold brand-font text-green-300 dark:text-purple-300 neon-text">Get In Touch</h1>
        <p className="text-xl text-green-400/80 dark:text-purple-400/80 mt-2">
          Have questions, feedback, or need support? We're here to help!
        </p>
      </div>

      {/* ... rest of your existing JSX ... */}
    </motion.div>
  );
};

export default ContactPage;
