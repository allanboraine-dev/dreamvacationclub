export interface PointBalance {
  total: number;
  available: number;
  used: number;
  expiring: number;
  expiryDate: string;
}

export interface UpcomingHoliday {
  id: string;
  resortName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  confirmationCode: string;
  imageUrl: string;
  guests: number;
  pointsUsed: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  roomType?: string; // Added to track specific unit selection
}

export interface CancellationDeal {
  id: string;
  resortName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  imageUrl: string;
  oldPoints: number;
  newPoints: number;
  timeLeft: string; // e.g. "2 hours left"
}

export interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  membershipTier: 'Silver' | 'Gold' | 'Platinum';
  memberSince: string;
  rsaId: string; // Used for validation logic
  points: PointBalance;
  bookings: UpcomingHoliday[];
}

export interface Resort {
  id: string;
  name: string;
  location: string;
  province: 'Western Cape' | 'KwaZulu-Natal' | 'Mpumalanga' | 'North West' | 'Eastern Cape' | 'Limpopo' | 'Gauteng' | 'Free State' | 'Northern Cape';
  rating: number;
  pointsPerNight: number;
  imageUrl: string;
  amenities: string[];
  description: string;
  roomType: string;
  maxGuests: number;
  // Optional availability ranges where the resort is NOT available
  unavailableRanges?: { from: string; to: string }[];
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  SEARCH = 'SEARCH',
  CONCIERGE = 'CONCIERGE',
  CARD = 'CARD',
  SPECS = 'SPECS',
  ITINERARY = 'ITINERARY',
  BUY_POINTS = 'BUY_POINTS',
  TRANSFER = 'TRANSFER',
  TRIPS = 'TRIPS'
}

export type NotificationFunc = (message: string, type?: 'success' | 'info' | 'error') => void;