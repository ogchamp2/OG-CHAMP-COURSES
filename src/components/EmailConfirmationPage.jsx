
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const EmailConfirmationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Email Confirmed!",
        description: "Welcome! You are now logged in and being redirected.",
      });
      navigate('/courses');
    }
  }, [isAuthenticated, navigate]);

  const handleResend = async () => {
    if (!user?.email) {
      toast({ title: "Error", description: "No user email found to resend confirmation.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Confirmation email sent again. Check your inbox and spam folder." });
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-lg hologram neon-glow text-center">
          <CardHeader>
            <MailCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-300">Confirm Your Email</CardTitle>
            <CardDescription className="text-green-400/80 text-lg">
              A confirmation link has been sent to your email address:
            </CardDescription>
            <p className="text-xl font-bold text-yellow-300 pt-2">{user?.email || 'your email'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-300">
              Please click the link in that email to complete your registration. You will be able to log in after confirming.
            </p>
            <p className="text-sm text-green-400/70">
              (Don't forget to check your spam or promotions folder!)
            </p>
            <Button onClick={handleResend} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white neon-glow">
              <Send className="w-4 h-4 mr-2" />
              Resend Confirmation Email
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailConfirmationPage;
