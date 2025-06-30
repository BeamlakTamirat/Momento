import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import TripCard from '../components/TripCard';
import AuthPage from './AuthPage';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [featuredTrips, setFeaturedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const q = query(collection(db, 'trips'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allTrips = [];
      querySnapshot.forEach((doc) => {
        allTrips.push({ id: doc.id, ...doc.data() });
      });
      const publicTrips = allTrips.filter(trip => trip.isPublic === true && trip.imageUrl);
      publicTrips.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });
      setFeaturedTrips(publicTrips);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = (tripId) => {
    if (!currentUser) {
      setShowAuth(true);
    } else {
      navigate(`/trip/${tripId}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 animate-gradient-move bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 opacity-90" style={{backgroundSize:'200% 200%', animation:'gradientMove 12s ease-in-out infinite'}} />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl animate-blob1" />
        <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-3xl animate-blob2" />
      </div>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 pb-12">
        {showAuth && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
              <button onClick={() => setShowAuth(false)} className="absolute top-2 right-4 text-2xl font-bold">×</button>
              <AuthPage />
            </div>
          </div>
        )}
        <div className="w-full max-w-3xl mx-auto text-center mt-24 mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Immortalize Your Journey</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-4">The modern digital journal for travelers. Document your adventures, preserve your memories, and tell your story to the world.</p>
          <p className="text-base text-gray-400">Share your adventures, discover new places, and connect with a global community of explorers.</p>
        </div>
        <div className="w-full max-w-6xl mx-auto mt-8">
        {loading ? (
            <div className="text-white text-center py-32 text-xl">Loading public photos...</div>
          ) : featuredTrips.length === 0 ? (
            <div className="text-gray-400 text-center py-32 text-xl">No public photos yet.</div>
        ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4"
            >
            {featuredTrips.map(trip => (
                <div key={trip.id} onClick={() => handleCardClick(trip.id)} className="cursor-pointer">
                  <TripCard trip={trip} />
                </div>
            ))}
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}