import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, Sun, Moon } from 'lucide-react';


function Header({ theme, onThemeToggle }) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-20"
    >
      <div className="container mx-auto flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-gray-800 dark:text-[#e0e0e0]">Momento</div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-white transition-colors">Discover</a>
                 
          <button 
            onClick={onThemeToggle} 
            className="p-2 rounded-full text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="flex items-center space-x-2 bg-[#00aaff] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}


function TripCard({ trip }) {
  return (
    <div className="bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
      <div className="h-64 w-full overflow-hidden">
        <img 
          src={trip.imageUrl} 
          alt={trip.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 dark:text-[#e0e0e0] truncate">{trip.title}</h3>
        <p className="text-gray-500 dark:text-[#a0a0a0] mt-1">by {trip.author}</p>
      </div>
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const featuredTrips = [
    { id: 1, title: "Journey to the Danakil Depression", author: "Henok D.", imageUrl: "" },
    { id: 2, title: "Simien Mountains", author: "Selam T.", imageUrl: "" },
    { id: 3, title: "Churches of Lalibela", author: "Dawit B.", imageUrl: "" },
    { id: 4, title: "Axum", author: "Merry K.", imageUrl: "" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gray-100 dark:bg-[#121212] min-h-screen transition-colors duration-500">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-gray-800 dark:text-[#e0e0e0]">
            Immortalize Your Journeys.
          </h1>
          <p className="text-xl text-gray-600 dark:text-[#a0a0a0] max-w-3xl mx-auto">
            The modern digital journal for travelers. Document your adventures, preserve your memories, and tell your story.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 flex items-center justify-center mx-auto space-x-2 bg-[#00aaff] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors"
          >
            <span>Start Your First Journal</span>
            <ArrowRight size={22} />
          </motion.button>
        </motion.section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-8">Featured Journals</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredTrips.map(trip => (
              <motion.div key={trip.id} variants={itemVariants}>
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default App;
