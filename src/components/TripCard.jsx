import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';

export default function TripCard({ trip }) {
  return (
    <Link to={`/trip/${trip.id}`} className="block">
      <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 group hover:shadow-blue-500/20">
        <div className="h-64 w-full overflow-hidden">
          <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 dark:text-[#e0e0e0] truncate">{trip.title}</h3>
          <p className="text-gray-500 dark:text-[#a0a0a0] mt-1">by {trip.author}</p>
          <div className="flex items-center justify-between text-gray-500 dark:text-[#a0a0a0] mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
             <div className="flex items-center space-x-1 text-sm"><MapPin size={14}/><span>{trip.location.split(',')[0]}</span></div>
             <div className="flex items-center space-x-1 text-sm"><Calendar size={14}/><span>{trip.date}</span></div>
          </div>
        </div>
      </div>
    </Link>
  );
}