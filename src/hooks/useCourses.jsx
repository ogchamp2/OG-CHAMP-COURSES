
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);


  const addCourse = async (courseData) => {
    if (!user || !isAdmin) {
        toast({ title: "Error", description: "Admin privileges required to add a course.", variant: "destructive"});
        return null;
    }
    try {
      const newCourse = {
        title: courseData.title,
        description: courseData.description,
        image_url: courseData.imageUrl,
        download_url: courseData.download_url,
        video_url: courseData.video_url,
        category: courseData.category || 'General',
        duration: courseData.duration || 'N/A',
        price: Number(courseData.price) || 0,
        is_premium: courseData.isPremium || false,
        created_by: user.id,
      };
      const { data, error } = await supabase.from('courses').insert([newCourse]).select();
      if (error) throw error;
      
      await loadCourses();
      toast({ title: "Success!", description: "Course added successfully" });
      return data[0];
    } catch (error) {
      console.error('Error adding course:', error);
      toast({ title: "Error", description: `Failed to add course: ${error.message}`, variant: "destructive" });
      return null;
    }
  };

  const updateCourse = async (courseId, updates) => {
     if (!user || !isAdmin) {
        toast({ title: "Error", description: "Admin privileges required to update a course.", variant: "destructive"});
        return null;
    }
    try {
      const courseUpdates = {
        title: updates.title,
        description: updates.description,
        image_url: updates.imageUrl,
        download_url: updates.download_url,
        video_url: updates.video_url,
        category: updates.category,
        duration: updates.duration,
        price: Number(updates.price) || 0,
        is_premium: updates.isPremium,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('courses').update(courseUpdates).eq('id', courseId).select();
      if (error) throw error;
      
      await loadCourses();
      toast({ title: "Success!", description: "Course updated successfully" });
    } catch (error) {
      console.error('Error updating course:', error);
      toast({ title: "Error", description: `Failed to update course: ${error.message}`, variant: "destructive" });
    }
  };

  const deleteCourse = async (courseId) => {
    if (!user || !isAdmin) {
        toast({ title: "Error", description: "Admin privileges required to delete a course.", variant: "destructive"});
        return null;
    }
    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      
      await loadCourses();
      toast({ title: "Success!", description: "Course deleted successfully" });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({ title: "Error", description: `Failed to delete course: ${error.message}`, variant: "destructive" });
    }
  };

  return {
    courses,
    isLoading,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: loadCourses
  };
};
