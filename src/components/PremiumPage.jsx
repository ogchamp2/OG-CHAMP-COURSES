import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Rocket, Eye, Skull, Zap, Info, Banknote, MessageSquare, Send } from 'lucide-react';
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
            { id: 'default1', title: "Hard Hack Mastery (Default)", description: "Unlock advanced hacking techniques and methodologies.", price: 5, image_url: null },
            { id: 'default2', title: "Cyber Warfare Tools (Default)", description: "Access to a suite of powerful hacking courses.", price: 5, image_url: null },
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
    priceDollars: 5,
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
              <p className="text-green-300">Explore the premium courses and materials available to you. Your journey into advanced techniques starts now.</p>
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
            <h2 className="text-3xl font-bold text-green-300 text-center mb-8">Premium Offerings</h2>
            {isLoadingOffers ? (
                <div className="text-center text-yellow-400">Loading premium offers...</div>
            ) : premiumOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumOffers.map((offer, index) => (
                  <motion.div key={offer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 flex flex-col">
                      {offer.image_url && (
                          <img-replace src={offer.image_url} alt={offer.title} className="w-full h-48 object-cover"/>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-3">
                           {!offer.image_url && (
                             <div className="p-3 bg-yellow-500/20 rounded-full text-yellow-400">
                                {index % 3 === 0 ? <Eye className="w-7 h-7"/> : index % 3 === 1 ? <Skull className="w-7 h-7"/> : <Zap className="w-7 h-7"/>}
                             </div>
                           )}
                          <CardTitle className="text-yellow-300 text-xl">{offer.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <CardDescription className="text-yellow-400/80 mb-3 flex-1">{offer.description}</CardDescription>
                        <p className="text-2xl font-bold text-yellow-200 mt-2">${offer.price}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-yellow-400/80">No premium offers currently defined. Check back soon!</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="hologram neon-glow max-w-3xl mx-auto border-green-500/40">
              <CardHeader>
                <CardTitle className="text-2xl text-green-300 flex items-center gap-2">
                  <Banknote className="w-7 h-7"/> How to Get Premium Access
                </CardTitle>
                <CardDescription className="text-green-400/80">
                  Follow these steps to unlock the premium zone. Price: <strong className="text-yellow-400">${paymentDetails.priceDollars} USD</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">Payment (Nigeria):</h3>
                  <p className="text-green-300">
                    Send <strong className="text-yellow-400">${paymentDetails.priceDollars} (USD equivalent in Naira)</strong> via OPay:
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
                        onClick={() => window.open(`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}?text=Hello OG CHAMP, I'm interested in premium access for ${paymentDetails.priceDollars} from outside Nigeria. My registered email is ${user?.email || '[Please provide your registered email]'}`, '_blank')}
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
                    Send a screenshot of your payment confirmation to us via Telegram or WhatsApp. Include your registered email: <strong className="text-yellow-300">{user?.email || "[Your Registered Email]"}</strong>
                  </p>
                   <ul className="list-disc list-inside ml-4 mt-2 text-green-300 space-y-1">
                      <li>Telegram: <a href={paymentDetails.telegramLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{paymentDetails.telegramLink}</a></li>
                      <li>WhatsApp: <a href={`https://wa.me/${paymentDetails.whatsappNumber.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{paymentDetails.whatsappNumber}</a></li>
                   </ul>
                  <p className="text-green-400/80 mt-2 text-sm">
                    Once confirmed, your account will be granted premium access.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-black/40 border border-red-500/50 rounded-lg">
                    <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2"><Info className="w-5 h-5"/>Important Note</h4>
                    <p className="text-red-300/90 text-sm mt-1">
                        Premium access is typically granted within a few hours of payment confirmation. Please be patient. Ensure your payment screenshot clearly shows the transaction details and that you provide your registered email address.
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