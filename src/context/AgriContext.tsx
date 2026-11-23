import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_EQUIPMENT_LISTINGS, DEFAULT_LEDGER_ENTRIES } from '../data/agriData';
import type {
  CropType,
  DiagnosisRecord,
  EquipmentListing,
  KisanSetuPersistedState,
  Language,
  LedgerEntry,
  SymptomType,
  UrgencyLevel,
} from '../types/agri';

const STORAGE_KEY = 'kisansetu_offline_cache_v1';
const STATE_VERSION = 1;

function createInitialState(): KisanSetuPersistedState {
  return {
    version: STATE_VERSION,
    language: 'en',
    farmAcreage: 4.5,
    mandiQuantityQuintals: 40,
    transportRatePerKmPerQuintal: 3.5,
    equipmentListings: DEFAULT_EQUIPMENT_LISTINGS,
    ledgerEntries: DEFAULT_LEDGER_ENTRIES,
    diagnosisHistory: [],
    lastSyncedAt: new Date().toISOString(),
  };
}

function loadCachedState(): KisanSetuPersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<KisanSetuPersistedState>;
    const initial = createInitialState();
    return {
      version: STATE_VERSION,
      language: parsed.language === 'hi' ? 'hi' : 'en',
      farmAcreage:
        typeof parsed.farmAcreage === 'number' && parsed.farmAcreage > 0
          ? parsed.farmAcreage
          : initial.farmAcreage,
      mandiQuantityQuintals:
        typeof parsed.mandiQuantityQuintals === 'number' && parsed.mandiQuantityQuintals > 0
          ? parsed.mandiQuantityQuintals
          : initial.mandiQuantityQuintals,
      transportRatePerKmPerQuintal:
        typeof parsed.transportRatePerKmPerQuintal === 'number' &&
        parsed.transportRatePerKmPerQuintal >= 0
          ? parsed.transportRatePerKmPerQuintal
          : initial.transportRatePerKmPerQuintal,
      equipmentListings:
        Array.isArray(parsed.equipmentListings) && parsed.equipmentListings.length > 0
          ? parsed.equipmentListings
          : initial.equipmentListings,
      ledgerEntries: Array.isArray(parsed.ledgerEntries)
        ? parsed.ledgerEntries
        : initial.ledgerEntries,
      diagnosisHistory: Array.isArray(parsed.diagnosisHistory)
        ? parsed.diagnosisHistory
        : initial.diagnosisHistory,
      lastSyncedAt: parsed.lastSyncedAt ?? initial.lastSyncedAt,
    };
  } catch {
    return createInitialState();
  }
}

interface AgriContextValue {
  state: KisanSetuPersistedState;
  setLanguage: (lang: Language) => void;
  setMandiInputs: (quintals: number, ratePerKmPerQuintal: number) => void;
  setFarmAcreage: (acres: number) => void;
  toggleEquipmentBooking: (equipmentId: string) => void;
  addEquipmentListing: (listing: Omit<EquipmentListing, 'id'>) => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
  deleteLedgerEntry: (entryId: string) => void;
  saveDiagnosisRecord: (record: {
    crop: CropType;
    symptom: SymptomType;
    likelyCause: string;
    urgency: UrgencyLevel;
    photoDataUrl?: string;
  }) => void;
  resetOfflineCache: () => void;
}

const AgriContext = createContext<AgriContextValue | null>(null);

export function AgriProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KisanSetuPersistedState>(() => loadCachedState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Handle localStorage quota gracefully
    }
  }, [state]);

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const setMandiInputs = useCallback((quintals: number, ratePerKmPerQuintal: number) => {
    setState((prev) => ({
      ...prev,
      mandiQuantityQuintals: Math.max(1, quintals),
      transportRatePerKmPerQuintal: Math.max(0, ratePerKmPerQuintal),
    }));
  }, []);

  const setFarmAcreage = useCallback((acres: number) => {
    setState((prev) => ({
      ...prev,
      farmAcreage: Math.max(0.5, acres),
    }));
  }, []);

  const toggleEquipmentBooking = useCallback((equipmentId: string) => {
    setState((prev) => ({
      ...prev,
      equipmentListings: prev.equipmentListings.map((eq) =>
        eq.id === equipmentId
          ? {
              ...eq,
              bookedByMe: !eq.bookedByMe,
            }
          : eq,
      ),
    }));
  }, []);

  const addEquipmentListing = useCallback((listing: Omit<EquipmentListing, 'id'>) => {
    const newItem: EquipmentListing = {
      ...listing,
      id: `eq-custom-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      equipmentListings: [newItem, ...prev.equipmentListings],
    }));
  }, []);

  const addLedgerEntry = useCallback((entry: Omit<LedgerEntry, 'id'>) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: `led-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      ledgerEntries: [newEntry, ...prev.ledgerEntries],
    }));
  }, []);

  const deleteLedgerEntry = useCallback((entryId: string) => {
    setState((prev) => ({
      ...prev,
      ledgerEntries: prev.ledgerEntries.filter((e) => e.id !== entryId),
    }));
  }, []);

  const saveDiagnosisRecord = useCallback(
    (record: {
      crop: CropType;
      symptom: SymptomType;
      likelyCause: string;
      urgency: UrgencyLevel;
      photoDataUrl?: string;
    }) => {
      const entry: DiagnosisRecord = {
        ...record,
        id: `diag-${Date.now()}`,
        diagnosedAt: new Date().toISOString(),
      };
      setState((prev) => ({
        ...prev,
        diagnosisHistory: [entry, ...prev.diagnosisHistory].slice(0, 15),
      }));
    },
    [],
  );

  const resetOfflineCache = useCallback(() => {
    setState(createInitialState());
  }, []);

  const value = useMemo<AgriContextValue>(
    () => ({
      state,
      setLanguage,
      setMandiInputs,
      setFarmAcreage,
      toggleEquipmentBooking,
      addEquipmentListing,
      addLedgerEntry,
      deleteLedgerEntry,
      saveDiagnosisRecord,
      resetOfflineCache,
    }),
    [
      state,
      setLanguage,
      setMandiInputs,
      setFarmAcreage,
      toggleEquipmentBooking,
      addEquipmentListing,
      addLedgerEntry,
      deleteLedgerEntry,
      saveDiagnosisRecord,
      resetOfflineCache,
    ],
  );

  return <AgriContext.Provider value={value}>{children}</AgriContext.Provider>;
}

export function useAgri() {
  const ctx = useContext(AgriContext);
  if (!ctx) throw new Error('useAgri must be used within an AgriProvider');
  return ctx;
}
