import { Lock, Star } from 'lucide-react';
import { useKidHero } from '../context/KidHeroContext';
import { SKILL_BADGES } from '../data/missions';
import { IconGlyph } from './IconGlyph';

export function SkillBadgesView() {
  const { state } = useKidHero();
  const unlockedCount = state.unlockedBadgeIds.length;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-base font-semibold text-amber-700">
              Hero Trophy Shelf
            </p>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Collectible Skill Badges
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Practice calm problem-solving guides and complete daily missions to unlock every KidHero badge.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-mono-num text-3xl font-extrabold text-amber-600">
                {unlockedCount}/{SKILL_BADGES.length}
              </div>
              <div className="text-sm font-semibold text-slate-500">Badges Unlocked</div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3">
              <Star className="h-6 w-6 fill-amber-400 text-amber-500" aria-hidden="true" />
              <span className="font-mono-num text-2xl font-extrabold text-slate-900">
                {state.stars}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_BADGES.map((badge) => {
          const unlocked = state.unlockedBadgeIds.includes(badge.id);

          const accentColors =
            badge.accent === 'sky'
              ? 'border-sky-300 bg-sky-50/70 text-sky-800'
              : badge.accent === 'mint'
                ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800'
                : 'border-amber-300 bg-amber-50/70 text-amber-800';

          const iconCircle =
            badge.accent === 'sky'
              ? 'bg-sky-600 text-white'
              : badge.accent === 'mint'
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white';

          return (
            <div
              key={badge.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                unlocked
                  ? `${accentColors} shadow-sm`
                  : 'border-slate-200 bg-white/80 text-slate-500'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      unlocked ? iconCircle : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {unlocked ? (
                      <IconGlyph name={badge.iconName} className="h-7 w-7" />
                    ) : (
                      <Lock className="h-6 w-6" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-sm font-bold">
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl font-extrabold text-slate-900">
                    {badge.title}
                  </h2>
                  <p className="mt-1 text-lg leading-snug text-slate-700">
                    {badge.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
