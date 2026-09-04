export type MerchantStatus = 
  | 'Pending Verification'
  | 'Verified'
  | 'Changes Requested'
  | 'Rejected'
  | 'Suspended'
  | 'Blocked'
  | 'Inactive'
  | 'Deleted';

export type DocumentType = 
  | 'Aadhaar'
  | 'PAN'
  | 'GST Certificate'
  | 'Business Registration'
  | 'Rental Agreement'
  | 'Property Ownership'
  | 'Cancelled Cheque'
  | 'Bank Passbook'
  | 'Profile Photo'
  | 'Business Logo';

export type DocumentStatus = 'Verified' | 'Pending' | 'Changes Requested' | 'Rejected';

export interface MerchantDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
  documentNumber?: string;
}

export interface MerchantBasicInfo {
  merchantId: string;
  fullName: string;
  profilePhoto: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  lastLogin: string;
  accountStatus: MerchantStatus;
}

export interface MerchantBusinessInfo {
  businessName: string;
  businessType: 'Sole Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited' | 'Individual';
  gstNumber: string;
  panNumber: string;
  businessAddress: string;
  city: string;
  yearsInBusiness: number;
  totalPGs: number;
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  businessLogo?: string;
}

export interface MerchantVerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  panVerified: boolean;
  aadhaarVerified: boolean;
  bankVerified: boolean;
  gstVerified: boolean;
  agreementUploaded: boolean;
  policeVerification: boolean;
}

export interface MerchantBankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  payoutStatus: 'Pending Payout' | 'Completed Payout' | 'Failed Payout';
  pendingPayoutAmount: number;
  lifetimeEarnings: number;
  lastPayoutDate: string;
  commissionPercentage: number;
}

export type PGStatus = 
  | 'Draft' 
  | 'Under Review' 
  | 'Pending Review'
  | 'Live' 
  | 'Changes Required' 
  | 'Rejected' 
  | 'Paused'
  | 'Inactive';

export type EnquiryStatus = import('../contracts/merchantEnquiry').MerchantEnquiryStatus;

export interface EnquiryItem {
  id: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  pgId: string;
  pgName: string;
  roomType: string;
  moveInDate: string;
  status: EnquiryStatus;
  createdDate: string;
  notes?: string;
}

export type VisitCategory = 'Today' | 'Upcoming' | 'Completed' | 'Cancelled';
export type VisitStatus = import('../contracts/merchantVisit').MerchantVisitStatus;

export interface VisitItem {
  id: string;
  visitorName: string;
  visitorPhone: string;
  pgId: string;
  pgName: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
  category: VisitCategory;
  notes?: string;
}

export interface PGRoomAvailability {
  roomType: 'Single' | '2 Sharing' | '3 Sharing' | '4 Sharing';
  totalBeds: number;
  availableBeds: number;
  monthlyRent: number;
}

export type RoomOccupancyStatus =
  | 'full'
  | 'partial'
  | 'vacant'
  | 'waiting_list'
  | 'available_tomorrow'
  | 'notice_period';

export interface PGRoom {
  id: string;
  roomNumber: string;
  type: 'Single Sharing' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing' | 'Single' | '2 Sharing' | '3 Sharing' | '4 Sharing';
  totalBeds: number;
  occupiedBeds: number;
  monthlyRent: number;
  amenities: string[];
  building?: string;
  floor?: string;
  wing?: string;
  displayStatus?: RoomOccupancyStatus;
  availableFrom?: string;
  waitingListCount?: number;
}

export interface ResidentStay {
  id: string;
  pgId: string;
  tenantName: string;
  phone?: string;
  roomNumber: string;
  building?: string;
  roomType: string;
  moveInDate: string;
  moveOutDate?: string;
  agreementEndDate?: string;
  status: 'Staying' | 'Notice Period' | 'Moved Out';
}

export interface VacancyForecast {
  roomNumber: string;
  building: string;
  floorOrWing?: string;
  bedsBecomingVacant: number;
  date: string;
  reason: string;
}

export interface MoveOutForecast {
  tenantName: string;
  roomNumber: string;
  building?: string;
  moveOutDate: string;
  bedsFreeing: number;
}

export interface AgreementExpiry {
  tenantName: string;
  roomNumber: string;
  building?: string;
  agreementEndDate: string;
  daysLeft: number;
}

export interface OccupancyForecast {
  bedsVacantNextWeek: VacancyForecast[];
  upcomingMoveOuts: MoveOutForecast[];
  expiringAgreements: AgreementExpiry[];
  expectedNextMonth: {
    occupancyRate: number;
    occupiedBeds: number;
    totalBeds: number;
    changeFromToday: number;
  };
}

export interface BuildingSection {
  building: string;
  sections: {
    label: string;
    rooms: PGRoom[];
  }[];
}

export interface PGListing {
  id: string;
  name: string;
  category: 'Girls Only' | 'Boys Only' | 'Unisex / Co-living';
  address: string;
  city: string;
  area: string;
  status: PGStatus;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalBeds?: number;
  availableBeds?: number;
  monthlyRent?: number;
  rentRange: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images?: string[];
  videos?: string[];
  amenities: string[];
  rooms: PGRoom[];
  roomAvailability?: PGRoomAvailability[];
  foodDetails?: {
    provided: boolean;
    cookingAvailable?: boolean;
    /** Combined service model for hostels/PGs */
    serviceModel?:
      | 'Food + Cooking'
      | 'Food Only (No Cooking)'
      | 'Cooking Only (No Food)'
      | 'No Food & No Cooking';
    type:
      | 'No Food'
      | 'Only Veg Cooking Available'
      | 'Veg Meals Only'
      | 'Veg & Non-Veg'
      | 'Self Cooking / Order'
      | 'Veg Only'
      | 'Food + Cooking Available'
      | 'Food Provided No Cooking'
      | 'Cooking Available No Food';
    mealType?: 'Veg Only' | 'Veg & Non-Veg';
    cookingType?: 'Veg Only' | 'Veg & Non-Veg' | 'Any';
    meals: string[];
    chargeType?: 'Included in rent' | 'Extra monthly' | 'Per meal';
    monthlyFoodCharge?: number;
    mealCharges?: {
      Breakfast?: number;
      Lunch?: number;
      Dinner?: number;
    };
    notes?: string;
  };
  /** Shared appliances with placement (per floor vs whole PG) */
  amenityDetails?: {
    fridge?: 'None' | 'Per Floor' | 'Entire PG';
    washingMachine?: 'None' | 'Per Floor' | 'Entire PG';
  };
  rules?: string[];
  createdDate: string;
}

export interface BookingRecord {
  id: string;
  pgName: string;
  pgId: string;
  tenantName: string;
  tenantPhone: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Pending Payment';
  paymentMode: string;
  bookingDate: string;
}

export interface SettlementHistory {
  id: string;
  amount: number;
  payoutDate: string;
  status: 'Completed' | 'Pending' | 'Failed';
  utrNumber: string;
  bankAccount: string;
}

export interface MerchantReview {
  id: string;
  pgName: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  merchantReply?: string;
  status: 'Visible' | 'Reported' | 'Hidden';
}

export interface MerchantComplaint {
  id: string;
  reportedBy: string;
  tenantPhone: string;
  pgName: string;
  complaintType: 'Maintenance & Amenities' | 'Rent & Deposit Dispute' | 'Overcrowding & Safety' | 'Behavioral / Staff Issue' | 'Food Quality';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  assignedAdmin: string;
  createdDate: string;
  resolvedDate?: string;
  description: string;
  resolutionNotes?: string;
}

export interface MerchantNotification {
  id: string;
  title: string;
  message: string;
  type: 'Approval' | 'Rejection' | 'Payment' | 'Booking' | 'Complaint' | 'Maintenance' | 'Promotional' | 'System';
  sentAt: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  category: 'Security' | 'Profile' | 'Listing' | 'Finance' | 'Verification';
}

export interface Merchant {
  id: string;
  basicInfo: MerchantBasicInfo;
  businessInfo: MerchantBusinessInfo;
  verificationStatus: MerchantVerificationStatus;
  documents: MerchantDocument[];
  bankDetails: MerchantBankDetails;
  pgListings: PGListing[];
  recentBookings: BookingRecord[];
  settlements: SettlementHistory[];
  reviews: MerchantReview[];
  complaints: MerchantComplaint[];
  notifications: MerchantNotification[];
  activityLogs: ActivityLog[];
  metrics: {
    totalRevenue: number;
    monthlyRevenue: number;
    occupancyRate: number;
    averageRating: number;
    responseRate: string;
    cancellationRate: string;
  };
  permissions: {
    canCreatePG: boolean;
    canEditPG: boolean;
    canDeletePG: boolean;
    canAddRooms: boolean;
    canEditPrices: boolean;
    canAcceptBookings: boolean;
    canCancelBookings: boolean;
    canReceivePayments: boolean;
    canWithdrawEarnings: boolean;
    canRespondReviews: boolean;
    canManageAvailability: boolean;
  };
}

export interface MerchantFilterState {
  searchQuery: string;
  status: MerchantStatus | 'All';
  city: string;
  businessType: string;
  minRevenue: number;
  minRating: number;
  sortBy: 'newest' | 'oldest' | 'revenue_high' | 'rating_high' | 'pgs_count';
}

export type DashboardTab = 
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard' 
  | 'home'
  | 'my-pgs' 
  | 'add-pg' 
  | 'residents'
  | 'earnings'
  | 'enquiries' 
  | 'visits' 
  | 'availability' 
  | 'reviews' 
  | 'notifications' 
  | 'profile';

