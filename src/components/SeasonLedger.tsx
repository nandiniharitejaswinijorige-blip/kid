import { ArrowDownLeft, ArrowUpRight, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAgri } from '../context/AgriContext';
import { CROP_LABELS, UI_TEXT } from '../data/i18n';
import type { CropType, LedgerCategory, LedgerEntryType } from '../types/agri';

function formatInr(amount: number): string {
  const abs = Math.abs(Math.round(amount)).toLocaleString('en-IN');
  return amount < 0 ? `-₹${abs}` : `₹${abs}`;
}

export function SeasonLedger() {
  const { state, setFarmAcreage, addLedgerEntry, deleteLedgerEntry } = useAgri();
  const lang = state.language;
  const t = UI_TEXT[lang];

  const [filterType, setFilterType] = useState<'all' | LedgerEntryType>('all');
  const [entryType, setEntryType] = useState<LedgerEntryType>('expense');
  const [category, setCategory] = useState<LedgerCategory>('fertilizer');
  const [crop, setCrop] = useState<CropType>('rice');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const { totalExpense, totalRevenue, netProfit, profitPerAcre } = useMemo(() => {
    const exp = state.ledgerEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amountInr, 0);
    const rev = state.ledgerEntries
      .filter((e) => e.type === 'revenue')
      .reduce((sum, e) => sum + e.amountInr, 0);
    const net = rev - exp;
    const perAcre = state.farmAcreage > 0 ? net / state.farmAcreage : net;
    return {
      totalExpense: exp,
      totalRevenue: rev,
      netProfit: net,
      profitPerAcre: perAcre,
    };
  }, [state.ledgerEntries, state.farmAcreage]);

  const visibleEntries =
    filterType === 'all'
      ? state.ledgerEntries
      : state.ledgerEntries.filter((e) => e.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title.trim() || !numAmount || numAmount <= 0) return;
    addLedgerEntry({
      date: new Date().toISOString().slice(0, 10),
      type: entryType,
      category: entryType === 'revenue' ? 'harvest-sale' : category,
      title: title.trim(),
      crop,
      amountInr: Math.round(numAmount),
    });
    setTitle('');
    setAmount('');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {t.ledgerHeading}
          </h2>
          <p className="max-w-2xl text-base text-slate-700">{t.ledgerSubtitle}</p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-2">
          <label htmlFor="farm-acreage" className="text-sm font-bold text-slate-700">
            {lang === 'hi' ? 'खेती क्षेत्र (एकड़):' : 'Farm Area (Acres):'}
          </label>
          <input
            id="farm-acreage"
            type="number"
            min={0.5}
            step={0.5}
            max={500}
            value={state.farmAcreage}
            onChange={(e) => setFarmAcreage(Number(e.target.value) || 1)}
            className="font-mono-num min-h-[40px] w-20 rounded-lg border border-stone-300 bg-[#FAFAF9] px-2.5 text-center text-base font-extrabold text-slate-900 focus:border-[#14532D] focus:outline-none"
          />
        </div>
      </div>

      {/* Real-Time Per-Acre Profit Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-bold text-slate-500">
            {lang === 'hi' ? 'कुल लागत (खर्च)' : 'Total Input Expenses'}
          </div>
          <div className="font-mono-num mt-1 text-2xl font-extrabold text-amber-800">
            {formatInr(totalExpense)}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-bold text-slate-500">
            {lang === 'hi' ? 'कुल फसल बिक्री' : 'Total Harvest Revenue'}
          </div>
          <div className="font-mono-num mt-1 text-2xl font-extrabold text-emerald-800">
            {formatInr(totalRevenue)}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-bold text-slate-500">
            {lang === 'hi' ? 'शुद्ध सीज़न मुनाफा' : 'Net Season Profit'}
          </div>
          <div
            className={`font-mono-num mt-1 text-2xl font-extrabold ${
              netProfit >= 0 ? 'text-[#14532D]' : 'text-red-800'
            }`}
          >
            {formatInr(netProfit)}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
          <div className="text-sm font-extrabold text-emerald-900">
            {lang === 'hi' ? 'शुद्ध मुनाफा प्रति एकड़' : 'Net Profit / Acre'}
          </div>
          <div className="font-mono-num mt-1 text-2xl font-extrabold text-[#14532D]">
            {formatInr(profitPerAcre)}
          </div>
        </div>
      </div>

      {/* Add Ledger Entry Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:grid-cols-12"
      >
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700">Entry Type</label>
          <select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as LedgerEntryType)}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-base font-bold text-slate-900 focus:border-[#14532D] focus:outline-none"
          >
            <option value="expense">Expense (-)</option>
            <option value="revenue">Harvest Sale (+)</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700">Category</label>
          {entryType === 'revenue' ? (
            <div className="mt-1 flex min-h-[48px] items-center rounded-xl border border-stone-200 bg-stone-50 px-3 text-base font-semibold text-slate-600">
              Harvest Sale
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LedgerCategory)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#14532D] focus:outline-none"
            >
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizer / Spray</option>
              <option value="labor">Labor</option>
              <option value="diesel">Diesel / Power</option>
              <option value="equipment">Equipment Rent</option>
            </select>
          )}
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700">Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as CropType)}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#14532D] focus:outline-none"
          >
            {Object.entries(CROP_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {lang === 'hi' ? v.hi : v.en}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3">
          <label className="block text-sm font-bold text-slate-700">Description</label>
          <input
            type="text"
            required
            placeholder="e.g. Urea 3 bags or Sold 15q wheat"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base text-slate-900 focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700">Amount (₹)</label>
          <input
            type="number"
            required
            min={1}
            placeholder="1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono-num mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base font-extrabold text-slate-900 focus:border-[#14532D] focus:outline-none"
          />
        </div>

        <div className="flex items-end lg:col-span-1">
          <button
            type="submit"
            aria-label="Add Khatabook entry"
            className="flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#14532D] px-4 text-base font-bold text-white hover:bg-green-900"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span className="lg:hidden">Add Entry</span>
          </button>
        </div>
      </form>

      {/* Filter & Ledger List */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-5 py-3">
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'all', label: 'All Entries' },
                { id: 'expense', label: 'Expenses' },
                { id: 'revenue', label: 'Harvest Sales' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`min-h-[40px] cursor-pointer rounded-lg px-3.5 text-sm font-bold transition-colors ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-stone-200/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="font-mono-num text-sm font-bold text-slate-500">
            {visibleEntries.length} records
          </span>
        </div>

        {visibleEntries.length === 0 ? (
          <div className="p-8 text-center text-base font-medium text-slate-500">
            No entries in this filter yet. Use the form above to record an expense or harvest sale.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {visibleEntries.map((entry) => {
              const isRevenue = entry.type === 'revenue';
              return (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-stone-50/70"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isRevenue
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isRevenue ? (
                        <ArrowDownLeft className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{entry.title}</div>
                      <div className="text-xs font-semibold capitalize text-slate-500">
                        {entry.date} · {CROP_LABELS[entry.crop].en} · {entry.category.replace('-', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`font-mono-num text-lg font-extrabold ${
                        isRevenue ? 'text-emerald-800' : 'text-slate-900'
                      }`}
                    >
                      {isRevenue ? '+' : '-'}
                      {formatInr(entry.amountInr)}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteLedgerEntry(entry.id)}
                      aria-label={`Delete ${entry.title}`}
                      className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-stone-100 hover:text-slate-800"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
