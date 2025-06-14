import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Star, Crown, Play, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const CourseCard = ({ course, hasPremiumAccess, onViewContent }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLocked = course.is_premium && !hasPremiumAccess;
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const pressTimerRef = useRef(null);

  const handleActionClick = () => {
    if (isLocked) {
      navigate('/premium');
    } else {
      onViewContent();
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/courses?courseId=${course.id}`;
    const shareTitle = course.title;
    const shareText = `Check out this course: ${course.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({ title: "Share Failed", description: "Could not share the course.", variant: "destructive" });
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link Copied!", description: "Course link copied to clipboard." });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" });
      }
    }
    setIsShareMenuOpen(false); 
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch' || (event.pointerType === 'mouse' && event.button === 0)) {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
      pressTimerRef.current = window.setTimeout(() => {
        setIsShareMenuOpen(true);
      }, 700); 
    }
  };

  const handlePointerUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    if (pressTimerRef.current) { 
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsShareMenuOpen(true);
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="h-full relative"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      onPointerLeave={handlePointerUp} 
    >
      <Card className="h-full hologram neon-glow hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
        <div className="relative">
          {/* Updated: Now using course.image_url instead of hardcoded URL */}
          <img 
            alt={course.title || "Course image"}
            className="w-full h-48 object-cover"
            src={course.image_url || "https://images.unsplash.com/photo-1582177199344-a05724b6e775"} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {course.is_premium && (
                  <span className="px-2 py-1 bg-yellow-500/80 text-black rounded-full text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3"/> PREMIUM
                  </span>
              )}
              <span className="px-3 py-1 bg-green-500/80 text-white rounded-full text-sm font-medium">
              {course.category}
              </span>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        <CardHeader>
          <CardTitle className="text-green-300 text-xl">{course.title}</CardTitle>
          <CardDescription className="text-green-400/80 line-clamp-2 h-[40px]">
            {course.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-end">
            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm text-green-400/80">
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{course.rating || '5.0'}</span></div>
                </div>
                <div className="text-2xl font-bold text-green-300">
                {course.price === 0 ? 'Free' : `${course.price}`}
                </div>
            </div>

          <Button
            onClick={handleActionClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold neon-glow"
          >
             <Play className="w-4 h-4 mr-2" /> View Content
          </Button>
        </CardContent>
      </Card>
      {isShareMenuOpen && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 rounded-lg"
            onClick={() => setIsShareMenuOpen(false)} 
        >
            <Button 
                onClick={(e) => { e.stopPropagation(); handleShare(); }} 
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3 rounded-lg shadow-xl neon-glow"
            >
                <Share2 className="w-5 h-5 mr-2" /> Share Course
            </Button>
            <Button 
                variant="link" 
                onClick={(e) => { e.stopPropagation(); setIsShareMenuOpen(false); }}
                className="mt-3 text-green-300 hover:text-green-100"
            >
                Cancel
            </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CourseCard;
