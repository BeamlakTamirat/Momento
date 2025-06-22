import React from 'react'

function Header() {
  return (
    <header className="py-6 px-4">
      <div className="container mx-auto flex justify-between items-center">        
        <div className="text-2xl font-bold text-[#e0e0e0]">
          Momento
        </div>        
        <div className="flex items-center space-x-8">
          <a href="#" className="text-[#a0a0a0] hover:text-[#e0e0e0] transition-colors">Discover</a>
          <a href="#" className="text-[#a0a0a0] hover:text-[#e0e0e0] transition-colors">My Trips</a>
          <button className="bg-[#00aaff] text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-colors">
            Log In
          </button>
        </div>
      </div>
    </header>
  );
}

function TripCard(){
  return (
    <div className="bg-[#2a2a2a] rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-out group">
      <div className="h-56 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2787&auto=format&fit=crop" 
          alt="Danakil Depression" 
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out'/>
      </div>
      <div className='p-5'>
        <h3 className="text-xl font-bold text-[#e0e0e0] truncate">Journey to the Denakil Depression</h3>
        <p>by Haile D.</p>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className="bg-[#1a1a1a] text-[#e0e0e0] min-h-screen font-['Inter',_sans-serif]">
      <Header />
      <main className='container mx-auto px-4 py-8'>
        <section className='text-center mb-16'>
          <h1 className='text-5xl md:text-7xl font-extrabold tracking-tighter mb-4'>
            Capture Your <span className="text-[#00aaff]">Journeys.</span>
          </h1>
          <p className='text-xl text-[#a0a0a0] max-w-3xl mx-auto'>
            The modern digital journal for travelers. Document your adventures, preserve your memories, and share your story.
          </p>
        </section>

        <section>
          <h2 className='text-3xl font-bold mb-8'>Featured Journals</h2> 
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            <TripCard />
            <TripCard />
            <TripCard />
            <TripCard />
          </div>         
        </section>
      </main>
    </div>
  );
}

export default App