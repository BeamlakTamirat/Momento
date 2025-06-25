import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import TripCard from '../components/TripCard'; 
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        if (currentUser) {
            const tripsRef = collection(db, "trips");
            const q = query(tripsRef, where("authorId", "==", currentUser.uid), orderBy("createdAt", "desc"));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const trips = [];
                querySnapshot.forEach((doc) => {
                    trips.push({ id: doc.id, ...doc.data() });
                });
                setUserTrips(trips);
                setLoading(false);
            });

            return () => unsubscribe(); 
        }
    }, [currentUser]);

    return (
        <div className="container mx-auto px-6 pt-32 pb-16">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-[#e0e0e0]">My Journals</h1>
                    <p className="text-gray-500 dark:text-[#a0a0a0] mt-2">Welcome back, {currentUser?.email}</p>
                </div>
                <Link to="/create" className="flex items-center space-x-2 bg-[#00aaff] text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-colors">
                    <Plus size={20} />
                    <span>New Journal</span>
                </Link>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading your journals...</p>
            ) : userTrips.length > 0 ? (
                <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {userTrips.map(trip => (
                        <motion.div key={trip.id}><TripCard trip={trip} /></motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-[#e0e0e0]">No Journals Yet</h2>
                    <p className="text-gray-500 dark:text-[#a0a0a0] mt-2">Click "New Journal" to start immortalizing your first journey.</p>
                </div>
            )}
        </div>
    );
}