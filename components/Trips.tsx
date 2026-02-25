import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { MemberProfile, AppView } from '../types';

interface TripsProps {
  user: MemberProfile;
  onViewBooking: (id: string) => void;
  onNavigate: (view: AppView) => void;
}

const Trips: React.FC<TripsProps> = ({ user, onViewBooking, onNavigate }) => {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  // Helper to format dates
  const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
  };

  const getDaysUntil = (dateStr: string) => {
      const today = new Date();
      const target = new Date(dateStr);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
  };

  // Mock past bookings for demonstration if none exist in user profile
  const pastBookings = [
      {
          id: 'past-1',
          resortName: 'Cabana Beach Resort',
          location: 'Umhlanga, KZN',
          checkIn: '2023-12-10',
          checkOut: '2023-12-17',
          confirmationCode: 'RES-OLD-01',
          imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000',
          guests: 2,
          pointsUsed: 1800,
          status: 'Confirmed' as const
      }
  ];

  const displayedBookings = filter === 'upcoming' ? user.bookings : pastBookings;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 pt-safe pb-32 overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 bg-white dark:bg-navy-900 border-b border-slate-100 dark:border-navy-800 z-10">
            <h1 className="text-2xl font-serif text-navy-900 dark:text-white font-bold mb-4">My Trips</h1>
            
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-navy-950 rounded-xl">
                <button 
                    onClick={() => setFilter('upcoming')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'upcoming' ? 'bg-white dark:bg-navy-800 shadow-sm text-navy-900 dark:text-white' : 'text-slate-400'}`}
                >
                    Upcoming
                </button>
                <button 
                    onClick={() => setFilter('past')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'past' ? 'bg-white dark:bg-navy-800 shadow-sm text-navy-900 dark:text-white' : 'text-slate-400'}`}
                >
                    Past History
                </button>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            {displayedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-center">
                    <Calendar size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-serif mb-2">No trips found</p>
                    {filter === 'upcoming' && (
                        <button 
                            onClick={() => onNavigate(AppView.SEARCH)}
                            className="text-amber-500 font-bold text-sm hover:underline"
                        >
                            Start planning your next escape
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedBookings.map((booking) => {
                        const daysAway = getDaysUntil(booking.checkIn);
                        
                        return (
                            <div 
                                key={booking.id} 
                                onClick={() => onViewBooking(booking.id)}
                                className="bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-navy-800 active:scale-[0.98] transition-all cursor-pointer group flex flex-col"
                            >
                                <div className="relative h-48 bg-slate-200 dark:bg-navy-800">
                                    <img src={booking.imageUrl} alt={booking.resortName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent"></div>
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <h3 className="text-white font-serif font-bold text-lg leading-tight text-shadow-sm line-clamp-2">{booking.resortName}</h3>
                                            <div className="flex items-center text-slate-200 text-xs mt-1">
                                                <MapPin size={12} className="mr-1" />
                                                {booking.location}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4">
                                        {filter === 'upcoming' ? (
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 backdrop-blur-md ${
                                                booking.status === 'Confirmed' ? 'bg-green-500/90 text-white' : 'bg-amber-500/90 text-white'
                                            }`}>
                                                {booking.status === 'Confirmed' && <CheckCircle2 size={12} />}
                                                {booking.status}
                                            </span>
                                        ) : (
                                            <span className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 flex items-center justify-between flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-50 dark:bg-navy-950 p-2.5 rounded-xl border border-slate-100 dark:border-navy-800 text-center min-w-[60px]">
                                            <span className="block text-[10px] text-slate-400 uppercase font-bold">Check In</span>
                                            <span className="block text-sm font-bold text-navy-900 dark:text-white">{formatDate(booking.checkIn).split(' ')[0]} {formatDate(booking.checkIn).split(' ')[1]}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300" />
                                        <div className="bg-slate-50 dark:bg-navy-950 p-2.5 rounded-xl border border-slate-100 dark:border-navy-800 text-center min-w-[60px]">
                                            <span className="block text-[10px] text-slate-400 uppercase font-bold">Check Out</span>
                                            <span className="block text-sm font-bold text-navy-900 dark:text-white">{formatDate(booking.checkOut).split(' ')[0]} {formatDate(booking.checkOut).split(' ')[1]}</span>
                                        </div>
                                    </div>

                                    {filter === 'upcoming' && (
                                        <div className="text-right">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Status</span>
                                            {daysAway > 0 ? (
                                                <span className="text-amber-500 text-xs font-bold flex items-center justify-end gap-1">
                                                    <Clock size={12} />
                                                    In {daysAway} days
                                                </span>
                                            ) : (
                                                <span className="text-green-500 text-xs font-bold">Enjoy your stay!</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* End of list spacer */}
            <div className="h-8"></div>
        </div>
    </div>
  );
};

export default Trips;