import React, { useState, useEffect } from 'react';
import { Home, Search as SearchIcon, QrCode, Sparkles, FileText, CheckCircle, Info, XCircle, Briefcase } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import DigitalCard from './components/DigitalCard';
import Concierge from './components/Concierge';
import Specs from './components/Specs';
import Itinerary from './components/Itinerary';
import Trips from './components/Trips';
import Login from './components/Login';
import BuyPoints from './components/BuyPoints';
import Transfer from './components/Transfer';
import { AppView, NotificationFunc, MemberProfile, UpcomingHoliday, CancellationDeal, CancellationWatch } from './types';
import { MOCK_USER, CANCELLATION_DEALS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'info' | 'error' } | null>(null);

  // State for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Lift user state so we can manipulate points
  const [user, setUser] = useState<MemberProfile>(MOCK_USER);

  // Lift Deals state so cancellations can populate it
  const [activeDeals, setActiveDeals] = useState<CancellationDeal[]>(CANCELLATION_DEALS);

  // State to track which booking is currently being viewed
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Apply dark mode class to root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showNotification(isDarkMode ? "Light Mode Enabled" : "Dark Mode Enabled", "info");
  };

  const showNotification: NotificationFunc = (msg, type = 'info') => {
    setNotification({ msg, type });
    // Clear after 3 seconds
    setTimeout(() => {
      setNotification((prev) => (prev?.msg === msg ? null : prev));
    }, 3000);
  };

  const handleLoginSuccess = () => {
    setCurrentView(AppView.DASHBOARD);
    showNotification(`Welcome back, ${user.firstName}!`, 'success');
  };

  const handleUpdatePoints = (amount: number, type: 'add' | 'subtract', isPurchase: boolean = false) => {
    setUser(prev => {
      const newAvailable = type === 'add' ? prev.points.available + amount : prev.points.available - amount;
      const newTotal = isPurchase && type === 'add' ? prev.points.total + amount : prev.points.total;
      const newUsed = type === 'subtract' ? prev.points.used + amount : (isPurchase ? prev.points.used : prev.points.used - amount);

      return {
        ...prev,
        points: {
          ...prev.points,
          available: newAvailable,
          total: newTotal,
          used: Math.max(0, newUsed)
        }
      };
    });
  };

  const handleAddBooking = (newBooking: Omit<UpcomingHoliday, 'id' | 'confirmationCode' | 'status'>) => {
    const bookingId = `DVC-${Math.floor(Math.random() * 10000)}`;
    const fullBooking: UpcomingHoliday = {
      ...newBooking,
      id: bookingId,
      confirmationCode: bookingId,
      status: 'Confirmed'
    };

    // Deduct points
    handleUpdatePoints(newBooking.pointsUsed, 'subtract', false);

    // Add to list (at start)
    setUser(prev => ({
      ...prev,
      bookings: [fullBooking, ...prev.bookings],
      // Remove any active watch for this resort since it's now booked
      activeWatches: prev.activeWatches.filter(w => w.resortName !== newBooking.resortName)
    }));
  };

  const handleAddWatch = (watch: Omit<CancellationWatch, 'id' | 'status'>) => {
    const newWatch: CancellationWatch = {
      ...watch,
      id: `WATCH-${Date.now()}`,
      status: 'Active'
    };

    setUser(prev => ({
      ...prev,
      activeWatches: [newWatch, ...prev.activeWatches]
    }));
    showNotification(`Watch set for ${watch.resortName}`, 'success');
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = user.bookings.find(b => b.id === bookingId);

    if (!bookingToCancel) return;

    // 1. Remove from User Bookings
    setUser(prev => ({
      ...prev,
      bookings: prev.bookings.filter(b => b.id !== bookingId)
    }));

    // 2. Refund Points (80% refund policy)
    const refundAmount = Math.floor(bookingToCancel.pointsUsed * 0.8);
    handleUpdatePoints(refundAmount, 'add', false);

    // 3. Create a "Cancellation Deal" for the Dashboard
    const dealPrice = Math.floor(bookingToCancel.pointsUsed * 0.5);

    // 3.5 Check for matching Active Watches
    const matchingWatchIndex = user.activeWatches.findIndex(w =>
      w.status === 'Active' &&
      w.resortName === bookingToCancel.resortName
    );

    let isMatchedDeal = false;

    if (matchingWatchIndex !== -1) {
      isMatchedDeal = true;

      // REMOVE the watch since it's now matched and shown in deals
      setUser(prev => ({
        ...prev,
        activeWatches: prev.activeWatches.filter((_, i) => i !== matchingWatchIndex)
      }));

      showNotification(`🔥 MATCH FOUND: ${bookingToCancel.resortName}`, 'success');
    }

    const newDeal: CancellationDeal = {
      id: `DEAL-${Date.now()}`,
      resortName: bookingToCancel.resortName,
      location: bookingToCancel.location,
      checkIn: bookingToCancel.checkIn,
      checkOut: bookingToCancel.checkOut,
      imageUrl: bookingToCancel.imageUrl,
      oldPoints: bookingToCancel.pointsUsed,
      newPoints: dealPrice,
      timeLeft: isMatchedDeal ? "MATCHED FOR YOU" : "Just Released"
    };

    setActiveDeals(prev => [newDeal, ...prev]);

    // 4. Notifications and Navigation
    if (!isMatchedDeal) {
      showNotification(`Booking Cancelled. ${refundAmount} points refunded.`, 'success');
    }
    setCurrentView(AppView.DASHBOARD);
  };

  const handleViewBooking = (id: string) => {
    setSelectedBookingId(id);
    setCurrentView(AppView.ITINERARY);
  };

  // Demo Handlers for Sales Presentation
  const handleSimulateSync = () => {
    showNotification("Syncing with ResortOS Backend...", "info");
    setTimeout(() => {
      // Randomly fluctuate available points to show "live" data
      const fluctuation = Math.floor(Math.random() * 500) - 250;
      handleUpdatePoints(Math.abs(fluctuation), fluctuation > 0 ? 'add' : 'subtract');
      showNotification("Data Sync Complete. Balance updated.", "success");
    }, 2000);
  };

  const handleTriggerDeal = () => {
    const newDeal: CancellationDeal = {
      id: `LIVE-${Date.now()}`,
      resortName: "Zimbali Coastal Resort",
      location: "Ballito, KZN",
      checkIn: "2024-06-28", // Next Friday
      checkOut: "2024-06-30",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-68c2531b26f5?auto=format&fit=crop&q=80&w=1000",
      oldPoints: 3500,
      newPoints: 1750, // Massive discount
      timeLeft: "JUST RELEASED"
    };
    setActiveDeals(prev => [newDeal, ...prev]);
    showNotification("⚠️ NEW INVENTORY DETECTED: Zimbali", "success");
  };

  const handleSimulateMatch = () => {
    // 1. Ensure user has the watch removed if it existed
    setUser(prev => ({
      ...prev,
      activeWatches: prev.activeWatches.filter(w => w.resortName !== "Sun City Vacation Club")
    }));

    // 2. Inject the deal
    const newDeal: CancellationDeal = {
      id: `MATCH-${Date.now()}`,
      resortName: "Sun City Vacation Club",
      location: "Sun City",
      checkIn: "2026-03-15",
      checkOut: "2026-03-20",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
      oldPoints: 8000, 
      newPoints: 4000, 
      timeLeft: "MATCHED FOR YOU"
    };

    setActiveDeals(prev => [newDeal, ...prev]);
    showNotification("🔥 BREAKING: A match was found for your Sun City watch!", "success");
  };

  const handleResetDemo = () => {
    setUser(MOCK_USER);
    setActiveDeals(CANCELLATION_DEALS);
    showNotification("Demo State Reset", "info");
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} showNotification={showNotification} />;
      case AppView.DASHBOARD:
        return <Dashboard
          user={user}
          activeDeals={activeDeals}
          onNavigate={setCurrentView}
          showNotification={showNotification}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onAddBooking={handleAddBooking}
          onSimulateSync={handleSimulateSync}
          onTriggerDeal={handleTriggerDeal}
          onSimulateMatch={handleSimulateMatch}
          onResetDemo={handleResetDemo}
        />;
      case AppView.SEARCH:
        return <Search showNotification={showNotification} onAddBooking={(b: any) => {
          handleAddBooking(b);
          setTimeout(() => setCurrentView(AppView.TRIPS), 1000); // Redirect to Trips on normal search booking
        }} onAddWatch={handleAddWatch} />;
      case AppView.CARD:
        return <DigitalCard user={user} />;
      case AppView.CONCIERGE:
        return <Concierge user={user} />;
      case AppView.SPECS:
        return <Specs />;
      case AppView.TRIPS:
        return <Trips user={user} onViewBooking={handleViewBooking} onNavigate={setCurrentView} />;
      case AppView.ITINERARY:
        return <Itinerary
          user={user}
          bookingId={selectedBookingId}
          onNavigate={setCurrentView}
          showNotification={showNotification}
          onCancelBooking={handleCancelBooking}
        />;
      case AppView.BUY_POINTS:
        return <BuyPoints user={user} onNavigate={setCurrentView} showNotification={showNotification} onUpdatePoints={(amt) => handleUpdatePoints(amt, 'add', true)} />;
      case AppView.TRANSFER:
        return <Transfer user={user} onNavigate={setCurrentView} showNotification={showNotification} onUpdatePoints={(amt) => handleUpdatePoints(amt, 'subtract', false)} />;
      default:
        return <Dashboard
          user={user}
          activeDeals={activeDeals}
          onNavigate={setCurrentView}
          showNotification={showNotification}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onAddBooking={handleAddBooking}
          onSimulateSync={handleSimulateSync}
          onTriggerDeal={handleTriggerDeal}
          onSimulateMatch={handleSimulateMatch}
          onResetDemo={handleResetDemo}
        />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => {
    const isActive = currentView === view;
    // Check if a child view is active (like Itinerary for Trips, or specific modals for Dashboard)
    const isParentActive =
      isActive ||
      (currentView === AppView.ITINERARY && view === AppView.TRIPS) || // Itinerary now falls under Trips conceptually
      (currentView === AppView.BUY_POINTS && view === AppView.DASHBOARD) ||
      (currentView === AppView.TRANSFER && view === AppView.DASHBOARD);

    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${isActive || (isParentActive && !isActive) ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isParentActive && !isActive ? 'opacity-50' : ''} />
        <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className={`h-full w-full relative flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-navy-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Toast Notification - Adjusted top position for Safe Area */}
      {notification && (
        <div className="absolute top-4 left-4 right-4 pt-safe z-[60] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className={`rounded-xl p-4 shadow-xl border flex items-center gap-3 pointer-events-auto ${notification.type === 'success' ? 'bg-navy-900 text-white border-navy-800' :
            notification.type === 'error' ? 'bg-red-50 text-red-800 border-red-100' :
              isDarkMode ? 'bg-navy-800 text-white border-navy-700' : 'bg-white text-navy-900 border-slate-100'
            }`}>
            {notification.type === 'success' && <CheckCircle size={20} className="text-green-400" />}
            {notification.type === 'error' && <XCircle size={20} className="text-red-500" />}
            {notification.type === 'info' && <Info size={20} className="text-amber-500" />}
            <span className="text-sm font-medium">{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative w-full">
        {renderView()}
      </main>

      {/* Bottom Navigation - ONLY show if NOT on Login screen */}
      {currentView !== AppView.LOGIN && (
        <div className="absolute bottom-0 left-0 right-0 h-[calc(5rem+env(safe-area-inset-bottom))] bg-white dark:bg-navy-900 border-t border-slate-100 dark:border-navy-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 rounded-t-2xl transition-colors duration-300 flex justify-center w-full">
          <div className="w-full max-w-md flex items-start pt-2 justify-around px-2 pb-safe">
            <NavItem view={AppView.DASHBOARD} icon={Home} label="Home" />
            <NavItem view={AppView.SEARCH} icon={SearchIcon} label="Explore" />

            {/* Floating Concierge Button */}
            <div className="relative -top-8">
              <button
                onClick={() => setCurrentView(AppView.CONCIERGE)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 transition-transform active:scale-95 ${currentView === AppView.CONCIERGE ? 'bg-navy-900 dark:bg-navy-800 text-amber-400 ring-4 ring-slate-50 dark:ring-navy-950' : 'bg-amber-500 text-white'}`}
              >
                <Sparkles size={24} fill={currentView === AppView.CONCIERGE ? "currentColor" : "none"} />
              </button>
            </div>

            <NavItem view={AppView.TRIPS} icon={Briefcase} label="Trips" />
            <NavItem view={AppView.CARD} icon={QrCode} label="My Card" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;