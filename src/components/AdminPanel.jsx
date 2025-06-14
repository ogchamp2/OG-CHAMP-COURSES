
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, BookOpen, Users, Crown, UserCheck, UserX, ShieldCheck, ShieldOff, Send } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const AdminPanel = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();
  const { user, getAllUsers, grantPremiumAccess, revokePremiumAccess, isAdmin, toggleAdminStatus } = useAuth();
  
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '', description: '', imageUrl: '', category: '', duration: '', price: 0, isPremium: false, download_url: '', video_url: ''
  });

  const [isPremiumOfferDialogOpen, setIsPremiumOfferDialogOpen] = useState(false);
  const [editingPremiumOffer, setEditingPremiumOffer] = useState(null);
  const [premiumOfferFormData, setPremiumOfferFormData] = useState({ title: '', description: '', price: 5, image_url: '', download_url: '', tutorial_url: '' });
  const [premiumOffers, setPremiumOffers] = useState([]);

  const [usersList, setUsersList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  
  const [notification, setNotification] = useState({ title: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const fetchAdminData = async () => {
    setIsLoadingUsers(true);
    const usersData = await getAllUsers();
    setUsersList(usersData || []);
    setIsLoadingUsers(false);
    
    setIsLoadingOffers(true);
    try {
        const { data, error } = await supabase.from('premium_offers').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setPremiumOffers(data || []);
    } catch(error) {
        toast({ title: "Error", description: `Failed to load premium offers: ${error.message}`, variant: "destructive"});
    } finally {
        setIsLoadingOffers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
        fetchAdminData();
    }
  }, [isAdmin]);

  const resetCourseForm = () => {
    setCourseFormData({ title: '', description: '', imageUrl: '', category: '', duration: '', price: 0, isPremium: false, download_url: '', video_url: '' });
    setEditingCourse(null);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!courseFormData.title || !courseFormData.description || !courseFormData.imageUrl) {
      toast({ title: "Error", description: "Please fill in title, description, and image URL", variant: "destructive" });
      return;
    }
    if (editingCourse) {
      await updateCourse(editingCourse.id, { ...courseFormData, id: editingCourse.id });
    } else {
      await addCourse(courseFormData);
    }
    resetCourseForm();
    setIsCourseDialogOpen(false);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({ 
        title: course.title, 
        description: course.description, 
        imageUrl: course.image_url,
        download_url: course.download_url || '',
        video_url: course.video_url || '',
        category: course.category, 
        duration: course.duration, 
        price: course.price, 
        isPremium: course.is_premium
    });
    setIsCourseDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };
  
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
            await supabase.from('premium_offers').insert([premiumOfferFormData]).throwOnError();
        }
        resetPremiumOfferForm();
        setIsPremiumOfferDialogOpen(false);
        toast({ title: "Success", description: `Premium offer ${editingPremiumOffer ? 'updated' : 'added'}` });
        fetchAdminData();
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
            fetchAdminData();
        } catch (error) {
            toast({ title: "Error", description: `Failed to delete premium offer: ${error.message}`, variant: "destructive"});
        }
    }
  };

  const handleTogglePremiumAccess = async (userId) => {
    if (!isAdmin) return;
    const targetUser = usersList.find(u => u.id === userId);
    if (targetUser) {
      try {
        if (targetUser.has_premium_access) {
          await revokePremiumAccess(userId);
          toast({ title: "Success", description: `Premium access revoked for ${targetUser.email}`});
        } else {
          await grantPremiumAccess(userId);
          toast({ title: "Success", description: `Premium access granted to ${targetUser.email}`});
        }
        fetchAdminData();
      } catch (error) {}
    }
  };

  const handleToggleAdminStatus = async (userId) => {
    if (!isAdmin) return;
    const targetUser = usersList.find(u => u.id === userId);
    if (targetUser) {
        if (targetUser.email === 'ogchamptech@gmail.com') {
            toast({ title: "Action Forbidden", description: "Cannot change the role of the primary admin.", variant: "destructive" });
            return;
        }
        await toggleAdminStatus(userId, !targetUser.is_admin);
        fetchAdminData();
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notification.title || !notification.message) {
        toast({ title: "Error", description: "Title and message are required.", variant: "destructive" });
        return;
    }
    setIsSending(true);
    try {
        const { error } = await supabase.from('notifications').insert([notification]);
        if (error) throw error;
        toast({ title: "Success", description: "Global notification sent!" });
        setNotification({ title: '', message: '' });
    } catch (error) {
        toast({ title: "Error", description: `Failed to send notification: ${error.message}`, variant: "destructive" });
    } finally {
        setIsSending(false);
    }
  };

  const stats = {
    totalCourses: courses.length,
    totalUsers: usersList.length,
    premiumUsers: usersList.filter(u => u.has_premium_access || u.is_admin).length
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-300 brand-font neon-text">Admin Dashboard</h1>
          <p className="text-green-400/80 mt-2">Manage courses, premium offers, and user access</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Courses', value: stats.totalCourses, icon: <BookOpen className="w-6 h-6 text-green-400" /> },
          { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-400" /> },
          { title: 'Premium Users', value: stats.premiumUsers, icon: <Crown className="w-6 h-6 text-yellow-400" /> }
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * (idx + 1) }}>
            <Card className="hologram neon-glow"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-black/30 rounded-full">{stat.icon}</div><div><p className="text-green-400/80 text-sm">{stat.title}</p><p className="text-2xl font-bold text-green-300">{stat.value}</p></div></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Card className="hologram neon-glow">
        <CardHeader><CardTitle className="text-green-300">Send Global Notification</CardTitle><CardDescription className="text-green-400/80">Broadcast a message to all active users.</CardDescription></CardHeader>
        <CardContent>
            <form onSubmit={handleSendNotification} className="space-y-4">
                <Input value={notification.title} onChange={(e) => setNotification(p => ({...p, title: e.target.value}))} placeholder="Notification Title" className="bg-black/50 border-green-500/50 text-green-100"/>
                <Textarea value={notification.message} onChange={(e) => setNotification(p => ({...p, message: e.target.value}))} placeholder="Notification Message" className="bg-black/50 border-green-500/50 text-green-100"/>
                <Button type="submit" disabled={isSending} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 neon-glow">
                    <Send className="w-4 h-4 mr-2" /> {isSending ? 'Sending...' : 'Send Notification'}
                </Button>
            </form>
        </CardContent>
      </Card>
      
      <Card className="hologram neon-glow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle className="text-green-300">Manage Courses</CardTitle><CardDescription className="text-green-400/80">Add, edit, or delete courses.</CardDescription></div>
          <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
            <DialogTrigger asChild><Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 neon-glow" onClick={resetCourseForm}><Plus className="w-4 h-4 mr-2" /> Add Course</Button></DialogTrigger>
            <DialogContent className="hologram border-green-500/30 max-w-2xl"><DialogHeader><DialogTitle className="text-green-300">{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle></DialogHeader>
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                 <Input value={courseFormData.title} onChange={(e) => setCourseFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Course Title *" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Textarea value={courseFormData.description} onChange={(e) => setCourseFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Description *" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input value={courseFormData.imageUrl} onChange={(e) => setCourseFormData(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="Image URL *" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input value={courseFormData.video_url} onChange={(e) => setCourseFormData(prev => ({ ...prev, video_url: e.target.value }))} placeholder="Video URL (optional)" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input value={courseFormData.download_url} onChange={(e) => setCourseFormData(prev => ({ ...prev, download_url: e.target.value }))} placeholder="Download URL (optional)" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input value={courseFormData.category} onChange={(e) => setCourseFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input value={courseFormData.duration} onChange={(e) => setCourseFormData(prev => ({ ...prev, duration: e.target.value }))} placeholder="Duration" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <Input type="number" value={courseFormData.price} onChange={(e) => setCourseFormData(prev => ({ ...prev, price: Number(e.target.value) }))} placeholder="Price ($)" className="bg-black/50 border-green-500/50 text-green-100"/>
                 <div className="flex items-center space-x-2"><input type="checkbox" id="isPremiumCourse" checked={courseFormData.isPremium} onChange={(e) => setCourseFormData(prev => ({...prev, isPremium: e.target.checked}))} className="form-checkbox h-5 w-5 text-green-500 bg-black/50 border-green-500/50 rounded focus:ring-green-400"/><Label htmlFor="isPremiumCourse" className="text-green-300">Premium Course</Label></div>
                 <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">{editingCourse ? 'Update Course' : 'Create Course'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>{courses.map(course => (<motion.div key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-3 my-2 bg-black/30 rounded-lg border border-green-500/30"><img src={course.image_url} alt={course.title} className="w-12 h-12 object-cover rounded" /><div className="flex-1"><h3 className="text-green-300 font-semibold">{course.title} {course.is_premium && <Crown className="inline w-4 h-4 ml-1 text-yellow-400" />}</h3><p className="text-xs text-green-400/60">{course.category} - ${course.price}</p></div><Button size="sm" variant="outline" onClick={() => handleEditCourse(course)} className="border-green-500/50 text-green-300 hover:bg-green-500/20"><Edit className="w-3 h-3" /></Button><Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)} className="border-red-500/50 text-red-300 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /></Button></motion.div>))}</CardContent>
      </Card>

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
        <CardContent>{isLoadingOffers ? <p className="text-yellow-400/70 text-center">Loading offers...</p> : premiumOffers.map(offer => (<motion.div key={offer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-3 my-2 bg-black/30 rounded-lg border border-yellow-500/30">
            {offer.image_url && <img src={offer.image_url} alt={offer.title} className="w-12 h-12 object-cover rounded" />}
            {!offer.image_url && <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0" />}
            <div className="flex-1"><h3 className="text-yellow-300 font-semibold">{offer.title} - ${offer.price}</h3><p className="text-xs text-yellow-400/60">{offer.description}</p></div><Button size="sm" variant="outline" onClick={() => handleEditPremiumOffer(offer)} className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"><Edit className="w-3 h-3" /></Button><Button size="sm" variant="outline" onClick={() => handleDeletePremiumOffer(offer.id)} className="border-red-500/50 text-red-300 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /></Button></motion.div>))}</CardContent>
      </Card>

      <Card className="hologram neon-glow">
        <CardHeader><CardTitle className="text-green-300">Manage User Roles</CardTitle><CardDescription className="text-green-400/80">Grant or revoke premium and admin access for users.</CardDescription></CardHeader>
        <CardContent>{isLoadingUsers ? <p className="text-purple-400/70 text-center">Loading users...</p> : usersList.map(u => (<motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 my-2 bg-black/30 rounded-lg border border-purple-500/30">
            <div className="flex-1">
                <h3 className="text-purple-300 font-semibold flex items-c
