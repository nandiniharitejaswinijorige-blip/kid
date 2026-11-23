import type { CropType, Language, SymptomType } from '../types/agri';

export const CROP_LABELS: Record<CropType, { en: string; hi: string; season: string }> = {
  rice: { en: 'Rice / Paddy', hi: 'धान (चावल)', season: 'Kharif' },
  wheat: { en: 'Wheat', hi: 'गेहूँ', season: 'Rabi' },
  cotton: { en: 'Cotton', hi: 'कपास', season: 'Kharif' },
  tomato: { en: 'Tomato', hi: 'टमाटर', season: 'All Season' },
  chili: { en: 'Chili', hi: 'मिर्च', season: 'All Season' },
  maize: { en: 'Maize', hi: 'मक्का', season: 'Kharif / Rabi' },
};

export const SYMPTOM_LABELS: Record<SymptomType, { en: string; hi: string; hint: string }> = {
  yellowing: {
    en: 'Yellowing Leaves',
    hi: 'पत्तियों का पीला पड़ना',
    hint: 'Pale green or bright yellow streaks on lower or upper leaves',
  },
  'brown-spots': {
    en: 'Brown / Black Spots',
    hi: 'भूरे या काले धब्बे',
    hint: 'Circular rings, water-soaked lesions, or powdery patches',
  },
  wilting: {
    en: 'Wilting / Drooping',
    hi: 'पौधे का मुरझाना',
    hint: 'Leaves curl and droop even when soil has moisture',
  },
  pests: {
    en: 'Stem Borer / Pests',
    hi: 'तना छेदक / कीट',
    hint: 'Holes in stems/fruit, chewed leaves, or tiny insects underneath',
  },
};

export const UI_TEXT: Record<
  Language,
  {
    brandTagline: string;
    navMandi: string;
    navWeather: string;
    navEquipment: string;
    navLedger: string;
    ctaCropDoctor: string;
    heroTitle: string;
    heroSubtitle: string;
    quickDiagnose: string;
    quickMandi: string;
    quickEquipment: string;
    quickLedger: string;
    todaysWeatherAction: string;
    mandiHeading: string;
    mandiSubtitle: string;
    weatherHeading: string;
    weatherSubtitle: string;
    equipmentHeading: string;
    equipmentSubtitle: string;
    ledgerHeading: string;
    ledgerSubtitle: string;
    cropDoctorTitle: string;
    stepSelectCrop: string;
    stepSelectSymptom: string;
    stepActionCard: string;
    organicFirst: string;
    chemicalDosage: string;
    safetyPrecautions: string;
  }
> = {
  en: {
    brandTagline: 'Offline-Ready Field Companion · Two-Tap Farm Decisions',
    navMandi: 'Mandi Rates',
    navWeather: '7-Day Weather',
    navEquipment: 'Equipment',
    navLedger: 'Khatabook',
    ctaCropDoctor: 'Crop Doctor',
    heroTitle: 'Practical, Profit-Protecting Decisions in Your Pocket',
    heroSubtitle:
      'Diagnose leaf diseases, calculate real net mandi take-home pay, check safe spray windows, rent village machinery, and track per-acre profit.',
    quickDiagnose: 'Diagnose Crop',
    quickMandi: 'Compare Mandi Net Profit',
    quickEquipment: 'Rent Farm Tools',
    quickLedger: 'Log Expense / Sale',
    todaysWeatherAction: "Today's Field Action Advisory",
    mandiHeading: 'Live Mandi Price & Net Take-Home Calculator',
    mandiSubtitle:
      'Compare modal rates across nearby mandis minus transport cost to pick your highest-profit market.',
    weatherHeading: '7-Day Farm Action Weather Advisory',
    weatherSubtitle:
      'Forecasts translated directly into spray, irrigation, fungal risk, and harvest decisions.',
    equipmentHeading: 'Village Equipment & Custom Hiring Board',
    equipmentSubtitle:
      'Rent tractors, sprayers, harvesters, and water pumps directly from verified local owners.',
    ledgerHeading: 'Season Expense & Harvest Ledger (Khatabook)',
    ledgerSubtitle:
      'Track seeds, fertilizer, labor, and diesel against harvest revenue for real-time profit per acre.',
    cropDoctorTitle: 'Crop Doctor & Symptom Triage',
    stepSelectCrop: '1. Select Your Crop',
    stepSelectSymptom: '2. Pick Visible Symptom & Photo',
    stepActionCard: '3. Immediate Action Card',
    organicFirst: 'Organic / Low-Cost Remedy First',
    chemicalDosage: 'Chemical Treatment Dosage (Per Acre)',
    safetyPrecautions: 'Field Safety Precautions',
  },
  hi: {
    brandTagline: 'ऑफ़लाइन तैयार किसान साथी · दो टैप में सही निर्णय',
    navMandi: 'मंडी भाव',
    navWeather: '7-दिन मौसम',
    navEquipment: 'कृषि यंत्र',
    navLedger: 'खाताबही',
    ctaCropDoctor: 'फसल डॉक्टर',
    heroTitle: 'खेती के हर दिन के सही और मुनाफे वाले फैसले आपकी जेब में',
    heroSubtitle:
      'फसल रोग की तुरंत जांच, नजदीकी मंडी का शुद्ध मुनाफा, छिड़काव मौसम सलाह, गांव के कृषि यंत्र किराये पर, और प्रति एकड़ हिसाब।',
    quickDiagnose: 'फसल जांच करें',
    quickMandi: 'मंडी मुनाफा देखें',
    quickEquipment: 'यंत्र किराये पर लें',
    quickLedger: 'खर्च / बिक्री लिखें',
    todaysWeatherAction: 'आज की खेत कार्य सलाह',
    mandiHeading: 'मंडी भाव और शुद्ध मुनाफा कैलकुलेटर',
    mandiSubtitle:
      'किराया घटाकर जानें कि किस मंडी में फसल बेचने पर आपको सबसे ज्यादा शुद्ध लाभ मिलेगा।',
    weatherHeading: '7-दिन कृषि मौसम सलाह',
    weatherSubtitle:
      'बारिश, हवा और नमी के आधार पर छिड़काव, सिंचाई और कटाई का सीधा निर्णय।',
    equipmentHeading: 'गांव कृषि यंत्र किराया बोर्ड',
    equipmentSubtitle:
      'ट्रैक्टर, स्प्रेयर, हार्वेस्टर और पंप सीधे गांव के मालिकों से कॉल या व्हाट्सऐप पर बुक करें।',
    ledgerHeading: 'सीज़न खर्च और फसल बिक्री (खाताबही)',
    ledgerSubtitle:
      'बीज, खाद, मजदूरी और डीजल खर्च के साथ प्रति एकड़ शुद्ध लाभ तुरंत देखें।',
    cropDoctorTitle: 'फसल डॉक्टर और लक्षण जांच',
    stepSelectCrop: '1. अपनी फसल चुनें',
    stepSelectSymptom: '2. लक्षण चुनें और फोटो अपलोड करें',
    stepActionCard: '3. तुरंत उपचार कार्ड',
    organicFirst: 'जैविक / कम लागत का पहला उपाय',
    chemicalDosage: 'रासायनिक छिड़काव मात्रा (प्रति एकड़)',
    safetyPrecautions: 'खेत सुरक्षा सावधानियाँ',
  },
};
