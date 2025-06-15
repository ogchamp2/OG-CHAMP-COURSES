
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Rocket, Eye, Skull, Zap, Info, Banknote, MessageSquare, Send, CalendarDays, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const PremiumPage = () => {
  const { user, profile, hasPremiumAccess } = useAuth();
  const navigate = useNavigate();
  const [premiumOffers, setPremiumOffers] = useState([]); 
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);

  useEffect(() => {
    const fetchPremiumOffers = async () => {
      setIsLoadingOffers(true);
      try {
        const { data, error } = await supabase.from('premium_offers').select('*').order('created_at', {ascending: false});
        if (error) throw error;
        setPremiumOffers(data || []);
      } catch (error) {
        console.error("Error fetching premium offers:", error.message);
        toast({ title: "Error", description: "Could not load premium offers.", variant: "destructive"});
        setPremiumOffers([
            { id: 'default1', title: "Hard Hack Mastery (Default)", description: "Unlock advanced hacking techniques and methodologies.", price: 0, image_url: null },
            { id: 'default2', title: "Cyber Warfare Tools (Default)", description: "Access to a suite of powerful hacking courses.", price: 0, image_url: null },
        ]);
      } finally {
        setIsLoadingOffers(false);
      }
    };
    fetchPremiumOffers();
  }, []);

  const paymentDetails = {
    opayAccount: "8149498588",
    opayName: "Asikoto Medese",
    priceDollarsMonthly: 5,
    priceDollarsYearly: 25,
    telegramLink: "https://t.me/OGCHAMP2",
    whatsappNumber: "+22896342434"
  };

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
          <h1 className="text-5xl font-bold text-green-300 brand-font neon-text">Premium Zone</h1>
        </div>
        <p className="text-xl text-green-400/80 max-w-3xl mx-auto">
          Elevate your skills with exclusive "Hard Hack" courses and advanced methods. For serious learners only.
        </p>
      </motion.div>

      {hasPremiumAccess ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center">
           <Card className="hologram neon-glow max-w-2xl mx-auto border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-3xl text-yellow-300 flex items-center justify-center gap-2">
                <Shield className="w-8 h-8"/> Access Granted!
              </CardTitle>
              <CardDescription className="text-yellow-400/80 text-lg">
                Welcome, {profile?.name || user?.email}! You have full access to all premium content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-300">
                Your premium tier: <strong className="text-yellow-300">{profile?.premium_tier || 'N/A'}</strong>.
              </p>
              {profile?.premium_expires_at && (
                <p className="text-green-300">
                  Access valid until: <strong className="text-yellow-300">{new Date(profile.premium_expires_at).toLocaleDateString()}</strong>.
                </p>
              )}
               {!profile?.premium_expires_at && profile?.has_premium_access && !profile?.is_admin && (
                 <p className="text-green-300">
                  Your access type: <strong className="text-yellow-300">Lifetime (Legacy)</strong>.
                </p>
              )}
              <Button 
                onClick={() => navigate('/premium-offers')} 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 neon-glow text-white">
                <Rocket className="w-5 h-5 mr-2"/> View Premium Offers
              </Button>
            </CardContent>
           </Card>
        </motion.div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-bold text-green-300 text-center mb-8">Premium Subscription Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan Info */}
              <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 flex flex-col">
                <CardHeader className="text-center">
                  <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-2"/>
                  <CardTitle className="text-yellow-300 text-2xl">Monthly Access</CardTitle>
                  <CardDescription className="text-yellow-400/80">Full access, renewed monthly.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between items-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-200">${paymentDetails.priceDollarsMonthly}</p>
                    <p className="text-yellow-400/70">per month</p>
                  </div>
                  <ul className="text-green-300/90 space-y-1 my-4 text-sm list-disc list-inside">
                    <li>All Premium Courses</li>
                    <li>Exclusive Content</li>
                    <li>Priority Support (via contact)</li>
                  </ul>
                  <Button 
                    onClick={() => document.getElementById('manual-payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 neon-glow text-white"
                  >
                    <Info className="w-5 h-5 mr-2"/> How to Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Yearly Plan Info */}
              <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 flex flex-col ring-2 ring-yellow-400 shadow-yellow-500/30">
                <CardHeader className="text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rounded-full">BEST VALUE</div>
                  <CalendarDays className="w-12 h-12 text-yellow-400 mx-auto mb-2"/>
                  <CardTitle className="text-yellow-300 text-2xl">Yearly Access</CardTitle>
                  <CardDescription className="text-yellow-400/80">Save big with annual billing!</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between items-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-200">${paymentDetails.priceDollarsYearly}</p>
                    <p className="text-yellow-400/70">per year</p>
                  </div>
                   <ul className="text-green-300/90 space-y-1 my-4 text-sm list-disc list-inside">
                    <li>All Monthly Benefits</li>
                    <li>Significant Cost Savings</li>
                    <li>Year-long Uninterrupted Access</li>
                  </ul>
                   <Button 
                    onClick={() => document.getElementById('manual-payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 neon-glow text-black font-semibold"
                  >
                    <Info className="w-5 h-5 mr-2"/> How to Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold text-green-300 text-center mb-8">What You Get</h2>
            {isLoadingOffers ? (
                <div className="text-center text-yellow-400">Loading premium offer details...</div>
            ) : premiumOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumOffers.map((offer, index) => (
                  <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 flex flex-col">
                      {offer.image_url ? (
                          <img-replace src={offer.image_url} alt={offer.title || 'Premium Offer Image'} class="w-full h-48 object-cover rounded-t-md" />
                      ) : (
                        <div className="w-full h-48 bg-black/30 rounded-t-md flex items-center justify-center">
                           <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
                              {index % 3 === 0 ? <Eye className="w-10 h-10"/> : index % 3 === 1 ? <Skull className="w-10 h-10"/> : <Zap className="w-10 h-10"/>}
                           </div>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-yellow-300 text-xl">{offer.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <CardDescription className="text-yellow-400/80 mb-3 flex-1">{offer.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-yellow-400/80">No specific premium offer details defined yet, but you get access to all premium courses!</p>
            )}
          </motion.div>

          <motion.div id="manual-payment-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="hologram neon-glow max-w-3xl mx-auto border-green-500/40">
              <CardHeader>
                <CardTitle className="text-2xl text-green-300 flex items-center gap-2">
                  <Banknote className="w-7 h-7"/> Manual Payment & Activation
                </CardTitle>
                <CardDescription className="text-green-400/80">
                  To get premium access: Monthly <strong className="text-yellow-400">${paymentDetails.priceDollarsMonthly} USD</strong>, Yearly <strong className="text-yellow-400">${paymentDetails.priceDollarsYearly} USD</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Payment (Nigeria):</h3>
                  <p className="text-green-300">
                    Send equivalent in Naira via OPay:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 text-green-300 space-y-1">
                    <li>Account Number: <strong className="text-yellow-300">{paymentDetails.opayAccount}</strong></li>
                    <li>Account Name: <strong className="text-yellow-300">{paymentDetails.opayName}</strong></li>
                    <li>Bank: <strong className="text-yellow-300">OPay</strong></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Payment (International):</h3>
                  <p className="text-green-300">
                    For users outside Nigeria, please contact us to discuss payment methods:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                     <Button 
                        onClick={() => window.open(`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}?text=Hello OG CHAMP, I'm interested in premium access (manual payment). My registered email is ${user?.email || '[Please provide your registered email]'}`, '_blank')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 neon-glow text-white"
                     >
                        <MessageSquare className="w-5 h-5 mr-2"/> Contact via WhatsApp
                     </Button>
                     <Button 
                        onClick={() => window.open(`${paymentDetails.telegramLink}?start=premium_inquiry_email=${user?.email || '[Please provide your registered email]'}`, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 neon-glow text-white"
                     >
                        <Send className="w-5 h-5 mr-2"/> Contact via Telegram
                     </Button>
                  </div>
                </div>
                 <div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">After Payment:</h3>
                  <p className="text-green-300">
                    Send a screenshot of your payment confirmation to us via Telegram or WhatsApp. Include your registered email: <strong className="text-yellow-300">{user?.email || "[Your Registered Email]"}</strong> and specify if it's for Monthly or Yearly.
                  </p>
                   <ul className="list-disc list-inside ml-4 mt-2 text-green-300 space-y-1">
                      <li>Telegram: <a href={paymentDetails.telegramLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{paymentDetails.telegramLink}</a></li>
                      <li>WhatsApp: <a href={`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{paymentDetails.whatsappNumber}</a></li>
                   </ul>
                  <p className="text-green-400/80 mt-2 text-sm">
                    Once confirmed, an admin will grant your account premium access.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-black/40 border border-red-500/50 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2"><Info className="w-5 h-5"/>Important Note</h4>
                    <p className="text-red-300/90 text-sm mt-1">
                        Premium access is granted manually by an administrator after payment confirmation. Please allow some time for processing. Ensure your payment screenshot clearly shows the transaction details and that you provide your registered email address.
                    </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default PremiumPage;
                    
