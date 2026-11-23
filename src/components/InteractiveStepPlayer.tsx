import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pause,
  Phone,
  Play,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useKidHero } from '../context/KidHeroContext';
import type { BreathingConfig, ScenarioGuide, StepNode } from '../types/kidhero';
import { IconGlyph } from './IconGlyph';

interface InteractiveStepPlayerProps {
  guide: ScenarioGuide;
  onClose: () => void;
  onOpenSafeInfoModal: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfter';

function BreathingTimerWidget({
  config,
  onCompletedAllCycles,
}: {
  config: BreathingConfig;
  onCompletedAllCycles: () => void;
}) {
  const [isRunning, setIsRunning] = useState(true);
  const [cycle, setCycle] = useState(1);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(config.inhaleSec);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIsRunning(true);
    setCycle(1);
    setPhase('inhale');
    setSecondsLeft(config.inhaleSec);
    setFinished(false);
  }, [config]);

  useEffect(() => {
    if (!isRunning || finished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Advance phase
        if (phase === 'inhale') {
          if (config.holdSec > 0) {
            setPhase('hold');
            return config.holdSec;
          }
          setPhase('exhale');
          return config.exhaleSec;
        }
        if (phase === 'hold') {
          setPhase('exhale');
          return config.exhaleSec;
        }
        if (phase === 'exhale') {
          if (config.holdAfterSec && config.holdAfterSec > 0) {
            setPhase('holdAfter');
            return config.holdAfterSec;
          }
          if (cycle >= config.cycles) {
            setFinished(true);
            setIsRunning(false);
            onCompletedAllCycles();
            return 0;
          }
          setCycle((c) => c + 1);
          setPhase('inhale');
          return config.inhaleSec;
        }
        // holdAfter
        if (cycle >= config.cycles) {
          setFinished(true);
          setIsRunning(false);
          onCompletedAllCycles();
          return 0;
        }
        setCycle((c) => c + 1);
        setPhase('inhale');
        return config.inhaleSec;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, finished, phase, cycle, config, onCompletedAllCycles]);

  const phaseLabel = useMemo(() => {
    if (finished) return 'Great breathing!';
    switch (phase) {
      case 'inhale':
        return 'Breathe In Slowly';
      case 'hold':
        return 'Hold Gently';
      case 'exhale':
        return 'Breathe Out Softly';
      case 'holdAfter':
        return 'Rest Empty';
    }
  }, [phase, finished]);

  const scaleClass =
    finished
      ? 'scale-100'
      : phase === 'inhale' || phase === 'hold'
        ? 'scale-115'
        : 'scale-90';

  const circleColorClass =
    finished
      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
      : phase === 'inhale'
        ? 'bg-sky-100 border-sky-400 text-sky-900'
        : phase === 'hold' || phase === 'holdAfter'
          ? 'bg-amber-100 border-amber-400 text-amber-900'
          : 'bg-emerald-100 border-emerald-400 text-emerald-900';

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-sky-200/80 bg-sky-50/50 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-center gap-3 text-base font-bold text-slate-700">
        <span>{config.label}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="font-mono-num">
          Round {Math.min(cycle, config.cycles)} of {config.cycles}
        </span>
      </div>

      <div className="flex h-52 w-52 items-center justify-center">
        <div
          className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 shadow-sm transition-transform duration-1000 ease-in-out ${scaleClass} ${circleColorClass}`}
        >
          <span className="font-mono-num text-4xl font-extrabold">
            {finished ? 'Done' : `${secondsLeft}s`}
          </span>
          <span className="mt-1 px-3 text-center text-sm font-bold leading-tight">
            {phaseLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!finished && (
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-800 transition-colors hover:bg-slate-50"
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5" aria-hidden="true" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>Resume</span>
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setCycle(1);
            setPhase('inhale');
            setSecondsLeft(config.inhaleSec);
            setFinished(false);
            setIsRunning(true);
          }}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          <span>Restart Breath</span>
        </button>
      </div>
    </div>
  );
}

export function InteractiveStepPlayer({
  guide,
  onClose,
  onOpenSafeInfoModal,
}: InteractiveStepPlayerProps) {
  const { state, completeScenario } = useKidHero();
  const [history, setHistory] = useState<string[]>([guide.startStepId]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [breathingDone, setBreathingDone] = useState(false);
  const [hasClaimedReward, setHasClaimedReward] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentStepId = history[history.length - 1];
  const currentStep: StepNode = guide.steps[currentStepId] ?? guide.steps[guide.startStepId];

  useEffect(() => {
    setCheckedItems({});
    setBreathingDone(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStepId]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (currentStep.interactiveType === 'finish' && !hasClaimedReward) {
      setHasClaimedReward(true);
      completeScenario(guide.id, history.length);
    }
  }, [currentStep.interactiveType, hasClaimedReward, completeScenario, guide.id, history.length]);

  const handleGoToStep = (nextId: string) => {
    if (!guide.steps[nextId]) return;
    setHistory((prev) => [...prev, nextId]);
  };

  const handleBack = () => {
    if (history.length <= 1) {
      onClose();
      return;
    }
    setHistory((prev) => prev.slice(0, -1));
  };

  const toggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = [currentStep.title, currentStep.prompt, currentStep.helperTip]
      .filter(Boolean)
      .join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const checklistTotal = currentStep.checklistItems?.length ?? 0;
  const checklistDoneCount = Object.values(checkedItems).filter(Boolean).length;
  const allChecklistDone = checklistTotal > 0 && checklistDoneCount === checklistTotal;
  const primaryContact =
    state.emergencyProfile.contacts.find((c) => c.isPrimary) ??
    state.emergencyProfile.contacts[0];

  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-base font-bold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          <span>{history.length > 1 ? 'Previous Step' : 'All Helpers'}</span>
        </button>

        <div className="flex items-center gap-3">
          {speechSupported && (
            <button
              type="button"
              onClick={toggleReadAloud}
              className={`inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border px-4 py-2.5 text-base font-bold transition-colors ${
                isSpeaking
                  ? 'border-sky-300 bg-sky-100 text-sky-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-5 w-5" aria-hidden="true" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5" aria-hidden="true" />
                  <span>Read to Me</span>
                </>
              )}
            </button>
          )}
          <span className="font-mono-num text-base font-bold text-slate-500">
            Step {history.length}
          </span>
        </div>
      </div>

      {/* Focused Single-Step Card */}
      <article className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm sm:p-10">
        <div className="space-y-6">
          {/* Guide Context Line */}
          <div className="flex items-center gap-3 text-base font-semibold text-sky-700">
            <IconGlyph name={guide.iconName} className="h-5 w-5" />
            <span>{guide.title}</span>
          </div>

          {/* Step Title & Calm Large Prompt */}
          <div className="space-y-3">
            <h1 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl [text-wrap:balance]">
              {currentStep.title}
            </h1>
            <p className="text-xl leading-relaxed text-slate-800">
              {currentStep.prompt}
            </p>
            {currentStep.helperTip && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-lg font-medium text-amber-950">
                {currentStep.helperTip}
              </div>
            )}
          </div>

          {/* Interactive Type: Breathing Timer */}
          {currentStep.interactiveType === 'breathing' && currentStep.breathingConfig && (
            <div className="space-y-5">
              <BreathingTimerWidget
                config={currentStep.breathingConfig}
                onCompletedAllCycles={() => setBreathingDone(true)}
              />
              {currentStep.nextStepId && (
                <button
                  type="button"
                  onClick={() => handleGoToStep(currentStep.nextStepId!)}
                  className={`flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-lg font-bold transition-colors ${
                    breathingDone
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  <span>
                    {breathingDone ? 'I Feel Calmer — Next Step' : 'Continue to Next Step'}
                  </span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Interactive Type: Branching Choices */}
          {currentStep.interactiveType === 'choice' && currentStep.choices && (
            <div className="space-y-3 pt-2">
              {currentStep.choices.map((choice) => {
                const styleClass =
                  choice.tone === 'primary'
                    ? 'border-sky-600 bg-sky-600 text-white hover:bg-sky-700'
                    : choice.tone === 'calm'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                      : 'border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100';

                return (
                  <button
                    key={choice.nextStepId + choice.label}
                    type="button"
                    onClick={() => handleGoToStep(choice.nextStepId)}
                    className={`flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border px-6 py-4 text-left text-lg font-bold transition-colors active:scale-[0.99] ${styleClass}`}
                  >
                    <span>{choice.label}</span>
                    <ArrowRight className="h-6 w-6 shrink-0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Interactive Type: Checklist */}
          {currentStep.interactiveType === 'checklist' && currentStep.checklistItems && (
            <div className="space-y-4">
              <div className="space-y-3">
                {currentStep.checklistItems.map((item, idx) => {
                  const key = `${currentStep.id}-${idx}`;
                  const checked = !!checkedItems[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className={`flex min-h-[58px] w-full cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 text-left text-lg font-semibold transition-colors ${
                        checked
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                          : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                          checked
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />}
                      </span>
                      <span className={checked ? 'line-through opacity-80' : ''}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>

              {currentStep.nextStepId && (
                <button
                  type="button"
                  onClick={() => handleGoToStep(currentStep.nextStepId!)}
                  className={`flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-lg font-bold transition-colors ${
                    allChecklistDone
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  <span>
                    {allChecklistDone
                      ? 'All Done! Finish Guide'
                      : `Next Step (${checklistDoneCount}/${checklistTotal} checked)`}
                  </span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Interactive Type: Safe Info Peek */}
          {currentStep.interactiveType === 'safe-info-peek' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-lg font-bold text-sky-950">
                    {state.emergencyProfile.kidName}’s Quick Safe Info
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSafeInfoModal}
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 text-base font-bold text-sky-700 underline underline-offset-4 hover:text-sky-900"
                  >
                    <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                    <span>Open Full Safe Card</span>
                  </button>
                </div>

                {primaryContact && (
                  <div className="rounded-xl border border-sky-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-500">
                      Primary Contact ({primaryContact.relationship})
                    </div>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xl font-extrabold text-slate-900">
                        {primaryContact.name}
                      </span>
                      <a
                        href={`tel:${primaryContact.phone.replace(/[^0-9+]/g, '')}`}
                        className="font-mono-num inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-lg font-bold text-white hover:bg-sky-700"
                      >
                        <Phone className="h-5 w-5" aria-hidden="true" />
                        <span>{primaryContact.phone}</span>
                      </a>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-sky-200 bg-white p-4 text-base text-slate-800">
                  <span className="font-bold text-slate-900">Home Landmark: </span>
                  {state.emergencyProfile.safeLandmark}
                </div>
              </div>

              {currentStep.nextStepId && (
                <button
                  type="button"
                  onClick={() => handleGoToStep(currentStep.nextStepId!)}
                  className="flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  <span>I Got Help — Finish Guide</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Interactive Type: Finish Celebration */}
          {currentStep.interactiveType === 'finish' && (
            <div className="space-y-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <Sparkles className="h-8 w-8" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <div className="font-mono-num text-xl font-extrabold text-emerald-800">
                  +{guide.starReward} Hero Stars Earned!
                </div>
                {currentStep.celebrationMessage && (
                  <p className="text-lg font-medium text-emerald-950">
                    {currentStep.celebrationMessage}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-lg font-bold text-white transition-colors hover:bg-slate-800 sm:w-auto sm:min-w-[260px]"
              >
                <span>Back to KidHero HQ</span>
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
