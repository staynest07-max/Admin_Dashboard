import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, DoorOpen } from 'lucide-react';
import { BuildingSection, PGRoom } from '../../types/merchant';
import {
  groupRoomsByBuilding,
  inferRoomStatus,
  roomStatusColor,
  roomStatusLabel,
} from '../../utils/occupancyUtils';

interface OccupancyHierarchyPanelProps {
  rooms: PGRoom[];
  compact?: boolean;
}

export const OccupancyHierarchyPanel: React.FC<OccupancyHierarchyPanelProps> = ({
  rooms,
  compact = false,
}) => {
  const hierarchy = groupRoomsByBuilding(rooms);
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(hierarchy.map((b) => [b.building, true]))
  );
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    hierarchy.forEach((b) =>
      b.sections.forEach((s) => {
        init[`${b.building}::${s.label}`] = true;
      })
    );
    return init;
  });

  if (rooms.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#EAE8E4] text-center text-xs text-[#6B7280]">
        No room-level data yet. Add rooms with building and floor details when creating a PG.
      </div>
    );
  }

  const toggleBuilding = (name: string) => {
    setExpandedBuildings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`space-y-3 ${compact ? '' : 'space-y-4'}`}>
      {hierarchy.map((building: BuildingSection) => {
        const buildingOpen = expandedBuildings[building.building] !== false;

        return (
          <div
            key={building.building}
            className="rounded-2xl border border-[#EAE8E4] bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleBuilding(building.building)}
              className="w-full flex items-center justify-between gap-3 p-4 bg-[#FAF8F4] hover:bg-[#DDE9E0] transition-all text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-[#7B9D8A] text-white shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-[#2F3A35] truncate">{building.building}</span>
              </div>
              {buildingOpen ? (
                <ChevronUp className="w-4 h-4 text-[#6B7280] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
              )}
            </button>

            {buildingOpen && (
              <div className="p-3 space-y-2">
                {building.sections.map((section) => {
                  const sectionKey = `${building.building}::${section.label}`;
                  const sectionOpen = expandedSections[sectionKey] !== false;

                  return (
                    <div key={sectionKey} className="rounded-xl border border-[#F3F1EC] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionKey)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-[#FFFFFF] hover:bg-[#F3F1EC] text-left"
                      >
                        <span className="text-xs font-bold text-[#2F3A35]">{section.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6B7280] font-semibold">
                            {section.rooms.length} room{section.rooms.length !== 1 ? 's' : ''}
                          </span>
                          {sectionOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#6B7280]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                          )}
                        </div>
                      </button>

                      {sectionOpen && (
                        <div className="divide-y divide-[#F3F1EC]">
                          {section.rooms.map((room) => {
                            const status = inferRoomStatus(room);
                            const colors = roomStatusColor(status);

                            return (
                              <div
                                key={room.id}
                                className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-[#FFFFFF]"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <DoorOpen className="w-3.5 h-3.5 text-[#7B9D8A] shrink-0" />
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-[#2F3A35]">
                                      Room {room.roomNumber}
                                    </span>
                                    {!compact && (
                                      <span className="text-[10px] text-[#6B7280] ml-1.5">
                                        · {room.type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
                                >
                                  {roomStatusLabel(room)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
