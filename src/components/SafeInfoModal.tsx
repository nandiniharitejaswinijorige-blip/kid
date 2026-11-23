import { Check, Copy, HeartPulse, Home, Lock, Phone, ShieldAlert, X } from 'lucide-react';
import { useState } from 'react';
import { useKidHero } from '../context/KidHeroContext';

interface SafeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenParentMode: () => void;
}

export function SafeInfoModal({ isOpen, onClose, onOpenParentMode }: SafeInfoModalProps) {
  const { state } = useKidHero();
  const { emergencyProfile } = state;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mathLockOpen, setMathLockOpen] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathError, setMathError] = useState('');

  if (!isOpen) return null;

  const handleCopy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard may be restricted in some iframes; fail silently
    }
  };

  const handleMathCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer.trim() === '15') {
      setMathLockOpen(false);
      setMathAnswer('');
      setMathError('');
      onClose();
      onOpenParentMode();
    } else {
      setMathError('Try again — ask a grown-up to solve 7 + 8.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safe-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sky-200 bg-[#FFFBF2] p-6 shadow-xl sm:p-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-amber-200/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white">
              <ShieldAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="safe-info-title"
                className="font-display text-2xl font-extrabold text-slate-900"
              >
                My Safe Info
              </h2>
              <p className="text-base font-medium text-slate-600">
                {emergencyProfile.kidName}, Age {emergencyProfile.kidAge} · Show this to a safe adult helper
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close My Safe Info"
            className="flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Trusted Family Numbers (ICE)
            </h3>
            <div className="space-y-3">
              {emergencyProfile.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <div className="text-lg font-extrabold text-slate-900">
                      {contact.name}
                    </div>
                    <div className="text-sm font-semibold text-slate-500">
                      {contact.relationship}
                      {contact.isPrimary ? ' · Primary Contact' : ''}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-mono-num inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-lg font-bold text-white transition-colors hover:bg-sky-700"
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      <span>{contact.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(contact.id, contact.phone)}
                      aria-label={`Copy ${contact.name} phone number`}
                      className="inline-flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      {copiedId === contact.id ? (
                        <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Copy className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Home Address & Safe Landmark */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-base font-bold text-sky-800">
                <Home className="h-5 w-5" aria-hidden="true" />
                <span>Home Address</span>
              </div>
              <p className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                {emergencyProfile.homeAddress}
              </p>
              <p className="mt-2 text-base text-slate-600">
                <span className="font-bold text-slate-800">Landmark: </span>
                {emergencyProfile.safeLandmark}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <div className="flex items-center gap-2 text-base font-bold text-amber-900">
                <HeartPulse className="h-5 w-5" aria-hidden="true" />
                <span>Allergy & Medical Notes</span>
              </div>
              <p className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                {emergencyProfile.allergyMedicalNotes || 'None listed'}
              </p>
            </div>
          </section>

          {/* Protected Edit Gate (Math Lock for Quick Adult Verification) */}
          <div className="border-t border-amber-200/70 pt-4">
            {!mathLockOpen ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-600">
                  Editing is locked so info stays safe from accidental taps.
                </span>
                <button
                  type="button"
                  onClick={() => setMathLockOpen(true)}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-base font-bold text-slate-800 transition-colors hover:bg-slate-50"
                >
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>Parent Edit</span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleMathCheck}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <label className="text-base font-bold text-slate-900">
                  Grown-up check: What is 7 + 8?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={mathAnswer}
                    onChange={(e) => {
                      setMathAnswer(e.target.value);
                      setMathError('');
                    }}
                    placeholder="?"
                    className="font-mono-num min-h-[48px] w-24 rounded-xl border border-slate-300 px-3 text-center text-lg font-bold text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="min-h-[48px] cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-base font-bold text-white hover:bg-slate-800"
                  >
                    Unlock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMathLockOpen(false);
                      setMathError('');
                    }}
                    className="min-h-[48px] cursor-pointer rounded-xl px-3 text-base font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
                {mathError && (
                  <p className="w-full text-sm font-semibold text-amber-800">{mathError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
