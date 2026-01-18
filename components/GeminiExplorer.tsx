
import React, { useState, useMemo, useRef } from 'react';
import { getCosmicInsights } from '../services/geminiService';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const GeminiExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState({ text: '', sources: [] as any[] });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const result = await getCosmicInsights(query);
    setResponse(result);
    setLoading(false);
  };

  const htmlContent = useMemo(() => {
    if (!response.text) return '';
    return marked.parse(response.text) as string;
  }, [response.text]);

  const handleExport = async (format: 'pdf' | 'word' | 'markdown') => {
    if (!response.text) return;
    setExporting(true);
    setShowExportMenu(false);
    const safeFilename = query.slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();

    try {
      if (format === 'markdown') {
        const blob = new Blob([response.text], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeFilename}.md`;
        link.click();
      } else if (format === 'pdf' && resultRef.current) {
        const canvas = await html2canvas(resultRef.current, { backgroundColor: '#0f172a', scale: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save(`${safeFilename}.pdf`);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <section id="ai-guide" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden border border-indigo-500/20 shadow-[0_0_80px_rgba(79,70,229,0.1)]">
        <div className="text-center mb-10">
          <span className="text-indigo-400 font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Neural Cosmic Link</span>
          <h2 className="text-4xl md:text-5xl font-bold font-space text-white mb-4">Cosmic Oracle</h2>
          <p className="text-slate-400 text-sm">Real-time astrophysics and space events guidance.</p>
        </div>

        <form onSubmit={handleExplore} className="relative mb-10">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about black holes, star births, or recent missions..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
          >
            {loading ? 'Searching Deep Space...' : 'Query'}
          </button>
        </form>

        {response.text && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Insight Streamed
              </span>
              <button onClick={() => setShowExportMenu(!showExportMenu)} className="text-[10px] font-bold text-white glass px-4 py-2 rounded-lg hover:bg-white/10 transition-all border border-white/10">
                Export Intel
              </button>
              {showExportMenu && (
                <div className="absolute right-12 mt-32 w-40 glass rounded-xl overflow-hidden z-30 border border-white/10">
                  {['pdf', 'markdown'].map(fmt => (
                    <button key={fmt} onClick={() => handleExport(fmt as any)} className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-indigo-600/30 uppercase tracking-widest border-b border-white/5 last:border-0">
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={resultRef} className="bg-slate-950/40 border border-white/5 p-8 rounded-2xl">
              <div className="prose-custom text-slate-200 leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: htmlContent }} />
              
              {response.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Scientific Sources & Grounding</h4>
                  <div className="flex flex-wrap gap-3">
                    {response.sources.map((chunk, idx) => chunk.web && (
                      <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-indigo-300 glass px-3 py-1.5 rounded-full hover:border-indigo-400/50 transition-all truncate max-w-[200px]">
                        {chunk.web.title || 'Source'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GeminiExplorer;
