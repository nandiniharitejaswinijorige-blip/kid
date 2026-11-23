import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  FlaskConical,
  Leaf,
  ShieldAlert,
  Sparkles,
  Sprout,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAgri } from '../context/AgriContext';
import { CROP_DIAGNOSES } from '../data/agriData';
import { CROP_LABELS, SYMPTOM_LABELS, UI_TEXT } from '../data/i18n';
import type { CropType, SymptomType, UrgencyLevel } from '../types/agri';

interface CropDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavedToLedger?: () => void;
}

const CROPS: CropType[] = ['rice', 'wheat', 'cotton', 'tomato', 'chili', 'maize'];
const SYMPTOMS: SymptomType[] = ['yellowing', 'brown-spots', 'wilting', 'pests'];

function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  if (level === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-3 py-1 text-sm font-extrabold text-red-900">
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>HIGH URGENCY · Act Within 24–48 hrs</span>
      </span>
    );
  }
  if (level === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-extrabold text-amber-950">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>MEDIUM URGENCY · Treat Within 3–4 Days</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-950">
      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>LOW URGENCY · Preventive Care</span>
    </span>
  );
}

export function CropDoctorModal({
  isOpen,
  onClose,
  onSavedToLedger,
}: CropDoctorModalProps) {
  const { state, saveDiagnosisRecord, addLedgerEntry } = useAgri();
  const lang = state.language;
  const t = UI_TEXT[lang];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType>('rice');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomType>('brown-spots');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [loggedTreatment, setLoggedTreatment] = useState(false);

  if (!isOpen) return null;

  const diagnosis =
    CROP_DIAGNOSES.find(
      (d) => d.crop === selectedCrop && d.symptom === selectedSymptom,
    ) ?? CROP_DIAGNOSES[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRunDiagnosis = () => {
    saveDiagnosisRecord({
      crop: selectedCrop,
      symptom: selectedSymptom,
      likelyCause: diagnosis.likelyCause,
      urgency: diagnosis.urgency,
      photoDataUrl: photoPreviewUrl ?? undefined,
    });
    setLoggedTreatment(false);
    setStep(3);
  };

  const handleLogSprayCost = () => {
    addLedgerEntry({
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      category: 'fertilizer',
      title: `Crop Treatment: ${diagnosis.likelyCause}`,
      crop: selectedCrop,
      amountInr: 650,
      notes: 'Logged from Crop Doctor Action Card',
    });
    setLoggedTreatment(true);
    if (onSavedToLedger) {
      window.setTimeout(onSavedToLedger, 500);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setLoggedTreatment(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-doctor-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm sm:p-5"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-stone-200 bg-[#FAFAF9] p-5 shadow-2xl sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white">
              <Sprout className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="crop-doctor-title"
                className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl"
              >
                {t.cropDoctorTitle}
              </h2>
              <p className="text-sm font-semibold text-slate-600">
                {step === 1
                  ? t.stepSelectCrop
                  : step === 2
                    ? t.stepSelectSymptom
                    : t.stepActionCard}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close Crop Doctor"
            className="flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white text-slate-700 hover:bg-stone-100"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="my-5 grid grid-cols-3 gap-2">
          {[
            { num: 1, label: lang === 'hi' ? '1. फसल' : '1. Crop' },
            { num: 2, label: lang === 'hi' ? '2. लक्षण + फोटो' : '2. Symptoms' },
            { num: 3, label: lang === 'hi' ? '3. उपचार' : '3. Action Card' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as 1 | 2 | 3)}
              className={`min-h-[44px] cursor-pointer rounded-xl border px-3 py-2 text-sm font-extrabold transition-colors ${
                step === s.num
                  ? 'border-[#14532D] bg-[#14532D] text-white'
                  : step > s.num
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-white text-slate-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* STEP 1: Select Crop */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CROPS.map((cropKey) => {
                const meta = CROP_LABELS[cropKey];
                const isSelected = selectedCrop === cropKey;
                return (
                  <button
                    key={cropKey}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(cropKey);
                      setStep(2);
                    }}
                    className={`flex min-h-[88px] cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-[#14532D] bg-green-50 text-green-950'
                        : 'border-stone-200 bg-white text-slate-900 hover:border-green-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-500">{meta.season}</span>
                    <div>
                      <div className="font-display text-lg font-extrabold">
                        {lang === 'hi' ? meta.hi : meta.en}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        {lang === 'hi' ? meta.en : meta.hi}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Pick Visible Symptoms & Leaf Photo */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SYMPTOMS.map((symKey) => {
                const meta = SYMPTOM_LABELS[symKey];
                const isSelected = selectedSymptom === symKey;
                return (
                  <button
                    key={symKey}
                    type="button"
                    onClick={() => setSelectedSymptom(symKey)}
                    className={`flex min-h-[84px] cursor-pointer flex-col justify-between rounded-2xl border p-4 text-left transition-colors ${
                      isSelected
                        ? 'border-[#14532D] bg-green-50 text-green-950'
                        : 'border-stone-200 bg-white text-slate-900 hover:border-green-700'
                    }`}
                  >
                    <div className="font-display text-lg font-extrabold">
                      {lang === 'hi' ? meta.hi : meta.en}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{meta.hint}</div>
                  </button>
                );
              })}
            </div>

            {/* Leaf Photo Upload & Sample Preview */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#14532D]" aria-hidden="true" />
                  <span className="font-display text-base font-bold text-slate-900">
                    {lang === 'hi'
                      ? 'पत्ती की फोटो जोड़ें (वैकल्पिक)'
                      : 'Attach Leaf Photo for Field Record (Optional)'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-[#FAFAF9] px-4 py-2 text-sm font-bold text-slate-800 hover:bg-stone-100">
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>{lang === 'hi' ? 'फोटो चुनें' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoPreviewUrl('/src/assets/images/crop_leaf_sample_1795454166268.jpg')
                    }
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-sm font-bold text-amber-950 hover:bg-amber-100"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>{lang === 'hi' ? 'नमूना फोटो देखें' : 'Use Sample Leaf Photo'}</span>
                  </button>
                </div>
              </div>

              {photoPreviewUrl && (
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-stone-100 pt-4">
                  <img
                    src={photoPreviewUrl}
                    alt="Uploaded crop leaf preview"
                    referrerPolicy="no-referrer"
                    className="h-28 w-36 rounded-xl border border-stone-200 object-cover"
                  />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-emerald-800">
                      Leaf photo attached for visual comparison
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoPreviewUrl(null)}
                      className="cursor-pointer text-sm font-bold text-slate-600 underline hover:text-slate-900"
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-base font-bold text-slate-800 hover:bg-stone-100"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleRunDiagnosis}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 text-base font-extrabold text-white hover:bg-green-900"
              >
                <span>
                  {lang === 'hi' ? 'तुरंत उपचार कार्ड देखें' : 'Get Immediate Action Card'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Immediate Action Card */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-slate-500">
                    {CROP_LABELS[selectedCrop].en} · {SYMPTOM_LABELS[selectedSymptom].en}
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-slate-900">
                    {lang === 'hi' ? diagnosis.likelyCauseHi : diagnosis.likelyCause}
                  </h3>
                  <div className="text-sm italic text-slate-500">
                    {diagnosis.scientificName}
                  </div>
                  <div className="pt-1">
                    <UrgencyBadge level={diagnosis.urgency} />
                  </div>
                </div>

                {photoPreviewUrl && (
                  <img
                    src={photoPreviewUrl}
                    alt="Inspected leaf"
                    referrerPolicy="no-referrer"
                    className="h-24 w-32 rounded-xl border border-stone-200 object-cover"
                  />
                )}
              </div>

              {/* 1. Organic / Low-Cost First */}
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-base font-extrabold text-emerald-950">
                  <Leaf className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                  <span>{t.organicFirst}</span>
                </div>
                <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-base font-medium text-slate-800">
                  {diagnosis.organicRemedy.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Chemical Treatment Dosage */}
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-base font-extrabold text-amber-950">
                  <FlaskConical className="h-5 w-5 text-amber-700" aria-hidden="true" />
                  <span>{t.chemicalDosage}</span>
                </div>
                <p className="mt-2 text-base font-semibold leading-relaxed text-slate-900">
                  {diagnosis.chemicalDosage}
                </p>
              </div>

              {/* 3. Safety Precautions */}
              <div className="mt-4 rounded-xl border border-stone-200 bg-[#FAFAF9] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                  <ShieldAlert className="h-5 w-5 text-slate-700" aria-hidden="true" />
                  <span>{t.safetyPrecautions}</span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-slate-700">
                  {diagnosis.safetyPrecautions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-stone-200 pt-2.5 text-sm font-bold text-[#14532D]">
                  Prevention Tip: {diagnosis.preventionTip}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-base font-bold text-slate-800 hover:bg-stone-100"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                <span>Check Another Symptom</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={loggedTreatment}
                  onClick={handleLogSprayCost}
                  className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-base font-bold transition-colors ${
                    loggedTreatment
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100'
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  <span>
                    {loggedTreatment ? 'Logged ₹650 to Khatabook' : 'Log Spray Cost (₹650)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="min-h-[48px] cursor-pointer rounded-xl bg-[#14532D] px-6 py-2.5 text-base font-extrabold text-white hover:bg-green-900"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
