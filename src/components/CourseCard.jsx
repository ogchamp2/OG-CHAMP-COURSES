
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, Crown, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, hasPremiumAccess, onViewContent }) => {
  const navigate = useNavigate();
  const isLocked = course.is_premium && !hasPremiumAccess;

  const handleActionClick = () => {
    if (isLocked) {
      navigate('/premium');
    } else {
      onViewContent();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full hologram neon-glow hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col">
        <div className="relative">
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-48 object-cover"
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
                {course.price === 0 ? 'Free' : `$${course.price}`}
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
    </motion.div>
  );
};

export default CourseCard;
