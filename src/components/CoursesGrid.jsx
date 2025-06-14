import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import CourseCard from '@/components/CourseCard';
import CourseContentDialog from '@/components/CourseContentDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, Crown, Lock } from 'lucide-react';

const CoursesGrid = () => {
  const { courses, isLoading: coursesLoading } = useCourses();
  const { hasPremiumAccess } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [viewingCourse, setViewingCourse] = useState(null);

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }

    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, setSearchParams, searchParams]);

  useEffect(() => {
    updateUrlParams();
  }, [searchTerm, selectedCategory, updateUrlParams]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    const searchFromUrl = searchParams.get('search') || '';
    
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl !== searchTerm) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const categories = ['all', ...new Set(courses.map(course => course.category).filter(Boolean).sort())];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const visibleCourses = filteredCourses.filter(course => !course.is_premium || hasPremiumAccess);
  const lockedCourses = filteredCourses.filter(course => course.is_premium && !hasPremiumAccess);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-400">Loading cosmic courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
          <Input placeholder="Search all courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-black/50 border-green-500/50 text-green-100 placeholder:text-green-400/60"/>
        </div>
        <div className="flex gap-2 flex-wrap">{categories.map(cat => (<Button key={cat} variant={selectedCategory === cat ? "default" : "outline"} size="sm" onClick={() => handleCategoryClick(cat)} className={`${selectedCategory === cat ? "bg-green-500 hover:bg-green-600 text-white" : "border-green-500/50 text-green-300 hover:bg-green-500/20"} capitalize`}>{cat === 'all' ? 'All Categories' : cat}</Button>))}</div>
      </motion.div>

      {visibleCourses.length === 0 && lockedCourses.length === 0 && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
            <h3 className="text-xl text-green-300 mb-2">No Courses Found</h3>
            <p className="text-green-400/80">
                {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filter.' : 'No courses have been added yet.'}
            </p>
        </motion.div>
      )}

      {visibleCourses.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCourses.map((course, index) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <CourseCard course={course} hasPremiumAccess={hasPremiumAccess} onViewContent={() => setViewingCourse(course)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {lockedCourses.length > 0 && (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-yellow-400 brand-font neon-text text-center mb-6 flex items-center justify-center gap-3"><Crown/> Unlock Premium Courses <Crown/></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedCourses.map((course, index) => (
                     <motion.div key={course.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                        <Card className="h-full hologram neon-glow hover:shadow-2xl transition-all duration-300 overflow-hidden border-yellow-500/40 opacity-70">
                            <div className="relative"><img-replace src={course.image_url} alt={course.title} class="w-full h-48 object-cover filter grayscale"/><div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-4"><Lock className="w-12 h-12 text-yellow-400 mb-3"/><h3 className="text-yellow-300 text-xl font-semibold text-center">{course.title}</h3><p className="text-yellow-400/80 text-sm text-center mt-1">This is a premium course.</p><Button onClick={() => navigate('/premium')} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" size="sm"><Crown className="w-4 h-4 mr-2"/> Go Premium</Button></div></div>
                        </Card>
                     </motion.div>
                ))}
            </div>
        </div>
      )}

      <CourseContentDialog course={viewingCourse} open={!!viewingCourse} onOpenChange={() => setViewingCourse(null)} />
    </div>
  );
};

export default CoursesGrid;
