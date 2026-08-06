import {
  BuildingSection,
  OccupancyForecast,
  PGRoom,
  PGListing,
  ResidentStay,
  RoomOccupancyStatus,
} from '../types/merchant';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDate(value: string): Date {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function inferRoomStatus(room: PGRoom): RoomOccupancyStatus {
  if (room.displayStatus) return room.displayStatus;

  const vacant = Math.max(room.totalBeds - room.occupiedBeds, 0);
  if (room.occupiedBeds >= room.totalBeds && room.totalBeds > 0) return 'full';
  if (room.occupiedBeds === 0) return 'vacant';
  return 'partial';
}

export function roomStatusLabel(room: PGRoom): string {
  const status = inferRoomStatus(room);
  const vacant = Math.max(room.totalBeds - room.occupiedBeds, 0);

  switch (status) {
    case 'full':
      return 'Full';
    case 'vacant':
      return vacant === 1 ? '1 Vacant' : `${vacant} Vacant`;
    case 'partial':
      return `${room.occupiedBeds}/${room.totalBeds} Occupied`;
    case 'waiting_list':
      return room.waitingListCount
        ? `Waiting List (${room.waitingListCount})`
        : 'Waiting List';
    case 'available_tomorrow':
      return room.availableFrom
        ? `Available ${formatShortDate(parseDate(room.availableFrom))}`
        : 'Available Tomorrow';
    case 'notice_period':
      return `${room.occupiedBeds}/${room.totalBeds} · Notice`;
    default:
      return `${room.occupiedBeds}/${room.totalBeds} Occupied`;
  }
}

export function roomStatusColor(status: RoomOccupancyStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'full':
      return { bg: 'bg-[#FDECEC]', text: 'text-[#E56363]', border: 'border-[#F5C4C4]' };
    case 'vacant':
      return { bg: 'bg-[#E8F5EC]', text: 'text-[#5DA271]', border: 'border-[#C5E3CF]' };
    case 'partial':
      return { bg: 'bg-[#FAF8F4]', text: 'text-[#7B9D8A]', border: 'border-[#D8C29B]' };
    case 'waiting_list':
      return { bg: 'bg-[#E8F1FA]', text: 'text-[#6F9BD1]', border: 'border-[#C5D9F0]' };
    case 'available_tomorrow':
      return { bg: 'bg-[#DDE9E0]', text: 'text-[#6D8F7D]', border: 'border-[#D8C29B]' };
    case 'notice_period':
      return { bg: 'bg-[#FFF8E7]', text: 'text-[#C9952A]', border: 'border-[#F2B94B]' };
    default:
      return { bg: 'bg-[#FFFFFF]', text: 'text-[#6B7280]', border: 'border-[#EAE8E4]' };
  }
}

export function getPgTotals(pg: PGListing) {
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

  return { totalBeds, availableBeds, occupiedBeds, occupancyPct };
}

export function groupRoomsByBuilding(rooms: PGRoom[]): BuildingSection[] {
  const buildingMap = new Map<string, Map<string, PGRoom[]>>();

  rooms.forEach((room) => {
    const building = room.building || 'Main Building';
    const section = room.wing || room.floor || 'Ground Floor';

    if (!buildingMap.has(building)) buildingMap.set(building, new Map());
    const sectionMap = buildingMap.get(building)!;
    if (!sectionMap.has(section)) sectionMap.set(section, []);
    sectionMap.get(section)!.push(room);
  });

  return Array.from(buildingMap.entries()).map(([building, sectionMap]) => ({
    building,
    sections: Array.from(sectionMap.entries()).map(([label, sectionRooms]) => ({
      label,
      rooms: sectionRooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })),
    })),
  }));
}

export function computeOccupancyForecast(
  pg: PGListing,
  residents: ResidentStay[],
  referenceDate = new Date()
): OccupancyForecast {
  const pgResidents = residents.filter((r) => r.pgId === pg.id && r.status !== 'Moved Out');
  const { totalBeds, occupiedBeds } = getPgTotals(pg);
  const nextWeek = addDays(referenceDate, 7);
  const nextMonth = addDays(referenceDate, 30);

  const bedsVacantNextWeek: OccupancyForecast['bedsVacantNextWeek'] = [];
  const upcomingMoveOuts: OccupancyForecast['upcomingMoveOuts'] = [];
  const expiringAgreements: OccupancyForecast['expiringAgreements'] = [];

  pgResidents.forEach((resident) => {
    if (resident.moveOutDate) {
      const moveOut = parseDate(resident.moveOutDate);
      const days = daysBetween(referenceDate, moveOut);

      if (moveOut >= referenceDate && moveOut <= nextWeek) {
        upcomingMoveOuts.push({
          tenantName: resident.tenantName,
          roomNumber: resident.roomNumber,
          building: resident.building,
          moveOutDate: formatShortDate(moveOut),
          bedsFreeing: 1,
        });

        const room = pg.rooms.find((r) => r.roomNumber === resident.roomNumber);
        bedsVacantNextWeek.push({
          roomNumber: resident.roomNumber,
          building: resident.building || room?.building || 'Main Building',
          floorOrWing: room?.wing || room?.floor,
          bedsBecomingVacant: 1,
          date: formatShortDate(moveOut),
          reason: `${resident.tenantName} moving out`,
        });
      }
    }

    if (resident.agreementEndDate) {
      const agreementEnd = parseDate(resident.agreementEndDate);
      const daysLeft = daysBetween(referenceDate, agreementEnd);

      if (daysLeft >= 0 && daysLeft <= 30) {
        expiringAgreements.push({
          tenantName: resident.tenantName,
          roomNumber: resident.roomNumber,
          building: resident.building,
          agreementEndDate: formatShortDate(agreementEnd),
          daysLeft,
        });
      }
    }
  });

  pg.rooms.forEach((room) => {
    if (room.displayStatus === 'available_tomorrow' && room.availableFrom) {
      const availDate = parseDate(room.availableFrom);
      if (availDate <= nextWeek) {
        const vacant = Math.max(room.totalBeds - room.occupiedBeds, 0);
        bedsVacantNextWeek.push({
          roomNumber: room.roomNumber,
          building: room.building || 'Main Building',
          floorOrWing: room.wing || room.floor,
          bedsBecomingVacant: vacant || 1,
          date: formatShortDate(availDate),
          reason: 'Room becoming available',
        });
      }
    }
  });

  const moveOutsByNextMonth = pgResidents.filter((r) => {
    if (!r.moveOutDate) return false;
    const d = parseDate(r.moveOutDate);
    return d >= referenceDate && d <= nextMonth;
  }).length;

  const expectedOccupied = Math.max(occupiedBeds - moveOutsByNextMonth, 0);
  const expectedRate = totalBeds > 0 ? Math.round((expectedOccupied / totalBeds) * 100) : 0;
  const todayRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return {
    bedsVacantNextWeek: bedsVacantNextWeek.sort(
      (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
    ),
    upcomingMoveOuts: upcomingMoveOuts.sort(
      (a, b) => parseDate(a.moveOutDate).getTime() - parseDate(b.moveOutDate).getTime()
    ),
    expiringAgreements: expiringAgreements.sort((a, b) => a.daysLeft - b.daysLeft),
    expectedNextMonth: {
      occupancyRate: expectedRate,
      occupiedBeds: expectedOccupied,
      totalBeds,
      changeFromToday: expectedRate - todayRate,
    },
  };
}
