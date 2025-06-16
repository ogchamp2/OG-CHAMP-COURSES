import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ManagePremiumOffers = ({ offers, isLoading, fetchOffers, isAdmin }) => {
  const [isPremiumOfferDialogOpen, setIsPremiumOfferDialogOpen] = useState(false);
  const [editingPremiumOffer, setEditingPremiumOffer] = useState(null);
  const [premiumOfferFormData, setPremiumOfferFormData] = useState({ title: '', description: '', price: 5, image_url: '', download_url: '', tutorial_url: '' });

  const resetPremiumOfferForm = () => {
    setPremiumOfferFormData({ title: '', description: '', price: 5, image_url: '', download_url: '', tutorial_url: '' });
    setEditingPremiumOffer(null);
  };

  const handlePremiumOfferSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!premiumOfferFormData.title || !premiumOfferFormData.description) {
      toast({ title: "Error", description: "Please fill title and description for premium offer", variant: "destructive" });
      return;
    }
    try {
        if (editingPremiumOffer) {
            await supabase.from('premium_offers').update({ ...premiumOfferFormData, updated_at: new Date().toISOString() }).eq('id', editingPremiumOffer.id).throwOnError();
        } else {
            await supabase.from('premium_offers').insert([{ ...premiumOfferFormData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).throwOnError();
        }
        resetPremiumOfferForm();
        setIsPremiumOfferDialogOpen(false);
        toast({ title: "Success", description: `Premium offer ${editingPremiumOffer ? 'updated' : 'added'}` });
        fetchOffers();
    } catch (error) {
        toast({ title: "Error", description: `Failed to save premium offer: ${error.message}`, variant: "destructive"});
    }
  };

  const handleEditPremiumOffer = (offer) => {
    setEditingPremiumOffer(offer);
    setPremiumOfferFormData({ 
        title: offer.title, 
        description: offer.description, 
        price: offer.price,
        image_url: offer.image_url || '',
        download_url: offer.download_url || '',
        tutorial_url: offer.tutorial_url || ''
    });
    setIsPremiumOfferDialogOpen(true);
  };

  const handleDeletePremiumOffer = async (offerId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this premium offer?')) {
        try {
            await supabase.from('premium_offers').delete().eq('id', offerId).throwOnError();
            toast({ title: "Success", description: "Premium offer deleted" });
            fetchOffers();
        } catch (error) {
            toast({ title: "Error", description: `Failed to delete premium offer: ${error.message}`, variant: "destructive"});
        }
    }
  };

  return (
    <Card className="hologram neon-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle className="text-green-300">Manage Premium Offers</CardTitle><CardDescription className="text-green-400/80">Define what premium access includes.</CardDescription></div>
        <Dialog open={isPremiumOfferDialogOpen} onOpenChange={setIsPremiumOfferDialogOpen}><DialogTrigger asChild><Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 neon-glow" onClick={resetPremiumOfferForm}><Plus className="w-4 h-4 mr-2" /> Add Offer</Button></DialogTrigger>
        <DialogContent className="hologram border-yellow-500/30 max-w-lg">
          <DialogHeader><DialogTitle className="text-yellow-300">{editingPremiumOffer ? 'Edit Premium Offer' : 'Add New Premium Offer'}</DialogTitle></DialogHeader>
          <form onSubmit={handlePremiumOfferSubmit} className="space-y-4">
              <Input value={premiumOfferFormData.title} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Offer Title *" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Textarea value={premiumOfferFormData.description} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Description *" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Input type="number" value={premiumOfferFormData.price} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, price: Number(e.target.value) }))} placeholder="Price ($)" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Input value={premiumOfferFormData.image_url} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, image_url: e.target.value }))} placeholder="Image URL (optional)" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Input value={premiumOfferFormData.tutorial_url} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, tutorial_url: e.target.value }))} placeholder="Tutorial URL (optional)" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Input value={premiumOfferFormData.download_url} onChange={(e) => setPremiumOfferFormData(prev => ({ ...prev, download_url: e.target.value }))} placeholder="Download URL (optional)" className="bg-black/50 border-yellow-500/50 text-yellow-100"/>
              <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">{editingPremiumOffer ? 'Update Offer' : 'Create Offer'}</Button>
          </form>
        </DialogContent></Dialog>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-yellow-400/70 text-center">Loading offers...</p>}
        {!isLoading && offers.length === 0 && <p className="text-yellow-400/70 text-center">No premium offers available.</p>}
        {!isLoading && offers.map(offer => (
            <motion.div key={offer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-3 my-2 bg-black/30 rounded-lg border border-yellow-500/30">
                {offer.image_url ? (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.style.display = 'none';
                    }}
                  />
                ) : <Crown className="w-12 h-12 text-yellow-400 flex-shrink-0 p-2" />}
                <div className="flex-1">
                    <h3 className="text-yellow-300 font-semibold">{offer.title} - ${offer.price}</h3>
                    <p className="text-xs text-yellow-400/60">{offer.description}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleEditPremiumOffer(offer)} className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"><Edit className="w-3 h-3" /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDeletePremiumOffer(offer.id)} className="border-red-500/50 text-red-300 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /></Button>
            </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManagePremiumOffers;
