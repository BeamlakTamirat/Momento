import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Route, 
  Globe, 
  Camera, 
  Heart, 
  TrendingUp,
  Search,
  Eye,
  Lock,
  Play,
  Pause
} from 'lucide-react';

const defaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = defaultIcon;

const createCustomIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function AllTripsMap() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('journey');
  const [showRoutes, setShowRoutes] = useState(true);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [filter, setFilter] = useState({ 
    pub: 'all', 
    region: 'all', 
    search: '',
    year: 'all'
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, 'trips'));
        const tripsWithCoords = [];
        snap.forEach(doc => {
          const data = doc.data();
          if (data.lat && data.lng) {
            tripsWithCoords.push({ id: doc.id, ...data });
          }
        });
        setTrips(tripsWithCoords);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setError('Failed to load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const getFilteredTrips = () => {
    try {
      return trips.filter(trip => {
        if (filter.pub !== 'all' && (filter.pub === 'public') !== !!trip.isPublic) return false;
        if (filter.region !== 'all' && trip.location !== filter.region) return false;
        if (filter.year !== 'all') {
          const tripYear = trip.createdAt?.toDate ? new Date(trip.createdAt.toDate()).getFullYear() : new Date().getFullYear();
          if (tripYear.toString() !== filter.year) return false;
        }
        if (filter.search) {
          const s = filter.search.toLowerCase();
          if (!trip.title.toLowerCase().includes(s) && !(trip.location || '').toLowerCase().includes(s)) return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error filtering trips:', error);
      return [];
    }
  };

  const filteredTrips = getFilteredTrips();

  const userJourneys = useMemo(() => {
    try {
      const journeys = {};
      filteredTrips.forEach(trip => {
        const author = trip.authorEmail ? trip.authorEmail.split('@')[0] : 'Anonymous';
        if (!journeys[author]) {
          journeys[author] = [];
        }
        journeys[author].push(trip);
      });
      
      Object.keys(journeys).forEach(author => {
        journeys[author].sort((a, b) => {
          const dateA = a.createdAt?.toDate ? new Date(a.createdAt.toDate()) : new Date(0);
          const dateB = b.createdAt?.toDate ? new Date(b.createdAt.toDate()) : new Date(0);
          return dateA - dateB;
        });
      });
      
      return journeys;
    } catch (error) {
      console.error('Error creating user journeys:', error);
      return {};
    }
  }, [filteredTrips]);

  const travelStats = useMemo(() => {
    try {
      const stats = {
        totalTrips: filteredTrips.length,
        totalCountries: new Set(filteredTrips.map(t => t.location).filter(Boolean)).size,
        totalPhotos: filteredTrips.filter(t => t.imageUrl).length,
        mostVisitedPlace: null,
        recentTrip: null
      };

      const placeCount = {};
      filteredTrips.forEach(trip => {
        if (trip.location) {
          placeCount[trip.location] = (placeCount[trip.location] || 0) + 1;
        }
      });
      if (Object.keys(placeCount).length > 0) {
        stats.mostVisitedPlace = Object.entries(placeCount).sort((a, b) => b[1] - a[1])[0];
      }

      const sortedTrips = [...filteredTrips].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? new Date(a.createdAt.toDate()) : new Date(0);
        const dateB = b.createdAt?.toDate ? new Date(b.createdAt.toDate()) : new Date(0);
        return dateB - dateA;
      });
      stats.recentTrip = sortedTrips[0];

      return stats;
    } catch (error) {
      console.error('Error calculating travel stats:', error);
      return {
        totalTrips: 0,
        totalCountries: 0,
        totalPhotos: 0,
        mostVisitedPlace: null,
        recentTrip: null
      };
    }
  }, [filteredTrips]);

  const regions = useMemo(() => {
    try {
      return Array.from(new Set(trips.map(t => t.location).filter(Boolean)));
    } catch (error) {
      console.error('Error calculating regions:', error);
      return [];
    }
  }, [trips]);

  const years = useMemo(() => {
    try {
      return Array.from(new Set(trips.map(t => {
        return t.createdAt?.toDate ? new Date(t.createdAt.toDate()).getFullYear() : new Date().getFullYear();
      }))).sort((a, b) => b - a);
    } catch (error) {
      console.error('Error calculating years:', error);
      return [];
    }
  }, [trips]);

  const renderJourneyMode = () => (
    <div className="w-full h-[70vh] rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showRoutes && Object.entries(userJourneys).map(([author, userTrips], userIndex) => {
          if (userTrips.length < 2) return null;
          
          const positions = userTrips.map(trip => [trip.lat, trip.lng]);
          const color = `hsl(${(userIndex * 137.5) % 360}, 70%, 50%)`;
          
          return (
            <React.Fragment key={author}>
              <Polyline
                positions={positions}
                color={color}
                weight={3}
                opacity={0.7}
                dashArray="10, 5"
              />
              {userTrips.map((trip, index) => (
                <Marker 
                  key={`${trip.id}-${index}`} 
                  position={[trip.lat, trip.lng]}
                  icon={createCustomIcon(color)}
                >
                  <Popup minWidth={280}>
                    <div className="mb-2">
                      {trip.imageUrl && (
                        <img src={trip.imageUrl} alt={trip.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                      )}
                      <div className="text-base font-bold mb-1">{trip.title}</div>
                      <div className="text-xs text-gray-500 mb-1">by {author}</div>
                      <div className="text-xs text-gray-500 mb-1">
                        {trip.location} • {trip.createdAt?.toDate ? new Date(trip.createdAt.toDate()).toLocaleDateString() : ''}
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                        {trip.description?.slice(0, 80)}{trip.description?.length > 80 ? '...' : ''}
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/trip/${trip.id}`} className="text-blue-600 hover:underline text-sm font-semibold">
                          View Journal
                        </Link>
                        {currentUser && (
                          <button
                            className="text-green-600 hover:underline text-sm font-semibold"
                            onClick={() => navigate(`/create?lat=${trip.lat}&lng=${trip.lng}&place=${encodeURIComponent(trip.location || '')}`)}
                          >
                            Visit Here
                          </button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}
      </MapContainer>
      
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setPlayAnimation(!playAnimation)}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {playAnimation ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`p-2 rounded-lg transition-colors ${
              showRoutes ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          >
            <Route size={16} />
          </button>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {Object.keys(userJourneys).length} travelers • {filteredTrips.length} trips
        </div>
      </div>
    </div>
  );

  const renderStatsMode = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Trips</p>
            <p className="text-3xl font-bold">{travelStats.totalTrips}</p>
          </div>
          <Globe size={32} className="text-blue-200" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Countries Visited</p>
            <p className="text-3xl font-bold">{travelStats.totalCountries}</p>
          </div>
          <MapPin size={32} className="text-green-200" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Photos Shared</p>
            <p className="text-3xl font-bold">{travelStats.totalPhotos}</p>
          </div>
          <Camera size={32} className="text-purple-200" />
        </div>
      </motion.div>

      {travelStats.mostVisitedPlace && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Most Visited</p>
              <p className="text-xl font-bold">{travelStats.mostVisitedPlace[0]}</p>
              <p className="text-orange-200 text-sm">{travelStats.mostVisitedPlace[1]} trips</p>
            </div>
            <Heart size={32} className="text-orange-200" />
          </div>
        </motion.div>
      )}

      {travelStats.recentTrip && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Latest Adventure</p>
              <p className="text-lg font-bold line-clamp-2">{travelStats.recentTrip.title}</p>
              <p className="text-pink-200 text-sm">{travelStats.recentTrip.location}</p>
            </div>
            <TrendingUp size={32} className="text-pink-200" />
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Travel Journey Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover travel stories, visualize journeys, and explore the world through shared experiences
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setViewMode('journey')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'journey'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Route className="inline mr-2" size={18} />
            Journey Routes
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'stats'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="inline mr-2" size={18} />
            Travel Stats
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search trips..."
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            
            <select
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={filter.pub}
              onChange={e => setFilter(f => ({ ...f, pub: e.target.value }))}
            >
              <option value="all">All Privacy</option>
              <option value="public">Public Only</option>
              <option value="private">Private Only</option>
            </select>
            
            <select
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={filter.region}
              onChange={e => setFilter(f => ({ ...f, region: e.target.value }))}
            >
              <option value="all">All Locations</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            
            <select
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={filter.year}
              onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-2">Error Loading Map</p>
              <p className="text-red-500 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading travel data...</p>
          </div>
        ) : (
          <>
            {viewMode === 'journey' && renderJourneyMode()}
            {viewMode === 'stats' && renderStatsMode()}
          </>
        )}

        {currentUser && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/create')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create New Trip
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all"
              >
                View My Trips
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 