import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';
import abcLogo from '../assets/abc.png';

export default function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="absolute top-0 left-0 right-0 z-20">
      <div className="container mx-auto flex justify-between items-center p-6">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src={abcLogo} alt="Momento Logo" className="h-10 w-10 object-contain" />
          <span className="text-3xl font-extrabold tracking-tight text-gray-800 dark:text-[#e0e0e0] group-hover:text-blue-600" style={{ fontFamily: 'Poppins, Montserrat, Raleway, sans-serif', letterSpacing: '0.04em' }}>
            Momento
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-white transition-colors">Discover</Link>
          <Link to="/explore-map" className="text-gray-500 dark:text-[#a0a0a0] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore Map</Link>
          {currentUser ? (
             <div className="flex items-center space-x-4">
               <Link to="/dashboard" className="text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link>
               <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"><LogOut size={18} /><span>Logout</span></button>
             </div>
          ) : (
            <Link to="/auth" className="flex items-center space-x-2 bg-[#00aaff] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"><LogIn size={18} /><span>Sign In</span></Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}