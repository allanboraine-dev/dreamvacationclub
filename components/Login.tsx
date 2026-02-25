import React, { useState } from 'react';
import { Loader2, ArrowRight, Lock, Cpu } from 'lucide-react';
import { AppView, NotificationFunc } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
  showNotification: NotificationFunc;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, showNotification }) => {
  const [memberId, setMemberId] = useState('DVC-99283'); // Pre-filled for demo convenience
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberId.trim()) {
      showNotification("Please enter your Member Number", "error");
      return;
    }

    setIsLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="h-full w-full relative flex flex-col items-center justify-end pb-12 overflow-hidden bg-navy-900">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Resort" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 flex flex-col items-center animate-in slide-in-from-bottom-10 duration-700 fade-in">
        
        {/* Logo / Brand Area */}
        <div className="mb-12 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Lock className="text-amber-400" size={28} />
            </div>
            <h1 className="font-serif text-4xl text-white mb-2 tracking-tight">Dream<br/>Vacation Club</h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Members Only Access</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-500 uppercase tracking-wider ml-1">Member Number</label>
            <input 
              type="text" 
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="e.g. DVC-99283"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all backdrop-blur-sm text-lg"
            />
          </div>

          <button 
            type="button"
            className="w-full text-right text-sm text-slate-400 hover:text-white transition-colors mb-4"
            onClick={() => showNotification("Reset link sent to email.", "info")}
          >
            Forgot Number?
          </button>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-amber-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center space-y-8">
            <p className="text-slate-500 text-xs">By signing in, you agree to our <br/> Terms of Service and Privacy Policy.</p>
            
            {/* Boraine Tech AI Signature */}
            <div className="flex items-center justify-center space-x-2 opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-default">
               <Cpu size={12} className="text-amber-400" />
               <p className="text-white text-[10px] uppercase tracking-[0.25em] font-mono">Designed by Boraine Tech AI</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;