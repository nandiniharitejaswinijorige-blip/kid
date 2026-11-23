import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  CloudRain,
  Droplets,
  Sun,
  Wind,
} from 'lucide-react';
import { useState } from 'react';
import { useAgri } from '../context/AgriContext';
import { WEATHER_ADVISORIES } from '../data/agriData';
import { UI_TEXT } from '../data/i18n';
import type { WeatherAdvisory, WeatherDecision } from '../types/agri';

function getDecisionStyle(decision: WeatherDecision) {
  switch (decision) {
    case 'safe-spray':
      return {
        badgeBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        cardBorder: 'border-emerald-300',
        icon: CheckCircle2,
      };
    case 'harvest-window':
      return {
        badgeBg: 'bg-amber-100 text-amber-950 border-amber-300',
        cardBorder: 'border-amber-300',
        icon: Sun,
      };
    case 'fungal-alert':
      return {
        badgeBg: 'bg-amber-100 text-amber-950 border-amber-400',
        cardBorder: 'border-amber-300',
        icon: AlertTriangle,
      };
    case 'delay-irrigation':
      return {
        badgeBg: 'bg-sky-100 text-sky-950 border-sky-300',
        cardBorder: 'border-sky-300',
        icon: CloudRain,
      };
  }
}

function ConditionIcon({ condition }: { condition: WeatherAdvisory['condition'] }) {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-6 w-6 text-amber-600" aria-hidden="true" />;
    case 'rain':
      return <CloudRain className="h-6 w-6 text-sky-700" aria-hidden="true" />;
    case 'windy':
      return <Wind className="h-6 w-6 text-slate-700" aria-hidden="true" />;
    default:
      return <Cloud className="h-6 w-6 text-slate-600" aria-hidden="true" />;
  }
}

export function WeatherActionBanner({ expanded = false }: { expanded?: boolean }) {
  const { state } = useAgri();
  const lang = state.language;
  const t = UI_TEXT[lang];
  const [selectedDayId, setSelectedDayId] = useState(WEATHER_ADVISORIES[0].id);

  const activeDay =
    WEATHER_ADVISORIES.find((d) => d.id === selectedDayId) ?? WEATHER_ADVISORIES[0];
  const activeStyle = getDecisionStyle(activeDay.decision);
  const ActiveDecisionIcon = activeStyle.icon;

  return (
    <section
      aria-label="Farm weather action advisory"
      className="space-y-5"
    >
      {/* Selected Day Actionable Banner */}
      <div className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${activeStyle.cardBorder}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600">
              <span>{expanded ? t.weatherHeading : t.todaysWeatherAction}</span>
              <span aria-hidden="true">·</span>
              <span>
                {lang === 'hi' ? activeDay.dayLabelHi : activeDay.dayLabel} ({activeDay.dateStr})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-base font-extrabold ${activeStyle.badgeBg}`}
              >
                <ActiveDecisionIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>
                  {lang === 'hi' ? activeDay.decisionLabelHi : activeDay.decisionLabel}
                </span>
              </span>
            </div>

            <p className="max-w-3xl pt-1 text-base font-medium text-slate-800">
              {lang === 'hi' ? activeDay.actionNoteHi : activeDay.actionNote}
            </p>
          </div>

          {/* Crisp Telemetry Readout */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-stone-200 bg-[#FAFAF9] px-4 py-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500">
                <CloudRain className="h-3.5 w-3.5 text-sky-700" aria-hidden="true" />
                <span>Rain</span>
              </div>
              <div className="font-mono-num mt-0.5 text-lg font-extrabold text-slate-900">
                {activeDay.rainProbPct}%
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500">
                <Wind className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                <span>Wind</span>
              </div>
              <div className="font-mono-num mt-0.5 text-lg font-extrabold text-slate-900">
                {activeDay.windKmh} km/h
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-500">
                <Droplets className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Hum</span>
              </div>
              <div className="font-mono-num mt-0.5 text-lg font-extrabold text-slate-900">
                {activeDay.humidityPct}%
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Selector Strip */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
          {WEATHER_ADVISORIES.map((day) => {
            const isSelected = day.id === activeDay.id;
            const dStyle = getDecisionStyle(day.decision);
            const DIcon = dStyle.icon;
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDayId(day.id)}
                className={`flex min-h-[92px] cursor-pointer flex-col justify-between rounded-xl border p-3 text-left transition-colors ${
                  isSelected
                    ? 'border-[#14532D] bg-green-50/70'
                    : 'border-stone-200 bg-[#FAFAF9] hover:border-stone-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-slate-900">
                    {lang === 'hi' ? day.dayLabelHi : day.dayLabel}
                  </span>
                  <ConditionIcon condition={day.condition} />
                </div>

                <div className="font-mono-num text-sm font-bold text-slate-700">
                  {day.tempMaxC}° / {day.tempMinC}°C
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <DIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {day.decision === 'safe-spray'
                      ? lang === 'hi'
                        ? 'सुरक्षित स्प्रे'
                        : 'Safe Spray'
                      : day.decision === 'delay-irrigation'
                        ? lang === 'hi'
                          ? 'सिंचाई रोकें'
                          : 'Hold Water'
                        : day.decision === 'fungal-alert'
                          ? lang === 'hi'
                            ? 'फफूंद खतरा'
                            : 'Fungal Alert'
                          : lang === 'hi'
                            ? 'कटाई समय'
                            : 'Harvest'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded 7-Day Action Cards when viewing full Weather Tab */}
      {expanded && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WEATHER_ADVISORIES.map((day) => {
            const style = getDecisionStyle(day.decision);
            const Icon = style.icon;
            return (
              <div
                key={day.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-extrabold text-slate-900">
                        {lang === 'hi' ? day.dayLabelHi : day.dayLabel} · {day.dateStr}
                      </h3>
                      <p className="font-mono-num text-sm font-semibold text-slate-600">
                        {day.tempMaxC}°C High / {day.tempMinC}°C Low
                      </p>
                    </div>
                    <ConditionIcon condition={day.condition} />
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-extrabold ${style.badgeBg}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{lang === 'hi' ? day.decisionLabelHi : day.decisionLabel}</span>
                  </div>

                  <p className="text-base leading-snug text-slate-700">
                    {lang === 'hi' ? day.actionNoteHi : day.actionNote}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 font-mono-num text-xs font-bold text-slate-600">
                  <span>Rain {day.rainProbPct}%</span>
                  <span>Wind {day.windKmh} km/h</span>
                  <span>Humidity {day.humidityPct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
