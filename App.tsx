
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ObjectCard from './components/ObjectCard';
import ObjectDetailModal from './components/ObjectDetailModal';
import GeminiExplorer from './components/GeminiExplorer';
import Forum from './components/Forum';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { SOLAR_SYSTEM_DATA, GALAXY_DATA } from './constants';
import { User, CelestialObject } from './types';

const INITIAL_COSMIC: CelestialObject[] = [
  {
    id: 'orion-nebula',
    name: 'Orion Nebula',
    type: 'nebula',
    description: 'A stellar nursery where new stars are born, visible even to the naked eye.',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a67a06d1?auto=format&fit=crop&q=80&w=2560',
    distance: '1,344 ly',
    details: ['Type: Emission Nebula', 'Mass: 2000 Suns', 'Age: 3 Million Years']
  },
  {
    id: 'pleiades',
    name: 'Pleiades',
    type: 'star',
    description: 'The Seven Sisters, an open star cluster dominated by hot blue stars.',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2560',
    distance: '444 ly',
    details: ['Stars: ~1000', 'Core Radius: 8 ly', 'Class: Open Cluster']
  }
];

const GUEST_USER: User = {
  username: 'Guest Voyager',
  avatar: 'https://i.pravatar.cc/150?u=guest',
  isLoggedIn: false,
  isAdmin: false
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Dynamic data state
  const [solarObjects, setSolarObjects] = useState<CelestialObject[]>(SOLAR_SYSTEM_DATA);
  const [cosmicObjects, setCosmicObjects] = useState<CelestialObject[]>(INITIAL_COSMIC);
  const [galaxyObjects, setGalaxyObjects] = useState<CelestialObject[]>(GALAXY_DATA);

  const solarScrollRef = useRef<HTMLDivElement>(null);
  const cosmicScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 800);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const horizontalScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.8;
      ref.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddObject = (obj: CelestialObject, sector: 'solar' | 'cosmic' | 'galaxy') => {
    if (sector === 'solar') setSolarObjects(prev => [...prev, obj]);
    else if (sector === 'cosmic') setCosmicObjects(prev => [...prev, obj]);
    else setGalaxyObjects(prev => [...prev, obj]);
  };

  const handleUpdateObject = (obj: CelestialObject, sector: 'solar' | 'cosmic' | 'galaxy') => {
    // 统一在所有区域搜索并更新，防止ID冲突导致数据不一致
    const update = (prev: CelestialObject[]) => prev.map(o => o.id === obj.id ? obj : o);
    setSolarObjects(update);
    setCosmicObjects(update);
    setGalaxyObjects(update);
  };

  const handleDeleteObject = (id: string) => {
    setSolarObjects(prev => prev.filter(o => o.id !== id));
    setCosmicObjects(prev => prev.filter(o => o.id !== id));
    setGalaxyObjects(prev => prev.filter(o => o.id !== id));
  };

  const handleLogin = (username: string) => {
    const isAdmin = username.toLowerCase().startsWith('admin_');
    setUser({ 
      username, 
      avatar: `https://i.pravatar.cc/150?u=${username}`, 
      isLoggedIn: true,
      isAdmin
    });
  };

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <Header 
        onNavigate={scrollToSection} 
        user={user} 
        onOpenLogin={() => setIsLoginModalOpen(true)} 
        onLogout={() => setUser(GUEST_USER)} 
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />
      
      <ObjectDetailModal obj={selectedObject} onClose={() => setSelectedObject(null)} />

      {/* Hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/40 z-10"></div>
        <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover animate-slow-zoom opacity-60" />
        <div className="relative z-40 text-center">
          <div className="mb-6">
             <span className="px-4 py-1 glass rounded-full text-indigo-400 font-bold tracking-[0.4em] uppercase text-[10px] border border-indigo-500/30">
               System Status: Active
             </span>
          </div>
          <h1 className="text-7xl md:text-9xl font-extrabold font-space text-white mb-8 drop-shadow-2xl">
            COSMOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">VOYAGER</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">Your orbital gateway to the infinite wonders of the universe.</p>
          <div className="flex gap-6 justify-center">
            <button onClick={() => scrollToSection('solar-system')} className="px-12 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-xl">Initiate Warp</button>
            {user.isAdmin && (
              <button onClick={() => scrollToSection('admin-panel')} className="px-12 py-5 glass text-white border border-pink-500/40 rounded-full font-bold text-lg hover:bg-pink-500/10 transition-all">Command Panel</button>
            )}
          </div>
        </div>
      </section>

      {/* Sector 01: Solar System */}
      <section id="solar-system" className="py-32 bg-slate-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-xs mb-2 block">Orbital Sector 01</span>
            <h2 className="text-5xl font-bold font-space text-white">The Solar System</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => horizontalScroll(solarScrollRef, 'left')} className="p-3 glass rounded-full border border-white/10 hover:bg-indigo-600/30 transition-all group"><svg className="w-6 h-6 text-white group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg></button>
            <button onClick={() => horizontalScroll(solarScrollRef, 'right')} className="p-3 glass rounded-full border border-white/10 hover:bg-indigo-600/30 transition-all group"><svg className="w-6 h-6 text-white group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg></button>
          </div>
        </div>

        <div ref={solarScrollRef} className="flex gap-8 overflow-x-auto pb-16 px-6 md:px-24 snap-x snap-mandatory no-scrollbar scroll-smooth">
          {solarObjects.map(obj => (
            <div key={obj.id} className="min-w-[320px] md:min-w-[420px] snap-center">
              <ObjectCard obj={obj} onExplore={setSelectedObject} />
            </div>
          ))}
        </div>
      </section>

      {/* Sector 02: Galaxies (Intergalactic Scale) */}
      <section id="milky-way" className="py-32 border-t border-white/5 bg-slate-950/60 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[200px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-pink-400 font-bold tracking-[0.3em] uppercase text-xs mb-2 block">Intergalactic Sector 02</span>
            <h2 className="text-5xl font-bold font-space text-white">Galactic Entities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {galaxyObjects.map(obj => <ObjectCard key={obj.id} obj={obj} onExplore={setSelectedObject} />)}
          </div>
        </div>
      </section>

      {/* Sector 03: Deep Universe Exploration (Cosmic Scale) */}
      <section id="deep-space" className="py-32 relative bg-slate-950/40 overflow-hidden border-t border-white/5">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[150px] rounded-full -ml-80 -mb-80"></div>
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end relative z-10">
          <div>
            <span className="text-purple-400 font-bold tracking-[0.3em] uppercase text-xs mb-2 block">Universal Sector 03</span>
            <h2 className="text-5xl font-bold font-space text-white">Deep Universe Exploration</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => horizontalScroll(cosmicScrollRef, 'left')} className="p-3 glass rounded-full border border-white/10 hover:bg-purple-600/30 transition-all group"><svg className="w-6 h-6 text-white group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg></button>
            <button onClick={() => horizontalScroll(cosmicScrollRef, 'right')} className="p-3 glass rounded-full border border-white/10 hover:bg-purple-600/30 transition-all group"><svg className="w-6 h-6 text-white group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2}/></svg></button>
          </div>
        </div>

        <div ref={cosmicScrollRef} className="flex gap-8 overflow-x-auto pb-16 px-6 md:px-24 snap-x snap-mandatory no-scrollbar scroll-smooth relative z-10">
          {cosmicObjects.map(obj => (
            <div key={obj.id} className="min-w-[320px] md:min-w-[420px] snap-center">
              <ObjectCard obj={obj} onExplore={setSelectedObject} />
            </div>
          ))}
          {cosmicObjects.length === 0 && (
            <div className="w-full text-center py-20 text-slate-500 italic font-space">No deep space entities registered in current quadrant.</div>
          )}
        </div>
      </section>

      <GeminiExplorer />

      {/* Admin Panel (Visible only to admins) */}
      {user.isAdmin && (
        <AdminPanel 
          objects={[...solarObjects, ...cosmicObjects, ...galaxyObjects]} 
          onAddObject={handleAddObject}
          onUpdateObject={handleUpdateObject}
          onDeleteObject={handleDeleteObject}
        />
      )}

      <Forum user={user} onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-slate-950 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 opacity-50 blur-sm"></div>
          <p className="text-slate-500 text-sm font-space uppercase tracking-widest">Across the stars, we are one.</p>
          <p className="text-slate-700 text-[10px]">© 2024 Cosmos Voyager Initiative. All signals encrypted.</p>
        </div>
      </footer>

      {/* Back to Top */}
      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-4 glass rounded-full border border-indigo-500/50 text-indigo-400 hover:scale-110 transition-all z-50 animate-bounce shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7M5 19l7-7 7 7" /></svg>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
