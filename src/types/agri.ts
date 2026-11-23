export type Language = 'en' | 'hi';

export type CropType = 'rice' | 'wheat' | 'cotton' | 'tomato' | 'chili' | 'maize';

export type SymptomType = 'yellowing' | 'brown-spots' | 'wilting' | 'pests';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface CropDiagnosis {
  id: string;
  crop: CropType;
  symptom: SymptomType;
  likelyCause: string;
  likelyCauseHi: string;
  scientificName: string;
  urgency: UrgencyLevel;
  organicRemedy: string[];
  chemicalDosage: string;
  safetyPrecautions: string[];
  preventionTip: string;
}

export interface DiagnosisRecord {
  id: string;
  crop: CropType;
  symptom: SymptomType;
  likelyCause: string;
  urgency: UrgencyLevel;
  photoDataUrl?: string;
  diagnosedAt: string;
}

export interface MandiRate {
  id: string;
  mandiName: string;
  mandiNameHi: string;
  district: string;
  crop: CropType;
  distanceKm: number;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  trend: 'up' | 'down' | 'flat';
  trendDelta: number;
  arrivalsTonnes: number;
  updatedAt: string;
}

export type WeatherDecision =
  | 'safe-spray'
  | 'delay-irrigation'
  | 'fungal-alert'
  | 'harvest-window';

export interface WeatherAdvisory {
  id: string;
  dayLabel: string;
  dayLabelHi: string;
  dateStr: string;
  condition: 'sunny' | 'cloudy' | 'rain' | 'windy';
  tempMaxC: number;
  tempMinC: number;
  rainProbPct: number;
  windKmh: number;
  humidityPct: number;
  decision: WeatherDecision;
  decisionLabel: string;
  decisionLabelHi: string;
  actionNote: string;
  actionNoteHi: string;
}

export type EquipmentCategory = 'tractor' | 'sprayer' | 'harvester' | 'pump';

export interface EquipmentListing {
  id: string;
  name: string;
  nameHi: string;
  category: EquipmentCategory;
  rateAmount: number;
  rateUnit: 'hour' | 'acre' | 'day';
  ownerName: string;
  village: string;
  distanceKm: number;
  phone: string;
  available: boolean;
  specs: string;
  imageUrl?: string;
  bookedByMe?: boolean;
}

export type LedgerEntryType = 'expense' | 'revenue';

export type LedgerCategory =
  | 'seeds'
  | 'fertilizer'
  | 'labor'
  | 'diesel'
  | 'equipment'
  | 'harvest-sale';

export interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerEntryType;
  category: LedgerCategory;
  title: string;
  crop: CropType;
  amountInr: number;
  notes?: string;
}

export type AgriTab = 'mandi' | 'weather' | 'equipment' | 'ledger';

export interface KisanSetuPersistedState {
  version: number;
  language: Language;
  farmAcreage: number;
  mandiQuantityQuintals: number;
  transportRatePerKmPerQuintal: number;
  equipmentListings: EquipmentListing[];
  ledgerEntries: LedgerEntry[];
  diagnosisHistory: DiagnosisRecord[];
  lastSyncedAt: string;
}
