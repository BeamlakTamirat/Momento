import React, { useState, useEffect } from 'react';
import {Routes , Route , Link ,useParams } from 'react-router-dom';
import { motion , AnimatePresence} from 'framer-motion';
import { ArrowRight, LogIn, Sun, Moon ,MapPin , Calendar} from 'lucide-react';



const tripsData = [
  { id: "1", title: "Journey to the Danakil Depression", author: "Henok D.", imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2787&auto=format&fit=crop", location: "Afar Region, Ethiopia", date: "October 2024", description: "An unforgettable expedition to one of the most surreal and extreme landscapes on Earth. We witnessed otherworldly sulphur springs, vast salt flats, and the glowing lava lake of the Erta Ale volcano. A true test of endurance and a visual feast.", gallery: ["https://images.unsplash.com/photo-1548872545-3C534a742134?q=80&w=2787&auto=format&fit=crop", "https://images.unsplash.com/photo-1617751139145-a37a2629ff58?q=80&w=2835&auto=format&fit=crop", "https://images.unsplash.com/photo-1598179883995-1216b0a85a49?q=80&w=2835&auto=format&fit=crop"] },
  { id: "2", title: "Trekking the Simien Mountains", author: "Selam T.", imageUrl: "https://images.unsplash.com/photo-1606243403755-9ab377196434?q=80&w=2831&auto=format&fit=crop", location: "Amhara Region, Ethiopia", date: "November 2024", description: "Three days spent hiking through the breathtaking 'Roof of Africa'. Encountered massive troops of Gelada monkeys and spotted the elusive Walia Ibex on the sheer cliffs. The views from Imet Gogo were simply life-changing.", gallery: ["https://images.unsplash.com/photo-1617992933719-2169ac965451?q=80&w=2787&auto=format&fit=crop", "https://www.discover-afrika.com/wp-content/uploads/2021/03/Gelada-Baboon-Ethiopia-e1616782236968.jpg", "https://i.natgeofe.com/n/a9296359-3319-48d7-84d3-317429a25993/walia-ibex_thumb_3x2.jpg"] },
  { id: "3", title: "Churches of Lalibela", author: "David B.", imageUrl: "https://images.unsplash.com/photo-1605599443424-857f12e60421?q=80&w=2787&auto=format&fit=crop", location: "Amhara Region, Ethiopia", date: "August 2024", description: "A spiritual journey back in time, exploring the incredible rock-hewn churches of Lalibela. Each structure, carved from a single piece of stone, tells a story of faith and incredible craftsmanship. A humbling and awe-inspiring experience.", gallery: ["https://images.unsplash.com/photo-1578637387413-8199344f65c2?q=80&w=2787&auto=format&fit=crop", "https://images.unsplash.com/photo-1662952945209-6a3f133036e4?q=80&w=2799&auto=format&fit=crop", "https://images.unsplash.com/photo-1662952945455-3b1a1a2b2e8e?q=80&w=2799&auto=format&fit=crop"] },
  { id: "4", title: "Exploring the Omo Valley", author: "Aman F.", imageUrl: "https://images.unsplash.com/photo-1596922813971-f930a8a62319?q=80&w=2787&auto=format&fit=crop", location: "SNNPR, Ethiopia", date: "September 2024", description: "Met with the incredible tribes of the Omo Valley, including the Mursi and Hamar people. It was a profound cultural experience, learning about ancient traditions and ways of life that have remained unchanged for centuries.", gallery: ["https://images.unsplash.com/photo-1596792476906-e7f369f44358?q=80&w=2787&auto=format&fit=crop", "https://images.unsplash.com/photo-1582233634938-7952554868f7?q=80&w=2787&auto=format&fit=crop", "https://images.unsplash.com/photo-1598242475583-0863970de840?q=80&w=2787&auto=format&fit=crop"] },
];

const getTripById = (id) => {
  return tripsData.find(trip => trip.id === id);
}

function Header({ theme, onThemeToggle }) {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-20"
    >
      <div className="container mx-auto flex justify-between items-center p-6"> 
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-[#e0e0e0]">Momento</Link>
        <div className="flex items-center space-x-6">  
          <Link to="/" className="text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-white transition-colors">Discover</Link>
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
    <Link to={`/trip/${trip.id}`} className="block">
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
    </Link>
  );
}

function HomePage(){
  
  const containerVariants =  {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="container mx-auto px-6 pt-32 pb-16">
      <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="text-center mb-20">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-6 bg-clip-text text-gray-100 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-blue-300 dark:to-[#00aaff]">Immortalize Your Journeys.</h1>
        <p className="text-xl text-gray-600 dark:text-[#a0a0a0] max-w-3xl mx-auto">The modern digital journal for travelers. Document your adventures, preserve your memories, and tell your story.</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-10 flex items-center justify-center mx-auto space-x-2 bg-[#00aaff] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors">
          <span>Start Your First Journal</span>
          <ArrowRight size={22} />
        </motion.button>
      </motion.section>
      <section>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-8">Featured Journals</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tripsData.map(trip => (
            <motion.div key={trip.id} variants={itemVariants}>
              <TripCard trip={trip} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}


function TripDetailPage(){
  const {tripId} = useParams();

  const trip = getTripById(tripId);

  if (!trip){
    return (
      <div className="container mx-auto px-6 pt-32 pb-16 text-center">
        <h1 className="text-4xl font-bold">Trip not found!</h1>
        <Link to="/" className="text-accent mt-8 inline-block hover:underline">← Back to Discover</Link>
      </div>
    );
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2, duration: 0.5 } }
  }

  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const imageVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible">
      {/* Hero section with the main image */}
      <div className="h-[60vh] w-full relative">
        <img src={trip.imageUrl} alt={trip.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
          <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }} className="text-4xl md:text-6xl font-extrabold">{trip.title}</motion.h1>
          <motion.p initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="text-xl mt-2">by {trip.author}</motion.p>
        </div>
      </div>
      
      {/* Main content section */}
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column for description */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.7 }} className="lg:col-span-2">
            <div className="flex items-center space-x-6 mb-8 text-gray-500 dark:text-[#a0a0a0]">
              <div className="flex items-center space-x-2"><Calendar size={20}/><span className="font-semibold">{trip.date}</span></div>
              <div className="flex items-center space-x-2"><MapPin size={20}/><span className="font-semibold">{trip.location}</span></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-4">About the Journey</h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-[#a0a0a0]">{trip.description}</p>
          </motion.div>
          
          {/* Right column for photo gallery */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-[#e0e0e0] mb-4">Gallery</h2>
            <motion.div variants={galleryVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
              {trip.gallery.map((imgUrl, index) => (
                <motion.div key={index} variants={imageVariants} className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img src={imgUrl} className="w-full h-full object-cover"/>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="text-center mt-16">
          <Link to="/" className="text-[#00aaff] text-lg font-semibold hover:underline">← Back to Discover</Link>
        </div>
      </div>
    </motion.div>
  );
}



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
  return (
    <div className="bg-gray-100 dark:bg-[#121212] min-h-screen transition-colors duration-500">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />  
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip/:tripId" element={<TripDetailPage />} />
        </Routes> 
      </AnimatePresence>   
    </div>
  );
}

export default App;
