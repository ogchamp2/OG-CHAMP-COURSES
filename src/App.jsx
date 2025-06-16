import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import CoursesGrid from '@/components/CoursesGrid';
import AdminPanel from '@/components/AdminPanel/index';
import PremiumPage from '@/components/PremiumPage';
import PremiumOffersGrid from '@/components/PremiumOffersGrid';
import EmailConfirmationPage from '@/components/EmailConfirmationPage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import ChannelsPage from '@/pages/ChannelsPage';
import { Button } from '@/components/ui/button';
import { BookOpen, Crown, Settings, Info, Phone, Tv2 } from 'lucide-react';

const MobileBottomNavigation = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Courses', color: 'green' },
    { path: '/premium', icon: <Crown className="w-5 h-5" />, label: 'Premium', color: 'yellow' },
    { path: '/channels', icon: <Tv2 className="w-5 h-5" />, label: 'Channels', color: 'cyan' },
    // { path: '/about', icon: <Info className="w-5 h-5" />, label: 'About', color: 'sky' }, // Moved to hamburger
    // { path: '/contact', icon: <Phone className="w-5 h-5" />, label: 'Contact', color: 'pink' }, // Moved to hamburger
  ];

  // Only show Admin on bottom nav if it's an admin and space permits, or keep essential items
  // For simplicity, keeping bottom nav focused on core content consumption. Admin, About, Contact accessible via hamburger.

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 p-2 bg-black/50 dark:bg-neutral-900/70 backdrop-blur-md z-40 lg:hidden border-t border-gray-700/50 dark:border-neutral-700/50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto gap-1">
        {navItems.map(item => (
            <Button
            key={item.path}
            variant={location.pathname === item.path ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col h-auto items-center justify-center py-1.5 rounded-lg text-xs
              ${location.pathname === item.path ? 
                `bg-${item.color}-500 text-white shadow-lg shadow-${item.color}-500/30` : 
                `text-${item.color}-400 dark:text-${item.color}-300 hover:bg-${item.color}-500/10 dark:hover:bg-${item.color}-500/20`
              }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="mt-0.5 font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    return isAuthenticated && isAdmin ? children : <Navigate to="/courses" />;
};

const PremiumRoute = ({ children }) => {
    const { isAuthenticated, hasPremiumAccess } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return hasPremiumAccess ? children : <Navigate to="/premium" />;
};


const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-bg dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-green-500 dark:border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-400 dark:text-purple-400 text-lg">Initializing space-tech platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-bg dark:bg-neutral-900 text-foreground dark:text-neutral-100 transition-colors duration-300">
      <div className="cyber-grid absolute inset-0 opacity-10 dark:opacity-5"></div>
      <Header />
      <MobileBottomNavigation /> {/* Renamed and only for mobile */}
      
      {/* Main content padding adjusted as desktop sidebar is removed. pb-28 for mobile nav, pb-8 for desktop */}
      <main className="pt-24 pb-28 lg:pb-8"> 
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/confirm-email" element={<EmailConfirmationPage />} />
                <Route path="/" element={isAuthenticated ? <Navigate to="/courses" /> : <AuthForm />} />
                
                <Route path="/courses" element={<ProtectedRoute><CoursesGrid /></ProtectedRoute>} />
                <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
                <Route path="/premium-offers" element={<PremiumRoute><PremiumOffersGrid /></PremiumRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                
                <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
                <Route path="/channels" element={<ProtectedRoute><ChannelsPage /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to={isAuthenticated ? "/courses" : "/"} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
                                                                                            
