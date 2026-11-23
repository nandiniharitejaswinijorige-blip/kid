import { BookOpen, CloudSun, IndianRupee, Stethoscope, Tractor } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { UI_TEXT } from '../data/i18n';
import type { AgriTab } from '../types/agri';

interface AgriHeaderProps {
  activeTab: AgriTab;
  onSelectTab: (tab: AgriTab) => void;
  onOpenCropDoctor: () => void;
}

export function AgriHeader({
  activeTab,
  onSelectTab,
  onOpenCropDoctor,
}: AgriHeaderProps) {
  const { state } = useAgri();
  const t = UI_TEXT[state.language];

  const navItems: {
    id: AgriTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'mandi', label: t.navMandi, icon: IndianRupee },
    { id: 'weather', label: t.navWeather, icon: CloudSun },
    { id: 'equipment', label: t.navEquipment, icon: Tractor },
    { id: 'ledger', label: t.navLedger, icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('mandi')}
            className="font-display min-h-[48px] cursor-pointer text-2xl font-extrabold tracking-tight text-[#14532D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            KisanSetu
          </button>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`min-h-[44px] cursor-pointer border-b-2 px-1 text-base font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D] ${
                    isActive
                      ? 'border-[#14532D] text-[#14532D]'
                      : 'border-transparent text-slate-600 hover:border-stone-300 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Field CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCropDoctor}
              className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-green-900 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D]"
            >
              <Stethoscope className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{t.ctaCropDoctor}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Thumb-Zone Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-stone-200 bg-white/95 backdrop-blur-md md:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex min-h-[56px] cursor-pointer flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-xs font-bold transition-colors ${
                isActive ? 'text-[#14532D]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} aria-hidden="true" />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
