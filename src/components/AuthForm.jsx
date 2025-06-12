
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { MessageCircle, Rocket, Shield } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [channelIndex, setChannelIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem('whatsappChannelIndex');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });
  const [channelsJoined, setChannelsJoined] = useState(false);

  const whatsappChannels = [
    { name: "OG CHAMP UPDATES 1", url: 'https://whatsapp.com/channel/0029VaN2eQQ59PwNixDnvD16/7593' },
    { name: "OG CHAMP UPDATES 2", url: 'https://whatsapp.com/channel/0029Vb3wqli8V0tfOrWXwk2K' }
  ];

  useEffect(() => {
    if (channelIndex >= whatsappChannels.length) {
      setChannelsJoined(true);
    }
  }, [channelIndex, whatsappChannels.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && !channelsJoined) {
      toast({
        title: "WhatsApp Channels Required",
        description: `Please join all WhatsApp channels to register.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isLogin) {
        if (!formData.email || !formData.password) throw new Error("Email and password are required.");
        await login(formData);
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        navigate('/courses');
      } else {
        if (!formData.name || !formData.email || !formData.password) throw new Error("All fields are required.");
        const newUser = await register(formData);
        if (newUser) {
          toast({ title: "Registration Successful!", description: "Please check your email to confirm your account." });
          sessionStorage.removeItem('whatsappChannelIndex');
          navigate('/confirm-email');
        }
      }
    } catch (error) {
       if(!error.message.includes("supabase")){
          toast({ title: "Error", description: error.message, variant: "destructive" });
       }
    }
  };

  const handleWhatsAppJoin = () => {
    if (channelIndex < whatsappChannels.length) {
      window.open(whatsappChannels[channelIndex].url, '_blank');
      toast({
        title: `Joining ${whatsappChannels[channelIndex].name}...`,
        description: "After joining, the next step will unlock here.",
      });
      
      const nextIndex = channelIndex + 1;
      setChannelIndex(nextIndex);
      sessionStorage.setItem('whatsappChannelIndex', nextIndex.toString());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 space-bg">
      <div className="cyber-grid absolute inset-0 opacity-20"></div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
        <Card className="w-full max-w-md hologram neon-glow">
          <CardHeader className="text-center">
            <motion.div className="brand-font text-3xl neon-text mb-4" animate={{ textShadow: ['0 0 10px rgba(0, 255, 127, 0.8)', '0 0 20px rgba(0, 255, 127, 1)', '0 0 10px rgba(0, 255, 127, 0.8)'] }} transition={{ duration: 2, repeat: Infinity }}>
              〔𝗢𝗚 𝗖𝗛𝗔𝗠𝗣〕√
            </motion.div>
            <CardTitle className="text-2xl text-green-300">{isLogin ? 'Welcome Back' : 'Join the Future'}</CardTitle>
            <CardDescription className="text-green-400/80">{isLogin ? 'Access your space-tech courses' : 'Create your cosmic learning account'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (<div className="space-y-2"><Label htmlFor="name" className="text-green-300">Name</Label><Input id="name" type="text" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="bg-black/50 border-green-500/50 text-green-100 placeholder:text-green-400/60"/></div>)}
              <div className="space-y-2"><Label htmlFor="email" className="text-green-300">Email</Label><Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-black/50 border-green-500/50 text-green-100 placeholder:text-green-400/60"/></div>
              <div className="space-y-2"><Label htmlFor="password" className="text-green-300">Password</Label><Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))} className="bg-black/50 border-green-500/50 text-green-100 placeholder:text-green-400/60"/></div>
              {!isLogin && (
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-green-400" /><span className="text-sm text-green-300">{channelsJoined ? "All Channels Verified!" : `Join: ${whatsappChannels[channelIndex]?.name}`}</span></div>
                    {channelsJoined ? (<div className="flex items-center gap-1 text-green-400"><Shield className="w-4 h-4" /><span>Completed</span></div>) : (<Button type="button" size="sm" onClick={handleWhatsAppJoin} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>{channelIndex < whatsappChannels.length -1 ? "Join & Next" : "Join Last Channel"}</Button>)}
                  </div>
                  {channelIndex < whatsappChannels.length && !channelsJoined && (<p className="text-xs text-green-400/70 text-center">You need to join {whatsappChannels.length - channelIndex} more channel(s).</p>)}
                </div>
              )}
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold neon-glow" disabled={(!isLogin && !channelsJoined) || isLoading}>{isLoading ? 'Processing...' : <><Rocket className="w-4 h-4 mr-2" /> {isLogin ? 'Launch Into Courses' : 'Create Account'}</>}</Button>
            </form>
            <div className="mt-6 text-center"><Button variant="ghost" onClick={() => setIsLogin(!isLogin)} className="text-green-400 hover:text-green-300" disabled={isLoading}>{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</Button></div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthForm;
