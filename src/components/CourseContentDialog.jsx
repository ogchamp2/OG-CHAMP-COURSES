
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayCircle, Download, X } from 'lucide-react';

const CourseContentDialog = ({ course, open, onOpenChange }) => {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hologram border-green-500/30 max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-300 brand-font neon-text">{course.title}</DialogTitle>
          <DialogDescription className="text-green-400/80">
            {course.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <p className="text-sm text-green-300">Access your course materials below. Happy learning! 🚀</p>
            <div className="flex flex-col sm:flex-row gap-4">
                 {course.video_url && (
                     <Button 
                        onClick={() => window.open(course.video_url, '_blank')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 neon-glow"
                    >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Watch Tutorial
                    </Button>
                 )}
                 {course.download_url && (
                    <Button 
                        onClick={() => window.open(course.download_url, '_blank')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 neon-glow"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download Files
                    </Button>
                 )}
            </div>
             {(!course.video_url && !course.download_url) && (
                <p className="text-center text-yellow-400/80">Content links are not yet available for this course.</p>
             )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseContentDialog;
