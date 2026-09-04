import { PGListing, EnquiryItem, VisitItem, MerchantReview, MerchantNotification, PGRoomAvailability } from '../types/merchant';
import { SUNRISE_HIERARCHY_ROOMS } from './occupancyData';

export const INITIAL_PG_LISTINGS: PGListing[] = [
  {
    id: 'PG-001',
    name: "Sunrise Women's PG",
    category: 'Girls Only',
    address: 'Plot 42, Green Glen Layout, Bellandur',
    city: 'Hyderabad',
    area: 'Gachibowli',
    status: 'Live',
    totalRooms: 12,
    occupiedRooms: 9,
    availableRooms: 3,
    totalBeds: 30,
    availableBeds: 12,
    monthlyRent: 250,
    rentRange: '$250 / month (₹12,500)',
    rating: 4.8,
    reviewCount: 34,
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: ['3 Times Food', 'High Speed WiFi', 'Daily Housekeeping', 'AC & Geyser', 'Biometric Lock', 'Power Backup', 'Washing Machine', 'CCTV Security'],
    rooms: SUNRISE_HIERARCHY_ROOMS,
    roomAvailability: [
      { roomType: 'Single', totalBeds: 4, availableBeds: 2, monthlyRent: 350 },
      { roomType: '2 Sharing', totalBeds: 10, availableBeds: 4, monthlyRent: 250 },
      { roomType: '3 Sharing', totalBeds: 12, availableBeds: 5, monthlyRent: 200 },
      { roomType: '4 Sharing', totalBeds: 4, availableBeds: 1, monthlyRent: 160 },
    ],
    foodDetails: {
      provided: true,
      cookingAvailable: true,
      serviceModel: 'Food + Cooking',
      type: 'Veg & Non-Veg',
      meals: ['Breakfast', 'Lunch', 'Dinner']
    },
    amenityDetails: {
      fridge: 'Per Floor',
      washingMachine: 'Entire PG',
    },
    rules: ['Gate closing time: 10:30 PM', 'Notice period: 30 days', 'No smoking / alcohol inside premises', 'Female guests allowed in common area'],
    createdDate: '2025-11-10',
  },
  {
    id: 'PG-002',
    name: 'ZenStays Orchid Luxury PG',
    category: 'Unisex / Co-living',
    address: '27th Main Road, Sector 1, HSR Layout',
    city: 'Bengaluru',
    area: 'HSR Layout',
    status: 'Live',
    totalRooms: 18,
    occupiedRooms: 15,
    availableRooms: 3,
    totalBeds: 40,
    availableBeds: 8,
    monthlyRent: 320,
    rentRange: '$320 / month (₹16,000)',
    rating: 4.9,
    reviewCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    amenities: ['High Speed WiFi', 'Daily Housekeeping', 'AC & Geyser', 'Gym & Gaming Zone', 'Washing Machine', 'Smart TV'],
    rooms: [
      { id: 'R-201', roomNumber: '201', type: 'Single Sharing', totalBeds: 1, occupiedBeds: 1, monthlyRent: 400, amenities: ['Attached Bath', 'Workdesk'] },
      { id: 'R-202', roomNumber: '202', type: 'Double Sharing', totalBeds: 2, occupiedBeds: 0, monthlyRent: 320, amenities: ['Balcony', 'AC'] }
    ],
    roomAvailability: [
      { roomType: 'Single', totalBeds: 8, availableBeds: 1, monthlyRent: 400 },
      { roomType: '2 Sharing', totalBeds: 16, availableBeds: 4, monthlyRent: 320 },
      { roomType: '3 Sharing', totalBeds: 12, availableBeds: 3, monthlyRent: 260 },
      { roomType: '4 Sharing', totalBeds: 4, availableBeds: 0, monthlyRent: 220 },
    ],
    foodDetails: {
      provided: true,
      cookingAvailable: false,
      serviceModel: 'Food Only (No Cooking)',
      type: 'Veg & Non-Veg',
      meals: ['Breakfast', 'Dinner']
    },
    amenityDetails: {
      fridge: 'Entire PG',
      washingMachine: 'Per Floor',
    },
    rules: ['No loud music after 11:00 PM', 'Valid Govt ID proof required'],
    createdDate: '2025-08-14',
  },
  {
    id: 'PG-003',
    name: 'Royal Oak Men’s Executive PG',
    category: 'Boys Only',
    address: 'Near Cyber Towers, Madhapur',
    city: 'Hyderabad',
    area: 'Madhapur',
    status: 'Draft',
    totalRooms: 10,
    occupiedRooms: 0,
    availableRooms: 10,
    totalBeds: 25,
    availableBeds: 25,
    monthlyRent: 210,
    rentRange: '$210 / month (₹10,500)',
    rating: 0,
    reviewCount: 0,
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    amenities: ['WiFi', '3 Times Food', '24x7 Water', 'CCTV Security', 'Power Backup'],
    rooms: [
      { id: 'R-301', roomNumber: '101', type: 'Triple Sharing', totalBeds: 3, occupiedBeds: 0, monthlyRent: 210, amenities: ['Wi-Fi', 'Wardrobe'] }
    ],
    roomAvailability: [
      { roomType: 'Single', totalBeds: 2, availableBeds: 2, monthlyRent: 300 },
      { roomType: '2 Sharing', totalBeds: 8, availableBeds: 8, monthlyRent: 240 },
      { roomType: '3 Sharing', totalBeds: 15, availableBeds: 15, monthlyRent: 210 },
      { roomType: '4 Sharing', totalBeds: 0, availableBeds: 0, monthlyRent: 180 },
    ],
    foodDetails: {
      provided: false,
      cookingAvailable: true,
      serviceModel: 'Cooking Only (No Food)',
      type: 'Cooking Available No Food',
      meals: []
    },
    amenityDetails: {
      fridge: 'Per Floor',
      washingMachine: 'None',
    },
    rules: ['Strictly no alcohol', 'Visitor entry till 8 PM'],
    createdDate: '2026-07-20',
  },
  {
    id: 'PG-004',
    name: 'Skyline Luxury Co-living Space',
    category: 'Unisex / Co-living',
    address: 'Outer Ring Road, Marathahalli',
    city: 'Bengaluru',
    area: 'Marathahalli',
    status: 'Under Review',
    totalRooms: 15,
    occupiedRooms: 0,
    availableRooms: 15,
    totalBeds: 30,
    availableBeds: 30,
    monthlyRent: 290,
    rentRange: '$290 / month (₹14,500)',
    rating: 0,
    reviewCount: 0,
    coverImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80',
    amenities: ['WiFi', 'AC', 'Housekeeping', 'Gym', 'Terrace Lounge'],
    rooms: [],
    createdDate: '2026-07-25',
  }
];

export const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: 'ENQ-101',
    tenantName: 'Rahul Sharma',
    tenantPhone: '+91 98765 12345',
    tenantEmail: 'rahul.s@gmail.com',
    pgId: 'PG-001',
    pgName: "Sunrise Women's PG",
    roomType: 'Double Sharing',
    moveInDate: '15 Aug 2026',
    status: 'NEW',
    createdDate: '2026-07-27 09:15 AM',
    notes: 'Inquiring about food menu and AC availability.'
  },
  {
    id: 'ENQ-102',
    tenantName: 'Priya Nair',
    tenantPhone: '+91 98112 33445',
    tenantEmail: 'priya.nair@outlook.com',
    pgId: 'PG-001',
    pgName: "Sunrise Women's PG",
    roomType: 'Single Room',
    moveInDate: '01 Aug 2026',
    status: 'CONTACTED',
    createdDate: '2026-07-26 04:20 PM',
    notes: 'Spoke over phone. Sent room photos on WhatsApp.'
  },
  {
    id: 'ENQ-103',
    tenantName: 'Ananya Verma',
    tenantPhone: '+91 97400 88210',
    tenantEmail: 'ananya.v@techcorp.com',
    pgId: 'PG-002',
    pgName: 'ZenStays Orchid Luxury PG',
    roomType: 'Single Sharing',
    moveInDate: '10 Aug 2026',
    status: 'VISIT_SCHEDULED',
    createdDate: '2026-07-25 11:30 AM',
    notes: 'Visit scheduled for 28 July at 4:00 PM.'
  },
  {
    id: 'ENQ-104',
    tenantName: 'Vikram Malhotra',
    tenantPhone: '+91 99001 55432',
    tenantEmail: 'v.malhotra@gmail.com',
    pgId: 'PG-002',
    pgName: 'ZenStays Orchid Luxury PG',
    roomType: 'Double Sharing',
    moveInDate: '01 Aug 2026',
    status: 'CLOSED',
    createdDate: '2026-07-24 02:15 PM',
    notes: 'Token deposit paid. Checking in on 1st August.'
  },
  {
    id: 'ENQ-105',
    tenantName: 'Siddharth Rao',
    tenantPhone: '+91 98860 11223',
    tenantEmail: 'sid.rao@gmail.com',
    pgId: 'PG-003',
    pgName: 'Royal Oak Men’s Executive PG',
    roomType: 'Triple Sharing',
    moveInDate: '20 Aug 2026',
    status: 'NEW',
    createdDate: '2026-07-27 08:00 AM',
    notes: 'Asking if parking space for two-wheeler is available.'
  },
  {
    id: 'ENQ-106',
    tenantName: 'Megha Reddy',
    tenantPhone: '+91 97110 44332',
    tenantEmail: 'megha.r@gmail.com',
    pgId: 'PG-001',
    pgName: "Sunrise Women's PG",
    roomType: '3 Sharing',
    moveInDate: '15 Aug 2026',
    status: 'CLOSED',
    createdDate: '2026-07-22 03:10 PM',
    notes: 'Opted for another location closer to office.'
  }
];

export const INITIAL_VISITS: VisitItem[] = [
  {
    id: 'VST-201',
    visitorName: 'Ananya Verma',
    visitorPhone: '+91 97400 88210',
    pgId: 'PG-002',
    pgName: 'ZenStays Orchid Luxury PG',
    visitDate: '2026-07-27',
    visitTime: '04:00 PM',
    status: 'CONFIRMED',
    category: 'Today',
    notes: 'Wants to view Single Sharing room with attached balcony.'
  },
  {
    id: 'VST-202',
    visitorName: 'Karthik Raja',
    visitorPhone: '+91 99123 00987',
    pgId: 'PG-003',
    pgName: 'Royal Oak Men’s Executive PG',
    visitDate: '2026-07-27',
    visitTime: '06:30 PM',
    status: 'REQUESTED',
    category: 'Today',
    notes: 'Interested in 2 Sharing room.'
  },
  {
    id: 'VST-203',
    visitorName: 'Sneha Kapur',
    visitorPhone: '+91 98334 11223',
    pgId: 'PG-001',
    pgName: "Sunrise Women's PG",
    visitDate: '2026-07-28',
    visitTime: '11:30 AM',
    status: 'CONFIRMED',
    category: 'Upcoming',
    notes: 'Coming with mother to view premises.'
  },
  {
    id: 'VST-204',
    visitorName: 'Aditya Sen',
    visitorPhone: '+91 98200 44112',
    pgId: 'PG-002',
    pgName: 'ZenStays Orchid Luxury PG',
    visitDate: '2026-07-26',
    visitTime: '02:00 PM',
    status: 'COMPLETED',
    category: 'Completed',
    notes: 'Visited room 202. Decided to book.'
  },
  {
    id: 'VST-205',
    visitorName: 'Rohan Gupta',
    visitorPhone: '+91 98777 66554',
    pgId: 'PG-003',
    pgName: 'Royal Oak Men’s Executive PG',
    visitDate: '2026-07-25',
    visitTime: '05:00 PM',
    status: 'CANCELLED',
    category: 'Cancelled',
    notes: 'Cancelled due to rain.'
  }
];

export const INITIAL_REVIEWS: MerchantReview[] = [
  {
    id: 'REV-301',
    pgName: "Sunrise Women's PG",
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Very clean rooms and good food. The warden John is extremely helpful and responds quickly to any maintenance requests!',
    createdAt: '2026-07-26',
    merchantReply: 'Thank you Rahul! We strive to make ZenStays feel just like home.',
    status: 'Visible'
  },
  {
    id: 'REV-302',
    pgName: 'ZenStays Orchid Luxury PG',
    userName: 'Deepika Sundaram',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'High speed WiFi is super reliable for work from home. Food quality is consistently great. Highly recommended co-living PG!',
    createdAt: '2026-07-24',
    merchantReply: '',
    status: 'Visible'
  },
  {
    id: 'REV-303',
    pgName: "Sunrise Women's PG",
    userName: 'Kavya Singh',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Great security and quiet environment. Would love if breakfast time was extended by 30 mins on weekends.',
    createdAt: '2026-07-20',
    merchantReply: 'Noted Kavya! We have updated weekend breakfast timings from 8 AM to 10 AM.',
    status: 'Visible'
  }
];

export const INITIAL_NOTIFICATIONS: MerchantNotification[] = [
  {
    id: 'NTF-1',
    title: 'PG Approved',
    message: "Sunrise Women's PG has been verified by admin and is now LIVE on the StayNest platform!",
    type: 'Approval',
    sentAt: 'Today at 08:30 AM',
    read: false
  },
  {
    id: 'NTF-2',
    title: 'New Enquiry Received',
    message: "Rahul Sharma sent an enquiry for Double Sharing room at Sunrise Women's PG.",
    type: 'Booking',
    sentAt: 'Today at 09:15 AM',
    read: false
  },
  {
    id: 'NTF-3',
    title: 'Visit Confirmed',
    message: 'Ananya Verma confirmed visit for today at 04:00 PM at ZenStays Orchid Luxury PG.',
    type: 'Booking',
    sentAt: 'Yesterday at 06:20 PM',
    read: true
  },
  {
    id: 'NTF-4',
    title: 'Changes Requested by Admin',
    message: 'Please re-upload a clearer copy of your GST registration certificate for Skyline Luxury.',
    type: 'Rejection',
    sentAt: '25 July 2026',
    read: true
  },
  {
    id: 'NTF-5',
    title: 'New Review Added',
    message: "Rahul Sharma gave a ⭐⭐⭐⭐⭐ 5-star review for Sunrise Women's PG.",
    type: 'Promotional',
    sentAt: '26 July 2026',
    read: true
  }
];

export const INITIAL_MERCHANT_PROFILE = {
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  name: 'John Doe',
  mobileNumber: '+91 98765 43210',
  email: 'john.doe@zenstaypg.com',
  businessName: 'Sunrise PG & Hospitality Ltd',
  businessType: 'Private Limited',
  gstNumber: '36ABCDE1234F1Z9',
  panNumber: 'ABCDE1234F',
  businessAddress: 'Plot 42, Hitech City Main Road, Madhapur, Hyderabad, Telangana - 500081',
  paymentQrUrl: '',
  upiId: '',
  notifications: {
    email: true,
    sms: true,
    push: true,
    whatsapp: true
  }
};
