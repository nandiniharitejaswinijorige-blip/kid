import { ArrowDownRight, ArrowUpRight, Award, Minus, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAgri } from '../context/AgriContext';
import { MANDI_RATES } from '../data/agriData';
import { CROP_LABELS, UI_TEXT } from '../data/i18n';
import type { CropType } from '../types/agri';

const CROPS: CropType[] = ['rice', 'wheat', 'cotton', 'tomato', 'chili', 'maize'];

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function MandiComparisonBoard() {
  const { state, setMandiInputs } = useAgri();
  const lang = state.language;
  const t = UI_TEXT[lang];

  const [selectedCrop, setSelectedCrop] = useState<CropType>('rice');
  const quantity = state.mandiQuantityQuintals;
  const ratePerKmPerQ = state.transportRatePerKmPerQuintal;

  const calculatedMandis = useMemo(() => {
    const filtered = MANDI_RATES.filter((m) => m.crop === selectedCrop);
    return filtered
      .map((m) => {
        const grossRevenue = m.modalPrice * quantity;
        const transportCost = Math.round(m.distanceKm * ratePerKmPerQ * quantity);
        const netTakeHome = grossRevenue - transportCost;
        return {
          ...m,
          grossRevenue,
          transportCost,
          netTakeHome,
        };
      })
      .sort((a, b) => b.netTakeHome - a.netTakeHome);
  }, [selectedCrop, quantity, ratePerKmPerQ]);

  const bestMandi = calculatedMandis[0];
  const worstMandi = calculatedMandis[calculatedMandis.length - 1];
  const extraProfitVsLowest =
    bestMandi && worstMandi ? bestMandi.netTakeHome - worstMandi.netTakeHome : 0;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {t.mandiHeading}
          </h2>
          <p className="max-w-2xl text-base text-slate-700">{t.mandiSubtitle}</p>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2">
        {CROPS.map((cropKey) => {
          const active = selectedCrop === cropKey;
          const label = CROP_LABELS[cropKey];
          return (
            <button
              key={cropKey}
              type="button"
              onClick={() => setSelectedCrop(cropKey)}
              className={`min-h-[48px] cursor-pointer rounded-xl px-4 py-2 text-base font-bold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#14532D] text-white'
                  : 'text-slate-700 hover:bg-stone-100'
              }`}
            >
              {lang === 'hi' ? label.hi : label.en}
            </button>
          );
        })}
      </div>

      {/* Net Take-Home Estimator Controls */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:grid-cols-12">
        <div className="space-y-1.5 lg:col-span-3">
          <label
            htmlFor="mandi-qty"
            className="block text-sm font-extrabold text-slate-700"
          >
            {lang === 'hi' ? 'कुल उपज (क्विंटल)' : 'Harvest Quantity (Quintals)'}
          </label>
          <input
            id="mandi-qty"
            type="number"
            min={1}
            max={1000}
            value={quantity}
            onChange={(e) =>
              setMandiInputs(Math.max(1, Number(e.target.value) || 1), ratePerKmPerQ)
            }
            className="font-mono-num min-h-[48px] w-full rounded-xl border border-stone-300 bg-[#FAFAF9] px-4 text-lg font-extrabold text-slate-900 focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5 lg:col-span-4">
          <label
            htmlFor="mandi-transport"
            className="block text-sm font-extrabold text-slate-700"
          >
            {lang === 'hi'
              ? 'भाड़ा दर (₹ प्रति किमी प्रति क्विंटल)'
              : 'Transport Cost (₹ / km / quintal)'}
          </label>
          <input
            id="mandi-transport"
            type="number"
            min={0}
            step={0.5}
            max={50}
            value={ratePerKmPerQ}
            onChange={(e) =>
              setMandiInputs(quantity, Math.max(0, Number(e.target.value) || 0))
            }
            className="font-mono-num min-h-[48px] w-full rounded-xl border border-stone-300 bg-[#FAFAF9] px-4 text-lg font-extrabold text-slate-900 focus:border-[#14532D] focus:outline-none"
          />
        </div>

        {bestMandi && (
          <div className="flex flex-col justify-center rounded-xl border border-emerald-300 bg-emerald-50 p-4 lg:col-span-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900">
              <Award className="h-5 w-5 text-emerald-700" aria-hidden="true" />
              <span>
                {lang === 'hi' ? 'सबसे अधिक शुद्ध लाभ:' : 'Best Net Take-Home Market:'}{' '}
                {lang === 'hi' ? bestMandi.mandiNameHi : bestMandi.mandiName}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="font-mono-num text-2xl font-extrabold text-[#14532D]">
                {formatInr(bestMandi.netTakeHome)}
              </span>
              {extraProfitVsLowest > 0 && (
                <span className="text-sm font-bold text-emerald-800">
                  (+{formatInr(extraProfitVsLowest)} more than lowest market)
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop High-Contrast Comparison Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-xs font-extrabold uppercase tracking-wider text-slate-600">
              <th className="px-5 py-4">Mandi / Market</th>
              <th className="px-4 py-4 text-right">Distance</th>
              <th className="px-4 py-4 text-right">Min–Max (₹/q)</th>
              <th className="px-4 py-4 text-right">Modal Rate (₹/q)</th>
              <th className="px-4 py-4 text-right">Trend</th>
              <th className="px-4 py-4 text-right">Transport</th>
              <th className="px-5 py-4 text-right">Net Take-Home</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {calculatedMandis.map((m, idx) => {
              const isBest = idx === 0;
              return (
                <tr
                  key={m.id}
                  className={isBest ? 'bg-emerald-50/50' : 'hover:bg-stone-50/60'}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-extrabold text-slate-900">
                        {lang === 'hi' ? m.mandiNameHi : m.mandiName}
                      </span>
                      {isBest && (
                        <span className="rounded-lg border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-950">
                          Best Profit
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      {m.district} · Arrivals {m.arrivalsTonnes}t · {m.updatedAt}
                    </div>
                  </td>
                  <td className="font-mono-num px-4 py-4 text-right text-base font-bold text-slate-700">
                    {m.distanceKm} km
                  </td>
                  <td className="font-mono-num px-4 py-4 text-right text-sm font-semibold text-slate-600">
                    {formatInr(m.minPrice)}–{formatInr(m.maxPrice)}
                  </td>
                  <td className="font-mono-num px-4 py-4 text-right text-lg font-extrabold text-slate-900">
                    {formatInr(m.modalPrice)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {m.trend === 'up' ? (
                      <span className="font-mono-num inline-flex items-center gap-0.5 text-sm font-extrabold text-emerald-700">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />+₹{m.trendDelta}
                      </span>
                    ) : m.trend === 'down' ? (
                      <span className="font-mono-num inline-flex items-center gap-0.5 text-sm font-extrabold text-amber-700">
                        <ArrowDownRight className="h-4 w-4" aria-hidden="true" />-₹{m.trendDelta}
                      </span>
                    ) : (
                      <span className="font-mono-num inline-flex items-center gap-0.5 text-sm font-bold text-slate-500">
                        <Minus className="h-4 w-4" aria-hidden="true" />
                        Flat
                      </span>
                    )}
                  </td>
                  <td className="font-mono-num px-4 py-4 text-right text-sm font-bold text-slate-600">
                    -{formatInr(m.transportCost)}
                  </td>
                  <td className="font-mono-num px-5 py-4 text-right text-xl font-extrabold text-[#14532D]">
                    {formatInr(m.netTakeHome)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {calculatedMandis.map((m, idx) => {
          const isBest = idx === 0;
          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                isBest
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {lang === 'hi' ? m.mandiNameHi : m.mandiName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {m.distanceKm} km away · {m.updatedAt}
                  </p>
                </div>
                {isBest && (
                  <span className="rounded-lg border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-950">
                    Best Profit
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-stone-100 pt-3">
                <div>
                  <div className="text-xs font-bold text-slate-500">Modal Rate</div>
                  <div className="font-mono-num text-xl font-extrabold text-slate-900">
                    {formatInr(m.modalPrice)}/q
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500">Net Take-Home</div>
                  <div className="font-mono-num text-xl font-extrabold text-[#14532D]">
                    {formatInr(m.netTakeHome)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  Transport: -{formatInr(m.transportCost)}
                </span>
                <span>
                  {m.trend === 'up'
                    ? `↑ +₹${m.trendDelta}`
                    : m.trend === 'down'
                      ? `↓ -₹${m.trendDelta}`
                      : '→ Steady'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
