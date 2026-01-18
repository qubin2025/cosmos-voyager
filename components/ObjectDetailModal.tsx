
import React, { useState, useEffect, useMemo } from 'react';
import { CelestialObject } from '../types';
import { getCosmicInsights } from '../services/geminiService';
import { marked } from 'marked';

interface ObjectDetailModalProps {
  obj: CelestialObject | null;
  onClose: () => void;
}

const ObjectDetailModal: React.FC<ObjectDetailModalProps> = ({ obj, onClose }) => {
  const [aiResponse, setAiResponse] = useState<{ text: string; sources: any[] }>({ text: '', sources: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (obj) {
      const fetchFact = async () => {
        setLoading(true);
        // Clear previous response while loading
        setAiResponse({ text: '', sources: [] });
        try {
          const result = await getCosmicInsights(`Tell me a mind-blowing, specific scientific fact about ${obj.name} that most people don't know.`);
          // Ensure result is handled as an object
          setAiResponse(result);
        } catch (error) {
          setAiResponse({ text: 'Error retrieving cosmic data.', sources: [] });
        } finally {
          setLoading(false);
        }
      };
      fetchFact();
    }
  }, [obj]);

  const htmlContent = useMemo(() => {
    if (!aiResponse.text) return '';
    return marked.parse(aiResponse.text) as string;
  }, [aiResponse.text]);

  if (!obj) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="glass w-full max-w-5xl max-h-[90vh] rounded-[2rem] relative z-10 overflow-hidden flex flex-col md:flex-row animate-fade-in border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Left: Immersive Image Area */}
        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
          <img 
            src={obj.image} 
            alt={obj.name}
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8">
            <span className="px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-lg mb-4 inline-block">
              {obj.type}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold font-space text-white drop-shadow-2xl">{obj.name}</h2>
          </div>
        </div>

        {/* Right: Detailed Info Area */}
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-950/20">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full glass hover:bg-white/10 transition-colors z-20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-400 mb-4">Overview</h3>
              <p className="text-slate-200 text-lg leading-relaxed font-light italic">
                {obj.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {obj.details.map((detail, idx) => (
                <div key={idx} className="glass p-4 rounded-xl border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest block mb-1">Observation</span>
                  <span className="text-white text-sm font-semibold">{detail}</span>
                </div>
              ))}
              <div className="glass p-4 rounded-xl border border-white/5 col-span-2">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest block mb-1">Distance from Base</span>
                <span className="text-white text-sm font-semibold">{obj.distance}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-indigo-400">Deep Cosmic Insight</h3>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  <div className="shimmer-box h-4 w-11/12"></div>
                  <div className="shimmer-box h-4 w-full"></div>
                  <div className="shimmer-box h-4 w-9/12"></div>
                  <div className="shimmer-box h-4 w-10/12"></div>
                </div>
              ) : (
                <>
                  <div 
                    className="prose-custom text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                  {aiResponse.sources.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {aiResponse.sources.map((chunk, idx) => chunk.web && (
                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] font-bold text-indigo-400/70 border border-indigo-500/20 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors">
                          Source: {chunk.web.title || 'Data'}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
              Return to Expedition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetailModal;
