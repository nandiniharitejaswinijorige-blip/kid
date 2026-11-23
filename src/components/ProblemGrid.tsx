import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import { useState } from 'react';
import { useKidHero } from '../context/KidHeroContext';
import { CATEGORY_META, SCENARIO_GUIDES } from '../data/scenarios';
import type { ScenarioCategory, ScenarioGuide } from '../types/kidhero';
import { IconGlyph } from './IconGlyph';

interface ProblemGridProps {
  onStartScenario: (guide: ScenarioGuide) => void;
  onGoToMissions: () => void;
}

const CATEGORY_ORDER: ScenarioCategory[] = ['safety', 'feelings', 'school'];

export function ProblemGrid({ onStartScenario, onGoToMissions }: ProblemGridProps) {
  const { state } = useKidHero();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ScenarioCategory>('all');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const completedMissionCount = state.missions.filter((m) => m.completedToday).length;
  const totalPracticedCount = Object.values(state.completedScenarios).reduce(
    (sum, n) => sum + n,
    0,
  );

  const visibleCategories =
    selectedCategory === 'all' ? CATEGORY_ORDER : [selectedCategory];

  return (
    <div className="space-y-10">
      {/* Welcoming Hero Focal Anchor */}
      <section className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <p className="text-base font-semibold text-sky-700">
              Hi {state.emergencyProfile.kidName || 'Hero'} · Calm Step-by-Step Guides
            </p>
            <h1 className="font-display max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
              I Need Help Right Now
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-700">
              Pick what is happening right now. We will walk through it together one calm step at a time—no rushing, no wall of text.
            </p>

            {/* Unboxed Clean Metric Summary + Quick Jump */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="font-mono-num text-amber-600">{state.stars}</span>
                <span>Hero Stars</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono-num text-emerald-700">{state.streakDays}-Day</span>
                <span>Streak</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono-num text-sky-700">{totalPracticedCount}</span>
                <span>Guides Practiced</span>
              </div>

              <button
                type="button"
                onClick={onGoToMissions}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-base font-bold text-emerald-900 transition-colors hover:bg-emerald-100 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <span>
                  Today’s Missions ({completedMissionCount}/{state.missions.length})
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-4 lg:justify-end">
            <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-amber-200/70 bg-[#FFFBF2] sm:h-48 sm:w-48">
              {!imgErrors['hero-compass'] ? (
                <img
                  src="/src/assets/images/hero_kidhero_compass_1795453705141.jpg"
                  alt="KidHero HQ star compass badge"
                  referrerPolicy="no-referrer"
                  onError={() => setImgErrors((e) => ({ ...e, 'hero-compass': true }))}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-amber-50 p-4 text-center">
                  <Compass className="h-14 w-14 text-sky-600" aria-hidden="true" />
                  <span className="mt-2 font-display text-base font-bold text-slate-800">
                    KidHero Compass
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Category Filter Segmented Control */}
      <section aria-label="Problem categories" className="space-y-8">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[48px] cursor-pointer rounded-xl px-5 py-2.5 text-base font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Helpers
          </button>
          {CATEGORY_ORDER.map((catId) => {
            const meta = CATEGORY_META[catId];
            const isSelected = selectedCategory === catId;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => setSelectedCategory(catId)}
                className={`min-h-[48px] cursor-pointer rounded-xl px-5 py-2.5 text-base font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                  isSelected
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {meta.title}
              </button>
            );
          })}
        </div>

        {/* Category Sections with Large Illustrated Category Headers + High-Contrast Tiles */}
        <div className="space-y-12">
          {visibleCategories.map((catId) => {
            const meta = CATEGORY_META[catId];
            const guides = SCENARIO_GUIDES.filter((g) => g.category === catId);

            return (
              <div key={catId} className="space-y-5">
                {/* Illustrated Category Banner */}
                <div
                  className={`grid grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl border p-5 sm:p-6 md:grid-cols-12 ${meta.accentBg} ${meta.accentBorder}`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/80 bg-white md:col-span-4 lg:col-span-3">
                    {!imgErrors[catId] ? (
                      <img
                        src={meta.imageUrl}
                        alt={meta.title}
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((e) => ({ ...e, [catId]: true }))}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/80 p-4 text-center">
                        <span className={`font-display text-lg font-bold ${meta.accentText}`}>
                          {meta.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-8 lg:col-span-9">
                    <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                      {meta.title}
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-slate-700">
                      {meta.subtitle}
                    </p>
                  </div>
                </div>

                {/* Scenario Action Tiles */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {guides.map((guide) => {
                    const practicedTimes = state.completedScenarios[guide.id] ?? 0;
                    const cardAccent =
                      catId === 'safety'
                        ? 'hover:border-sky-400 focus-visible:outline-sky-600'
                        : catId === 'feelings'
                          ? 'hover:border-emerald-400 focus-visible:outline-emerald-600'
                          : 'hover:border-amber-400 focus-visible:outline-amber-600';

                    const iconWrapperColor =
                      catId === 'safety'
                        ? 'bg-sky-100 text-sky-700'
                        : catId === 'feelings'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800';

                    return (
                      <button
                        key={guide.id}
                        type="button"
                        onClick={() => onStartScenario(guide)}
                        className={`group flex h-full min-h-[188px] cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${cardAccent}`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconWrapperColor}`}
                            >
                              <IconGlyph name={guide.iconName} className="h-6 w-6" />
                            </div>
                            <span className="font-mono-num text-sm font-semibold text-slate-500">
                              +{guide.starReward} Stars
                            </span>
                          </div>

                          <h3 className="font-display text-xl font-bold text-slate-900">
                            {guide.title}
                          </h3>
                          <p className="text-lg leading-snug text-slate-600">
                            {guide.shortDescription}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-base font-bold text-slate-800">
                          <span className="text-sm font-semibold text-slate-500">
                            {guide.estimatedMinutes} min
                            {practicedTimes > 0
                              ? ` · Practiced ${practicedTimes}x`
                              : ' · Tap to start'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sky-700 group-hover:translate-x-0.5 transition-transform">
                            <span>Open Guide</span>
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
