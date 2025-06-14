
import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import AuthForm from '@/components/AuthForm';
import CoursesGrid from '@/components/CoursesGrid';
import AdminPanel from '@/components/AdminPanel/index';
import PremiumPage from '@/components/PremiumPage';
import PremiumOffersGrid from '@/components/PremiumOffersGrid';
import EmailConfirmationPage from '@/components/EmailConfirmationPage';
import { Button } from '@/components/ui/button';
import { BookOpen, Crown, Settings } from 'lucide-react';

const Navigation = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: '/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Courses' },
    { path: '/premium', icon: <Crown className="w-5 h-5" />, label: 'Premium' },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', icon: <Settings className="w-5 h-5" />, label: 'Admin' });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav 
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col gap-3">
          {navItems.map(item => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 p-0 hologram neon-glow hover:scale-110 transition-all ${location.pathname === item.path ? 'border-2 border-green-400' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
            >
              {item.icon}
            </Button>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Bottom Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-md z-40 lg:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="flex justify-around items-center max-w-md mx-auto gap-2">
          {navItems.map(item => (
             <Button
              key={item.path}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col h-auto items-center justify-center py-1 rounded-lg
                ${location.pathname === item.path ? 
                  (item.path === '/courses' ? 'bg-green-500 text-white' : item.path === '/premium' ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white') : 
                  (item.path === '/courses' ? 'text-green-400 hover:bg-green-500/20' : item.path === '/premium' ? 'text-yellow-400 hover:bg-yellow-500/20' : 'text-purple-400 hover:bg-purple-500/20')
                }`}
              aria-label={item.label}
            >
              {item.icon}
              <span className="text-[10px] mt-1 font-semibold">{item.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>
    </>
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
      <div className="min-h-screen flex items-center justify-center space-bg">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Initializing space-tech platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-bg">
      <div className="cyber-grid absolute inset-0 opacity-10"></div>
      <Header />
      <Navigation />
      
      <main className="pt-24 pb-24 lg:pb-8">
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
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
};

export default App;
                
