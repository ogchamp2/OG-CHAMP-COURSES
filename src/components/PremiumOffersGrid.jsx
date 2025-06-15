import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Download, Video, PackageOpen } from 'lucide-react';

const PremiumOffersGrid = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('premium_offers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setOffers(data || []);
      } catch (error) {
        toast({ title: "Error", description: "Could not load premium offers.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-yellow-400">Loading Premium Offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Crown className="w-10 h-10 text-yellow-400 animate-pulse" />
          <h1 className="text-5xl font-bold text-yellow-300 brand-font neon-text">Your Premium Offers</h1>
        </div>
        <p className="text-xl text-yellow-400/80 max-w-3xl mx-auto">
          Here is your exclusive content. Access tutorials and download materials below.
        </p>
      </motion.div>

      {offers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <PackageOpen className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
            <h3 className="text-xl text-yellow-300 mb-2">No Offers Available</h3>
            <p className="text-yellow-400/80">
                It looks like no premium offers have been added yet. Please check back later.
            </p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div key={offer.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="hologram neon-glow h-full hover:shadow-2xl transition-all duration-300 border-yellow-500/30 flex flex-col">
                {offer.image_url ? (
                  <div className="w-full h-48 overflow-hidden rounded-t-md">
                    <img 
                      src={offer.image_url} 
                      alt={offer.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 800 400'%3E%3Crect fill='%23222222' width='800' height='400'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='16' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-black/30 rounded-t-md flex items-center justify-center">
                    <Crown className="w-16 h-16 text-yellow-500/50" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-xl">{offer.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <CardDescription className="text-yellow-400/80 mb-4">{offer.description}</CardDescription>
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                    {offer.tutorial_url && (
                      <Button onClick={() => window.open(offer.tutorial_url, '_blank')} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white neon-glow">
                        <Video className="w-4 h-4 mr-2" />
                        Tutorial
                      </Button>
                    )}
                    {offer.download_url && (
                       <Button onClick={() => window.open(offer.download_url, '_blank')} className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white neon-glow">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PremiumOffersGrid;
