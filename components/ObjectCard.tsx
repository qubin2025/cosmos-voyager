
import React from 'react';
import { CelestialObject } from '../types';

interface ObjectCardProps {
  obj: CelestialObject;
  onExplore: (obj: CelestialObject) => void;
}

const ObjectCard: React.FC<ObjectCardProps> = ({ obj, onExplore }) => {
  return (
    <div 
      onClick={() => onExplore(obj)}
      className="group cursor-pointer glass rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 shadow-lg"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={obj.image} 
          alt={obj.name}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-125 group-hover:rotate-2 transition-all duration-[4000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest font-bold text-indigo-300 border border-white/5">
            {obj.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold font-space text-white">{obj.name}</h3>
          <span className="text-xs text-slate-500 mt-2">{obj.distance}</span>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2">
          {obj.description}
        </p>
        
        <div className="space-y-2 mb-6">
          {obj.details.slice(0, 2).map((detail, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-indigo-200/70">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform duration-500"></div>
              {detail}
            </div>
          ))}
        </div>
        
        <button 
          className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-slate-950 transition-all duration-300"
        >
          Explore Deeply
        </button>
      </div>
    </div>
  );
};

export default ObjectCard;
