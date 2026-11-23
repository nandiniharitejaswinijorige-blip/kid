import {
  CheckCircle2,
  Delete,
  Lock,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Unlock,
} from 'lucide-react';
import { useState } from 'react';
import { useKidHero } from '../context/KidHeroContext';
import { SCENARIO_GUIDES } from '../data/scenarios';
import type { MissionCategory } from '../types/kidhero';

export function ParentSettingsDrawer() {
  const {
    state,
    updateEmergencyProfile,
    addEmergencyContact,
    removeEmergencyContact,
    addCustomMission,
    deleteMission,
    resetAllDemoData,
  } = useKidHero();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Profile Form State
  const [kidName, setKidName] = useState(state.emergencyProfile.kidName);
  const [kidAge, setKidAge] = useState(String(state.emergencyProfile.kidAge));
  const [homeAddress, setHomeAddress] = useState(state.emergencyProfile.homeAddress);
  const [safeLandmark, setSafeLandmark] = useState(state.emergencyProfile.safeLandmark);
  const [allergyNotes, setAllergyNotes] = useState(state.emergencyProfile.allergyMedicalNotes);
  const [newPin, setNewPin] = useState(state.emergencyProfile.parentPin);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // New Contact Form
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // New Mission Form
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionCat, setMissionCat] = useState<MissionCategory>('home');
  const [missionStars, setMissionStars] = useState('15');

  const [confirmReset, setConfirmReset] = useState(false);

  const handleUnlockAttempt = (code: string) => {
    if (code === state.emergencyProfile.parentPin) {
      setIsUnlocked(true);
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. Demo default is 1234.');
      setPinInput('');
    }
  };

  const handleDigitPress = (digit: string) => {
    if (pinInput.length >= 4) return;
    const next = pinInput + digit;
    setPinInput(next);
    setPinError('');
    if (next.length === 4) {
      handleUnlockAttempt(next);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPin = /^\d{4}$/.test(newPin.trim())
      ? newPin.trim()
      : state.emergencyProfile.parentPin;

    updateEmergencyProfile({
      ...state.emergencyProfile,
      kidName: kidName.trim() || 'Hero',
      kidAge: Math.max(4, Math.min(16, Number(kidAge) || 8)),
      homeAddress: homeAddress.trim(),
      safeLandmark: safeLandmark.trim(),
      allergyMedicalNotes: allergyNotes.trim(),
      parentPin: cleanedPin,
    });
    setProfileSavedMsg('Safe Info & Parent PIN saved!');
    window.setTimeout(() => setProfileSavedMsg(''), 2500);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    addEmergencyContact({
      name: contactName.trim(),
      relationship: contactRelation.trim() || 'Family',
      phone: contactPhone.trim(),
      isPrimary: state.emergencyProfile.contacts.length === 0,
    });
    setContactName('');
    setContactRelation('');
    setContactPhone('');
  };

  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle.trim()) return;
    addCustomMission(missionTitle, missionDesc, missionCat, Number(missionStars) || 15);
    setMissionTitle('');
    setMissionDesc('');
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Parent Dashboard Lock
          </h1>
          <p className="text-base text-slate-600">
            Enter your 4-digit Parent PIN to customize Safe Info, add missions, and view practiced guides.
          </p>
          <p className="text-sm font-semibold text-sky-700">
            Demo Parent PIN: <span className="font-mono-num">1234</span>
          </p>
        </div>

        {/* PIN Dots */}
        <div className="my-6 flex justify-center gap-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`flex h-14 w-12 items-center justify-center rounded-xl border-2 font-mono-num text-2xl font-bold ${
                pinInput[idx]
                  ? 'border-sky-600 bg-sky-50 text-sky-900'
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              {pinInput[idx] ? '•' : ''}
            </div>
          ))}
        </div>

        {pinError && (
          <p className="mb-4 text-center text-sm font-bold text-amber-800">{pinError}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="font-mono-num min-h-[54px] cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 text-xl font-bold text-slate-900 transition-colors hover:bg-slate-100 active:scale-[0.97]"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setPinInput('');
              setPinError('');
            }}
            className="min-h-[54px] cursor-pointer rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="font-mono-num min-h-[54px] cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 text-xl font-bold text-slate-900 transition-colors hover:bg-slate-100 active:scale-[0.97]"
          >
            0
          </button>
          <button
            type="button"
            aria-label="Backspace"
            onClick={() => setPinInput((p) => p.slice(0, -1))}
            className="flex min-h-[54px] cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <Delete className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Parent Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            <Unlock className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">
              Parent Dashboard
            </h1>
            <p className="text-base text-slate-600">
              COPPA-friendly local storage · Data stays privately on this device.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsUnlocked(false)}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-base font-bold text-slate-800 hover:bg-slate-100"
        >
          <Lock className="h-4 w-4" aria-hidden="true" />
          <span>Lock Parent Mode</span>
        </button>
      </div>

      {/* Section 1: Practice Insights */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          Practiced Problem-Solving Guides
        </h2>
        <p className="mt-1 text-base text-slate-600">
          See which real-life scenarios {state.emergencyProfile.kidName} has practiced recently.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">Total Hero Stars</div>
            <div className="font-mono-num mt-1 text-2xl font-extrabold text-slate-900">
              {state.stars}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">Guides Completed</div>
            <div className="font-mono-num mt-1 text-2xl font-extrabold text-slate-900">
              {state.practiceLog.length}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-500">Skill Badges Earned</div>
            <div className="font-mono-num mt-1 text-2xl font-extrabold text-slate-900">
              {state.unlockedBadgeIds.length}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scenario Coverage</h3>
            <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {SCENARIO_GUIDES.map((g) => {
                const count = state.completedScenarios[g.id] ?? 0;
                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between px-4 py-3 text-base"
                  >
                    <span className="font-semibold text-slate-800">{g.title}</span>
                    <span
                      className={`font-mono-num text-sm font-bold ${
                        count > 0 ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {count > 0 ? `${count}x practiced` : 'Not yet'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Practice Log</h3>
            {state.practiceLog.length === 0 ? (
              <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-500">
                No guides completed yet.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                {state.practiceLog.slice(0, 6).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-base"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      <span>{entry.scenarioTitle}</span>
                    </div>
                    <span className="font-mono-num text-sm text-slate-500">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Emergency Safe Info & Contacts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleSaveProfile}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Edit Child’s Safe Info
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700">Child’s Name</label>
              <input
                type="text"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">Age</label>
              <input
                type="number"
                min={4}
                max={16}
                value={kidAge}
                onChange={(e) => setKidAge(e.target.value)}
                className="font-mono-num mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">Home Address</label>
            <input
              type="text"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">Safe Landmark</label>
            <input
              type="text"
              value={safeLandmark}
              onChange={(e) => setSafeLandmark(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Allergy & Medical Notes
            </label>
            <textarea
              rows={2}
              value={allergyNotes}
              onChange={(e) => setAllergyNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Parent PIN (4 digits)
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              className="font-mono-num mt-1 min-h-[48px] w-36 rounded-xl border border-slate-300 px-3.5 text-base font-bold text-slate-900 focus:border-sky-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="min-h-[48px] cursor-pointer rounded-xl bg-sky-600 px-6 py-2.5 text-base font-bold text-white hover:bg-sky-700"
            >
              Save Safe Info
            </button>
            {profileSavedMsg && (
              <span className="text-base font-bold text-emerald-700">{profileSavedMsg}</span>
            )}
          </div>
        </form>

        {/* ICE Contacts Manager */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            Emergency Contacts (ICE)
          </h2>

          <div className="space-y-2.5">
            {state.emergencyProfile.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div>
                  <div className="text-base font-bold text-slate-900">{contact.name}</div>
                  <div className="font-mono-num text-sm text-slate-600">
                    {contact.relationship} · {contact.phone}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEmergencyContact(contact.id)}
                  aria-label={`Remove ${contact.name}`}
                  className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddContact} className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-base font-bold text-slate-900">Add New Trusted Adult</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Name (e.g. Uncle Sam)"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="min-h-[48px] rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Uncle)"
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                className="min-h-[48px] rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                type="tel"
                placeholder="Phone (e.g. (555) 392-1104)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="font-mono-num min-h-[48px] flex-1 rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-base font-bold text-white hover:bg-slate-800"
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                <span>Add Contact</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Section 3: Custom Household Missions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={handleAddMission} className="space-y-4">
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Add Custom Household Mission
            </h2>
            <input
              type="text"
              placeholder="Mission title (e.g. Feed the dog)"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Short description (e.g. Fill bowl with fresh water & kibble)"
              value={missionDesc}
              onChange={(e) => setMissionDesc(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 px-3.5 text-base text-slate-900 focus:border-sky-600 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={missionCat}
                onChange={(e) => setMissionCat(e.target.value as MissionCategory)}
                className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
              >
                <option value="morning">Morning</option>
                <option value="school">School</option>
                <option value="health">Health</option>
                <option value="home">Home</option>
              </select>
              <select
                value={missionStars}
                onChange={(e) => setMissionStars(e.target.value)}
                className="font-mono-num min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold text-slate-900 focus:border-sky-600 focus:outline-none"
              >
                <option value="10">+10 Stars</option>
                <option value="15">+15 Stars</option>
                <option value="20">+20 Stars</option>
                <option value="25">+25 Stars</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-base font-bold text-white hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              <span>Add to Mission Board</span>
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Active Missions ({state.missions.length})
            </h3>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {state.missions.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-base font-bold text-slate-900">{m.title}</div>
                    <div className="text-sm capitalize text-slate-500">
                      {m.category} · +{m.starReward} Stars
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMission(m.id)}
                    aria-label={`Delete mission ${m.title}`}
                    className="flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reset Demo Data */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <span className="text-base text-slate-600">
          Need a fresh start? Reset sample data back to defaults.
        </span>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-base font-bold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Reset Demo Data</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetAllDemoData();
                setConfirmReset(false);
              }}
              className="min-h-[48px] cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-base font-bold text-white hover:bg-amber-700"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-[48px] cursor-pointer rounded-xl px-3 text-base font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
