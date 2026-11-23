/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Award, Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConfettiBurst } from './components/ConfettiBurst';
import { InteractiveStepPlayer } from './components/InteractiveStepPlayer';
import { KidHeader } from './components/KidHeader';
import { MissionBoard } from './components/MissionBoard';
import { ParentSettingsDrawer } from './components/ParentSettingsDrawer';
import { ProblemGrid } from './components/ProblemGrid';
import { SafeInfoModal } from './components/SafeInfoModal';
import { SkillBadgesView } from './components/SkillBadgesView';
import { KidHeroProvider, useKidHero } from './context/KidHeroContext';
import type { AppView, ScenarioGuide } from './types/kidhero';

function KidHeroShell() {
  const { confettiTrigger, celebration, dismissCelebration } = useKidHero();
  const [activeView, setActiveView] = useState<AppView>('help');
  const [activeGuide, setActiveGuide] = useState<ScenarioGuide | null>(null);
  const [safeInfoOpen, setSafeInfoOpen] = useState(false);

  useEffect(() => {
    if (!celebration) return;
    const timer = window.setTimeout(() => {
      dismissCelebration();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [celebration, dismissCelebration]);

  const handleSelectView = (view: AppView) => {
    setActiveGuide(null);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] text-slate-900">
      <ConfettiBurst triggerKey={confettiTrigger} />

      <KidHeader
        activeView={activeView}
        onSelectView={handleSelectView}
        onOpenSafeInfo={() => setSafeInfoOpen(true)}
      />

      {/* Celebratory Toast Banner */}
      {celebration && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-40 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-amber-300 bg-white p-4 shadow-lg md:bottom-6 md:right-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Star className="h-6 w-6 fill-amber-400" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="font-display text-base font-extrabold text-slate-900">
                  {celebration.title}
                </div>
                <div className="font-mono-num text-sm font-bold text-amber-700">
                  +{celebration.starsEarned} Hero Stars
                </div>
                {celebration.newBadges.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1.5 text-sm font-bold text-emerald-700"
                  >
                    <Award className="h-4 w-4" aria-hidden="true" />
                    <span>New Badge Unlocked: {b.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={dismissCelebration}
              aria-label="Dismiss celebration"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:px-6 md:pb-12">
        {activeGuide ? (
          <InteractiveStepPlayer
            guide={activeGuide}
            onClose={() => setActiveGuide(null)}
            onOpenSafeInfoModal={() => setSafeInfoOpen(true)}
          />
        ) : activeView === 'help' ? (
          <ProblemGrid
            onStartScenario={(guide) => {
              setActiveGuide(guide);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToMissions={() => handleSelectView('missions')}
          />
        ) : activeView === 'missions' ? (
          <MissionBoard />
        ) : activeView === 'badges' ? (
          <SkillBadgesView />
        ) : (
          <ParentSettingsDrawer />
        )}
      </main>

      <footer className="border-t border-amber-200/70 bg-white/60 py-6 pb-24 md:pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:px-6">
          <span className="font-semibold text-slate-700">KidHero HQ</span>
          <span>Child-safe local storage · Zero ads, zero open chat, zero external tracking</span>
        </div>
      </footer>

      <SafeInfoModal
        isOpen={safeInfoOpen}
        onClose={() => setSafeInfoOpen(false)}
        onOpenParentMode={() => handleSelectView('parent')}
      />
    </div>
  );
}

export default function App() {
  return (
    <KidHeroProvider>
      <KidHeroShell />
    </KidHeroProvider>
  );
}
