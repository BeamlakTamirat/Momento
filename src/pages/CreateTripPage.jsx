import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageUp, LoaderCircle, X, Plus } from 'lucide-react';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import LocationAutocomplete from '../components/LocationAutocomplete';

const ToggleSwitch = ({ isToggled, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isToggled ? 'bg-[#00aaff] justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'}`}
  >
    <motion.div 
      className="w-6 h-6 bg-white rounded-full shadow-md"
      layout 
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
    />
  </div>
);

export default function CreateTripPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  React.useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const place = searchParams.get('place');
    
    if (lat && lng && place) {
      setLocation(place);
      setLocationCoords({
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      });
    }
  }, [searchParams]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      id: Date.now() + Math.random(),
      preview: URL.createObjectURL(file)
    }));
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  const removeGalleryImage = (id) => {
    setGalleryImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocationCoords({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { 
      method: "POST", 
      body: formData 
    });
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error.message || 'Image upload failed');
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { setError("You must be logged in."); return; }
    if (!image) { setError("Please upload a cover image."); return; }
    if (!locationCoords) { setError("Please select a valid location from the suggestions."); return; }

    setLoading(true);
    setError('');

    try {
      const imageUrl = await uploadImageToCloudinary(image);
      const galleryUrls = [];
      for (const galleryImage of galleryImages) {
        const url = await uploadImageToCloudinary(galleryImage.file);
        galleryUrls.push(url);
      }

      await addDoc(collection(db, "trips"), {
        title,
        description,
        location,
        lat: locationCoords.lat,
        lng: locationCoords.lng,
        imageUrl,
        galleryImages: galleryUrls,
        isPublic,
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        createdAt: new Date(),
      });
      
      navigate('/dashboard');

    } catch (err) {
      setError("Failed to create trip. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-16">
      <motion.div initial={{ y:20, opacity: 0 }} animate={{ y:0, opacity: 1}} className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-8">Create a New Momento</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Trip Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., A Weekend in the Bale Mountains" 
              className="w-full p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" 
              required 
            />
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Location</label>
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              onLocationSelect={handleLocationSelect}
              placeholder="Search for a location (e.g., Paris, France)"
            />
            {locationCoords && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Location coordinates saved: {locationCoords.lat.toFixed(4)}, {locationCoords.lng.toFixed(4)}
              </p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Cover Image</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
              <div className="text-center">
                <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[#00aaff] hover:text-blue-400">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {image ? <p className="text-xs text-gray-500 mt-2">{image.name}</p> : <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">
              Photo Gallery ({galleryImages.length} photos)
            </label>
            <div className="mt-2">
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt="Gallery preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-8">
                <div className="text-center">
                  <Plus className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <label htmlFor="gallery-upload" className="relative cursor-pointer rounded-md font-semibold text-[#00aaff] hover:text-blue-400">
                      <span>Add photos to gallery</span>
                      <input 
                        id="gallery-upload" 
                        name="gallery-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleGalleryChange} 
                        accept="image/*" 
                        multiple 
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select multiple images to create a photo gallery</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Journal / Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="10" 
              placeholder="Tell the story of your journey..." 
              className="w-full p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" 
              required
            />
          </div>
          
          <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg">
            <div>
              <label className="font-bold text-gray-800 dark:text-white">Make Journal Public</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">Public journals can be featured on the homepage.</p>
            </div>
            <ToggleSwitch isToggled={isPublic} onToggle={() => setIsPublic(!isPublic)} />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading || !locationCoords} 
              className="flex items-center justify-center space-x-2 bg-[#00aaff] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <span>Create Journal</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
