import { Check, Droplets, RotateCcw, Star } from 'lucide-react';
import { useState } from 'react';
import { useKidHero } from '../context/KidHeroContext';
import type { MissionCategory } from '../types/kidhero';
import { IconGlyph } from './IconGlyph';

const MISSION_FILTERS: { id: 'all' | MissionCategory; label: string }[] = [
  { id: 'all', label: 'All Missions' },
  { id: 'morning', label: 'Morning' },
  { id: 'school', label: 'School' },
  { id: 'health', label: 'Health' },
  { id: 'home', label: 'Home' },
];

export function MissionBoard() {
  const { state, toggleMission, incrementMissionStep, resetDailyMissions } = useKidHero();
  const [filter, setFilter] = useState<'all' | MissionCategory>('all');

  const filteredMissions =
    filter === 'all'
      ? state.missions
      : state.missions.filter((m) => m.category === filter);

  const completedCount = state.missions.filter((m) => m.completedToday).length;
  const totalCount = state.missions.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Summary Card */}
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-base font-semibold text-emerald-700">
              Daily Life-Skills Mission Board
            </p>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Build Everyday Superpowers
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Tap a mission when you finish it in real life to earn Hero Stars and keep your streak glowing.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-mono-num text-3xl font-extrabold text-emerald-700">
                {completedCount}/{totalCount}
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Completed Today ({progressPct}%)
              </div>
            </div>
            <button
              type="button"
              onClick={resetDailyMissions}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>New Day</span>
            </button>
          </div>
        </div>

        {/* Clean Progress Bar */}
        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-2">
        {MISSION_FILTERS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`min-h-[48px] cursor-pointer rounded-xl px-5 py-2 text-base font-bold transition-colors whitespace-nowrap shrink-0 ${
              filter === tab.id
                ? 'bg-emerald-600 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Mission Checklist */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredMissions.map((mission) => {
          const isCounted = typeof mission.targetCount === 'number' && mission.targetCount > 0;
          const currentCount = mission.currentCount ?? 0;

          return (
            <div
              key={mission.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                mission.completedToday
                  ? 'border-emerald-300 bg-emerald-50/70'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleMission(mission.id)}
                  aria-label={
                    mission.completedToday
                      ? `Mark ${mission.title} not done`
                      : `Mark ${mission.title} done`
                  }
                  className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 transition-colors ${
                    mission.completedToday
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-500'
                  }`}
                >
                  {mission.completedToday ? (
                    <Check className="h-6 w-6 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <IconGlyph name={mission.iconName} className="h-6 w-6" />
                  )}
                </button>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2
                      className={`font-display text-xl font-bold ${
                        mission.completedToday ? 'text-emerald-950 line-through' : 'text-slate-900'
                      }`}
                    >
                      {mission.title}
                    </h2>
                    <span className="font-mono-num inline-flex items-center gap-1 text-base font-bold text-amber-700">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                      +{mission.starReward}
                    </span>
                  </div>
                  <p className="text-lg leading-snug text-slate-600">{mission.description}</p>
                  <div className="pt-1 text-sm font-semibold capitalize text-slate-500">
                    {mission.category}
                    {mission.isCustom ? ' · Added by Parent' : ''}
                  </div>
                </div>
              </div>

              {/* Multi-step Water / Counter Tracker */}
              {isCounted && mission.targetCount && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: mission.targetCount }, (_, idx) => {
                      const filled = idx < currentCount;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => incrementMissionStep(mission.id)}
                          aria-label={`Log glass ${idx + 1} of ${mission.targetCount}`}
                          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
                            filled
                              ? 'border-sky-500 bg-sky-500 text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-sky-400'
                          }`}
                        >
                          <Droplets className="h-5 w-5" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                  <span className="font-mono-num text-base font-bold text-sky-800">
                    {currentCount}/{mission.targetCount}
                  </span>
                </div>
              )}

              {!isCounted && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => toggleMission(mission.id)}
                    className={`min-h-[48px] w-full cursor-pointer rounded-xl px-4 py-2 text-base font-bold transition-colors ${
                      mission.completedToday
                        ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {mission.completedToday ? 'Completed Today!' : 'Mark Mission Done'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
