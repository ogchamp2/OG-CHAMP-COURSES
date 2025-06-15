
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCourses } from '@/hooks/useCourses';
import { toast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Crown } from 'lucide-react';

const ManageCourses = ({ isAdmin }) => {
  const { courses, addCourse, updateCourse, deleteCourse, isLoading: coursesLoading } = useCourses();
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '', description: '', imageUrl: '', category: '', duration: '', price: 0, isPremium: false, download_url: '', video_url: ''
  });

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
        imageUrl: course.image_url, // Use image_url from course object
        download_url: course.download_url || '',
        video_url: course.video_url || '',
        category: course.category || '', 
        duration: course.duration || '', 
        price: course.price || 0, 
        isPremium: course.is_premium || false
    });
    setIsCourseDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(courseId);
    }
  };

  return (
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
               <Input value={courseFormData.category} onChange={(e) => setCourseFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Category (e.g., General, Cybersecurity)" className="bg-black/50 border-green-500/50 text-green-100"/>
               <Input value={courseFormData.duration} onChange={(e) => setCourseFormData(prev => ({ ...prev, duration: e.target.value }))} placeholder="Duration (e.g., 2h 30m)" className="bg-black/50 border-green-500/50 text-green-100"/>
               <Input type="number" value={courseFormData.price} onChange={(e) => setCourseFormData(prev => ({ ...prev, price: Number(e.target.value) }))} placeholder="Price ($)" className="bg-black/50 border-green-500/50 text-green-100"/>
               <div className="flex items-center space-x-2"><input type="checkbox" id="isPremiumCourse" checked={courseFormData.isPremium} onChange={(e) => setCourseFormData(prev => ({...prev, isPremium: e.target.checked}))} className="form-checkbox h-5 w-5 text-green-500 bg-black/50 border-green-500/50 rounded focus:ring-green-400"/><Label htmlFor="isPremiumCourse" className="text-green-300">Premium Course</Label></div>
               <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">{editingCourse ? 'Update Course' : 'Create Course'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {coursesLoading && <p className="text-green-400/70 text-center">Loading courses...</p>}
        {!coursesLoading && courses.length === 0 && <p className="text-green-400/70 text-center">No courses available.</p>}
        {!coursesLoading && courses.map(course => (
          <motion.div key={course.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 p-3 my-2 bg-black/30 rounded-lg border border-green-500/30">
            <img-replace src={course.image_url || 'default_admin_course_thumb.png'} alt={course.title || "Course Thumbnail"} class="w-12 h-12 object-cover rounded" /> 
            <div className="flex-1">
              <h3 className="text-green-300 font-semibold">{course.title} {course.is_premium && <Crown className="inline w-4 h-4 ml-1 text-yellow-400" />}</h3>
              <p className="text-xs text-green-400/60">{course.category || 'Uncategorized'} - ${course.price}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)} className="border-green-500/50 text-green-300 hover:bg-green-500/20"><Edit className="w-3 h-3" /></Button>
            <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)} className="border-red-500/50 text-red-300 hover:bg-red-500/20"><Trash2 className="w-3 h-3" /></Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ManageCourses;
