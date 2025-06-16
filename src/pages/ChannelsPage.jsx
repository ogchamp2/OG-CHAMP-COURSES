import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import * as LucideIcons from 'lucide-react';

const ChannelsPage = () => {
  const { isAdmin, user } = useAuth(); // Added user to check if auth is loaded
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon_name: 'Link',
    description: '',
  });

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChannels(data || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
      toast({
        title: 'Error Loading Channels',
        description: 'Could not fetch the list of channels. Please try again later.',
        variant: 'destructive',
      });
      setChannels([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch channels if user is loaded (if auth is required)
    if (user !== undefined) {
      fetchChannels();
    }
  }, [user]); // Added user as dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', icon_name: 'Link', description: '' });
    setEditingChannel(null);
  };

  const handleOpenForm = (channel = null) => {
    if (channel) {
      setEditingChannel(channel);
      setFormData({
        name: channel.name,
        url: channel.url,
        icon_name: channel.icon_name || 'Link',
        description: channel.description || '',
      });
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      toast({ title: "Validation Error", description: "Name and URL are required.", variant: "destructive" });
      return;
    }

    try {
      let error;
      if (editingChannel) {
        const { error: updateError } = await supabase
          .from('channels')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingChannel.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('channels')
          .insert([{ ...formData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
        error = insertError;
      }

      if (error) throw error;
      toast({
        title: `Channel ${editingChannel ? 'Updated' : 'Added'}`,
        description: `Successfully ${editingChannel ? 'updated' : 'added'} the channel.`,
      });
      fetchChannels();
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving channel:', error);
      toast({
        title: 'Save Error',
        description: `Could not save channel: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) return;
    try {
      const { error } = await supabase.from('channels').delete().eq('id', channelId);
      if (error) throw error;
      toast({ title: 'Channel Deleted', description: 'Channel successfully deleted.' });
      fetchChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast({ title: 'Delete Error', description: `Could not delete channel: ${error.message}`, variant: 'destructive' });
    }
  };
  
  const IconPreview = LucideIcons[formData.icon_name] || LucideIcons.Link;

  const getIconComponent = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    if (IconComponent) {
        return <IconComponent className="w-8 h-8" />;
    }
    return <LucideIcons.Link className="w-8 h-8" />;
  };

  // Added a check for user loading state
  if (user === undefined) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-10 h-10 border-2 border-green-500 dark:border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-green-400 dark:text-purple-400">Loading user data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-12">
        <LucideIcons.Share2 className="w-16 h-16 text-green-400 dark:text-purple-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-5xl font-bold brand-font text-green-300 dark:text-purple-300 neon-text">Our Channels</h1>
        <p className="text-xl text-green-400/80 dark:text-purple-400/80 mt-2">
          Stay connected! Follow us on our various channels for updates, tutorials, and community interaction.
        </p>
      </div>

      {isAdmin && (
        <div className="mb-8 text-center">
          <Button onClick={() => handleOpenForm()} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 neon-glow text-white">
            <LucideIcons.PlusCircle className="w-4 h-4 mr-2" /> Add New Channel
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-green-500 dark:border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-green-400 dark:text-purple-400">Loading channels...</p>
        </div>
      ) : channels.length === 0 ? (
        <p className="text-center text-xl text-green-400/70 dark:text-purple-400/70">
          No channels listed yet. {isAdmin ? "Click 'Add New Channel' to get started." : "Check back soon!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30 h-full flex flex-col">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="p-2 bg-black/20 dark:bg-white/10 rounded-md text-green-400 dark:text-purple-400">
                    {getIconComponent(channel.icon_name)}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-300 dark:text-purple-300">{channel.name}</CardTitle>
                    {channel.description && (
                      <CardDescription className="text-green-400/70 dark:text-purple-400/70 text-sm">
                        {channel.description}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end pt-0">
                  <Button
                    onClick={() => window.open(channel.url, '_blank')}
                    className="w-full mt-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 neon-glow text-white"
                  >
                    <LucideIcons.ExternalLink className="w-4 h-4 mr-2" /> Visit Channel
                  </Button>
                  {isAdmin && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => handleOpenForm(channel)} className="flex-1 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/10 dark:text-yellow-300 dark:border-yellow-400/50 dark:hover:bg-yellow-400/10">
                        <LucideIcons.Edit3 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(channel.id)} className="flex-1 text-red-400 border-red-500/50 hover:bg-red-500/10 dark:text-red-300 dark:border-red-400/50 dark:hover:bg-red-400/10">
                        <LucideIcons.Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) resetForm(); }}>
        <DialogContent className="hologram border-green-500/30 dark:border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-green-300 dark:text-purple-300">{editingChannel ? 'Edit' : 'Add New'} Channel</DialogTitle>
            <DialogDescription className="text-green-400/70 dark:text-purple-400/70">
              {editingChannel ? 'Update the details for this channel.' : 'Enter details for the new channel.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="text-green-400 dark:text-purple-400">Channel Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required 
                     className="mt-1 bg-black/50 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60" />
            </div>
            <div>
              <Label htmlFor="url" className="text-green-400 dark:text-purple-400">Channel URL</Label>
              <Input id="url" name="url" type="url" value={formData.url} onChange={handleInputChange} required 
                     className="mt-1 bg-black/50 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60" />
            </div>
            <div>
              <Label htmlFor="icon_name" className="text-green-400 dark:text-purple-400">Icon Name (Lucide)</Label>
              <div className="flex items-center gap-2">
                <Input id="icon_name" name="icon_name" value={formData.icon_name} onChange={handleInputChange} 
                      placeholder="e.g., Youtube, Twitter, Link"
                      className="mt-1 flex-grow bg-black/50 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60" />
                <IconPreview className="w-6 h-6 text-green-400 dark:text-purple-400 mt-1" />
              </div>
              <p className="text-xs text-green-400/70 dark:text-purple-400/70 mt-1">
                Find icons at <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-300 dark:hover:text-purple-300">lucide.dev/icons</a>. Use the exact name.
              </p>
            </div>
            <div>
              <Label htmlFor="description" className="text-green-400 dark:text-purple-400">Description (Optional)</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} 
                        className="mt-1 bg-black/50 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="text-green-300 border-green-500/50 hover:bg-green-500/20 dark:text-purple-300 dark:border-purple-500/50 dark:hover:bg-purple-500/20">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white">
                {editingChannel ? 'Update' : 'Add'} Channel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ChannelsPage;
