import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ImageUp, LoaderCircle } from 'lucide-react';
import { db } from '../lib/firebase'; 
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function CreateTripPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const CLOUDINARY_CLOUD_NAME = "ds3e0dpgh";
  const CLOUDINARY_UPLOAD_PRESET = "momento_preset";

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { setError("You must be logged in."); return; }
    if (!image) { setError("Please upload a cover image."); return; }

    setLoading(true);
    setError('');

    
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
      
        throw new Error(cloudinaryData.error.message || 'Image upload failed');
      }

     
      const imageUrl = cloudinaryData.secure_url;

      
      await addDoc(collection(db, "trips"), {
        title,
        description,
        location,
        imageUrl, 
        authorId: currentUser.uid,
        authorEmail: currentUser.email,
        createdAt: new Date(),
      });
      
     
      navigate('/dashboard');

    } catch (err) {
      setError("Failed to create trip. Please try again.");
      console.error("Error during trip creation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-16">
      <motion.div initial={{ y:20, opacity: 0 }} animate={{ y:0, opacity: 1}} className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-8">Create a New Momento</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div><label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Trip Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., A Weekend in the Bale Mountains" className="w-full p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" required /></div>
          
          <div><label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Location</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Amhara Region, Ethiopia" className="w-full p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" required /></div>

          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Cover Image</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/25 px-6 py-10">
              <div className="text-center">
                <ImageUp className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[#00aaff] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00aaff] focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 hover:text-blue-400">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {image && <p className="text-xs leading-5 text-gray-500 mt-2">{image.name}</p>}
                {!image && <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 10MB</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 dark:text-[#a0a0a0] block mb-2">Journal / Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="10" placeholder="Tell the story of your journey..." className="w-full p-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aaff]" required></textarea>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center justify-center space-x-2 bg-[#00aaff] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? <LoaderCircle className="animate-spin" /> : <span>Create Journal</span>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}