import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, MapPin, Star, Filter, Loader2, Check, Mail, Calendar, X, Bed, Users, Info, ChevronRight, AlertCircle, Plus, Minus, Map as MapIcon, List as ListIcon, Clock } from 'lucide-react';
import { RESORTS } from '../constants';
import { Resort, NotificationFunc, UpcomingHoliday, CancellationWatch } from '../types';
import ResortMap from './ResortMap';

interface SearchProps {
    showNotification: NotificationFunc;
    onAddBooking: (booking: Omit<UpcomingHoliday, 'id' | 'confirmationCode' | 'status'>) => void;
    onAddWatch: (watch: Omit<CancellationWatch, 'id'>) => void;
}

// Extended status to include date selection phase and unavailable result
type BookingStatus = 'idle' | 'selecting_dates' | 'checking' | 'available' | 'unavailable' | 'booked';

interface PendingBooking {
    resort: Resort;
    checkIn: string;
    checkOut: string;
    nights: number;
    totalPoints: number;
    selectedUnit: UnitOption;
    guestCount: number;
}

interface UnitOption {
    name: string;
    capacity: number;
    multiplier: number;
}

// Mock Unit Types generator based on resort base stats
const generateUnits = (resort: Resort): UnitOption[] => [
    { name: 'Studio Suite', capacity: 2, multiplier: 0.8 },
    { name: resort.roomType || 'Standard Apartment', capacity: resort.maxGuests, multiplier: 1.0 },
    { name: 'Luxury 2-Bedroom', capacity: resort.maxGuests + 2, multiplier: 1.6 }
];

const Search: React.FC<SearchProps> = ({ showNotification, onAddBooking, onAddWatch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

    const [bookingState, setBookingState] = useState<Record<string, BookingStatus>>({});

    // Store selected dates per resort
    const [dates, setDates] = useState<Record<string, { checkIn: string, checkOut: string }>>({});

    // Store selections for units and guests: { resortId: { unitIdx: 0, guests: 2 } }
    const [selections, setSelections] = useState<Record<string, { unitIdx: number, guests: number }>>({});

    // Booking Summary Modal State
    const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);

    const [filterActive, setFilterActive] = useState(false);
    // Global date range selector to list resorts available on selected dates
    const [globalDates, setGlobalDates] = useState<{ checkIn: string; checkOut: string } | null>(null);
    const [onlyShowAvailable, setOnlyShowAvailable] = useState(false);
    const [globalCheckInInput, setGlobalCheckInInput] = useState<string>('');
    const [globalCheckOutInput, setGlobalCheckOutInput] = useState<string>('');
    const [simulationOverrides, setSimulationOverrides] = useState<Record<string, boolean>>({});

    // --- FILTER LOGIC ---
    const filteredResorts = useMemo(() => {
        let results = RESORTS.filter(resort =>
            resort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resort.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // If a province is selected via map, filter strictly by it
        if (selectedProvince) {
            results = results.filter(r => r.province === selectedProvince);
        }

        if (filterActive) {
            results.sort((a, b) => a.pointsPerNight - b.pointsPerNight);
        }
        // If user selected global dates and wants to only show available resorts, filter by availability
        if (onlyShowAvailable && globalDates && globalDates.checkIn && globalDates.checkOut) {
            const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
                const A1 = new Date(aStart).getTime();
                const A2 = new Date(aEnd).getTime();
                const B1 = new Date(bStart).getTime();
                const B2 = new Date(bEnd).getTime();
                return A1 <= B2 && B1 <= A2;
            };

            const isResortAvailable = (resort: Resort) => {
                // Simulation overrides take precedence (true = force unavailable)
                if (simulationOverrides[resort.id] === true) return false;
                if (simulationOverrides[resort.id] === false) return true;
                if (!resort.unavailableRanges || resort.unavailableRanges.length === 0) return true;
                return !resort.unavailableRanges.some(r => rangesOverlap(r.from, r.to, globalDates.checkIn, globalDates.checkOut));
            };

            results = results.filter(isResortAvailable);
        }

        return results;
    }, [searchTerm, selectedProvince, filterActive, onlyShowAvailable, globalDates]);

    // --- GROUPING LOGIC (For List View) ---
    const resortsByProvince = useMemo(() => {
        const groups: Record<string, Resort[]> = {};
        filteredResorts.forEach(resort => {
            const prov = resort.province || 'Other';
            if (!groups[prov]) groups[prov] = [];
            groups[prov].push(resort);
        });
        return groups;
    }, [filteredResorts]);

    // --- MAP AVAILABILITY LOGIC ---
    const mapAvailability = useMemo(() => {
        const counts: Record<string, number> = {};
        RESORTS.forEach(r => {
            counts[r.province] = (counts[r.province] || 0) + 1;
        });
        return counts;
    }, []);

    const handleStartBooking = (id: string) => {
        setBookingState(prev => ({ ...prev, [id]: 'selecting_dates' }));

        if (!dates[id]) {
            const today = new Date();
            const checkout = new Date(today);
            checkout.setDate(today.getDate() + 3);

            setDates(prev => ({
                ...prev,
                [id]: {
                    checkIn: today.toISOString().split('T')[0],
                    checkOut: checkout.toISOString().split('T')[0]
                }
            }));
        }

        if (!selections[id]) {
            setSelections(prev => ({
                ...prev,
                [id]: { unitIdx: 1, guests: 2 }
            }));
        }
    };

    const handleCancelDates = (id: string) => {
        setBookingState(prev => ({ ...prev, [id]: 'idle' }));
    };

    const handleDateChange = (id: string, field: 'checkIn' | 'checkOut', value: string) => {
        setDates(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleSelectionChange = (id: string, field: 'unitIdx' | 'guests', value: number) => {
        setSelections(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleCheckAvailability = (id: string) => {
        const d = dates[id];
        if (!d || !d.checkIn || !d.checkOut) {
            showNotification("Please select valid dates", "error");
            return;
        }

        if (new Date(d.checkIn) >= new Date(d.checkOut)) {
            showNotification("Check-out must be after Check-in", "error");
            return;
        }

        setBookingState(prev => ({ ...prev, [id]: 'checking' }));

        // Simulate availability by checking resort's unavailableRanges
        const resort = RESORTS.find(r => r.id === id);

        setTimeout(() => {
            if (!resort) {
                setBookingState(prev => ({ ...prev, [id]: 'unavailable' }));
                showNotification('Resort not found', 'error');
                return;
            }

            const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
                const A1 = new Date(aStart).getTime();
                const A2 = new Date(aEnd).getTime();
                const B1 = new Date(bStart).getTime();
                const B2 = new Date(bEnd).getTime();
                return A1 <= B2 && B1 <= A2;
            };

            // If simulation overrides force this resort unavailable, respect that
            if (simulationOverrides[id] === true) {
                setBookingState(prev => ({ ...prev, [id]: 'unavailable' }));
                showNotification('Simulated: no availability at this resort', 'error');
                return;
            }

            const isUnavailable = resort.unavailableRanges && resort.unavailableRanges.some(r => rangesOverlap(r.from, r.to, d.checkIn, d.checkOut));

            if (isUnavailable) {
                setBookingState(prev => ({ ...prev, [id]: 'unavailable' }));
                showNotification('No availability for selected dates at this resort', 'error');
            } else {
                setBookingState(prev => ({ ...prev, [id]: 'available' }));
                showNotification('Resort is available for selected dates', 'success');
            }
        }, 700);
    };

    const handleRequestBooking = (resort: Resort) => {
        const currentSelection = selections[resort.id] || { unitIdx: 1, guests: 2 };
        const units = generateUnits(resort);
        const selectedUnit = units[currentSelection.unitIdx];
        const adjustedPointsPerNight = Math.round(resort.pointsPerNight * selectedUnit.multiplier);

        const { nights, total } = getCostDetails(resort.id, adjustedPointsPerNight);
        const d = dates[resort.id];

        setPendingBooking({
            resort,
            checkIn: d.checkIn,
            checkOut: d.checkOut,
            nights,
            totalPoints: total,
            selectedUnit,
            guestCount: currentSelection.guests
        });
    };

    const handleConfirmBooking = () => {
        if (!pendingBooking) return;

        const { resort, checkIn, checkOut, totalPoints, selectedUnit, guestCount } = pendingBooking;

        onAddBooking({
            resortName: resort.name,
            location: resort.location,
            checkIn: checkIn,
            checkOut: checkOut,
            imageUrl: resort.imageUrl,
            guests: guestCount,
            pointsUsed: totalPoints,
            roomType: selectedUnit.name
        });

        setBookingState(prev => ({ ...prev, [resort.id]: 'booked' }));
        setPendingBooking(null);
        showNotification("Booking Confirmed! Added to your Itinerary.", "success");
    };

    const toggleFilter = () => {
        setFilterActive(!filterActive);
        showNotification(filterActive ? "Sort: Recommended (Default)" : "Sort: Points Low to High", "info");
    }

    const getCostDetails = (resortId: string, pointsPerNight: number) => {
        const d = dates[resortId];
        if (!d) return { nights: 0, total: 0 };

        const start = new Date(d.checkIn);
        const end = new Date(d.checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            nights: diffDays > 0 ? diffDays : 1,
            total: (diffDays > 0 ? diffDays : 1) * pointsPerNight
        };
    };

    // --- RENDER HELPERS ---
    const renderResortCard = (resort: Resort) => {
        const status = bookingState[resort.id] || 'idle';
        const currentSelection = selections[resort.id] || { unitIdx: 1, guests: 2 };
        const units = generateUnits(resort);
        const selectedUnit = units[currentSelection.unitIdx];
        const adjustedPoints = Math.round(resort.pointsPerNight * selectedUnit.multiplier);
        const { nights, total } = getCostDetails(resort.id, adjustedPoints);

        return (
            <div key={resort.id} className="bg-white dark:bg-navy-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-navy-800 group transition-all duration-200 flex flex-col w-full h-full">
                {/* UPDATED: aspect-video (16:9) is standard for travel cards and leaves more vertical space for details */}
                <div className="relative aspect-video w-full bg-slate-200 dark:bg-navy-800 overflow-hidden">
                    <img
                        src={resort.imageUrl}
                        alt={resort.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-navy-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm z-10">
                        From {Math.round(resort.pointsPerNight * 0.8)} pts / night
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif font-bold text-navy-900 dark:text-white leading-tight line-clamp-2 pr-2">{resort.name}</h3>
                        <div className="flex items-center text-amber-500 text-sm font-bold shrink-0">
                            <Star size={14} fill="currentColor" className="mr-1" />
                            {resort.rating}
                        </div>
                    </div>

                    <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                        <MapPin size={14} className="mr-1 shrink-0" />
                        <span className="truncate">{resort.location}</span>
                    </div>

                    {/* UPDATED: line-clamp-3 to allow more description text as requested */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">{resort.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {resort.amenities.slice(0, 3).map(amenity => (
                            <span key={amenity} className="text-[10px] uppercase tracking-wider bg-slate-50 dark:bg-navy-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-100 dark:border-navy-700">
                                {amenity}
                            </span>
                        ))}
                    </div>

                    <div className="mt-2">
                        {/* STATUS: IDLE */}
                        {status === 'idle' && (
                            <button
                                onClick={() => handleStartBooking(resort.id)}
                                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-navy-950 border border-transparent dark:border-navy-800 text-white font-medium text-sm hover:bg-slate-800 transition-colors active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Calendar size={16} />
                                Check Availability
                            </button>
                        )}

                        {/* STATUS: SELECTING DATES */}
                        {status === 'selecting_dates' && (
                            <div className="bg-slate-50 dark:bg-navy-800 rounded-xl p-4 border border-slate-200 dark:border-navy-700 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
                                        <Calendar size={14} className="text-amber-500" />
                                        Select Dates
                                    </span>
                                    <button onClick={() => handleCancelDates(resort.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Check In</label>
                                        <input
                                            type="date"
                                            value={dates[resort.id]?.checkIn || ''}
                                            onChange={(e) => handleDateChange(resort.id, 'checkIn', e.target.value)}
                                            className="w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg px-2 py-2 text-xs font-medium text-navy-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Check Out</label>
                                        <input
                                            type="date"
                                            value={dates[resort.id]?.checkOut || ''}
                                            onChange={(e) => handleDateChange(resort.id, 'checkOut', e.target.value)}
                                            className="w-full bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg px-2 py-2 text-xs font-medium text-navy-900 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCheckAvailability(resort.id)}
                                    className="w-full py-2.5 rounded-lg bg-navy-900 dark:bg-amber-500 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
                                >
                                    Confirm Dates
                                </button>
                            </div>
                        )}

                        {/* STATUS: CHECKING */}
                        {status === 'checking' && (
                            <button disabled className="w-full py-3 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-400 font-medium text-sm flex items-center justify-center cursor-not-allowed">
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Checking Availability...
                            </button>
                        )}

                        {/* STATUS: AVAILABLE */}
                        {status === 'available' && (
                            <div className="animate-in fade-in zoom-in duration-300 space-y-4">
                                <div className="bg-slate-50 dark:bg-navy-950 rounded-xl p-3 border border-slate-100 dark:border-navy-800">
                                    {/* Unit Selector */}
                                    <div className="mb-4">
                                        <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 block">Select Unit Type</label>
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                            {units.map((unit, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        handleSelectionChange(resort.id, 'unitIdx', idx);
                                                        if (currentSelection.guests > unit.capacity) {
                                                            handleSelectionChange(resort.id, 'guests', unit.capacity);
                                                        }
                                                    }}
                                                    className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs text-left min-w-[100px] transition-all ${currentSelection.unitIdx === idx
                                                        ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900 border-navy-900 dark:border-white shadow-md'
                                                        : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-navy-700'
                                                        }`}
                                                >
                                                    <div className="font-bold mb-0.5">{unit.name}</div>
                                                    <div className="opacity-80">{Math.round(resort.pointsPerNight * unit.multiplier)} pts</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Guest Counter */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Travel Party</label>
                                            <span className="text-xs text-slate-400">Max {selectedUnit.capacity} guests</span>
                                        </div>
                                        <div className="flex items-center bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-700 p-1">
                                            <button
                                                onClick={() => handleSelectionChange(resort.id, 'guests', Math.max(1, currentSelection.guests - 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-navy-900 dark:text-white text-sm">{currentSelection.guests}</span>
                                            <button
                                                onClick={() => handleSelectionChange(resort.id, 'guests', Math.min(selectedUnit.capacity, currentSelection.guests + 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs mb-2 px-1">
                                    <span className="text-slate-500 dark:text-slate-400">{dates[resort.id]?.checkIn} to {dates[resort.id]?.checkOut}</span>
                                    <span className="font-bold text-navy-900 dark:text-white">{nights} Nights</span>
                                </div>
                                <button
                                    onClick={() => handleRequestBooking(resort)}
                                    className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30 flex justify-between px-6"
                                >
                                    <span>Request Booking</span>
                                    <span>{total.toLocaleString()} pts</span>
                                </button>
                            </div>
                        )}

                        {/* STATUS: UNAVAILABLE */}
                        {status === 'unavailable' && (
                            <div className="flex flex-col gap-2">
                                <div className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30 font-medium text-xs flex items-center justify-center cursor-default">
                                    <span className="flex items-center gap-2"><AlertCircle size={16} /> No availability for selected dates</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const d = dates[resort.id];
                                        if (d && d.checkIn && d.checkOut) {
                                            onAddWatch({
                                                resortId: resort.id,
                                                resortName: resort.name,
                                                location: resort.location,
                                                checkIn: d.checkIn,
                                                checkOut: d.checkOut,
                                                status: 'Active'
                                            });
                                            setBookingState(prev => ({ ...prev, [resort.id]: 'idle' }));
                                        }
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-amber-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Clock size={14} /> Set Cancellation Watch
                                </button>
                                <button
                                    onClick={() => handleCancelDates(resort.id)}
                                    className="w-full py-2 rounded-xl text-slate-500 font-medium text-xs hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        {/* STATUS: BOOKED */}
                        {status === 'booked' && (
                            <div className="w-full py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-100 dark:border-green-900/30 font-medium text-xs flex flex-col items-center justify-center cursor-default">
                                <div className="flex items-center font-bold text-sm mb-1">
                                    <Check size={16} className="mr-2" />
                                    Confirmed
                                </div>
                                <span className="opacity-75">Added to your Itinerary.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-navy-950 overflow-hidden pt-safe transition-colors duration-300 relative">
            {/* Search Header */}
            <div className="px-6 pt-8 pb-4 bg-white dark:bg-navy-900 shadow-sm z-10 shrink-0 transition-colors duration-300">
                <div className="flex flex-wrap justify-between items-end mb-4 gap-2">
                    <h1 className="text-2xl font-serif text-navy-900 dark:text-white font-bold">Find your paradise</h1>
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 dark:bg-navy-950 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-navy-800 shadow text-navy-900 dark:text-white' : 'text-slate-400'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white dark:bg-navy-800 shadow text-navy-900 dark:text-white' : 'text-slate-400'}`}
                        >
                            <MapIcon size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search resorts or locations..."
                            className="w-full bg-slate-100 dark:bg-navy-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={toggleFilter}
                        className={`p-3 rounded-xl transition-colors ${filterActive ? 'bg-amber-500 text-white' : 'bg-navy-900 dark:bg-navy-800 text-white'}`}
                    >
                        <Filter size={18} />
                    </button>
                </div>
                {/* Global date selector to list resorts available on selected dates */}
                {/* Global Date Filter & Simulation */}
                <div className="mt-4 flex flex-col gap-3">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto flex-1">
                            <div>
                                <label className="text-[10px] uppercase text-slate-400 block font-bold mb-1">Check In</label>
                                <input
                                    type="date"
                                    value={globalCheckInInput}
                                    onChange={(e) => setGlobalCheckInInput(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-navy-800 border-none rounded-lg px-3 py-2.5 text-sm text-navy-900 dark:text-white ring-1 ring-slate-200 dark:ring-navy-700 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase text-slate-400 block font-bold mb-1">Check Out</label>
                                <input
                                    type="date"
                                    value={globalCheckOutInput}
                                    onChange={(e) => setGlobalCheckOutInput(e.target.value)}
                                    className="w-full bg-slate-100 dark:bg-navy-800 border-none rounded-lg px-3 py-2.5 text-sm text-navy-900 dark:text-white ring-1 ring-slate-200 dark:ring-navy-700 focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    if (!globalCheckInInput || !globalCheckOutInput) {
                                        showNotification('Please select both dates', 'error');
                                        return;
                                    }
                                    if (new Date(globalCheckInInput) >= new Date(globalCheckOutInput)) {
                                        showNotification('Check-out must be after check-in', 'error');
                                        return;
                                    }
                                    setGlobalDates({ checkIn: globalCheckInInput, checkOut: globalCheckOutInput });
                                    setOnlyShowAvailable(true);
                                    showNotification('Showing available resorts only', 'success');
                                }}
                                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-colors"
                            >
                                Find Available
                            </button>

                            {(globalDates || Object.keys(simulationOverrides).length > 0) && (
                                <button
                                    onClick={() => {
                                        setGlobalDates(null);
                                        setOnlyShowAvailable(false);
                                        setGlobalCheckInInput('');
                                        setGlobalCheckOutInput('');
                                        setSimulationOverrides({});
                                        showNotification('All filters cleared', 'info');
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Simulation Controls (Hidden by default or smaller if needed, keeping accessible for demo) */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-800 mt-1">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Demo Controls:</span>
                        <button
                            onClick={() => {
                                if (!globalDates) { showNotification('Select dates first for simulation', 'error'); return; }
                                const ids = filteredResorts.map(r => r.id);
                                const overrides: Record<string, boolean> = {};
                                ids.forEach(id => {
                                    overrides[id] = Math.random() < 0.4;
                                });
                                setSimulationOverrides(overrides);
                                setOnlyShowAvailable(true);
                                showNotification('Simulated random availability', 'info');
                            }}
                            className="text-xs text-amber-600 dark:text-amber-500 hover:underline font-medium"
                        >
                            Simulate Availability
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content: Map or List */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {viewMode === 'map' && (
                    <div className="p-4">
                        <div className="bg-white dark:bg-navy-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-navy-800 mb-6">
                            <ResortMap
                                onSelectProvince={(prov) => {
                                    setSelectedProvince(prov === selectedProvince ? null : prov);
                                    // Automatically switch to list to show results if desired, or just show them below
                                }}
                                selectedProvince={selectedProvince}
                                availability={mapAvailability}
                            />
                            <div className="text-center mt-4">
                                {selectedProvince ? (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-full text-sm font-bold">
                                        <span>{selectedProvince} Selected</span>
                                        <button onClick={() => setSelectedProvince(null)}><X size={14} /></button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400">Tap a highlighted province to filter resorts</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="px-6 pb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {filteredResorts.length} Resorts Found
                            {selectedProvince && ` in ${selectedProvince}`}
                        </span>
                    </div>

                    {viewMode === 'map' ? (
                        // In Map mode, just list results grid if filtered, or all if not (below map)
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResorts.map(renderResortCard)}
                        </div>
                    ) : (
                        // In List mode, Group by Province
                        <div className="space-y-8">
                            {Object.entries(resortsByProvince).map(([province, resorts]: [string, Resort[]]) => (
                                <div key={province} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-2 mb-4 sticky top-0 bg-slate-50/95 dark:bg-navy-950/95 backdrop-blur py-2 z-10">
                                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                        <h2 className="text-lg font-bold text-navy-900 dark:text-white uppercase tracking-wider">{province}</h2>
                                        <span className="text-xs text-slate-400 bg-slate-200 dark:bg-navy-800 px-2 py-0.5 rounded-full">{resorts.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {resorts.map(renderResortCard)}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(resortsByProvince).length === 0 && (
                                <div className="text-center py-10 opacity-50">
                                    <p>No resorts found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="h-10 text-center text-xs text-slate-400 mt-6">
                        End of list
                    </div>
                </div>
            </div>

            {/* --- BOOKING SUMMARY MODAL --- */}
            {pendingBooking && (
                <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-navy-900 w-full sm:w-[90%] md:max-w-xl sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90%] animate-in slide-in-from-bottom-10 duration-300">
                        {/* Modal Header - UPDATED SIZE */}
                        <div className="relative h-64 sm:h-80 shrink-0">
                            <img src={pendingBooking.resort.imageUrl} className="w-full h-full object-cover" alt="Resort" />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                            <button
                                onClick={() => setPendingBooking(null)}
                                className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-6 text-white">
                                <h2 className="font-serif text-2xl font-bold leading-tight">{pendingBooking.resort.name}</h2>
                                <p className="text-xs opacity-90 flex items-center mt-1"><MapPin size={12} className="mr-1" /> {pendingBooking.resort.location}</p>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-navy-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                                <Info size={18} className="text-amber-500" />
                                Booking Summary
                            </h3>

                            {/* Details Grid */}
                            <div className="space-y-4 mb-6">
                                {/* Dates */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-100 dark:border-navy-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Dates</p>
                                            <p className="text-sm font-bold text-navy-900 dark:text-white">{pendingBooking.checkIn} — {pendingBooking.checkOut}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{pendingBooking.nights} Nights</p>
                                    </div>
                                </div>

                                {/* Room & Guests */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-100 dark:border-navy-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                            <Bed size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Unit Type</p>
                                            <p className="text-sm font-bold text-navy-900 dark:text-white">{pendingBooking.selectedUnit.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-100 dark:border-navy-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Travel Party</p>
                                            <p className="text-sm font-bold text-navy-900 dark:text-white">{pendingBooking.guestCount} Adults</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities Preview */}
                            <div className="mb-6">
                                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Amenities Included</p>
                                <div className="flex flex-wrap gap-2">
                                    {pendingBooking.resort.amenities.map(am => (
                                        <span key={am} className="text-[10px] bg-slate-100 dark:bg-navy-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{am}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex gap-3 text-amber-800 dark:text-amber-400 mb-2">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-xs leading-relaxed">
                                    Cancellation Policy: Free cancellation up to 48 hours before check-in. Points will be refunded to your wallet immediately.
                                </p>
                            </div>
                        </div>

                        {/* Footer Totals */}
                        <div className="p-6 bg-slate-50 dark:bg-navy-950 border-t border-slate-200 dark:border-navy-800">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Cost</span>
                                <span className="text-2xl font-bold text-navy-900 dark:text-white">{pendingBooking.totalPoints.toLocaleString()} <span className="text-sm font-normal text-slate-500">pts</span></span>
                            </div>
                            <button
                                onClick={handleConfirmBooking}
                                className="w-full py-4 rounded-xl bg-amber-500 text-white font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                Confirm Booking <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;