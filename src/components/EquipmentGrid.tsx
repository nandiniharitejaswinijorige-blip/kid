import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Tractor,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAgri } from '../context/AgriContext';
import { UI_TEXT } from '../data/i18n';
import type { EquipmentCategory } from '../types/agri';

const FILTERS: { id: 'all' | EquipmentCategory; en: string; hi: string }[] = [
  { id: 'all', en: 'All Tools', hi: 'सभी यंत्र' },
  { id: 'tractor', en: 'Tractors', hi: 'ट्रैक्टर' },
  { id: 'sprayer', en: 'Sprayers', hi: 'स्प्रेयर' },
  { id: 'harvester', en: 'Harvesters', hi: 'हार्वेस्टर' },
  { id: 'pump', en: 'Water Pumps', hi: 'पानी पंप' },
];

export function EquipmentGrid() {
  const { state, toggleEquipmentBooking, addEquipmentListing } = useAgri();
  const lang = state.language;
  const t = UI_TEXT[lang];

  const [categoryFilter, setCategoryFilter] = useState<'all' | EquipmentCategory>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<EquipmentCategory>('tractor');
  const [newRate, setNewRate] = useState('800');
  const [newUnit, setNewUnit] = useState<'hour' | 'acre' | 'day'>('hour');
  const [newOwner, setNewOwner] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const visibleListings =
    categoryFilter === 'all'
      ? state.equipmentListings
      : state.equipmentListings.filter((e) => e.category === categoryFilter);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newOwner.trim() || !newPhone.trim()) return;
    addEquipmentListing({
      name: newName.trim(),
      nameHi: newName.trim(),
      category: newCat,
      rateAmount: Math.max(50, Number(newRate) || 500),
      rateUnit: newUnit,
      ownerName: newOwner.trim(),
      village: newVillage.trim() || 'Local Village (2 km away)',
      distanceKm: 2,
      phone: newPhone.trim(),
      available: true,
      specs: 'Verified village peer listing · Ready for booking',
    });
    setNewName('');
    setNewOwner('');
    setNewVillage('');
    setNewPhone('');
    setShowAddForm(false);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {t.equipmentHeading}
          </h2>
          <p className="max-w-2xl text-base text-slate-700">{t.equipmentSubtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((s) => !s)}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-green-900"
        >
          {showAddForm ? (
            <>
              <X className="h-5 w-5" aria-hidden="true" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" aria-hidden="true" />
              <span>{lang === 'hi' ? 'अपना यंत्र जोड़ें' : 'List Your Equipment'}</span>
            </>
          )}
        </button>
      </div>

      {/* Add Equipment Drawer Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-emerald-300 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="block text-sm font-bold text-slate-700">Equipment Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Laser Land Leveler"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base text-slate-900 focus:border-[#14532D] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Category</label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value as EquipmentCategory)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-[#14532D] focus:outline-none"
            >
              <option value="tractor">Tractor / Implement</option>
              <option value="sprayer">Sprayer</option>
              <option value="harvester">Harvester</option>
              <option value="pump">Water Pump</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold text-slate-700">Rate (₹)</label>
              <input
                type="number"
                required
                min={50}
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="font-mono-num mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3 text-base font-bold text-slate-900 focus:border-[#14532D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">Per Unit</label>
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value as 'hour' | 'acre' | 'day')}
                className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 bg-white px-2 text-base font-semibold text-slate-900 focus:border-[#14532D] focus:outline-none"
              >
                <option value="hour">/ hour</option>
                <option value="acre">/ acre</option>
                <option value="day">/ day</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Owner Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Balwinder Singh"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base text-slate-900 focus:border-[#14532D] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Village & Distance</label>
            <input
              type="text"
              placeholder="e.g. Shamgarh (3 km)"
              value={newVillage}
              onChange={(e) => setNewVillage(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base text-slate-900 focus:border-[#14532D] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700">Phone / WhatsApp</label>
            <input
              type="tel"
              required
              placeholder="e.g. +919812000111"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="font-mono-num mt-1 min-h-[48px] w-full rounded-xl border border-stone-300 px-3.5 text-base text-slate-900 focus:border-[#14532D] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="min-h-[48px] cursor-pointer rounded-xl bg-[#14532D] px-6 py-2.5 text-base font-extrabold text-white hover:bg-green-900"
            >
              Publish Equipment Listing
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setCategoryFilter(f.id)}
            className={`min-h-[48px] cursor-pointer rounded-xl px-4 py-2 text-base font-bold transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === f.id
                ? 'bg-[#14532D] text-white'
                : 'text-slate-700 hover:bg-stone-100'
            }`}
          >
            {lang === 'hi' ? f.hi : f.en}
          </button>
        ))}
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {visibleListings.map((item) => {
          const cleanPhone = item.phone.replace(/[^0-9]/g, '');
          const whatsappHref = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Namaste ${item.ownerName}, I saw your ${item.name} on KisanSetu and want to check availability.`,
          )}`;

          return (
            <article
              key={item.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
            >
              <div>
                {item.imageUrl ? (
                  <div className="aspect-[16/9] w-full overflow-hidden border-b border-stone-100 bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 items-center justify-between border-b border-stone-100 bg-stone-50 px-5">
                    <div className="flex items-center gap-3 text-[#14532D]">
                      <Tractor className="h-8 w-8" aria-hidden="true" />
                      <span className="text-sm font-bold uppercase tracking-wide text-slate-600">
                        {item.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-extrabold text-slate-900">
                      {lang === 'hi' ? item.nameHi : item.name}
                    </h3>
                    {item.bookedByMe ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1 text-xs font-extrabold text-sky-900">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Requested</span>
                      </span>
                    ) : item.available ? (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-950">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Available Now</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-extrabold text-amber-950">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Booked Until Thu</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-slate-600">{item.specs}</p>

                  <div className="flex flex-wrap items-baseline justify-between gap-2 pt-1">
                    <div className="font-mono-num text-2xl font-extrabold text-[#14532D]">
                      ₹{item.rateAmount.toLocaleString('en-IN')}
                      <span className="text-sm font-bold text-slate-500">
                        /{item.rateUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <MapPin className="h-4 w-4 text-amber-700" aria-hidden="true" />
                      <span>
                        {item.ownerName} · {item.village}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex flex-wrap items-center gap-2.5 border-t border-stone-100 bg-[#FAFAF9] p-4">
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#14532D] px-4 py-2 text-base font-bold text-white transition-colors hover:bg-green-900"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>{lang === 'hi' ? 'कॉल करें' : 'Call Owner'}</span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-base font-bold text-emerald-950 transition-colors hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  disabled={!item.available && !item.bookedByMe}
                  onClick={() => toggleEquipmentBooking(item.id)}
                  className={`min-h-[48px] w-full cursor-pointer rounded-xl border px-4 py-2 text-base font-bold transition-colors sm:w-auto ${
                    item.bookedByMe
                      ? 'border-sky-300 bg-sky-100 text-sky-950 hover:bg-sky-200'
                      : item.available
                        ? 'border-stone-300 bg-white text-slate-800 hover:bg-stone-100'
                        : 'cursor-not-allowed border-stone-200 bg-stone-100 text-slate-400'
                  }`}
                >
                  {item.bookedByMe
                    ? 'Cancel Request'
                    : item.available
                      ? 'Reserve Slot'
                      : 'Waitlist'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
