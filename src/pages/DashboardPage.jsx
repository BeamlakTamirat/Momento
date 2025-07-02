import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import TripCard from '../components/TripCard';
import { motion } from 'framer-motion';
import { Plus, LoaderCircle, BookOpen, MapPin, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        let unsubscribe = () => {};
        
        if (currentUser) {
            console.log('🔍 Fetching trips for user:', currentUser.uid);
            setDebugInfo(`Connected as: ${currentUser.email}`);
            
            const q = query(
                collection(db, "trips"), 
                where("authorId", "==", currentUser.uid)
            );
            
            unsubscribe = onSnapshot(q, (querySnapshot) => {
                const trips = [];
                querySnapshot.forEach((doc) => {
                    trips.push({ id: doc.id, ...doc.data() });
                });
                
                trips.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                    return dateB - dateA;
                });
                
                console.log('📊 Found trips:', trips.length);
                setUserTrips(trips);
                setLoading(false);
                setError('');
                
                if (trips.length === 0) {
                    setDebugInfo('No journals found. Create your first one!');
                } else {
                    setDebugInfo(`Found ${trips.length} journal${trips.length > 1 ? 's' : ''}`);
                }
            }, (error) => {
                console.error("❌ Error fetching user trips: ", error);
                setError(`Failed to load journals: ${error.message}`);
                setLoading(false);
                setDebugInfo('Error connecting to database');
            });
        } else {
            console.log('⚠️ No user logged in');
            setLoading(false);
            setUserTrips([]);
            setError('Please log in to view your journals');
            setDebugInfo('Not logged in');
        }
        
        return () => unsubscribe();
    }, [currentUser]);

    const containerVariants = { 
        hidden: { opacity: 0 }, 
        visible: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            } 
        } 
    };
    
    const itemVariants = { 
        hidden: { y: 20, opacity: 0 }, 
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        } 
    };

    const stats = {
        total: userTrips.length,
        public: userTrips.filter(trip => trip.isPublic).length,
        private: userTrips.filter(trip => !trip.isPublic).length
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <div className="fixed inset-0 -z-10 animate-gradient-move bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 opacity-90" style={{backgroundSize:'200% 200%', animation:'gradientMove 12s ease-in-out infinite'}} />
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-pink-400 opacity-30 rounded-full blur-3xl animate-blob1" />
                <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-3xl animate-blob2" />
            </div>
        <div className="container mx-auto px-6 pt-32 pb-16">
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-12"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                My Journals
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {currentUser?.email?.split('@')[0] || 'Traveler'}
                                </span>
                            </p>
                </div>
                        <Link 
                            to="/create" 
                            className="mt-6 lg:mt-0 flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
                        >
                    <Plus size={20} />
                    <span>New Journal</span>
                </Link>
            </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Total Journals</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.public}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Public</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <User className="text-purple-600 dark:text-purple-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.private}</p>
                                    <p className="text-gray-600 dark:text-gray-400">Private</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                {debugInfo}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3"
                    >
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="text-red-700 dark:text-red-300">{error}</span>
                    </motion.div>
                )}

            {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <LoaderCircle className="animate-spin text-blue-600" size={48} />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your journals...</p>
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
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="text-white" size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                Your Adventure Awaits
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                You haven't created any journals yet. Start documenting your travels and create memories that last forever.
                            </p>
                            <Link 
                                to="/create" 
                                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
                            >
                                <Plus size={20} />
                                <span>Create Your First Journal</span>
                            </Link>
                </div>
                    </motion.div>
            )}
            </div>
        </div>
    );
}