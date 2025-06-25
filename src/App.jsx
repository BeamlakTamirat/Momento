import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage'; 

function ProtectedRoute() {
    const { currentUser } = useAuth();
    
    return currentUser ? <Outlet /> : <Navigate to="/auth" />;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="bg-gray-100 dark:bg-[#121212] min-h-screen transition-colors duration-500">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip/:tripId" element={<TripDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create" element={<CreateTripPage />} />
          </Route>
          
        </Routes>
      </AnimatePresence>
    </div>
  );
}