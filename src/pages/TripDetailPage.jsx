import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Edit, Trash2, LoaderCircle, ArrowLeft, Eye, Lock, User, Clock, Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = defaultIcon;

export default function TripDetailPage() {
  const { tripId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      const docRef = doc(db, "trips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tripData = { id: docSnap.id, ...docSnap.data() };
        if (tripData.isPublic || (currentUser && tripData.authorId === currentUser.uid)) {
          setTrip(tripData);
        } else {
          console.error("Access denied.");
          setTrip(null);
        }
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };
    fetchTrip();
  }, [tripId, currentUser]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % trip.galleryImages.length);
    }
  };

  const prevImage = () => {
    if (trip.galleryImages && trip.galleryImages.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + trip.galleryImages.length) % trip.galleryImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, trip]);
  
  const handleDelete = async () => {
    setIsDeleting(true);
      try {
        await deleteDoc(doc(db, "trips", tripId));
        navigate('/dashboard');
      } catch (error) {
        console.error("Error deleting trip: ", error);
        alert("Failed to delete trip.");
        setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="animate-spin text-blue-600 mx-auto" size={48} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading journal...</p>
      </div>
    </div>
  );
  
  if (!trip) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Journal Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This journal doesn't exist or you don't have access to it.</p>
        <Link to="/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200">
          <ArrowLeft size={20} />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
  
  const isAuthor = currentUser && currentUser.uid === trip.authorId;
  const tripDate = trip.createdAt?.toDate ? new Date(trip.createdAt.toDate()).toLocaleDateString() : 'Date not available';
  const authorName = trip.authorEmail ? trip.authorEmail.split('@')[0] : 'Anonymous';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Link 
              to="/dashboard" 
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-8"
          >
            <img 
              src={trip.imageUrl} 
              alt={trip.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute top-6 right-6">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                trip.isPublic 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-gray-800/90 text-white'
              }`}>
                {trip.isPublic ? <Eye size={16} /> : <Lock size={16} />}
                <span>{trip.isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <User size={20} />
                <span className="font-semibold">{authorName}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{tripDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{trip.createdAt?.toDate ? new Date(trip.createdAt.toDate()).toLocaleTimeString() : ''}</span>
          </div>
      </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-gray-800 dark:text-white mb-4"
              >
                {trip.title}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-4 text-gray-600 dark:text-gray-400"
              >
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="font-medium">{trip.location}</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="prose prose-lg dark:prose-invert max-w-none mb-8"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {trip.description}
              </p>
            </motion.div>

            {trip.lat && trip.lng && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Trip Location</h2>
                <div className="w-full h-64 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden">
                  <MapContainer
                    center={[trip.lat, trip.lng]}
                    zoom={12}
                    style={{ width: '100%', height: '100%' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[trip.lat, trip.lng]} />
                  </MapContainer>
                </div>
                {trip.location && (
                  <p className="text-xs text-gray-500 mt-2">{trip.location}</p>
                )}
              </div>
            )}

            {trip.galleryImages && trip.galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Image size={24} className="text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Photo Gallery</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({trip.galleryImages.length} photos)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trip.galleryImages.map((url, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="relative group cursor-pointer overflow-hidden rounded-2xl"
                      onClick={() => openLightbox(idx)}
                    >
                      <img
                        src={url}
                        alt={`Gallery photo ${idx + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 rounded-full p-2">
                            <Image size={20} className="text-gray-800" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {isAuthor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  <span>{isDeleting ? 'Deleting...' : 'Delete Journal'}</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxOpen && trip.galleryImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img
                  src={trip.galleryImages[lightboxIndex]}
                  alt={`Gallery photo ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                
                {trip.galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {lightboxIndex + 1} / {trip.galleryImages.length}
                    </div>
                  </>
                )}
              </div>
            </div>
                </motion.div>
        )}
      </AnimatePresence>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Delete Journal?</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to delete this journal permanently? This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); handleDelete(); }}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}