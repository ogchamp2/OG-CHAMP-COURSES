import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Rocket, Eye, Skull, Zap, Info, Banknote, MessageSquare, Send, CalendarDays, ShoppingCart, PackageOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const PremiumPage = () => {
  const { user, profile, hasPremiumAccess } = useAuth();
  const navigate = useNavigate();
  const [premiumOfferDetails, setPremiumOfferDetails] = useState([]); 
  const [isLoadingOfferDetails, setIsLoadingOfferDetails] = useState(true);

  useEffect(() => {
    if (!hasPremiumAccess) { 
      setIsLoadingOfferDetails(true);
      const fetchOfferDetails = async () => {
        try {
          const { data, error } = await supabase
            .from('premium_offers')
            .select('id, title, description, image_url')
            .order('created_at', {ascending: false});
          if (error) throw error;
          setPremiumOfferDetails(data || []);
        } catch (error) {
          console.error("Error fetching premium offer details for non-premium users:", error.message);
          toast({ title: "Info", description: "Could not load all premium feature details. Basic info shown.", variant: "default"});
          setPremiumOfferDetails([
              { id: 'default_offer_1', title: "Exclusive 'Hard Hack' Courses", description: "Unlock advanced hacking techniques, zero-day exploit analysis, and more.", image_url: null },
              { id: 'default_offer_2', title: "Full Course Catalog Access", description: "Gain access to every current and future course on the platform.", image_url: null },
              { id: 'default_offer_3', title: "Downloadable Resources & Tools", description: "Get supplementary materials, scripts, and tools for your learning.", image_url: null },
          ]);
        } finally {
          setIsLoadingOfferDetails(false);
        }
      };
      fetchOfferDetails();
    } else {
      setIsLoadingOfferDetails(false); 
    }
  }, [hasPremiumAccess]);

  const paymentDetails = {
    opayAccount: "8149498588",
    opayName: "Asikoto Medese",
    priceDollarsMonthly: 5,
    priceDollarsYearly: 25,
    telegramLink: "https://t.me/OGCHAMP2",
    whatsappNumber: "+22896342434"
  };

  const renderFallbackIcon = (index) => {
    switch(index % 3) {
      case 0: return <Eye className="w-10 h-10"/>;
      case 1: return <Skull className="w-10 h-10"/>;
      case 2: return <Zap className="w-10 h-10"/>;
      default: return <Eye className="w-10 h-10"/>;
    }
  };

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Crown className="w-10 h-10 text-yellow-400 dark:text-yellow-300 animate-pulse" />
          <h1 className="text-5xl font-bold text-green-300 dark:text-purple-300 brand-font neon-text">Premium Zone</h1>
        </div>
        <p className="text-xl text-green-400/80 dark:text-purple-400/80 max-w-3xl mx-auto">
          {hasPremiumAccess ? "Welcome to your exclusive content area." : "Elevate your skills with exclusive content and advanced methods."}
        </p>
      </motion.div>

      {hasPremiumAccess ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center">
           <Card className="hologram neon-glow max-w-2xl mx-auto border-yellow-500/50 dark:border-yellow-400/50">
            <CardHeader>
              <CardTitle className="text-3xl text-yellow-300 dark:text-yellow-200 flex items-center justify-center gap-2">
                <Shield className="w-8 h-8"/> Access Granted!
              </CardTitle>
              <CardDescription className="text-yellow-400/80 dark:text-yellow-300/80 text-lg">
                Welcome, {profile?.name || user?.email}! You have full access to all premium content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-300 dark:text-purple-300">
                Your premium tier: <strong className="text-yellow-300 dark:text-yellow-200">{profile?.premium_tier || 'N/A'}</strong>.
              </p>
              {profile?.premium_expires_at && (
                <p className="text-green-300 dark:text-purple-300">
                  Access valid until: <strong className="text-yellow-300 dark:text-yellow-200">{new Date(profile.premium_expires_at).toLocaleDateString()}</strong>.
                </p>
              )}
               {!profile?.premium_expires_at && profile?.has_premium_access && !profile?.is_admin && (
                 <p className="text-green-300 dark:text-purple-300">
                  Your access type: <strong className="text-yellow-300 dark:text-yellow-200">Lifetime (Legacy)</strong>.
                </p>
              )}
              <Button 
                onClick={() => navigate('/premium-offers')} 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 dark:from-yellow-400 dark:to-amber-500 dark:hover:from-yellow-500 dark:hover:to-amber-600 neon-glow text-white dark:text-black"
              >
                <Rocket className="w-5 h-5 mr-2"/> View Premium Offers
              </Button>
            </CardContent>
           </Card>
        </motion.div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-bold text-green-300 dark:text-purple-300 text-center mb-8">Premium Subscription Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 dark:border-yellow-400/30 flex flex-col">
                <CardHeader className="text-center">
                  <Crown className="w-12 h-12 text-yellow-400 dark:text-yellow-300 mx-auto mb-2"/>
                  <CardTitle className="text-yellow-300 dark:text-yellow-200 text-2xl">Monthly Access</CardTitle>
                  <CardDescription className="text-yellow-400/80 dark:text-yellow-300/80">Full access, renewed monthly.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between items-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-200 dark:text-yellow-100">${paymentDetails.priceDollarsMonthly}</p>
                    <p className="text-yellow-400/70 dark:text-yellow-300/70">per month</p>
                  </div>
                  <ul className="text-green-300/90 dark:text-purple-300/90 space-y-1 my-4 text-sm list-disc list-inside">
                    <li>All Premium Courses</li>
                    <li>Exclusive Content</li>
                    <li>Priority Support</li>
                  </ul>
                  <Button 
                    onClick={() => document.getElementById('manual-payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 dark:from-yellow-400 dark:to-amber-500 dark:hover:from-yellow-500 dark:hover:to-amber-600 neon-glow text-white dark:text-black"
                  >
                    <Info className="w-5 h-5 mr-2"/> How to Subscribe
                  </Button>
                </CardContent>
              </Card>

              <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 dark:border-yellow-400/30 flex flex-col ring-2 ring-yellow-400 dark:ring-yellow-300 shadow-yellow-500/30 dark:shadow-yellow-400/30">
                <CardHeader className="text-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 dark:bg-yellow-400 text-black px-3 py-1 text-xs font-bold rounded-full">BEST VALUE</div>
                  <CalendarDays className="w-12 h-12 text-yellow-400 dark:text-yellow-300 mx-auto mb-2"/>
                  <CardTitle className="text-yellow-300 dark:text-yellow-200 text-2xl">Yearly Access</CardTitle>
                  <CardDescription className="text-yellow-400/80 dark:text-yellow-300/80">Save big with annual billing!</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between items-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-200 dark:text-yellow-100">${paymentDetails.priceDollarsYearly}</p>
                    <p className="text-yellow-400/70 dark:text-yellow-300/70">per year</p>
                  </div>
                   <ul className="text-green-300/90 dark:text-purple-300/90 space-y-1 my-4 text-sm list-disc list-inside">
                    <li>All Monthly Benefits</li>
                    <li>Significant Cost Savings</li>
                    <li>Year-long Access</li>
                  </ul>
                   <Button 
                    onClick={() => document.getElementById('manual-payment-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 dark:from-yellow-300 dark:to-amber-400 dark:hover:from-yellow-400 dark:hover:to-amber-500 neon-glow text-black font-semibold"
                  >
                    <Info className="w-5 h-5 mr-2"/> How to Subscribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold text-green-300 dark:text-purple-300 text-center mb-8">What You Get With Premium</h2>
            {isLoadingOfferDetails ? (
                <div className="text-center text-yellow-400 dark:text-yellow-300">
                  <div className="animate-spin w-8 h-8 border-2 border-yellow-500 dark:border-yellow-400 border-t-transparent rounded-full mx-auto mb-3"></div>
                  Loading premium benefits...
                </div>
            ) : premiumOfferDetails.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumOfferDetails.map((offer, index) => (
                  <motion.div key={offer.id || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 dark:border-yellow-400/30 flex flex-col">
                      <div className="w-full h-48 relative overflow-hidden rounded-t-md">
                        {offer.image_url ? (
                          <img 
                            src={offer.image_url}
                            alt={offer.title || 'Premium Benefit Image'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center bg-black/30 dark:bg-neutral-700/30';
                              fallback.innerHTML = `
                                <div class="p-3 bg-yellow-500/20 dark:bg-yellow-400/20 rounded-full text-yellow-400 dark:text-yellow-300">
                                  ${renderFallbackIcon(index).props.className.includes('Eye') ? '<Eye class="w-10 h-10"/>' : 
                                    renderFallbackIcon(index).props.className.includes('Skull') ? '<Skull class="w-10 h-10"/>' : 
                                    '<Zap class="w-10 h-10"/>'}
                                </div>
                              `;
                              e.target.parentNode.replaceChild(fallback, e.target);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/30 dark:bg-neutral-700/30">
                            <div className="p-3 bg-yellow-500/20 dark:bg-yellow-400/20 rounded-full text-yellow-400 dark:text-yellow-300">
                              {renderFallbackIcon(index)}
                            </div>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-yellow-300 dark:text-yellow-200 text-xl">{offer.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <CardDescription className="text-yellow-400/80 dark:text-yellow-300/80 mb-3 flex-1">{offer.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                  <PackageOpen className="w-16 h-16 text-yellow-400/50 dark:text-yellow-300/50 mx-auto mb-4" />
                  <h3 className="text-xl text-yellow-300 dark:text-yellow-200 mb-2">Premium Benefits Information Coming Soon</h3>
                  <p className="text-yellow-400/80 dark:text-yellow-300/80 max-w-md mx-auto">
                      Details about exclusive courses, resources, and tools available to premium members will be listed here. Expect great things!
                  </p>
              </div>
            )}
          </motion.div>

          <motion.div id="manual-payment-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="hologram neon-glow max-w-3xl mx-auto border-green-500/40 dark:border-purple-500/40">
              <CardHeader>
                <CardTitle className="text-2xl text-green-300 dark:text-purple-300 flex items-center gap-2">
                  <Banknote className="w-7 h-7"/> Manual Payment & Activation
                </CardTitle>
                <CardDescription className="text-green-400/80 dark:text-purple-400/80">
                  To get premium access: Monthly <strong className="text-yellow-400 dark:text-yellow-300">${paymentDetails.priceDollarsMonthly} USD</strong>, Yearly <strong className="text-yellow-400 dark:text-yellow-300">${paymentDetails.priceDollarsYearly} USD</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-200 dark:text-purple-200 mb-2">Payment (Nigeria):</h3>
                  <p className="text-green-300 dark:text-purple-300">
                    Send equivalent in Naira via OPay:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 text-green-300 dark:text-purple-300 space-y-1">
                    <li>Account Number: <strong className="text-yellow-300 dark:text-yellow-200">{paymentDetails.opayAccount}</strong></li>
                    <li>Account Name: <strong className="text-yellow-300 dark:text-yellow-200">{paymentDetails.opayName}</strong></li>
                    <li>Bank: <strong className="text-yellow-300 dark:text-yellow-200">OPay</strong></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-200 dark:text-purple-200 mb-2">Payment (International):</h3>
                  <p className="text-green-300 dark:text-purple-300">
                    For users outside Nigeria, please contact us to discuss payment methods:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                     <Button 
                        onClick={() => window.open(`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}?text=Hello OG CHAMP, I'm interested in premium access (manual payment). My registered email is ${user?.email || '[Please provide your registered email]'}`, '_blank')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 dark:from-green-400 dark:to-teal-400 dark:hover:from-green-500 dark:hover:to-teal-500 neon-glow text-white"
                     >
                        <MessageSquare className="w-5 h-5 mr-2"/> Contact via WhatsApp
                     </Button>
                     <Button 
                        onClick={() => window.open(`${paymentDetails.telegramLink}?start=premium_inquiry_email=${user?.email || '[Please provide your registered email]'}`, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 dark:from-blue-400 dark:to-indigo-400 dark:hover:from-blue-500 dark:hover:to-indigo-500 neon-glow text-white"
                     >
                        <Send className="w-5 h-5 mr-2"/> Contact via Telegram
                     </Button>
                  </div>
                </div>
                 <div>
                  <h3 className="text-xl font-semibold text-green-200 dark:text-purple-200 mb-2">After Payment:</h3>
                  <p className="text-green-300 dark:text-purple-300">
                    Send a screenshot of your payment confirmation to us via Telegram or WhatsApp. Include your registered email: <strong className="text-yellow-300 dark:text-yellow-200">{user?.email || "[Your Registered Email]"}</strong> and specify if it's for Monthly or Yearly.
                  </p>
                   <ul className="list-disc list-inside ml-4 mt-2 text-green-300 dark:text-purple-300 space-y-1">
                      <li>Telegram: <a href={paymentDetails.telegramLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{paymentDetails.telegramLink}</a></li>
                      <li>WhatsApp: <a href={`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{paymentDetails.whatsappNumber}</a></li>
                   </ul>
                  <p className="text-green-400/80 dark:text-purple-400/80 mt-2 text-sm">
                    Once confirmed, an admin will grant your account premium access.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-black/40 dark:bg-neutral-700/30 border border-red-500/50 dark:border-red-400/50 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-400 dark:text-red-300 flex items-center gap-2"><Info className="w-5 h-5"/>Important Note</h4>
                    <p className="text-red-300/90 dark:text-red-200/90 text-sm mt-1">
                        Premium access is granted manually by an administrator after payment confirmation. Please allow some time for processing. Ensure your payment screenshot clearly shows the transaction details and that you provide your registered email address.
                    </p>
                </div>
       
