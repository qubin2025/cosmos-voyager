
import React, { useState, useRef } from 'react';
import { CelestialObject } from '../types';

interface AdminPanelProps {
  objects: CelestialObject[];
  onAddObject: (obj: CelestialObject, sector: 'solar' | 'cosmic' | 'galaxy') => void;
  onUpdateObject: (obj: CelestialObject, sector: 'solar' | 'cosmic' | 'galaxy') => void;
  onDeleteObject: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ objects, onAddObject, onUpdateObject, onDeleteObject }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sector, setSector] = useState<'solar' | 'cosmic' | 'galaxy'>('cosmic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState: Partial<CelestialObject> = {
    name: '', type: 'nebula', description: '', distance: '', image: '', details: []
  };
  
  const [formData, setFormData] = useState<Partial<CelestialObject>>(initialFormState);

  // Helper to check if URL likely points to a direct image file
  const isImageUrlValid = (url: string) => {
    if (!url) return true;
    if (url.startsWith('data:')) return true;
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url.split(/[?#]/)[0]);
  };

  const startEdit = (obj: CelestialObject) => {
    setEditingId(obj.id);
    setFormData({ ...obj });
    setIsFormOpen(true);
    window.scrollTo({ 
      top: document.getElementById('admin-form')?.offsetTop ? document.getElementById('admin-form')!.offsetTop - 100 : 0, 
      behavior: 'smooth' 
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || (formData.name || 'obj').toLowerCase().replace(/\s+/g, '-');
    const finalObj = { ...formData, id, details: formData.details || [] } as CelestialObject;
    
    if (editingId) {
      onUpdateObject(finalObj, sector);
    } else {
      onAddObject(finalObj, sector);
    }
    resetForm();
  };

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...(prev.details || []), 'New Observation Data']
    }));
  };

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...(formData.details || [])];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const removeDetail = (index: number) => {
    setFormData({
      ...formData,
      details: (formData.details || []).filter((_, i) => i !== index)
    });
  };

  return (
    <section id="admin-panel" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <span className="text-pink-500 font-bold tracking-[0.3em] uppercase text-xs mb-2 block">Command Center</span>
          <h2 className="text-4xl font-bold font-space text-white">Registry & Modification</h2>
        </div>
        <button 
          onClick={() => { if(isFormOpen && !editingId) resetForm(); else { resetForm(); setIsFormOpen(true); } }}
          className="px-8 py-3 bg-indigo-600 rounded-full text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          {isFormOpen && !editingId ? 'Close Form' : 'Deploy New Discovery'}
        </button>
      </div>

      {isFormOpen && (
        <div id="admin-form" className="glass p-8 md:p-12 rounded-[2.5rem] mb-12 border border-indigo-500/30 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
          
          <div className="mb-8 flex justify-between items-center relative z-10">
            <h3 className="text-xl font-bold text-white font-space">
              {editingId ? `Modifying: ${formData.name}` : 'New Entity Authorization'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-slate-500 hover:text-white uppercase tracking-widest">Cancel Modification</button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Operation Sector</label>
                <div className="flex gap-2 p-1 glass rounded-xl">
                  {(['solar', 'cosmic', 'galaxy'] as const).map(s => (
                    <button 
                      key={s} type="button" onClick={() => setSector(s)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${sector === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      {s === 'solar' ? 'Solar' : s === 'cosmic' ? 'Deep Space' : 'Galaxy'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Entity Name</label>
                  <input 
                    type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Distance</label>
                  <input 
                    type="text" required value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Class</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="planet">Planet</option>
                    <option value="star">Star</option>
                    <option value="nebula">Nebula</option>
                    <option value="galaxy">Galaxy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Visual Source</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required value={formData.image?.startsWith('data:') ? 'Local Image Attached' : formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      readOnly={formData.image?.startsWith('data:')}
                      className={`flex-1 bg-slate-900/50 border rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none text-xs truncate transition-colors ${!isImageUrlValid(formData.image || '') ? 'border-pink-500/50' : 'border-white/10'} ${formData.image?.startsWith('data:') ? 'text-indigo-400 font-mono' : ''}`}
                      placeholder="Direct Image URL (e.g. .jpg, .png)..."
                    />
                    <input 
                      type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 glass border border-white/10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0"
                      title="Upload Local Image"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                    {formData.image?.startsWith('data:') && (
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="p-3 glass border border-pink-500/20 rounded-xl hover:bg-pink-500/10 text-pink-500 transition-all flex-shrink-0"
                        title="Clear Upload"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {!formData.image?.startsWith('data:') && formData.image && !isImageUrlValid(formData.image) && (
                    <p className="text-[9px] text-pink-400 mt-2 font-bold uppercase tracking-widest animate-pulse">
                      Warning: URL should end with an image extension (.jpg, .png, etc.). Webpages won't display.
                    </p>
                  )}
                  <p className="text-[8px] text-slate-600 mt-1 uppercase tracking-tighter">
                    Tip: Right-click image on source page and "Copy Image Address".
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Observation Intelligence</label>
                <textarea 
                  required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none h-32 resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
               <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Spectral Details & Facts</label>
                  <button type="button" onClick={addDetail} className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">+ Add Row</button>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.details?.map((detail, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" value={detail} onChange={e => updateDetail(idx, e.target.value)}
                        className="flex-1 bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500/50"
                      />
                      <button type="button" onClick={() => removeDetail(idx)} className="text-slate-600 hover:text-pink-500 px-2 transition-colors">×</button>
                    </div>
                  ))}
                  {(!formData.details || formData.details.length === 0) && (
                    <p className="text-[10px] text-slate-600 italic">No specific details added. Click "Add Row" to contribute.</p>
                  )}
                </div>
              </div>

              <div className="p-6 border border-white/5 rounded-2xl bg-white/5">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Live Preview</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-slate-900 flex-shrink-0">
                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Link'; }} /> : <div className="w-full h-full animate-pulse bg-white/5"></div>}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white font-bold text-sm truncate">{formData.name || 'Untitled Entity'}</h4>
                    <p className="text-indigo-400 text-[10px] uppercase tracking-widest">{formData.type} • {formData.distance}</p>
                    {formData.image?.startsWith('data:') && (
                      <span className="text-[8px] text-green-500 uppercase tracking-widest">Local asset ready</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex justify-center pt-8 border-t border-white/5">
              <button type="submit" className="px-16 py-4 bg-white text-slate-950 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                {editingId ? 'Authorize Modification' : 'Authorize Full Deployment'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {objects.map(obj => (
          <div key={obj.id} className="glass p-4 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-indigo-500/30 transition-all bg-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-slate-900">
                <img src={obj.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-white font-bold text-xs truncate">{obj.name}</h4>
                <p className="text-slate-500 text-[8px] uppercase tracking-widest">{obj.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <button 
                onClick={() => startEdit(obj)}
                className="p-2 text-slate-500 hover:text-indigo-400"
                title="Edit Core Data"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => onDeleteObject(obj.id)}
                className="p-2 text-slate-500 hover:text-pink-500"
                title="Decommission Entity"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminPanel;
