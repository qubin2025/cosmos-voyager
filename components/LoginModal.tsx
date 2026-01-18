
import React, { useState, useEffect, useRef } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

type AuthStatus = 'idle' | 'verifying' | 'success' | 'error';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setStatusMsg('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setStatus('verifying');
    
    // Cycle through status messages for immersion
    const messages = [
      "Establishing secure uplink...",
      "Syncing bio-signature...",
      "Decrypting access keys..."
    ];

    for (let i = 0; i < messages.length; i++) {
      setStatusMsg(messages[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setStatus('success');
    setStatusMsg('Voyager Authorized!');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin(username);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-500" onClick={onClose}></div>
      
      <div className={`glass w-full max-w-md p-10 rounded-3xl relative z-10 transition-all duration-500 border ${
        status === 'success' ? 'border-green-500/50' : 'border-indigo-500/30'
      } ${status === 'verifying' ? 'scale-[1.02]' : 'scale-100'}`}>
        
        {/* Scanning Line Animation */}
        {status === 'verifying' && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="w-full h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] absolute animate-[scan_2s_linear_infinite]"></div>
          </div>
        )}

        <div className="relative">
          <h2 className="text-3xl font-bold font-space text-white mb-2 flex items-center gap-3">
            {status === 'success' ? (
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : "Voyager Link"}
          </h2>
          <p className="text-slate-400 text-sm mb-8 italic">
            {status === 'verifying' ? 'Processing credentials...' : 'Join the mission across the stars.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`${status !== 'idle' ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Voyager Callsign</label>
              <input 
                ref={inputRef}
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="e.g. Orion_Explorer"
                required
                disabled={status !== 'idle'}
              />
            </div>
            
            <div className={`${status !== 'idle' ? 'opacity-50 pointer-events-none' : ''} transition-opacity`}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Access Code</label>
                {password.length > 0 && (
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest animate-pulse">Encoded</span>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                placeholder="••••••••"
                required
                disabled={status !== 'idle'}
              />
            </div>
            
            <button 
              type="submit"
              disabled={status !== 'idle'}
              className={`w-full font-bold py-4 rounded-xl transition-all relative overflow-hidden flex items-center justify-center gap-3 ${
                status === 'success' 
                  ? 'bg-green-600 text-white cursor-default' 
                  : status === 'verifying' 
                  ? 'bg-slate-800 text-slate-400 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02]'
              }`}
            >
              {status === 'verifying' && (
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>
                {status === 'idle' && "Initiate Link"}
                {status === 'verifying' && (statusMsg || "Verifying...")}
                {status === 'success' && statusMsg}
              </span>
            </button>
          </form>

          {status === 'idle' && (
            <p className="text-[10px] text-slate-500 mt-6 text-center uppercase tracking-widest opacity-60">
              Biometric verification required for bridge access
            </p>
          )}
        </div>
        
        <button 
          onClick={onClose}
          disabled={status === 'verifying'}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors disabled:opacity-0"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
