import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Sun, Moon, Briefcase, Bell, Clock, Zap, Check, Settings, RefreshCw, PlusCircle, RotateCcw, Calendar, MapPin, FileText } from 'lucide-react';
import { MemberProfile, AppView, NotificationFunc, UpcomingHoliday, CancellationDeal } from '../types';

interface DashboardProps {
  user: MemberProfile;
  activeDeals: CancellationDeal[];
  onNavigate: (view: AppView) => void;
  showNotification: NotificationFunc;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onAddBooking: (booking: Omit<UpcomingHoliday, 'id' | 'confirmationCode' | 'status'>) => void;
  // Demo Props
  onSimulateSync: () => void;
  onTriggerDeal: () => void;
  onResetDemo: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  activeDeals, 
  onNavigate, 
  showNotification, 
  isDarkMode, 
  toggleDarkMode, 
  onAddBooking,
  onSimulateSync,
  onTriggerDeal,
  onResetDemo
}) => {
  const [grabbedDeals, setGrabbedDeals] = useState<string[]>([]);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleBuyPoints = () => {
    onNavigate(AppView.BUY_POINTS);
  };

  const handleTransfer = () => {
    onNavigate(AppView.TRANSFER);
  };

  const handleSpecs = () => {
    setShowDemoMenu(false);
    onNavigate(AppView.SPECS);
  };

  const handleGrabDeal = (deal: CancellationDeal) => {
     // Check points
     if (user.points.available < deal.newPoints) {
         showNotification("Insufficient points for this deal!", "error");
         return;
     }

     setGrabbedDeals(prev => [...prev, deal.id]);
     
     // Execute booking
     onAddBooking({
         resortName: deal.resortName,
         location: deal.location,
         checkIn: deal.checkIn,
         checkOut: deal.checkOut,
         imageUrl: deal.imageUrl,
         guests: 2,
         pointsUsed: deal.newPoints
     });

     showNotification("Deal Grabbed! Added to your Trips.", "success");
  };

  // Helper to format dates professionally (e.g. "15 Jun")
  const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch (e) {
        return dateStr;
    }
  };

  // SVG Chart Calculation
  const total = user.points.total;
  const available = user.points.available;
  const percentage = total > 0 ? (available / total) * 100 : 0;
  // Circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // --- SUB-COMPONENTS for Layout Clarity ---

  const PointsCard = () => (
    <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-navy-950/50 p-5 sm:p-6 relative overflow-hidden border border-slate-100 dark:border-navy-800 transition-colors duration-300 h-full flex flex-col justify-between group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 dark:bg-amber-500/10 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</p>
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-navy-900 dark:text-white break-words tracking-tight leading-none">{user.points.available.toLocaleString()}</h2>
          </div>
          <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 relative flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} strokeWidth="8" />
                <circle 
                    cx="50" 
                    cy="50" 
                    r={radius} 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth="8" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={strokeDashoffset} 
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-[8px] font-bold text-slate-400 uppercase">Used</span>
                 <span className="text-[10px] font-bold text-navy-900 dark:text-white">{Math.round(100 - percentage)}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-navy-800 pt-3">
                <span className="text-slate-500 dark:text-slate-400">Total Allocation</span>
                <span className="font-semibold text-navy-900 dark:text-slate-200">{user.points.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30">
                <div className="flex items-center text-red-600 dark:text-red-400">
                    <AlertCircle size={16} className="mr-2" />
                    <span className="font-medium text-xs">Expiring {user.points.expiryDate}</span>
                </div>
                <span className="font-bold text-red-700 dark:text-red-400">{user.points.expiring} pts</span>
            </div>
        </div>
    </div>
  );

  const ItineraryCard = () => (
      <div className="h-full flex flex-col">
          {user.bookings.length > 0 ? (
              <div onClick={() => onNavigate(AppView.ITINERARY)} className="bg-navy-900 dark:bg-navy-800 rounded-3xl text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all h-full min-h-[180px] group flex flex-col justify-end">
                   <img src={user.bookings[0].imageUrl} alt={user.bookings[0].resortName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" />
                   <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/50 to-navy-900/10"></div>
                   
                   <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                       <div className="flex justify-between items-start">
                           <span className="bg-white/20 text-xs px-2 py-1 rounded-lg backdrop-blur-md font-medium border border-white/10">Next Trip</span>
                           <span className="text-xs font-bold text-amber-400 bg-black/40 px-2 py-1 rounded backdrop-blur">{user.bookings[0].checkIn}</span>
                       </div>

                       <div>
                           <div className="mb-3">
                                <h4 className="text-xl font-serif font-bold text-shadow leading-tight">{user.bookings[0].resortName}</h4>
                                <p className="text-xs text-slate-200 flex items-center mt-1"><MapPin size={10} className="mr-1"/> {user.bookings[0].location}</p>
                           </div>
                           
                           <div className="flex items-center justify-between pt-3 border-t border-white/20">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-500 border border-navy-900 flex items-center justify-center text-[8px] font-bold shadow-lg">ME</div>
                                    {[...Array(Math.min(3, user.bookings[0].guests - 1))].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border border-navy-900 shadow-lg"></div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-amber-400 flex items-center bg-navy-900/80 px-2 py-1 rounded-full backdrop-blur-sm group-hover:bg-amber-500 group-hover:text-navy-900 transition-colors">
                                    View <ArrowRight size={10} className="ml-1"/>
                                </span>
                           </div>
                       </div>
                   </div>
              </div>
          ) : (
             <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 text-center border border-slate-100 dark:border-navy-800 h-full flex flex-col items-center justify-center min-h-[180px]">
                 <div className="w-12 h-12 bg-slate-50 dark:bg-navy-800 rounded-full flex items-center justify-center mb-3 text-slate-300">
                    <Briefcase size={20} />
                 </div>
                 <p className="text-sm font-bold text-navy-900 dark:text-white">No upcoming trips</p>
                 <button onClick={() => onNavigate(AppView.SEARCH)} className="mt-3 text-xs bg-navy-900 dark:bg-amber-500 text-white dark:text-navy-900 px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform">Start Searching</button>
             </div>
          )}
      </div>
  );

  const QuickActions = () => (
      <div className="grid grid-cols-2 gap-3 h-full">
          <button 
            onClick={handleBuyPoints}
            className="bg-white dark:bg-navy-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-800 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors h-full group"
          >
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <PlusCircle size={20} />
              </div>
              <span className="text-xs font-bold text-navy-900 dark:text-white">Top Up</span>
          </button>
          
          <button 
            onClick={handleTransfer}
            className="bg-white dark:bg-navy-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-800 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors h-full group"
          >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
              </div>
              <span className="text-xs font-bold text-navy-900 dark:text-white">Transfer</span>
          </button>
      </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-32 space-y-6 pt-safe bg-slate-50 dark:bg-navy-950 transition-colors duration-300 relative">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-2 flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-serif text-navy-900 dark:text-white">Hello, <span className="font-bold">{user.firstName}</span></h1>
            <div className="flex items-center space-x-2 mt-1">
            <span className="bg-navy-900 dark:bg-navy-800 text-amber-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                {user.membershipTier} Member
            </span>
            </div>
        </div>
        
        <div className="flex gap-2 relative">
            <button 
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className={`p-3 rounded-full shadow-sm border transition-all ${showDemoMenu ? 'bg-amber-500 text-white border-amber-600' : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-amber-400 border-slate-100 dark:border-navy-700'}`}
            >
                <Settings size={20} className={showDemoMenu ? 'animate-spin-slow' : ''} />
            </button>
            <button 
                onClick={toggleDarkMode}
                className="p-3 bg-white dark:bg-navy-800 rounded-full shadow-sm border border-slate-100 dark:border-navy-700 text-navy-900 dark:text-amber-400 hover:scale-105 transition-transform"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Sales Demo Control Panel */}
            {showDemoMenu && (
                <div className="absolute top-14 right-0 w-64 bg-slate-800 text-white rounded-2xl shadow-xl animate-in slide-in-from-top-2 z-50 border border-slate-700 p-2">
                    <div className="flex justify-between items-center px-3 py-2 border-b border-slate-700 mb-1">
                        <h3 className="font-bold text-[10px] uppercase tracking-widest text-amber-400">Sales Demo Controls</h3>
                        <button onClick={() => setShowDemoMenu(false)}><Settings size={12} className="text-slate-500"/></button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button onClick={onSimulateSync} className="flex items-center gap-3 p-3 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold text-left">
                            <RefreshCw size={14} className="text-blue-400" />
                            Simulate Backend Sync
                        </button>
                        <button onClick={onTriggerDeal} className="flex items-center gap-3 p-3 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold text-left">
                            <PlusCircle size={14} className="text-green-400" />
                            Inject "Hot Deal" (FOMO)
                        </button>
                        <button onClick={handleSpecs} className="flex items-center gap-3 p-3 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold text-left">
                            <FileText size={14} className="text-purple-400" />
                            View Tech Specs & Proposal
                        </button>
                        <div className="h-px bg-slate-700 my-1"></div>
                        <button onClick={onResetDemo} className="flex items-center gap-3 p-3 hover:bg-red-900/30 rounded-xl transition-colors text-xs font-bold text-left text-red-300">
                            <RotateCcw size={14} />
                            Reset Demo State
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Main Metric - Spans 7 cols on Desktop */}
          <div className="lg:col-span-7 h-auto min-h-[220px]">
            <PointsCard />
          </div>

          {/* Secondary - Spans 5 cols on Desktop */}
          <div className="lg:col-span-5 h-full min-h-[220px]">
             <ItineraryCard />
          </div>

          {/* Quick Actions - Row on Desktop, Grid on Mobile */}
          <div className="lg:col-span-12">
            <div className="lg:w-1/2 lg:mx-auto">
               <div className="grid grid-cols-2 gap-3 h-28">
                  <button 
                    onClick={handleBuyPoints}
                    className="bg-white dark:bg-navy-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-800 flex flex-row items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors h-full group gap-3"
                  >
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                          <PlusCircle size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-bold text-navy-900 dark:text-white">Top Up</span>
                        <span className="text-[10px] text-slate-400">Buy Points</span>
                      </div>
                  </button>
                  
                  <button 
                    onClick={handleTransfer}
                    className="bg-white dark:bg-navy-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-navy-800 flex flex-row items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors h-full group gap-3"
                  >
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                          <ArrowRight size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-bold text-navy-900 dark:text-white">Transfer</span>
                        <span className="text-[10px] text-slate-400">Send Points</span>
                      </div>
                  </button>
               </div>
            </div>
          </div>
      </div>

      {/* CANCELLATION WATCH - Full Width */}
      <div className="px-4 sm:px-6 animate-in slide-in-from-bottom-2 duration-500 delay-100">
        <div className="flex items-center gap-2 mb-3 mt-2">
             <div className="relative">
                 <Bell className="text-rose-500" size={20} fill="currentColor" />
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-navy-950"></span>
             </div>
             <h3 className="font-bold text-navy-900 dark:text-white">Cancellation Watch</h3>
             <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
        </div>

        {/* Responsive Grid: Single column on mobile, 3 columns on desktop for deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {activeDeals.map((deal) => {
                 const isGrabbed = grabbedDeals.includes(deal.id);
                 return (
                    <div key={deal.id} className="w-full bg-white dark:bg-navy-900 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-navy-800 relative group transition-all duration-300 hover:shadow-lg flex flex-col justify-between">
                        <div className="flex gap-3">
                            {/* Image Aspect Ratio */}
                            <div className="w-24 h-24 aspect-square shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-navy-800 relative shadow-inner">
                                <img src={deal.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Resort" />
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <div className="flex justify-between items-start mb-1 gap-1">
                                        <h4 className="font-bold text-navy-900 dark:text-white text-sm leading-tight line-clamp-1">{deal.resortName}</h4>
                                        <span className="text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">{deal.timeLeft}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                                        <MapPin size={10} className="mr-1 shrink-0" />
                                        <span className="truncate">{deal.location}</span>
                                    </p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 line-through">{deal.oldPoints} pts</p>
                                        <p className="text-base font-bold text-rose-600 dark:text-rose-400 leading-none">{deal.newPoints} pts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-xs pt-2 border-t border-slate-50 dark:border-navy-800">
                             <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium text-[10px]">
                                 <Calendar size={10} className="mr-1" />
                                 {formatDate(deal.checkIn)} - {formatDate(deal.checkOut)}
                             </div>
                             <button 
                                onClick={() => !isGrabbed && handleGrabDeal(deal)}
                                disabled={isGrabbed}
                                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${isGrabbed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-navy-900 dark:bg-white text-white dark:text-navy-900 hover:scale-105 active:scale-95'}`}
                             >
                                 {isGrabbed ? (
                                     <span className="flex items-center"><Check size={12} className="mr-1"/> Grabbed</span>
                                 ) : (
                                     <span className="flex items-center"><Zap size={12} className="mr-1"/> Grab</span>
                                 )}
                             </button>
                        </div>
                    </div>
                 )
             })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;