import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTrip({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchTrip();
  }, [tripId]);

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!trip) return <div className="pt-32 text-center text-xl">Trip not found! <Link to="/" className="text-[#00aaff] hover:underline">Go Home</Link></div>;

  const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const galleryVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
  const imageVariants = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      <div className="h-[60vh] w-full relative"><img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div><div className="absolute bottom-0 left-0 p-8 md:p-12 text-white"><motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl md:text-6xl font-extrabold">{trip.title}</motion.h1><motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-xl mt-2">by {trip.authorEmail.split('@')[0]}</motion.p></div></div>
      <div className="container mx-auto px-6 md:px-12 py-16"><div className="grid grid-cols-1 lg:grid-cols-3 gap-12"><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="lg:col-span-2"><div className="flex items-center space-x-6 mb-8 text-gray-500 dark:text-[#a0a0a0]"><div className="flex items-center space-x-2"><Calendar size={20}/><span className="font-semibold">{new Date(trip.createdAt?.toDate()).toLocaleDateString()}</span></div><div className="flex items-center space-x-2"><MapPin size={20}/><span className="font-semibold">{trip.location}</span></div></div><h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-4">About the Journey</h2><p className="text-lg leading-relaxed text-gray-600 dark:text-[#a0a0a0]">{trip.description}</p></motion.div><div className="lg:col-span-1"><h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-4">Gallery</h2><motion.div variants={galleryVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">{trip.gallery?.map((imgUrl, index) => (<motion.div key={index} variants={imageVariants} className="aspect-square rounded-lg overflow-hidden shadow-lg"><img src={imgUrl} className="w-full h-full object-cover"/></motion.div>)) || <p className="text-gray-500">No gallery images.</p>}</motion.div></div></div><div className="text-center mt-16"><Link to="/" className="text-[#00aaff] text-lg font-semibold hover:underline">← Back to Discover</Link></div></div>
    </motion.div>
  );
}