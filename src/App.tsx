/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BookOpen,
  IndianRupee,
  Languages,
  RotateCcw,
  Stethoscope,
  Tractor,
} from 'lucide-react';
import { useState } from 'react';
import { AgriHeader } from './components/AgriHeader';
import { CropDoctorModal } from './components/CropDoctorModal';
import { EquipmentGrid } from './components/EquipmentGrid';
import { MandiComparisonBoard } from './components/MandiComparisonBoard';
import { SeasonLedger } from './components/SeasonLedger';
import { WeatherActionBanner } from './components/WeatherActionBanner';
import { AgriProvider, useAgri } from './context/AgriContext';
import { CROP_LABELS, SYMPTOM_LABELS, UI_TEXT } from './data/i18n';
import type { AgriTab } from './types/agri';

function KisanSetuShell() {
  const { state, setLanguage, resetOfflineCache } = useAgri();
  const [activeTab, setActiveTab] = useState<AgriTab>('mandi');
  const [cropDoctorOpen, setCropDoctorOpen] = useState(false);

  const lang = state.language;
  const t = UI_TEXT[lang];

  const handleSelectTab = (tab: AgriTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900">
      <AgriHeader
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenCropDoctor={() => setCropDoctorOpen(true)}
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 pb-24 sm:px-6 md:pb-12">
        {/* Hero & Bilingual Field Quick-Action Bar */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            <div className="flex flex-col justify-between space-y-5 p-6 sm:p-8 lg:col-span-7">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#14532D]">{t.brandTagline}</span>

                  {/* Bilingual Toggle (EN / हिन्दी) */}
                  <div
                    role="group"
                    aria-label="Language toggle"
                    className="inline-flex items-center rounded-xl border border-stone-200 bg-[#FAFAF9] p-1"
                  >
                    <Languages className="ml-2 mr-1.5 h-4 w-4 text-slate-600" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`min-h-[40px] cursor-pointer rounded-lg px-3.5 text-sm font-extrabold transition-colors ${
                        lang === 'en'
                          ? 'bg-[#14532D] text-white'
                          : 'text-slate-700 hover:bg-stone-200/70'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('hi')}
                      className={`min-h-[40px] cursor-pointer rounded-lg px-3.5 text-sm font-extrabold transition-colors ${
                        lang === 'hi'
                          ? 'bg-[#14532D] text-white'
                          : 'text-slate-700 hover:bg-stone-200/70'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>

                <h1 className="font-display max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]">
                  {t.heroTitle}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-slate-700">
                  {t.heroSubtitle}
                </p>
              </div>

              {/* Two-Tap Quick Actions */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setCropDoctorOpen(true)}
                  className="flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#14532D] px-3 py-3 text-sm font-extrabold text-white transition-colors hover:bg-green-900"
                >
                  <Stethoscope className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t.quickDiagnose}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTab('mandi')}
                  className={`flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-extrabold transition-colors ${
                    activeTab === 'mandi'
                      ? 'border-[#14532D] bg-green-50 text-[#14532D]'
                      : 'border-stone-300 bg-white text-slate-800 hover:bg-stone-50'
                  }`}
                >
                  <IndianRupee className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t.quickMandi}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTab('equipment')}
                  className={`flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-extrabold transition-colors ${
                    activeTab === 'equipment'
                      ? 'border-[#14532D] bg-green-50 text-[#14532D]'
                      : 'border-stone-300 bg-white text-slate-800 hover:bg-stone-50'
                  }`}
                >
                  <Tractor className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t.quickEquipment}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTab('ledger')}
                  className={`flex min-h-[56px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-extrabold transition-colors ${
                    activeTab === 'ledger'
                      ? 'border-[#14532D] bg-green-50 text-[#14532D]'
                      : 'border-stone-300 bg-white text-slate-800 hover:bg-stone-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{t.quickLedger}</span>
                </button>
              </div>
            </div>

            <div className="min-h-[200px] bg-stone-100 lg:col-span-5">
              <img
                src="/src/assets/images/hero_kisansetu_farm_1795454165161.jpg"
                alt="Green paddy and wheat farmland in daylight"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Recent Offline Crop Doctor History (if user ran any check) */}
        {state.diagnosisHistory.length > 0 && (
          <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                Recent Crop Doctor Checks ({state.diagnosisHistory.length})
              </span>
              <button
                type="button"
                onClick={() => setCropDoctorOpen(true)}
                className="cursor-pointer text-sm font-bold text-[#14532D] underline underline-offset-4"
              >
                Open Crop Doctor
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {state.diagnosisHistory.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 rounded-xl border border-stone-200 bg-[#FAFAF9] px-3.5 py-2"
                >
                  {rec.photoDataUrl && (
                    <img
                      src={rec.photoDataUrl}
                      alt={rec.likelyCause}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {CROP_LABELS[rec.crop].en} · {SYMPTOM_LABELS[rec.symptom].en}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      {rec.likelyCause}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Always-Visible Weather Action Banner (expands fully on Weather Tab) */}
        <WeatherActionBanner expanded={activeTab === 'weather'} />

        {/* Primary Functional Workspace */}
        {activeTab === 'mandi' && <MandiComparisonBoard />}
        {activeTab === 'equipment' && <EquipmentGrid />}
        {activeTab === 'ledger' && <SeasonLedger />}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 pb-24 md:pb-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-slate-600 sm:px-6">
          <div>
            <span className="font-bold text-[#14532D]">KisanSetu (AgriAssist)</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Offline-cached field data · Ready for sunlight & low-connectivity use</span>
          </div>
          <button
            type="button"
            onClick={resetOfflineCache}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-100"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset Seeded Data</span>
          </button>
        </div>
      </footer>

      <CropDoctorModal
        isOpen={cropDoctorOpen}
        onClose={() => setCropDoctorOpen(false)}
        onSavedToLedger={() => {
          setCropDoctorOpen(false);
          handleSelectTab('ledger');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AgriProvider>
      <KisanSetuShell />
    </AgriProvider>
  );
}
