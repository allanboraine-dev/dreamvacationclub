import { MemberProfile, Resort, CancellationDeal } from './types';

export const MOCK_USER: MemberProfile = {
  id: "DVC-99283",
  firstName: "Lindiwe",
  lastName: "Molefe",
  membershipTier: "Platinum",
  memberSince: "2018-03-12",
  rsaId: "8502200000000",
  points: {
    total: 12500,
    available: 8200,
    used: 4300,
    expiring: 1200,
    expiryDate: "2024-12-31"
  },
  bookings: [
    {
      id: "BK-2024-001",
      resortName: "Peninsula All-Suite Hotel",
      location: "Cape Town, Western Cape",
      checkIn: "2026-03-15",
      checkOut: "2026-03-20",
      confirmationCode: "RES-88421",
      imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000",
      guests: 4,
      pointsUsed: 2400,
      status: 'Confirmed'
    },
    {
      id: "BK-2024-002",
      resortName: "Drakensberg Sun Resort",
      location: "Winterton, KZN",
      checkIn: "2026-03-22",
      checkOut: "2026-03-27",
      confirmationCode: "RES-99321",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
      guests: 2,
      pointsUsed: 1500,
      status: 'Confirmed'
    }
  ],
  activeWatches: []
};

export const CANCELLATION_DEALS: CancellationDeal[] = [
  {
    id: "DEAL-001",
    resortName: "Umhlanga Sands Resort",
    location: "Umhlanga Rocks, KZN",
    checkIn: "2026-03-21",
    checkOut: "2026-03-23",
    // Switched to a high-quality landscape resort image that fits 16:9 containers perfectly
    imageUrl: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&q=80&w=1000",
    oldPoints: 1200,
    newPoints: 600, // 50% off
    timeLeft: "45 mins"
  },
  {
    id: "DEAL-002",
    resortName: "Sun City Cascades",
    location: "North West",
    checkIn: "2026-04-05",
    checkOut: "2026-04-07",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    oldPoints: 2500,
    newPoints: 1800,
    timeLeft: "3 hours"
  }
];

// Expanded Scraped Data
export const RESORTS: Resort[] = [
  // --- WESTERN CAPE ---
  {
    id: "wc-1",
    name: "Peninsula All-Suite Hotel",
    location: "Sea Point, Cape Town",
    province: "Western Cape",
    rating: 4.8,
    pointsPerNight: 1200,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Ocean View", "Spa", "Pool", "Wifi"],
    description: "Luxury suites overlooking the Atlantic Ocean.",
    roomType: "2 Bedroom Seafacing Suite",
    maxGuests: 4
    ,
    unavailableRanges: [
      { from: '2026-03-15', to: '2026-03-20' } // user booking overlap
    ]
  },
  {
    id: "wc-2",
    name: "Beacon Island Resort",
    location: "Plettenberg Bay",
    province: "Western Cape",
    rating: 4.9,
    pointsPerNight: 1350,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Private Beach", "Kids Club", "Diving"],
    description: "The jewel of the Garden Route, surrounded by the ocean.",
    roomType: "Lagoon View Suite",
    maxGuests: 2,
    unavailableRanges: [
      { from: '2026-03-15', to: '2026-03-20' }
    ]
  },
  {
    id: "wc-3",
    name: "Wilderness Dunes",
    location: "Wilderness, Garden Route",
    province: "Western Cape",
    rating: 4.5,
    pointsPerNight: 980,
    imageUrl: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Beach Access", "Hiking", "Tennis"],
    description: "Nestled on the dunes overlooking the Indian Ocean.",
    roomType: "3 Bedroom Chalet",
    maxGuests: 6
  },
  {
    id: "wc-4",
    name: "Riviera Suites",
    location: "Sea Point, Cape Town",
    province: "Western Cape",
    rating: 4.3,
    pointsPerNight: 850,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    amenities: ["City Life", "Wifi", "Shuttle"],
    description: "Cosmopolitan living on the Sea Point promenade.",
    roomType: "1 Bedroom Suite",
    maxGuests: 2
  },

  // --- KWAZULU-NATAL ---
  {
    id: "kzn-1",
    name: "Drakensberg Sun Resort",
    location: "Winterton, Central Drakensberg",
    province: "KwaZulu-Natal",
    rating: 4.9,
    pointsPerNight: 1500,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Hiking", "Lake", "Restaurant", "Spa"],
    description: "A mountain retreat with breathtaking views and family activities.",
    roomType: "Superior Mountain View Room",
    maxGuests: 4
    ,
    unavailableRanges: [
      { from: '2026-03-22', to: '2026-03-27' }
    ]
  },
  {
    id: "kzn-2",
    name: "Umhlanga Sands Resort",
    location: "Umhlanga Rocks",
    province: "KwaZulu-Natal",
    rating: 4.7,
    pointsPerNight: 1400,
    // Consistent image update
    imageUrl: "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Direct Beach Access", "Family Pools", "Entertainment"],
    description: "Family favorite right on the Umhlanga promenade.",
    roomType: "4 Sleeper Tugela",
    maxGuests: 4
  },
  {
    id: "kzn-3",
    name: "Champagne Sports Resort",
    location: "Central Drakensberg",
    province: "KwaZulu-Natal",
    rating: 4.8,
    pointsPerNight: 1300,
    imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Golf Course", "Conferencing", "Pools"],
    description: "Premier golf and leisure resort in the mountains.",
    roomType: "2 Bedroom Chalet",
    maxGuests: 6
  },
  {
    id: "kzn-4",
    name: "Breakers Resort",
    location: "Umhlanga Rocks",
    province: "KwaZulu-Natal",
    rating: 4.4,
    pointsPerNight: 1100,
    imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Lagoon Pool", "Nature Reserve", "Restaurant"],
    description: "Bordering the Hawaan Forest and the lagoon.",
    roomType: "2 Bedroom Apartment",
    maxGuests: 4
  },

  // --- MPUMALANGA ---
  {
    id: "mp-1",
    name: "Burchell’s Bush Lodge",
    location: "Hazyview, Kruger Surrounds",
    province: "Mpumalanga",
    rating: 4.6,
    pointsPerNight: 950,
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Game Drives", "Braai Area", "Pool"],
    description: "Your gateway to the Kruger National Park, nestled in the bush.",
    roomType: "Standard Bush Chalet",
    maxGuests: 4
  },
  {
    id: "mp-2",
    name: "Ngwenya Lodge",
    location: "Komatipoort",
    province: "Mpumalanga",
    rating: 4.8,
    pointsPerNight: 1250,
    imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1000",
    amenities: ["River View", "Big 5 Viewing", "Restaurant"],
    description: "Overlooking the Crocodile River into the Kruger Park.",
    roomType: "River View Chalet",
    maxGuests: 6
  },
  {
    id: "mp-3",
    name: "Sanbonani Resort",
    location: "Hazyview",
    province: "Mpumalanga",
    rating: 4.2,
    pointsPerNight: 800,
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Large Pool", "Mini Golf", "Riverside"],
    description: "Where the Sabie and Sand rivers meet.",
    roomType: "2 Bedroom Chalet",
    maxGuests: 6
  },

  // --- NORTH WEST ---
  {
    id: "nw-1",
    name: "Sun City Vacation Club",
    location: "Sun City",
    province: "North West",
    rating: 4.7,
    pointsPerNight: 1600,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Valley of Waves", "Casino", "Golf"],
    description: "The ultimate entertainment resort in South Africa.",
    roomType: "2 Bedroom Luxury Unit",
    maxGuests: 6
    ,
    unavailableRanges: [
      { from: '2026-03-15', to: '2026-03-20' }
    ]
  },
  {
    id: "nw-2",
    name: "Bakubung Bush Lodge",
    location: "Pilanesberg",
    province: "North West",
    rating: 4.8,
    pointsPerNight: 1550,
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Big 5 Safari", "Boma Dinners", "Spa"],
    description: "Luxury bush lodge in the Pilanesberg crater.",
    roomType: "Studio Room",
    maxGuests: 2
  },

  // --- EASTERN CAPE ---
  {
    id: "ec-1",
    name: "Royal St. Andrews",
    location: "Port Alfred",
    province: "Eastern Cape",
    rating: 4.5,
    pointsPerNight: 1100,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Golf", "Fine Dining", "History"],
    description: "Heritage hotel and spa on the Sunshine Coast.",
    roomType: "Heritage Wing Room",
    maxGuests: 2
  },

  // --- LIMPOPO ---
  {
    id: "lp-1",
    name: "Mabula Game Lodge",
    location: "Bela-Bela",
    province: "Limpopo",
    rating: 4.6,
    pointsPerNight: 1400,
    imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&q=80&w=1000",
    amenities: ["Safari", "Horseback Riding", "Pools"],
    description: "Distinctive African safari experience near Johannesburg.",
    roomType: "Bush Chalet",
    maxGuests: 4
  }
];

// Deliverable: JSON Schema for Data
export const DATA_SCHEMA_SPEC = {
  "MemberProfile": {
    "type": "object",
    "properties": {
      "memberId": { "type": "string", "format": "uuid" },
      "personalDetails": {
        "type": "object",
        "properties": {
          "firstName": { "type": "string" },
          "surname": { "type": "string" },
          "rsaId": { "type": "string", "pattern": "^[0-9]{13}$" }
        }
      },
      "wallet": {
        "type": "object",
        "properties": {
          "totalPoints": { "type": "integer" },
          "availablePoints": { "type": "integer" },
          "expiringPoints": { "type": "integer" },
          "expiryDate": { "type": "string", "format": "date" }
        }
      },
      "bookings": {
        "type": "array",
        "items": { "$ref": "#/definitions/UpcomingHoliday" }
      },
      "activeWatches": {
        "type": "array",
        "items": { "$ref": "#/definitions/CancellationWatch" }
      }
    }
  },
  "Resort": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "name": { "type": "string" },
      "location": { "type": "string" },
      "province": { "type": "string" },
      "rating": { "type": "number" },
      "pointsPerNight": { "type": "integer" },
      "amenities": { "type": "array", "items": { "type": "string" } },
      "maxGuests": { "type": "integer" }
    }
  },
  "definitions": {
    "UpcomingHoliday": {
      "type": "object",
      "properties": {
        "resortName": { "type": "string" },
        "checkIn": { "type": "string", "format": "date" },
        "status": { "type": "string", "enum": ["Confirmed", "Pending", "Cancelled"] }
      }
    },
    "CancellationWatch": {
      "type": "object",
      "properties": {
        "resortName": { "type": "string" },
        "checkIn": { "type": "string", "format": "date" },
        "status": { "type": "string", "enum": ["Active", "Matched"] }
      }
    }
  }
};