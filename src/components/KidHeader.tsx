import { Award, CheckSquare, Compass, Lock, ShieldAlert } from 'lucide-react';
import type { AppView } from '../types/kidhero';

interface KidHeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenSafeInfo: () => void;
}

const NAV_ITEMS: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'help', label: 'Help Now', icon: Compass },
  { id: 'missions', label: 'Mission Board', icon: CheckSquare },
  { id: 'badges', label: 'Skill Badges', icon: Award },
  { id: 'parent', label: 'Parent Mode', icon: Lock },
];

export function KidHeader({ activeView, onSelectView, onOpenSafeInfo }: KidHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-[#FFFBF2]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectView('help')}
            className="font-display min-h-[48px] cursor-pointer text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            KidHero HQ
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectView(item.id)}
                  className={`min-h-[44px] cursor-pointer border-b-2 px-1 text-base font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${
                    isActive
                      ? 'border-sky-600 text-sky-700'
                      : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenSafeInfo}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-sky-700 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <ShieldAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>My Safe Info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Thumb-Zone Bottom Navigation Bar (keeps sticky total well under 15% vh) */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-amber-200/80 bg-white/95 backdrop-blur-md md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`flex min-h-[56px] cursor-pointer flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs font-semibold transition-colors ${
                isActive ? 'text-sky-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} aria-hidden="true" />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
