import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Bed, 
  DollarSign, 
  Plus, 
  PlusCircle, 
  Edit3, 
  Eye, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  Utensils, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { PGListing, PGRoom, DashboardTab } from '../../types/merchant';
import { OCCUPANCY_RESIDENTS } from '../../data/occupancyData';
import { computeOccupancyForecast } from '../../utils/occupancyUtils';
import { OccupancyHierarchyPanel } from './OccupancyHierarchyPanel';
import { OccupancyPredictionsPanel } from './OccupancyPredictionsPanel';

function getOccupancy(pg: PGListing) {
  const totalBeds =
    pg.totalBeds ??
    pg.roomAvailability?.reduce((acc, r) => acc + r.totalBeds, 0) ??
    pg.rooms.reduce((acc, r) => acc + r.totalBeds, 0);

  const availableBeds =
    pg.availableBeds ??
    pg.roomAvailability?.reduce((acc, r) => acc + r.availableBeds, 0) ??
    pg.rooms.reduce((acc, r) => acc + Math.max(r.totalBeds - r.occupiedBeds, 0), 0);

  const occupiedBeds = Math.max(totalBeds - availableBeds, 0);
  const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const roomTypeRows =
    pg.roomAvailability?.map((r) => ({
      label: r.roomType,
      totalBeds: r.totalBeds,
      availableBeds: r.availableBeds,
      occupiedBeds: Math.max(r.totalBeds - r.availableBeds, 0),
    })) ?? [];

  const roomRows = pg.rooms.map((r) => ({
    label: `Room ${r.roomNumber} · ${r.type}`,
    totalBeds: r.totalBeds,
    availableBeds: Math.max(r.totalBeds - r.occupiedBeds, 0),
    occupiedBeds: r.occupiedBeds,
  }));

  return { totalBeds, availableBeds, occupiedBeds, occupancyPct, roomTypeRows, roomRows };
}

interface MyPGsViewProps {
  pgListings: PGListing[];
  onSelectTab: (tab: DashboardTab) => void;
  onViewPG: (pg: PGListing) => void;
  onEditPG: (pg: PGListing) => void;
  onManageRooms: (pg: PGListing) => void;
  onUpdateAvailabilityPG: (pg: PGListing) => void;
  onTogglePausePG: (pgId: string) => void;
  onDeletePG: (pgId: string) => void;
  onSavePGDetails?: (updatedPG: PGListing) => void;
}

export const MyPGsView: React.FC<MyPGsViewProps> = ({
  pgListings,
  onSelectTab,
  onViewPG,
  onEditPG,
  onManageRooms,
  onUpdateAvailabilityPG,
  onTogglePausePG,
  onDeletePG,
  onSavePGDetails
}) => {
  // If a merchant clicks "View Details" or "Edit", we can show the single-scroll accordion page!
  const [activePropertyDetail, setActivePropertyDetail] = useState<PGListing | null>(null);

  // Accordions expanded state for single-scroll page
  const [openAccordionSections, setOpenAccordionSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    occupancy: true,
    rooms: true,
    pricing: true,
    amenities: false,
    foodDetails: false,
    houseRules: false,
    photosVideos: false,
    reviews: false,
    documents: false,
  });

  const toggleAccordion = (sectionKey: string) => {
    setOpenAccordionSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // IF AN ACTIVE PROPERTY DETAIL IS SELECTED, SHOW SINGLE SCROLL PAGE WITH EXPANDABLE ACCORDION SECTIONS
  if (activePropertyDetail) {
    const pg = activePropertyDetail;
    const occupancy = getOccupancy(pg);

    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Navigation Back Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE8E4]">
          <button
            onClick={() => setActivePropertyDetail(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-bold text-xs hover:bg-[#F3F1EC] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to All My PGs</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30">
              {pg.status}
            </span>
          </div>
        </div>

        {/* Property Hero Banner */}
        <div className="relative h-56 rounded-[28px] overflow-hidden bg-[#FAF8F4] border border-[#EAE8E4] shadow-soft-sm">
          <img src={pg.coverImage} alt={pg.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7B9D8A] w-fit mb-2">
              {pg.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{pg.name}</h1>
            <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#D8C29B]" />
              <span>{pg.address}, {pg.area}, {pg.city}</span>
            </p>
          </div>
        </div>

        {/* Page Subtitle */}
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-bold text-[#2F3A35]">Property Management — Single Scroll Details</h2>
          <p className="text-xs text-[#6B7280]">Expand any section below to review or update property information without leaving the page.</p>
        </div>

        {/* ACCORDIONS LIST */}
        <div className="space-y-4">
          {/* 1. Basic Information Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('basicInfo')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#DDE9E0] text-[#7B9D8A]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Basic Information</h3>
                  <p className="text-xs text-[#6B7280]">Property name, category, status, and full address</p>
                </div>
              </div>
              {openAccordionSections.basicInfo ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.basicInfo && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div>
                    <span className="text-[#6B7280] block font-semibold">PG Property Name</span>
                    <span className="font-bold text-[#2F3A35] text-sm">{pg.name}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Category</span>
                    <span className="font-bold text-[#7B9D8A]">{pg.category}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">City & Area</span>
                    <span className="font-bold text-[#2F3A35]">{pg.area}, {pg.city}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Full Address</span>
                    <span className="font-bold text-[#2F3A35]">{pg.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Occupancy Overview Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('occupancy')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E8F5EC] text-[#5DA271]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Occupancy Overview</h3>
                  <p className="text-xs text-[#6B7280]">
                    {occupancy.occupiedBeds} occupied · {occupancy.availableBeds} available · {occupancy.occupancyPct}% full
                  </p>
                </div>
              </div>
              {openAccordionSections.occupancy ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.occupancy && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-5 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                  <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center">
                    <span className="text-[10px] text-[#6B7280] font-semibold block">Total Beds</span>
                    <span className="text-lg font-extrabold text-[#2F3A35] font-number">{occupancy.totalBeds}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FDECEC] border border-[#E56363]/20 text-center">
                    <span className="text-[10px] text-[#6B7280] font-semibold block">Occupied</span>
                    <span className="text-lg font-extrabold text-[#E56363] font-number">{occupancy.occupiedBeds}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#E8F5EC] border border-[#5DA271]/30 text-center">
                    <span className="text-[10px] text-[#6B7280] font-semibold block">Vacant</span>
                    <span className="text-lg font-extrabold text-[#5DA271] font-number">{occupancy.availableBeds}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] text-center">
                    <span className="text-[10px] text-[#6B7280] font-semibold block">Occupancy</span>
                    <span className="text-lg font-extrabold text-[#7B9D8A] font-number">{occupancy.occupancyPct}%</span>
                  </div>
                </div>

                {pg.rooms.some((r) => r.building || r.floor || r.wing) ? (
                  <>
                    <div>
                      <h4 className="font-bold text-[#2F3A35] mb-2">Building → Floor → Room</h4>
                      <OccupancyHierarchyPanel rooms={pg.rooms} compact />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2F3A35] mb-2">Forecasts</h4>
                      <OccupancyPredictionsPanel
                        forecast={computeOccupancyForecast(pg, OCCUPANCY_RESIDENTS)}
                        compact
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {occupancy.roomTypeRows.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#2F3A35]">By room type</h4>
                        {occupancy.roomTypeRows.map((row) => (
                          <div
                            key={row.label}
                            className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
                          >
                            <span className="font-semibold text-[#2F3A35]">{row.label}</span>
                            <div className="flex items-center gap-3 font-number text-[11px]">
                              <span className="text-[#E56363] font-bold">{row.occupiedBeds} occupied</span>
                              <span className="text-[#5DA271] font-bold">{row.availableBeds} available</span>
                              <span className="text-[#6B7280]">/ {row.totalBeds} total</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {occupancy.roomRows.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#2F3A35]">Room-wise occupancy</h4>
                        {occupancy.roomRows.map((row) => (
                          <div
                            key={row.label}
                            className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]"
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-semibold text-[#2F3A35]">{row.label}</span>
                              <span className="font-number text-[11px] text-[#6B7280]">
                                {row.occupiedBeds}/{row.totalBeds} beds filled
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#EAE8E4] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#5DA271]"
                                style={{
                                  width: `${row.totalBeds > 0 ? (row.occupiedBeds / row.totalBeds) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* 3. Rooms Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('rooms')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E8F1FA] text-[#6F9BD1]">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Rooms & Beds Inventory</h3>
                  <p className="text-xs text-[#6B7280]">
                    Total Beds: {occupancy.totalBeds} · Occupied: {occupancy.occupiedBeds} · Available: {occupancy.availableBeds}
                  </p>
                </div>
              </div>
              {openAccordionSections.rooms ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.rooms && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  {pg.roomAvailability ? (
                    pg.roomAvailability.map((ra) => {
                      const occupied = Math.max(ra.totalBeds - ra.availableBeds, 0);
                      return (
                        <div key={ra.roomType} className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
                          <span className="font-bold text-sm text-[#2F3A35] block">{ra.roomType}</span>
                          <div className="mt-2 space-y-1 font-number">
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B7280]">Occupied</span>
                              <span className="font-bold text-[#E56363]">{occupied}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#6B7280]">Available</span>
                              <span className="font-bold text-[#5DA271]">{ra.availableBeds}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-[#EAE8E4] pt-1">
                              <span className="text-[#6B7280]">Total</span>
                              <span className="font-bold text-[#2F3A35]">{ra.totalBeds} beds</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#7B9D8A] font-number mt-2 block">${ra.monthlyRent} / mo</span>
                        </div>
                      );
                    })
                  ) : (
                    pg.rooms.map((room) => (
                      <div key={room.id} className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
                        <span className="font-bold text-sm text-[#2F3A35] block">Room {room.roomNumber}</span>
                        <span className="text-[11px] text-[#6B7280]">{room.type}</span>
                        <div className="mt-2 flex justify-between font-number text-[11px]">
                          <span className="text-[#E56363] font-bold">{room.occupiedBeds} occupied</span>
                          <span className="text-[#5DA271] font-bold">{Math.max(room.totalBeds - room.occupiedBeds, 0)} available</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. Pricing Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('pricing')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FFF8E7] text-[#C9952A]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Pricing & Rent Structure</h3>
                  <p className="text-xs text-[#6B7280]">Monthly rent rates, security deposit, maintenance fees</p>
                </div>
              </div>
              {openAccordionSections.pricing ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.pricing && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Starting Rent</span>
                    <span className="font-bold text-base text-[#7B9D8A] font-number">${pg.monthlyRent} / month</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Rent Range</span>
                    <span className="font-bold text-base text-[#2F3A35] font-number">{pg.rentRange}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Security Deposit</span>
                    <span className="font-bold text-[#2F3A35] font-number">1 Month Rent Equivalent</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block font-semibold">Notice Period</span>
                    <span className="font-bold text-[#2F3A35]">30 Days</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Amenities Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('amenities')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E8F5EC] text-[#5DA271]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Amenities & Services</h3>
                  <p className="text-xs text-[#6B7280]">Wi-Fi, AC, Power Backup, Housekeeping, Security</p>
                </div>
              </div>
              {openAccordionSections.amenities ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.amenities && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <div className="flex flex-wrap gap-2 pt-3">
                  {pg.amenities.map((a, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#EAE8E4] font-semibold text-[#2F3A35]">
                      ✔ {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Food Details Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('foodDetails')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FAF8F4] text-[#7B9D8A]">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Food & Dining Details</h3>
                  <p className="text-xs text-[#6B7280]">Meal plans, veg/non-veg options, timing</p>
                </div>
              </div>
              {openAccordionSections.foodDetails ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.foodDetails && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                {pg.foodDetails ? (
                  <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] space-y-2 pt-3">
                    <p className="font-bold text-[#2F3A35]">
                      {pg.foodDetails.serviceModel || pg.foodDetails.type}
                    </p>
                    <p className="text-[#2F3A35]">
                      Food: {pg.foodDetails.provided ? 'Provided' : 'Not provided'}
                      {' · '}
                      Cooking:{' '}
                      {pg.foodDetails.cookingAvailable === true
                        ? 'Available'
                        : pg.foodDetails.cookingAvailable === false
                          ? 'Not available'
                          : '—'}
                    </p>
                    {pg.foodDetails.mealType && (
                      <p className="text-[#2F3A35]">Meal type: {pg.foodDetails.mealType}</p>
                    )}
                    {pg.foodDetails.cookingType && (
                      <p className="text-[#2F3A35]">Cooking type: {pg.foodDetails.cookingType}</p>
                    )}
                    {pg.foodDetails.meals.length > 0 && (
                      <p className="text-[#2F3A35]">Meals: {pg.foodDetails.meals.join(', ')}</p>
                    )}
                    {pg.foodDetails.chargeType && (
                      <p className="text-[#2F3A35]">
                        Charges: {pg.foodDetails.chargeType}
                        {pg.foodDetails.chargeType === 'Extra monthly' &&
                          pg.foodDetails.monthlyFoodCharge != null &&
                          ` · $${pg.foodDetails.monthlyFoodCharge}/mo`}
                      </p>
                    )}
                    {pg.foodDetails.mealCharges && (
                      <div className="text-[#2F3A35] space-y-0.5">
                        {Object.entries(pg.foodDetails.mealCharges).map(([meal, amt]) => (
                          <p key={meal}>
                            {meal}: ${amt}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[#6B7280] pt-3">No food details added.</p>
                )}
                {pg.amenityDetails && (
                  <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] space-y-1">
                    <p className="font-bold text-[#2F3A35]">Fridge & washing</p>
                    <p className="text-[#6B7280]">
                      Fridge: {pg.amenityDetails.fridge || '—'} · Washing machine:{' '}
                      {pg.amenityDetails.washingMachine || '—'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 6. House Rules Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('houseRules')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FFFFFF] text-[#2F3A35] border border-[#EAE8E4]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">House Rules & Guidelines</h3>
                  <p className="text-xs text-[#6B7280]">Curfew time, visitor policy, smoking/alcohol rules</p>
                </div>
              </div>
              {openAccordionSections.houseRules ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.houseRules && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <ul className="space-y-2 pt-3">
                  {pg.rules?.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#2F3A35]">
                      <span className="w-2 h-2 rounded-full bg-[#7B9D8A]" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 7. Photos & Videos Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('photosVideos')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#DDE9E0] text-[#7B9D8A]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Photos & Video Tour</h3>
                  <p className="text-xs text-[#6B7280]">High-res room gallery images</p>
                </div>
              </div>
              {openAccordionSections.photosVideos ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.photosVideos && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                  {(pg.images && pg.images.length > 0 ? pg.images : [pg.coverImage]).map((img, i) => (
                    <img
                      key={`${img}-${i}`}
                      src={img}
                      alt={`Photo ${i + 1}`}
                      className="h-28 w-full object-cover rounded-xl border border-[#EAE8E4]"
                    />
                  ))}
                </div>
                {pg.videos && pg.videos.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-bold text-[#2F3A35]">Videos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pg.videos.map((vid, i) => (
                        <video
                          key={`${vid}-${i}`}
                          src={vid}
                          controls
                          className="w-full rounded-xl border border-[#EAE8E4] bg-black aspect-video"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 8. Reviews Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('reviews')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FFF8E7] text-[#F4B740]">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Tenant Reviews</h3>
                  <p className="text-xs text-[#6B7280]">Rating: ★ {pg.rating} ({pg.reviewCount} total tenant reviews)</p>
                </div>
              </div>
              {openAccordionSections.reviews ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.reviews && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <p className="text-[#6B7280] pt-3">
                  Check out all resident reviews in the <button onClick={() => onSelectTab('reviews')} className="text-[#7B9D8A] font-bold underline">Reviews Section</button>.
                </p>
              </div>
            )}
          </div>

          {/* 9. Documents Accordion */}
          <div className="bg-white border border-[#EAE8E4] rounded-[24px] shadow-soft-sm overflow-hidden">
            <button
              onClick={() => toggleAccordion('documents')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FFFFFF] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E8F5EC] text-[#5DA271]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2F3A35]">Property Legal Documents</h3>
                  <p className="text-xs text-[#6B7280]">Rental agreement, ownership proof, trade license</p>
                </div>
              </div>
              {openAccordionSections.documents ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
            </button>

            {openAccordionSections.documents && (
              <div className="p-5 pt-0 border-t border-[#F3F1EC] space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#E8F5EC] border border-[#5DA271]/30 text-[#5DA271] font-semibold flex items-center gap-2 pt-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Property Verification Documents Verified & Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT MAIN MY PGS CARDS GRID VIEW
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3A35]">My PGs</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Manage your registered PG properties, update room inventories, or view detailed single-scroll profiles.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('add-pg')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#7B9D8A] text-white font-bold text-xs hover:bg-[#6D8F7D] shadow-soft-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New PG</span>
        </button>
      </div>

      {/* Property Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pgListings.map((pg) => (
          <div
            key={pg.id}
            className="bg-white border border-[#EAE8E4] rounded-[28px] overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between group"
          >
            {/* Card Image Banner */}
            <div className="relative h-44 overflow-hidden bg-[#FAF8F4]">
              <img
                src={pg.coverImage}
                alt={pg.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30 shadow-soft-xs">
                  {pg.status}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#7B9D8A] border border-[#D8C29B] shadow-soft-xs">
                  {pg.category}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-[#2F3A35] leading-snug">{pg.name}</h3>
                  <span className="flex items-center gap-1 font-bold text-xs text-[#2F3A35] font-number shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#F4B740] fill-current" />
                    <span>{pg.rating}</span>
                  </span>
                </div>

                <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#7B9D8A]" />
                  <span>{pg.area}, {pg.city}</span>
                </p>
              </div>

              {/* Occupancy summary */}
              {(() => {
                const occ = getOccupancy(pg);
                return (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F3F1EC] text-center">
                        <span className="text-[10px] text-[#6B7280] block">Total</span>
                        <span className="font-bold text-sm text-[#2F3A35] font-number">{occ.totalBeds}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FDECEC] border border-[#E56363]/15 text-center">
                        <span className="text-[10px] text-[#6B7280] block">Occupied</span>
                        <span className="font-bold text-sm text-[#E56363] font-number">{occ.occupiedBeds}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#E8F5EC] border border-[#5DA271]/20 text-center">
                        <span className="text-[10px] text-[#6B7280] block">Available</span>
                        <span className="font-bold text-sm text-[#5DA271] font-number">{occ.availableBeds}</span>
                      </div>
                    </div>

                    <div className="h-1.5 rounded-full bg-[#EAE8E4] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#7B9D8A]"
                        style={{ width: `${occ.occupancyPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[#6B7280] font-semibold text-center">
                      {occ.occupancyPct}% occupied · ${pg.monthlyRent}/mo
                    </p>

                    {(occ.roomTypeRows.length > 0 ? occ.roomTypeRows : occ.roomRows).slice(0, 3).map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between text-[10px] px-1"
                      >
                        <span className="text-[#6B7280] font-medium truncate pr-2">{row.label}</span>
                        <span className="font-number shrink-0">
                          <span className="text-[#E56363] font-bold">{row.occupiedBeds}</span>
                          <span className="text-[#6B7280]"> / </span>
                          <span className="text-[#5DA271] font-bold">{row.availableBeds}</span>
                          <span className="text-[#9CA3AF]"> avail</span>
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Primary Action Buttons */}
              <div className="pt-2 border-t border-[#F3F1EC] grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActivePropertyDetail(pg)}
                  className="py-2 px-2 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] font-bold text-[11px] hover:text-[#7B9D8A] hover:border-[#D8C29B] transition-all flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onUpdateAvailabilityPG(pg)}
                  className="py-2 px-2 rounded-xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] font-bold text-[11px] hover:bg-[#DDE9E0] transition-all flex items-center justify-center gap-1"
                >
                  <Bed className="w-3.5 h-3.5" />
                  <span>Rooms</span>
                </button>

                <button
                  onClick={() => setActivePropertyDetail(pg)}
                  className="py-2 px-2 rounded-xl bg-[#7B9D8A] text-white font-bold text-[11px] hover:bg-[#6D8F7D] transition-all flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
