import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';


export default function HomePage() {
  const { currentUser } = useAuth();
  const [featuredTrips, setFeaturedTrips] = useState([]);
  
  useEffect(() => {
    
    const q = query(collection(db, "trips"), orderBy("createdAt", "desc"), limit(4));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      setFeaturedTrips(trips);
    });

    return () => unsubscribe();
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <main className="container mx-auto px-6 pt-32 pb-16">
      <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-gray-200 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-blue-300 dark:to-[#00aaff]">Immortalize Your Journeys.</h1>
        <p className="text-xl text-gray-600 dark:text-[#a0a0a0] max-w-3xl mx-auto">The modern digital journal for travelers. Document your adventures, preserve your memories, and tell your story.</p>
        <Link to={currentUser ? "/dashboard" : "/auth"}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-10 flex items-center justify-center mx-auto space-x-2 bg-[#00aaff] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors">
            <span>Start Your First Journal</span><ArrowRight size={22} />
          </motion.button>
        </Link>
      </motion.section>
      <section>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-8">Featured Journals</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredTrips.map(trip => (
            <motion.div key={trip.id} variants={itemVariants}><TripCard trip={trip} /></motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}