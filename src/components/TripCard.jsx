import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, Lock, Image as ImageIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TripCard({ trip, minimal, isOwner, setShowConfirm }) {
  if (minimal) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          style={{ display: 'block' }}
        />
      </div>
    );
  }


  const tripDate = trip.createdAt?.toDate ? new Date(trip.createdAt.toDate()).toLocaleDateString() : 'N/A';
  const authorName = trip.authorEmail ? trip.authorEmail.split('@')[0] : 'Anonymous';

  return (
    <Link to={`/trip/${trip.id}`} className="block group">
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden transform transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/20 border border-gray-200 dark:border-gray-700"
      >

        <div className="relative h-64 w-full overflow-hidden">
          {trip.imageUrl ? (
            <img 
              src={trip.imageUrl} 
              alt={trip.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}

          <div 
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 ${trip.imageUrl ? 'hidden' : 'flex'}`}
          >
            <div className="text-center">
              <ImageIcon className="mx-auto text-blue-500 dark:text-blue-400 mb-2" size={32} />
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">No Image</p>
            </div>
          </div>
          

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
              trip.isPublic 
                ? 'bg-green-500/90 text-white' 
                : 'bg-gray-800/90 text-white'
            }`}>
              {trip.isPublic ? <Eye size={12} /> : <Lock size={12} />}
              <span>{trip.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-sm font-medium line-clamp-2">
              {trip.description?.substring(0, 100)}...
            </p>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {trip.title}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            by <span className="font-medium text-gray-700 dark:text-gray-300">{authorName}</span>
          </p>
          
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin size={14} className="text-blue-500" />
              <span className="truncate max-w-24">{trip.location || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={14} className="text-purple-500" />
              <span>{tripDate}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">Click to view</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="text-blue-500 text-sm font-medium"
              >
                →
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      {isOwner && (
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
          <button
            className="bg-white/90 hover:bg-red-100 dark:bg-gray-900/80 dark:hover:bg-red-900/40 text-red-600 dark:text-red-300 rounded-full p-2 shadow"
            title="Delete"
            onClick={e => { e.preventDefault(); setShowConfirm(true); }}
          >
            <Trash2 size={16} />
          </button>
      </div>
      )}
    </Link>
  );
}