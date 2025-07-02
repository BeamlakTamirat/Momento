
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const defaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = defaultIcon;

function LocationMarker({ position, setPosition, setPlaceName }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      reverseGeocode(e.latlng, setPlaceName);
    },
  });
  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
          reverseGeocode(latlng, setPlaceName);
        },
      }}
    />
  );
}

async function reverseGeocode(latlng, setPlaceName) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`);
    const data = await res.json();
    setPlaceName(data.display_name || '');
  } catch {
    setPlaceName('');
  }
}

export default function MapInput({ value, onChange }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null);
  const [placeName, setPlaceName] = useState(value?.placeName || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (position) {
      onChange({ lat: position.lat, lng: position.lng, placeName });
    }

  }, [position, placeName]);

  async function handleSearch(e) {
    setSearch(e.target.value);
    if (e.target.value.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(e.target.value)}`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  }

  function handleSuggestionClick(suggestion) {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setPosition({ lat, lng });
    setPlaceName(suggestion.display_name);
    setSuggestions([]);
    setSearch(suggestion.display_name);
  }

  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Location (search or pick on map)</label>
      <div className="relative mb-2">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search for a place..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {loading && <span className="absolute right-3 top-3 text-xs text-blue-500">Loading...</span>}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg max-h-56 overflow-y-auto">
            {suggestions.map((s) => (
              <li
                key={s.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-full h-64 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg overflow-hidden">
        <MapContainer
          center={position || [9.0054, 38.7578]}
          zoom={position ? 10 : 5}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} setPlaceName={setPlaceName} />
        </MapContainer>
      </div>
      {placeName && (
        <p className="text-xs text-gray-500 mt-2">Selected: {placeName}</p>
      )}
    </div>
  );
} 