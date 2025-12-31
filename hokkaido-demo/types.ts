
export interface LocationDetail {
  id: string;
  title: string;
  description: string;
  address?: string;
  openingHours?: string;
  mapUrl?: string;
  websiteUrl?: string;
  carNaviPhone?: string;
  imageUrl?: string;
  transitLegs?: TransitLeg[];
  reservation?: {
    id: string;
    sections: ReservationSection[];
  };
}

export interface ReservationSection {
  title: string;
  items: { label: string; value: string; isFullWidth?: boolean }[];
}

export interface TransitLeg {
  type: 'bus' | 'walk' | 'train' | 'wait';
  transport: string;
  depTime: string;
  depStop: string;
  arrTime: string;
  arrStop: string;
  details: string[];
}

export interface ItineraryEvent {
  time: string;
  description: string;
  isHighlight?: boolean;
  note?: string;
  locationId?: string;
}

export interface DaySchedule {
  date: string;
  weekday: string;
  title: string;
  accommodation?: string;
  accommodationMapUrl?: string;
  mapUrl?: string;
  events: ItineraryEvent[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
}

export interface UsefulLink {
  title: string;
  url: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  note?: string;
}

export interface ShoppingItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ExpenseRecord {
  rowIndex: number;
  date: string;
  item: string;
  payer: '小 A' | '小 B';
  amountTwd: number;
  amountJpy: number;
  note: string;
  splitType: 'equal' | 'manual';
  splitATwd: number;
  splitAJpy: number;
  splitBTwd: number;
  splitBJpy: number;
}

export enum Tab {
  ITINERARY = 'Itinerary',
  PREP = 'Prep',
  COST = 'Cost',
  PACKING = 'Packing',
  SHOPPING = 'Shopping',
  INFO = 'Info'
}
