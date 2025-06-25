import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import TripCard from '../components/TripCard'; 
import { motion } from 'framer-motion';
import { Plus, LoaderCircle } from 'lucide-react';

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        let unsubscribe = () => {}; 

        if (currentUser) {
            const tripsRef = collection(db, "trips");

            
            const q = query(
                tripsRef, 
                where("authorId", "==", currentUser.uid), 
                orderBy("createdAt", "desc")
            );

            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const trips = [];
                querySnapshot.forEach((doc) => {
                    trips.push({ id: doc.id, ...doc.data() });
                });
                setUserTrips(trips);
                setLoading(false); 
            });
        }

        
        return () => unsubscribe();
    }, [currentUser]);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    return (
        <div className="container mx-auto px-6 pt-32 pb-16">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-[#e0e0e0]">My Journals</h1>
                    <p className="text-gray-500 dark:text-[#a0a0a0] mt-2">Welcome back, {currentUser?.email.split('@')[0]}</p>
                </div>
                <Link to="/create" className="flex items-center space-x-2 bg-[#00aaff] text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    <span>New Journal</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                  <LoaderCircle className="animate-spin text-[#00aaff]" size={48} />
                </div>
            ) : userTrips.length > 0 ? (
                <motion.div 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible" 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {userTrips.map(trip => (
                        <motion.div key={trip.id} variants={itemVariants}>
                            <TripCard trip={trip} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl mt-10">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#e0e0e0]">Your Adventure Awaits</h2>
                    <p className="text-gray-500 dark:text-[#a0a0a0] mt-2">You haven't created any journals yet. Click "New Journal" to begin.</p>
                </div>
            )}
        </div>
    );
}