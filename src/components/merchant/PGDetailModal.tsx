import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Bed, 
  DollarSign, 
  Sparkles, 
  Utensils, 
  ShieldAlert, 
  Image as ImageIcon, 
  CheckCircle2, 
  X,
  Edit3,
  Star,
  Save
} from 'lucide-react';
import { PGListing, PGRoom } from '../../types/merchant';

interface PGDetailModalProps {
  pg: PGListing | null;
  onClose: () => void;
  onSavePG: (updatedPG: PGListing) => void;
}

export const PGDetailModal: React.FC<PGDetailModalProps> = ({
  pg,
  onClose,
  onSavePG
}) => {
  if (!pg) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pg.name);
  const [address, setAddress] = useState(pg.address);
  const [city, setCity] = useState(pg.city);
  const [area, setArea] = useState(pg.area);
  const [monthlyRent, setMonthlyRent] = useState(pg.monthlyRent);
  const [availableBeds, setAvailableBeds] = useState(pg.availableBeds);

  const handleSave = () => {
    const updated: PGListing = {
      ...pg,
      name,
      address,
      city,
      area,
      monthlyRent,
      availableBeds
    };
    onSavePG(updated);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#EAE8E4] rounded-[28px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-soft-lg space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#6B7280] hover:text-[#2F3A35] rounded-xl hover:bg-[#F3F1EC]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Header */}
        <div className="relative h-48 rounded-2xl overflow-hidden bg-[#FAF8F4]">
          <img src={pg.coverImage} alt={pg.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5EC] text-[#5DA271] border border-[#5DA271]/30">
              {pg.status}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#7B9D8A] border border-[#D8C29B]">
              {pg.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-bold text-xl text-[#2F3A35] border border-[#EAE8E4] rounded-xl px-3 py-1"
                />
              ) : (
                <h2 className="font-bold text-2xl text-[#2F3A35]">{pg.name}</h2>
              )}
              <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7B9D8A]" />
                <span>{pg.address}, {pg.area}, {pg.city}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-4 py-2 bg-[#7B9D8A] text-white text-xs font-bold rounded-2xl shadow-soft-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-[#DDE9E0] border border-[#D8C29B] text-[#7B9D8A] text-xs font-semibold rounded-2xl"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit PG</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#F3F1EC] text-xs">
            <div>
              <span className="text-[#6B7280] block">Available Beds</span>
              <span className="font-bold text-sm text-[#2F3A35] font-number">{pg.availableBeds} Beds</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Monthly Rent</span>
              <span className="font-bold text-sm text-[#7B9D8A] font-number">${pg.monthlyRent}/mo</span>
            </div>
            <div>
              <span className="text-[#6B7280] block">Rating</span>
              <span className="font-bold text-sm text-[#2F3A35] font-number flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F4B740] fill-current" />
                <span>{pg.rating} ({pg.reviewCount} Reviews)</span>
              </span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="font-bold text-xs text-[#2F3A35] mb-2 uppercase tracking-wider">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {pg.amenities.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-[#F3F1EC] text-[#2F3A35] border border-[#EAE8E4] text-xs font-medium rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Food Facility */}
          {pg.foodDetails && (
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#D8C29B] text-xs space-y-1">
              <h4 className="font-bold text-[#2F3A35] flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#7B9D8A]" />
                <span>Food: {pg.foodDetails.type}</span>
              </h4>
              {pg.foodDetails.meals.length > 0 && (
                <p className="text-[#2F3A35]">Meals: {pg.foodDetails.meals.join(', ')}</p>
              )}
              {pg.foodDetails.chargeType && (
                <p className="text-[#2F3A35]">
                  Charges: {pg.foodDetails.chargeType}
                  {pg.foodDetails.monthlyFoodCharge != null
                    ? ` · $${pg.foodDetails.monthlyFoodCharge}/mo`
                    : ''}
                </p>
              )}
              {pg.foodDetails.mealCharges &&
                Object.entries(pg.foodDetails.mealCharges).map(([meal, amt]) => (
                  <p key={meal} className="text-[#2F3A35]">
                    {meal}: ${amt}
                  </p>
                ))}
            </div>
          )}

          {/* Rules */}
          {pg.rules && pg.rules.length > 0 && (
            <div>
              <h4 className="font-bold text-xs text-[#2F3A35] mb-2 uppercase tracking-wider">PG House Rules</h4>
              <ul className="space-y-1.5 text-xs text-[#6B7280]">
                {pg.rules.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B9D8A]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
