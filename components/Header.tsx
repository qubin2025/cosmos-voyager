
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (section: string) => void;
  user: User;
  onOpenLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onOpenLogin, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('hero')}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 animate-pulse group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <h1 className="text-2xl font-bold font-space tracking-tight text-white">COSMOS<span className="text-indigo-400">VOYAGER</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {[
            { label: 'Solar System', id: 'solar-system' },
            { label: 'Deep Space', id: 'deep-space' },
            { label: 'Galaxies', id: 'milky-way' },
            { label: 'Forum', id: 'forum' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('ai-guide')}
            className="hidden sm:block text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-[0.3em] border border-indigo-500/20 px-3 py-1.5 rounded-full hover:bg-indigo-500/5"
          >
            AI Oracle
          </button>
          
          {user.isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">{user.username}</span>
                <button 
                  onClick={onLogout}
                  className="text-[9px] text-slate-500 hover:text-pink-400 uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </div>
              <div className="relative">
                <img src={user.avatar} className="w-10 h-10 rounded-full border border-indigo-500/50" alt={user.username} />
                {user.isAdmin && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Link
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
