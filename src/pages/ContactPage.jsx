
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, Send, MessageSquare, User, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ContactPage = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here (e.g., send to an API endpoint)
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


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-12">
        <Mail className="w-16 h-16 text-green-400 dark:text-purple-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-5xl font-bold brand-font text-green-300 dark:text-purple-300 neon-text">Get In Touch</h1>
        <p className="text-xl text-green-400/80 dark:text-purple-400/80 mt-2">
          Have questions, feedback, or need support? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-2xl text-green-300 dark:text-purple-300">Send Us a Message</CardTitle>
            <CardDescription className="text-green-400/80 dark:text-purple-400/80">
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-green-200 dark:text-purple-200 flex items-center gap-2"><User className="w-4 h-4"/> Your Name</Label>
                <Input id="name" type="text" placeholder="Enter your name" required className="mt-1 bg-black/50 dark:bg-white/5 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60"/>
              </div>
              <div>
                <Label htmlFor="email" className="text-green-200 dark:text-purple-200 flex items-center gap-2"><Mail className="w-4 h-4"/> Your Email</Label>
                <Input id="email" type="email" placeholder="Enter your email address" required className="mt-1 bg-black/50 dark:bg-white/5 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60"/>
              </div>
              <div>
                <Label htmlFor="message" className="text-green-200 dark:text-purple-200 flex items-center gap-2"><FileText className="w-4 h-4"/> Your Message</Label>
                <Textarea id="message" placeholder="Type your message here..." required rows={5} className="mt-1 bg-black/50 dark:bg-white/5 border-green-500/50 dark:border-purple-500/50 text-green-100 dark:text-purple-100 placeholder:text-green-400/60 dark:placeholder:text-purple-400/60"/>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 neon-glow text-white">
                <Send className="w-5 h-5 mr-2" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-green-300 dark:text-purple-300">Direct Contact</CardTitle>
              <CardDescription className="text-green-400/80 dark:text-purple-400/80">
                Reach out to us directly through these channels for a faster response.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialLinks.map(link => (
                <Button 
                  key={link.name}
                  variant="outline"
                  onClick={() => window.open(link.href, '_blank')}
                  className={`w-full justify-start
                    ${link.color === 'green' ? 'text-green-300 border-green-500/50 hover:bg-green-500/20 hover:text-green-200' : 
                      link.color === 'blue' ? 'text-blue-300 border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-200' :
                      'text-teal-300 border-teal-500/50 hover:bg-teal-500/20 hover:text-teal-200'}
                    dark:text-${link.color}-400 dark:border-${link.color}-500/50 dark:hover:bg-${link.color}-500/20 dark:hover:text-${link.color}-300
                  `}
                >
                  {link.icon} {link.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="hologram neon-glow border-green-500/30 dark:border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-green-300 dark:text-purple-300">Our Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-400/90 dark:text-purple-400/90">
                We strive to respond to all inquiries within 24-48 hours. Your feedback is valuable to us and helps us improve our platform and services. Don't hesitate to reach out!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
                  
