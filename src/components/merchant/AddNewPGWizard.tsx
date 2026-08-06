import React, { useRef, useState } from 'react';
import {
  Building2,
  MapPin,
  Bed,
  Sparkles,
  Utensils,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Upload,
  Video,
  Star,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PGListing, DashboardTab } from '../../types/merchant';

interface AddNewPGWizardProps {
  onSelectTab: (tab: DashboardTab) => void;
  onAddPGListing: (newPG: PGListing) => void;
}

type SharingType = 'Single Sharing' | '2 Sharing' | '3 Sharing' | '4 Sharing';

interface WizardRoom {
  id: string;
  roomNumber: string;
  /** true = filled, false = available — length = bedsPerRoom */
  beds: boolean[];
}

interface RoomCategory {
  type: SharingType;
  bedsPerRoom: number;
  monthlyRent: number;
  rooms: WizardRoom[];
}

const ROOM_TYPE_PREFIX: Record<SharingType, string> = {
  'Single Sharing': 'S',
  '2 Sharing': '2',
  '3 Sharing': '3',
  '4 Sharing': '4',
};

const BEDS_PER_TYPE: Record<SharingType, number> = {
  'Single Sharing': 1,
  '2 Sharing': 2,
  '3 Sharing': 3,
  '4 Sharing': 4,
};

const makeWizardRoom = (index: number, type: SharingType): WizardRoom => {
  const bedsPerRoom = BEDS_PER_TYPE[type];
  return {
    id: `${type}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    roomNumber: `${index + 1}`,
    beds: Array.from({ length: bedsPerRoom }, () => false),
  };
};

const roomFilledCount = (room: WizardRoom) => room.beds.filter(Boolean).length;

const createInitialCategories = (): RoomCategory[] => [
  { type: 'Single Sharing', bedsPerRoom: 1, monthlyRent: 350, rooms: [makeWizardRoom(0, 'Single Sharing')] },
  { type: '2 Sharing', bedsPerRoom: 2, monthlyRent: 250, rooms: [makeWizardRoom(0, '2 Sharing'), makeWizardRoom(1, '2 Sharing')] },
  { type: '3 Sharing', bedsPerRoom: 3, monthlyRent: 200, rooms: [makeWizardRoom(0, '3 Sharing'), makeWizardRoom(1, '3 Sharing')] },
  { type: '4 Sharing', bedsPerRoom: 4, monthlyRent: 160, rooms: [] },
];

const mapRoomTypeForAvailability = (
  type: SharingType
): 'Single' | '2 Sharing' | '3 Sharing' | '4 Sharing' => {
  if (type === 'Single Sharing') return 'Single';
  return type;
};

export const AddNewPGWizard: React.FC<AddNewPGWizardProps> = ({
  onSelectTab,
  onAddPGListing,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Girls Only' | 'Boys Only' | 'Unisex / Co-living'>('Girls Only');
  const [city, setCity] = useState('Hyderabad');
  const [area, setArea] = useState('Gachibowli');
  const [address, setAddress] = useState('');

  // Room details: per-type categories with individual rooms
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(createInitialCategories);
  const [expandedTypes, setExpandedTypes] = useState<Record<SharingType, boolean>>({
    'Single Sharing': true,
    '2 Sharing': false,
    '3 Sharing': false,
    '4 Sharing': false,
  });

  // Amenities
  const availableAmenities = [
    'High Speed WiFi',
    'Daily Housekeeping',
    'AC & Geyser',
    'Biometric Lock',
    'Power Backup',
    'CCTV Security',
    'Gym & Recreation',
    'Smart TV',
    '24/7 Water Supply',
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High Speed WiFi',
    'Daily Housekeeping',
    'AC & Geyser',
  ]);

  type AppliancePlacement = 'None' | 'Per Floor' | 'Entire PG';
  const [fridgePlacement, setFridgePlacement] = useState<AppliancePlacement>('Per Floor');
  const [washingPlacement, setWashingPlacement] = useState<AppliancePlacement>('Entire PG');

  // Food + Cooking model (common hostel/PG combinations)
  type FoodServiceModel =
    | 'Food + Cooking'
    | 'Food Only (No Cooking)'
    | 'Cooking Only (No Food)'
    | 'No Food & No Cooking';

  const foodServiceOptions: { value: FoodServiceModel; label: string; hint: string }[] = [
    {
      value: 'Food + Cooking',
      label: 'Food provided + cooking available',
      hint: 'PG serves meals AND residents can cook',
    },
    {
      value: 'Food Only (No Cooking)',
      label: 'Food provided · no cooking',
      hint: 'Meals from PG only — kitchen cooking not allowed',
    },
    {
      value: 'Cooking Only (No Food)',
      label: 'Cooking available · no food',
      hint: 'Kitchen/cooking allowed — PG does not serve meals',
    },
    {
      value: 'No Food & No Cooking',
      label: 'No food & no cooking',
      hint: 'Residents arrange food outside',
    },
  ];

  const [foodServiceModel, setFoodServiceModel] = useState<FoodServiceModel>('Food + Cooking');
  const [mealType, setMealType] = useState<'Veg Only' | 'Veg & Non-Veg'>('Veg & Non-Veg');
  const [cookingType, setCookingType] = useState<'Veg Only' | 'Veg & Non-Veg' | 'Any'>('Veg Only');
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['Breakfast', 'Lunch', 'Dinner']);
  const [foodChargeType, setFoodChargeType] = useState<'Included in rent' | 'Extra monthly' | 'Per meal'>(
    'Extra monthly'
  );
  const [monthlyFoodCharge, setMonthlyFoodCharge] = useState<number>(3000);
  const [breakfastCharge, setBreakfastCharge] = useState<number>(50);
  const [lunchCharge, setLunchCharge] = useState<number>(80);
  const [dinnerCharge, setDinnerCharge] = useState<number>(80);

  const foodProvided =
    foodServiceModel === 'Food + Cooking' || foodServiceModel === 'Food Only (No Cooking)';
  const cookingAvailable =
    foodServiceModel === 'Food + Cooking' || foodServiceModel === 'Cooking Only (No Food)';

  const buildAmenityList = () => {
    const list = [...selectedAmenities];
    if (fridgePlacement === 'Per Floor') list.push('Refrigerator (Per Floor)');
    if (fridgePlacement === 'Entire PG') list.push('Refrigerator (Entire PG)');
    if (washingPlacement === 'Per Floor') list.push('Washing Machine (Per Floor)');
    if (washingPlacement === 'Entire PG') list.push('Washing Machine (Entire PG)');
    return list;
  };

  const mapFoodType = (): NonNullable<PGListing['foodDetails']>['type'] => {
    if (foodServiceModel === 'Food + Cooking') return 'Food + Cooking Available';
    if (foodServiceModel === 'Food Only (No Cooking)') return 'Food Provided No Cooking';
    if (foodServiceModel === 'Cooking Only (No Food)') return 'Cooking Available No Food';
    return 'No Food';
  };

  // Rules
  const defaultRules = [
    'Gate closing time: 10:30 PM',
    'Notice period: 30 days',
    'No smoking or alcohol inside premises',
    'Visitors allowed in common area till 8:00 PM',
  ];
  const [rules, setRules] = useState<string[]>(defaultRules);
  const [newRuleInput, setNewRuleInput] = useState('');

  // Photos & videos
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
  ]);
  const [videos, setVideos] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState(photos[0]);

  const steps = [
    { title: 'Property & Location', subtitle: 'Name, category and address' },
    { title: 'Rooms & Pricing', subtitle: 'Add rooms per type and mark filled beds' },
    { title: 'Facilities & Rules', subtitle: 'Amenities, food and house rules' },
    { title: 'Photos & Videos', subtitle: 'Upload photos, videos, then publish' },
  ];

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const urls = files
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f));
    if (urls.length === 0) return;
    setPhotos((prev) => {
      const next = [...prev, ...urls];
      if (!coverImage && next[0]) setCoverImage(next[0]);
      return next;
    });
    e.target.value = '';
  };

  const handleAddVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const urls = files
      .filter((f) => f.type.startsWith('video/'))
      .map((f) => URL.createObjectURL(f));
    if (urls.length === 0) return;
    setVideos((prev) => [...prev, ...urls]);
    e.target.value = '';
  };

  const removePhoto = (url: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p !== url);
      if (coverImage === url) setCoverImage(next[0] || '');
      return next;
    });
  };

  const removeVideo = (url: string) => {
    setVideos((prev) => prev.filter((v) => v !== url));
  };

  const handleToggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleToggleMeal = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setRules((prev) => [...prev, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCategory = (type: SharingType, updater: (cat: RoomCategory) => RoomCategory) => {
    setRoomCategories((prev) => prev.map((cat) => (cat.type === type ? updater(cat) : cat)));
  };

  const setCategoryRoomCount = (type: SharingType, count: number) => {
    const nextCount = Math.max(0, count);
    updateCategory(type, (cat) => {
      const rooms = [...cat.rooms];
      while (rooms.length < nextCount) {
        rooms.push(makeWizardRoom(rooms.length, type));
      }
      while (rooms.length > nextCount) {
        rooms.pop();
      }
      return { ...cat, rooms };
    });
    if (nextCount > 0) {
      setExpandedTypes((prev) => ({ ...prev, [type]: true }));
    }
  };

  const updateRoom = (type: SharingType, roomId: string, patch: Partial<WizardRoom>) => {
    updateCategory(type, (cat) => ({
      ...cat,
      rooms: cat.rooms.map((room) => (room.id === roomId ? { ...room, ...patch } : room)),
    }));
  };

  const setRoomBedFilled = (type: SharingType, roomId: string, bedIndex: number, filled: boolean) => {
    updateCategory(type, (cat) => ({
      ...cat,
      rooms: cat.rooms.map((room) => {
        if (room.id !== roomId) return room;
        const beds = [...room.beds];
        beds[bedIndex] = filled;
        return { ...room, beds };
      }),
    }));
  };

  const setSingleRoomStatus = (type: SharingType, roomId: string, filled: boolean) => {
    setRoomBedFilled(type, roomId, 0, filled);
  };

  const toggleTypeExpanded = (type: SharingType) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const categoryStats = (cat: RoomCategory) => {
    const totalBeds = cat.rooms.length * cat.bedsPerRoom;
    const occupied = cat.rooms.reduce((sum, room) => sum + roomFilledCount(room), 0);
    return {
      roomCount: cat.rooms.length,
      totalBeds,
      occupied,
      available: Math.max(totalBeds - occupied, 0),
    };
  };

  const totalBeds = roomCategories.reduce((sum, cat) => sum + categoryStats(cat).totalBeds, 0);
  const totalOccupied = roomCategories.reduce((sum, cat) => sum + categoryStats(cat).occupied, 0);
  const totalAvailable = Math.max(totalBeds - totalOccupied, 0);
  const totalRoomCount = roomCategories.reduce((sum, cat) => sum + cat.rooms.length, 0);

  const rentRange = () => {
    const rents = roomCategories.filter((c) => c.rooms.length > 0).map((c) => c.monthlyRent);
    if (rents.length === 0) return '$0 / month';
    return `$${Math.min(...rents)} - $${Math.max(...rents)} / month`;
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return name.trim().length > 0 && city.trim().length > 0 && area.trim().length > 0;
    }
    if (currentStep === 2) {
      return totalBeds > 0;
    }
    return true;
  };

  const handleSubmit = () => {
    const builtRooms = roomCategories.flatMap((cat) =>
      cat.rooms.map((room) => ({
        id: room.id,
        roomNumber: room.roomNumber.trim() || '—',
        type: cat.type,
        totalBeds: cat.bedsPerRoom,
        occupiedBeds: roomFilledCount(room),
        monthlyRent: cat.monthlyRent,
        amenities: buildAmenityList(),
      }))
    );

    const occupiedRooms = builtRooms.filter((r) => r.occupiedBeds >= r.totalBeds).length;
    const availableRooms = builtRooms.filter((r) => r.occupiedBeds < r.totalBeds).length;

    const newPG: PGListing = {
      id: `PG-${Date.now()}`,
      name: name.trim() || 'New Sunrise Executive PG',
      category,
      address: address.trim() || `${area}, ${city}`,
      city,
      area,
      status: 'Live',
      totalRooms: totalRoomCount,
      occupiedRooms,
      availableRooms,
      totalBeds,
      availableBeds: totalAvailable,
      monthlyRent: roomCategories.find((c) => c.rooms.length > 0)?.monthlyRent ?? 0,
      rentRange: rentRange(),
      rating: 5.0,
      reviewCount: 1,
      coverImage: coverImage || photos[0] || '',
      images: photos.length > 0 ? photos : coverImage ? [coverImage] : [],
      videos,
      amenities: buildAmenityList(),
      rooms: builtRooms,
      roomAvailability: roomCategories
        .filter((cat) => cat.rooms.length > 0)
        .map((cat) => {
          const stats = categoryStats(cat);
          return {
            roomType: mapRoomTypeForAvailability(cat.type),
            totalBeds: stats.totalBeds,
            availableBeds: stats.available,
            monthlyRent: cat.monthlyRent,
          };
        }),
      foodDetails: {
        provided: foodProvided,
        cookingAvailable,
        serviceModel: foodServiceModel,
        type: mapFoodType(),
        mealType: foodProvided ? mealType : undefined,
        cookingType: cookingAvailable ? cookingType : undefined,
        meals: foodProvided ? selectedMeals : [],
        chargeType: foodProvided ? foodChargeType : undefined,
        monthlyFoodCharge:
          foodProvided && foodChargeType === 'Extra monthly' ? monthlyFoodCharge : undefined,
        mealCharges:
          foodProvided && foodChargeType === 'Per meal'
            ? {
                ...(selectedMeals.includes('Breakfast') ? { Breakfast: breakfastCharge } : {}),
                ...(selectedMeals.includes('Lunch') ? { Lunch: lunchCharge } : {}),
                ...(selectedMeals.includes('Dinner') ? { Dinner: dinnerCharge } : {}),
              }
            : undefined,
      },
      amenityDetails: {
        fridge: fridgePlacement,
        washingMachine: washingPlacement,
      },
      rules,
      createdDate: new Date().toISOString().split('T')[0],
    };

    onAddPGListing(newPG);
    onSelectTab('my-pgs');
  };

  const goNext = () => {
    if (!canProceed()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200 pb-8">
      {/* Wizard Header */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-[#7B9D8A] uppercase tracking-wider">
              Step {currentStep} of {steps.length}
            </span>
            <h1 className="text-2xl font-bold text-[#2F3A35] mt-0.5">{steps[currentStep - 1].title}</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">{steps[currentStep - 1].subtitle}</p>
          </div>
          <button
            onClick={() => onSelectTab('my-pgs')}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#2F3A35]"
          >
            Cancel & Exit
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center gap-2">
          {steps.map((st, index) => {
            const stepNum = index + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <button
                key={st.title}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep || (stepNum === currentStep + 1 && canProceed())) {
                    setCurrentStep(stepNum);
                  }
                }}
                className="flex-1 group"
                title={`${stepNum}. ${st.title}`}
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    isCurrent ? 'bg-[#7B9D8A]' : isDone ? 'bg-[#D8C29B]' : 'bg-[#EAE8E4]'
                  }`}
                />
                <p
                  className={`mt-2 text-[10px] font-semibold hidden sm:block truncate ${
                    isCurrent ? 'text-[#7B9D8A]' : isDone ? 'text-[#6D8F7D]' : 'text-[#6B7280]'
                  }`}
                >
                  {st.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content — scrollable sections */}
      <div className="bg-white border border-[#EAE8E4] rounded-[24px] p-6 sm:p-8 shadow-soft-sm space-y-8 max-h-[calc(100vh-280px)] overflow-y-auto">
        {/* Step 1: Property & Location */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#7B9D8A]" />
                <span>Basic Information</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#2F3A35] mb-1">PG Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise Women's PG & Hostel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3A35] mb-1">PG Category / Gender *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Girls Only', value: 'Girls Only' },
                    { label: 'Boys Only', value: 'Boys Only' },
                    { label: 'Unisex / Co-living', value: 'Unisex / Co-living' },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value as typeof category)}
                      className={`py-3 px-3 rounded-2xl text-xs font-semibold border text-center transition-all ${
                        category === cat.value
                          ? 'bg-[#7B9D8A] text-white border-[#7B9D8A] shadow-soft-sm'
                          : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4] hover:bg-[#F3F1EC]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-4 pt-2 border-t border-[#F3F1EC]">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7B9D8A]" />
                <span>Location & Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2F3A35] mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2F3A35] mb-1">Full Street Address</label>
                <textarea
                  rows={3}
                  placeholder="Plot 42, Green Glen Layout, Opposite Tech Park..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl focus:outline-none focus:border-[#7B9D8A]"
                />
              </div>
            </section>
          </div>
        )}

        {/* Step 2: Rooms & Pricing */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <section className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                  <Bed className="w-5 h-5 text-[#7B9D8A]" />
                  <span>Rooms by type</span>
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Set <strong>how many rooms</strong> for each type. For Single Sharing, mark each room{' '}
                  <strong>Available</strong> or <strong>Filled</strong>. For 2/3/4 Sharing, mark each bed
                  Available or Filled.
                </p>
              </div>

              <div className="space-y-3">
                {roomCategories.map((cat) => {
                  const stats = categoryStats(cat);
                  const isExpanded = expandedTypes[cat.type];
                  const isFull = stats.roomCount > 0 && stats.available === 0;

                  return (
                    <div key={cat.type} className="rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleTypeExpanded(cat.type)}
                        className="w-full flex items-center justify-between gap-3 p-4 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#2F3A35]">{cat.type}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F1EC] text-[#6B7280]">
                              {cat.bedsPerRoom} bed{cat.bedsPerRoom > 1 ? 's' : ''} per room
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6B7280] mt-0.5">
                            {stats.roomCount === 0
                              ? 'No rooms added'
                              : `${stats.roomCount} room${stats.roomCount > 1 ? 's' : ''} · ${stats.occupied}/${stats.totalBeds} filled · ${stats.available} available`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {stats.roomCount > 0 && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isFull
                                  ? 'bg-[#FDECEC] text-[#E56363]'
                                  : 'bg-[#E8F5EC] text-[#5DA271]'
                              }`}
                            >
                              {isFull ? 'All full' : `${stats.available} free`}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-4 border-t border-[#EAE8E4] pt-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-semibold text-[#6B7280] mb-1">
                                How many rooms?
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setCategoryRoomCount(cat.type, stats.roomCount - 1)}
                                  className="p-2 rounded-xl border border-[#EAE8E4] bg-white text-[#6B7280] hover:bg-[#F3F1EC]"
                                  aria-label="Remove room"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  min={0}
                                  value={stats.roomCount}
                                  onChange={(e) =>
                                    setCategoryRoomCount(cat.type, Number(e.target.value) || 0)
                                  }
                                  className="flex-1 min-w-0 px-2 py-2 text-sm border border-[#EAE8E4] rounded-xl font-number bg-white text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => setCategoryRoomCount(cat.type, stats.roomCount + 1)}
                                  className="p-2 rounded-xl border border-[#EAE8E4] bg-white text-[#7B9D8A] hover:bg-[#DDE9E0]"
                                  aria-label="Add room"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-[#6B7280] mb-1">
                                Rent per bed ($/month)
                              </label>
                              <input
                                type="number"
                                min={0}
                                value={cat.monthlyRent}
                                onChange={(e) =>
                                  updateCategory(cat.type, (c) => ({
                                    ...c,
                                    monthlyRent: Number(e.target.value) || 0,
                                  }))
                                }
                                className="w-full px-3 py-2 text-sm border border-[#EAE8E4] rounded-xl font-number bg-white"
                              />
                            </div>
                          </div>

                          {cat.rooms.length === 0 ? (
                            <div className="p-4 rounded-2xl border border-dashed border-[#D8C29B] bg-[#FAF8F4] text-center">
                              <p className="text-xs text-[#6B7280]">
                                No {cat.type.toLowerCase()} rooms. Tap + to add rooms of this type.
                              </p>
                              <button
                                type="button"
                                onClick={() => setCategoryRoomCount(cat.type, 1)}
                                className="mt-2 px-4 py-2 rounded-2xl bg-[#7B9D8A] text-white text-xs font-bold"
                              >
                                Add first room
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                                {cat.bedsPerRoom === 1
                                  ? 'Each room — Available or Filled'
                                  : `Each room — ${cat.bedsPerRoom} beds (Available / Filled)`}
                              </p>
                              {cat.rooms.map((room, idx) => {
                                const filled = roomFilledCount(room);
                                const available = cat.bedsPerRoom - filled;
                                const roomFull = filled >= cat.bedsPerRoom;
                                const isSingle = cat.bedsPerRoom === 1;

                                return (
                                  <div
                                    key={room.id}
                                    className="p-3 rounded-2xl bg-white border border-[#EAE8E4] space-y-3"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <span className="text-[10px] font-bold text-[#6B7280] shrink-0">
                                          Room
                                        </span>
                                        <input
                                          type="text"
                                          value={room.roomNumber}
                                          onChange={(e) =>
                                            updateRoom(cat.type, room.id, {
                                              roomNumber: e.target.value,
                                            })
                                          }
                                          placeholder={`e.g. ${ROOM_TYPE_PREFIX[cat.type]}${101 + idx}`}
                                          className="flex-1 min-w-0 px-2.5 py-1.5 text-sm border border-[#EAE8E4] rounded-xl bg-[#FFFFFF] font-semibold"
                                        />
                                      </div>
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                          roomFull
                                            ? 'bg-[#FDECEC] text-[#E56363]'
                                            : filled === 0
                                              ? 'bg-[#E8F5EC] text-[#5DA271]'
                                              : 'bg-[#FAF8F4] text-[#7B9D8A]'
                                        }`}
                                      >
                                        {roomFull
                                          ? 'Full'
                                          : isSingle
                                            ? 'Available'
                                            : `${filled} filled · ${available} available`}
                                      </span>
                                    </div>

                                    {isSingle ? (
                                      <div className="grid grid-cols-2 gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setSingleRoomStatus(cat.type, room.id, false)}
                                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                            !room.beds[0]
                                              ? 'bg-[#E8F5EC] text-[#5DA271] border-[#5DA271]/40'
                                              : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                                          }`}
                                        >
                                          Available
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setSingleRoomStatus(cat.type, room.id, true)}
                                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                            room.beds[0]
                                              ? 'bg-[#FDECEC] text-[#E56363] border-[#E56363]/40'
                                              : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                                          }`}
                                        >
                                          Filled
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        {room.beds.map((isFilled, bedIdx) => (
                                          <div
                                            key={`${room.id}-bed-${bedIdx}`}
                                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFFFFF] border border-[#EAE8E4]"
                                          >
                                            <span className="text-xs font-semibold text-[#2F3A35]">
                                              Bed {bedIdx + 1}
                                            </span>
                                            <div className="flex gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setRoomBedFilled(cat.type, room.id, bedIdx, false)
                                                }
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
                                                  !isFilled
                                                    ? 'bg-[#E8F5EC] text-[#5DA271] border-[#5DA271]/40'
                                                    : 'bg-white text-[#6B7280] border-[#EAE8E4]'
                                                }`}
                                              >
                                                Available
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setRoomBedFilled(cat.type, room.id, bedIdx, true)
                                                }
                                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
                                                  isFilled
                                                    ? 'bg-[#FDECEC] text-[#E56363] border-[#E56363]/40'
                                                    : 'bg-white text-[#6B7280] border-[#EAE8E4]'
                                                }`}
                                              >
                                                Filled
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                        <p className="text-[10px] text-[#6B7280] text-center">
                                          {filled} filled · {available} available of {cat.bedsPerRoom} beds
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#FAF8F4] border border-[#D8C29B] rounded-2xl text-center">
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block">Rooms</span>
                  <span className="text-lg font-extrabold text-[#2F3A35] font-number">{totalRoomCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block">Total beds</span>
                  <span className="text-lg font-extrabold text-[#2F3A35] font-number">{totalBeds}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block">Filled</span>
                  <span className="text-lg font-extrabold text-[#E56363] font-number">{totalOccupied}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] font-semibold block">Available</span>
                  <span className="text-lg font-extrabold text-[#5DA271] font-number">{totalAvailable}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Step 3: Facilities & Rules */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B9D8A]" />
                <span>Amenities</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableAmenities.map((amenity) => {
                  const selected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`p-3 rounded-2xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-[#7B9D8A] text-white border-[#7B9D8A]'
                          : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4] hover:bg-[#F3F1EC]'
                      }`}
                    >
                      <span>{amenity}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Fridge & Washing Machine placement */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-[#6B7280]">
                  For <strong>Fridge</strong> and <strong>Washing Machine</strong>, say if it is{' '}
                  <strong>per floor</strong> or <strong>one for the entire PG</strong>.
                </p>

                {(
                  [
                    {
                      key: 'fridge' as const,
                      label: 'Refrigerator / Fridge',
                      value: fridgePlacement,
                      set: setFridgePlacement,
                    },
                    {
                      key: 'washing' as const,
                      label: 'Washing Machine',
                      value: washingPlacement,
                      set: setWashingPlacement,
                    },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] space-y-2"
                  >
                    <span className="text-xs font-bold text-[#2F3A35]">{item.label}</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { value: 'None' as const, label: 'Not available' },
                          { value: 'Per Floor' as const, label: 'Per floor' },
                          { value: 'Entire PG' as const, label: 'Entire PG' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => item.set(opt.value)}
                          className={`py-2.5 px-1 rounded-xl text-[11px] font-bold border text-center transition-all ${
                            item.value === opt.value
                              ? 'bg-[#7B9D8A] text-white border-[#7B9D8A]'
                              : 'bg-white text-[#6B7280] border-[#EAE8E4]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4 pt-2 border-t border-[#F3F1EC]">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#7B9D8A]" />
                <span>Food & cooking</span>
              </h3>
              <p className="text-xs text-[#6B7280]">
                Some PGs give food and allow cooking. Some give food only. Some allow cooking only.
                Pick what matches your PG.
              </p>

              <div className="space-y-2">
                {foodServiceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFoodServiceModel(opt.value)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                      foodServiceModel === opt.value
                        ? 'bg-[#7B9D8A] text-white border-[#7B9D8A] shadow-soft-sm'
                        : 'bg-[#FFFFFF] text-[#2F3A35] border-[#EAE8E4] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{opt.label}</span>
                    <span
                      className={`text-[11px] ${
                        foodServiceModel === opt.value ? 'text-white/80' : 'text-[#6B7280]'
                      }`}
                    >
                      {opt.hint}
                    </span>
                  </button>
                ))}
              </div>

              {foodProvided && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2F3A35] mb-2">
                      What type of food do you provide?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { value: 'Veg Only' as const, label: 'Veg only' },
                          { value: 'Veg & Non-Veg' as const, label: 'Veg & Non-Veg' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setMealType(opt.value)}
                          className={`py-2.5 rounded-2xl text-xs font-bold border ${
                            mealType === opt.value
                              ? 'bg-[#D8C29B] text-[#2F3A35] border-[#7B9D8A]'
                              : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F3A35] mb-2">
                      Which meals do you provide?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Breakfast', 'Lunch', 'Dinner'].map((meal) => {
                        const sel = selectedMeals.includes(meal);
                        return (
                          <button
                            key={meal}
                            type="button"
                            onClick={() => handleToggleMeal(meal)}
                            className={`flex-1 min-w-[100px] py-2.5 rounded-2xl text-xs font-semibold border ${
                              sel
                                ? 'bg-[#D8C29B] text-[#2F3A35] border-[#7B9D8A]'
                                : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                            }`}
                          >
                            {meal}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2F3A35] mb-2">
                      How is food charged?
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {(
                        [
                          { value: 'Included in rent' as const, label: 'Included in rent', hint: 'No separate food fee' },
                          { value: 'Extra monthly' as const, label: 'Extra monthly package', hint: 'One food charge per month' },
                          { value: 'Per meal' as const, label: 'Different charge per meal', hint: 'Breakfast / Lunch / Dinner priced separately' },
                        ] as const
                      ).map((ct) => (
                        <button
                          key={ct.value}
                          type="button"
                          onClick={() => setFoodChargeType(ct.value)}
                          className={`p-3 rounded-2xl text-left border text-xs ${
                            foodChargeType === ct.value
                              ? 'bg-[#DDE9E0] border-[#7B9D8A] text-[#2F3A35]'
                              : 'bg-[#FFFFFF] border-[#EAE8E4] text-[#6B7280]'
                          }`}
                        >
                          <span className="font-bold block">{ct.label}</span>
                          <span className="text-[11px] opacity-80">{ct.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {foodChargeType === 'Extra monthly' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#2F3A35] mb-1">
                        Monthly food charge ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={monthlyFoodCharge}
                        onChange={(e) => setMonthlyFoodCharge(Number(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl font-number"
                      />
                    </div>
                  )}

                  {foodChargeType === 'Per meal' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-[#2F3A35]">
                        Charge for each meal ($)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {selectedMeals.includes('Breakfast') && (
                          <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
                            <span className="text-[11px] font-semibold text-[#6B7280]">Breakfast</span>
                            <input
                              type="number"
                              min={0}
                              value={breakfastCharge}
                              onChange={(e) => setBreakfastCharge(Number(e.target.value) || 0)}
                              className="w-full mt-1 px-3 py-2 text-sm border border-[#EAE8E4] rounded-xl font-number bg-white"
                            />
                          </div>
                        )}
                        {selectedMeals.includes('Lunch') && (
                          <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
                            <span className="text-[11px] font-semibold text-[#6B7280]">Lunch</span>
                            <input
                              type="number"
                              min={0}
                              value={lunchCharge}
                              onChange={(e) => setLunchCharge(Number(e.target.value) || 0)}
                              className="w-full mt-1 px-3 py-2 text-sm border border-[#EAE8E4] rounded-xl font-number bg-white"
                            />
                          </div>
                        )}
                        {selectedMeals.includes('Dinner') && (
                          <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4]">
                            <span className="text-[11px] font-semibold text-[#6B7280]">Dinner</span>
                            <input
                              type="number"
                              min={0}
                              value={dinnerCharge}
                              onChange={(e) => setDinnerCharge(Number(e.target.value) || 0)}
                              className="w-full mt-1 px-3 py-2 text-sm border border-[#EAE8E4] rounded-xl font-number bg-white"
                            />
                          </div>
                        )}
                      </div>
                      {selectedMeals.length === 0 && (
                        <p className="text-[11px] text-[#C9952A]">Select at least one meal above to set charges.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {cookingAvailable && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[#2F3A35] mb-2">
                    What cooking is allowed?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { value: 'Veg Only' as const, label: 'Veg cooking only' },
                        { value: 'Veg & Non-Veg' as const, label: 'Veg & Non-Veg' },
                        { value: 'Any' as const, label: 'Any cooking' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCookingType(opt.value)}
                        className={`py-2.5 rounded-2xl text-xs font-bold border ${
                          cookingType === opt.value
                            ? 'bg-[#D8C29B] text-[#2F3A35] border-[#7B9D8A]'
                            : 'bg-[#FFFFFF] text-[#6B7280] border-[#EAE8E4]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {foodServiceModel === 'No Food & No Cooking' && (
                <div className="p-3 rounded-2xl bg-[#F3F1EC] text-xs text-[#6B7280]">
                  No meals from PG and no cooking inside. Residents arrange food on their own.
                </div>
              )}
            </section>

            <section className="space-y-4 pt-2 border-t border-[#F3F1EC]">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#7B9D8A]" />
                <span>House Rules</span>
              </h3>

              <div className="space-y-2">
                {rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-xs gap-2"
                  >
                    <span>• {rule}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-[#6B7280] hover:text-[#E56363] shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Add custom rule..."
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRule();
                    }
                  }}
                  className="flex-1 px-4 py-2 text-xs bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-4 py-2 bg-[#7B9D8A] text-white rounded-2xl text-xs font-semibold"
                >
                  + Add Rule
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Step 4: Photos, Videos & Publish */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddPhotos}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleAddVideos}
            />

            {/* Photos */}
            <section className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#7B9D8A]" />
                    <span>Photos</span>
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Upload room, building, and common area photos. Tap a photo to set it as cover.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="shrink-0 px-3.5 py-2 rounded-2xl bg-[#7B9D8A] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Add photos
                </button>
              </div>

              {photos.length === 0 ? (
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full h-36 rounded-2xl border-2 border-dashed border-[#D8C29B] bg-[#FAF8F4] flex flex-col items-center justify-center gap-2 text-[#7B9D8A]"
                >
                  <Upload className="w-7 h-7" />
                  <span className="text-xs font-bold">Tap to upload photos</span>
                  <span className="text-[11px] text-[#6B7280]">JPG, PNG · multiple allowed</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((url, idx) => {
                    const isCover = coverImage === url;
                    return (
                      <div
                        key={`${url}-${idx}`}
                        className={`relative rounded-2xl overflow-hidden border-2 bg-[#FAF8F4] aspect-[4/3] ${
                          isCover ? 'border-[#7B9D8A]' : 'border-[#EAE8E4]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setCoverImage(url)}
                          className="w-full h-full"
                          title="Set as cover"
                        >
                          <img src={url} alt={`PG photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                        {isCover && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#7B9D8A] text-white text-[10px] font-bold inline-flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/55 text-white hover:bg-[#E56363]"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-[#D8C29B] bg-[#FAF8F4] aspect-[4/3] flex flex-col items-center justify-center gap-1 text-[#7B9D8A]"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[11px] font-bold">Add more</span>
                  </button>
                </div>
              )}
            </section>

            {/* Videos */}
            <section className="space-y-4 pt-2 border-t border-[#F3F1EC]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#7B9D8A]" />
                    <span>Videos</span>
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Optional room or property walkthrough videos (MP4, MOV, etc.).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="shrink-0 px-3.5 py-2 rounded-2xl bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Add videos
                </button>
              </div>

              {videos.length === 0 ? (
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-[#EAE8E4] bg-[#FFFFFF] flex flex-col items-center justify-center gap-2 text-[#6B7280]"
                >
                  <Video className="w-7 h-7 text-[#7B9D8A]" />
                  <span className="text-xs font-bold text-[#2F3A35]">Tap to upload videos</span>
                  <span className="text-[11px] text-[#6B7280]">Optional · multiple allowed</span>
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {videos.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="relative rounded-2xl overflow-hidden border border-[#EAE8E4] bg-black aspect-video"
                    >
                      <video src={url} controls className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeVideo(url)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/55 text-white hover:bg-[#E56363]"
                        title="Remove video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                        Video {idx + 1}
                      </span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-[#EAE8E4] bg-[#FFFFFF] aspect-video flex flex-col items-center justify-center gap-1 text-[#7B9D8A]"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[11px] font-bold">Add more videos</span>
                  </button>
                </div>
              )}
            </section>

            <section className="space-y-4 pt-2 border-t border-[#F3F1EC]">
              <h3 className="text-base font-bold text-[#2F3A35] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B9D8A]" />
                <span>Listing Preview</span>
              </h3>

              <div className="bg-[#FFFFFF] border border-[#EAE8E4] rounded-2xl p-5 space-y-3">
                {(coverImage || photos[0]) && (
                  <div className="h-36 rounded-xl overflow-hidden mb-2">
                    <img
                      src={coverImage || photos[0]}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-bold text-lg text-[#2F3A35]">
                      {name || "Sunrise Women's PG"}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {area}, {city}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#7B9D8A] text-white text-xs font-bold rounded-full shrink-0">
                    {category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div>
                    • Rooms: <b>{totalRoomCount}</b> · Beds: <b>{totalBeds}</b>
                  </div>
                  <div>
                    • Filled: <b className="text-[#E56363]">{totalOccupied}</b> · Available:{' '}
                    <b className="text-[#5DA271]">{totalAvailable}</b>
                  </div>
                  <div>
                    • Photos: <b>{photos.length}</b> · Videos: <b>{videos.length}</b>
                  </div>
                  <div>
                    • Rent Range: <b>{rentRange()}</b>
                  </div>
                  <div>
                    • Amenities: <b>{buildAmenityList().length} selected</b>
                    {fridgePlacement !== 'None' && (
                      <> · Fridge: <b>{fridgePlacement}</b></>
                    )}
                    {washingPlacement !== 'None' && (
                      <> · Wash: <b>{washingPlacement}</b></>
                    )}
                  </div>
                  <div>
                    • Food & cooking: <b>{foodServiceModel}</b>
                    {foodProvided && selectedMeals.length > 0 && (
                      <> · {mealType} · {selectedMeals.join(', ')} ({foodChargeType})</>
                    )}
                    {cookingAvailable && <> · Cooking: <b>{cookingType}</b></>}
                  </div>
                </div>
              </div>

              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#E8F5EC] text-[#5DA271] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                  Review looks good? Publish to make this PG live for tenants on StayNest.
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-[#7B9D8A] text-white font-bold text-sm rounded-2xl hover:bg-[#6D8F7D] shadow-soft-md"
                >
                  Publish PG Listing
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Sticky footer controls */}
      <div className="sticky bottom-4 bg-white border border-[#EAE8E4] rounded-[24px] p-4 shadow-soft-md flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            currentStep === 1
              ? 'opacity-40 cursor-not-allowed text-[#6B7280]'
              : 'bg-[#FFFFFF] border border-[#EAE8E4] text-[#2F3A35] hover:bg-[#F3F1EC]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep < 4 ? (
          <button
            type="button"
            disabled={!canProceed()}
            onClick={goNext}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-soft-sm ${
              canProceed()
                ? 'bg-[#7B9D8A] text-white hover:bg-[#6D8F7D]'
                : 'bg-[#EAE8E4] text-[#6B7280] cursor-not-allowed'
            }`}
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#7B9D8A] text-white text-xs font-semibold hover:bg-[#6D8F7D] transition-all shadow-soft-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Now</span>
          </button>
        )}
      </div>
    </div>
  );
};
