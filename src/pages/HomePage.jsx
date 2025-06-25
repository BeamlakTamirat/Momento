import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext'; 

const tripsData = [ 
    { id: "1", title: "Journey to the Danakil Depression", author: "Henok D.", imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2787&auto=format&fit=crop", location: "Afar Region, Ethiopia", date: "October 2024", description: "An unforgettable expedition...", gallery: [] },
    { id: "2", title: "Trekking the Simien Mountains", author: "Selam T.", imageUrl: "https://images.unsplash.com/photo-1606243403755-9ab377196434?q=80&w=2831&auto=format&fit=crop", location: "Amhara Region, Ethiopia", date: "November 2024", description: "Three days spent hiking...", gallery: [] },
    { id: "3", title: "Churches of Lalibela", author: "Dawit B.", imageUrl: "https://images.unsplash.com/photo-1605599443424-857f12e60421?q=80&w=2787&auto=format&fit=crop", location: "Amhara Region, Ethiopia", date: "August 2024", description: "A spiritual journey...", gallery: [] },
    { id: "4", title: "Exploring the Omo Valley", author: "Aman F.", imageUrl: "https://images.unsplash.com/photo-1596922813971-f930a8a62319?q=80&w=2787&auto=format&fit=crop", location: "SNNPR, Ethiopia", date: "September 2024", description: "Met with the incredible tribes...", gallery: [] },
];

export default function HomePage() {
  const { currentUser } = useAuth();
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <main className="container mx-auto px-6 pt-32 pb-16">
      <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-700 to-gray-900 dark:from-blue-300 dark:to-[#00aaff]">Immortalize Your Journeys.</h1>
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
          {tripsData.map(trip => (
            <motion.div key={trip.id} variants={itemVariants}><TripCard trip={trip} /></motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}