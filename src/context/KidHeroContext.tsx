import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_EMERGENCY_PROFILE, DEFAULT_MISSIONS, SKILL_BADGES } from '../data/missions';
import { SCENARIO_GUIDES } from '../data/scenarios';
import type {
  EmergencyContact,
  EmergencyProfile,
  KidHeroPersistedState,
  LifeMission,
  MissionCategory,
  PracticeLogEntry,
  SkillBadge,
} from '../types/kidhero';

const STORAGE_KEY = 'kidhero_hq_state_v1';
const STATE_VERSION = 1;

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createInitialState(): KidHeroPersistedState {
  return {
    version: STATE_VERSION,
    stars: 25,
    streakDays: 3,
    lastActiveDate: getTodayIsoDate(),
    completedScenarios: {
      'lost-in-public': 1,
    },
    practiceLog: [
      {
        id: 'seed-log-1',
        scenarioId: 'lost-in-public',
        scenarioTitle: "I'm Lost in Public",
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        stepsVisited: 5,
      },
    ],
    missions: DEFAULT_MISSIONS,
    unlockedBadgeIds: ['badge-first-star', 'badge-safety-scout'],
    emergencyProfile: DEFAULT_EMERGENCY_PROFILE,
  };
}

function loadStateFromStorage(): KidHeroPersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<KidHeroPersistedState>;
    if (!parsed || typeof parsed !== 'object') return createInitialState();

    const today = getTodayIsoDate();
    const initial = createInitialState();
    const missions = Array.isArray(parsed.missions) && parsed.missions.length > 0
      ? parsed.missions
      : initial.missions;

    // Reset daily completion status cleanly if date rolled over
    const isNewDay = parsed.lastActiveDate && parsed.lastActiveDate !== today;
    const normalizedMissions = isNewDay
      ? missions.map((m) => ({
          ...m,
          completedToday: false,
          currentCount: m.targetCount ? 0 : m.currentCount,
        }))
      : missions;

    return {
      version: STATE_VERSION,
      stars: typeof parsed.stars === 'number' ? parsed.stars : initial.stars,
      streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : initial.streakDays,
      lastActiveDate: today,
      completedScenarios: parsed.completedScenarios ?? initial.completedScenarios,
      practiceLog: Array.isArray(parsed.practiceLog) ? parsed.practiceLog : initial.practiceLog,
      missions: normalizedMissions,
      unlockedBadgeIds: Array.isArray(parsed.unlockedBadgeIds)
        ? parsed.unlockedBadgeIds
        : initial.unlockedBadgeIds,
      emergencyProfile: parsed.emergencyProfile ?? initial.emergencyProfile,
    };
  } catch {
    return createInitialState();
  }
}

function computeUnlockedBadges(
  stars: number,
  completedScenarios: Record<string, number>,
  missions: LifeMission[],
  existingIds: string[],
): string[] {
  const completedMissionsCount = missions.filter((m) => m.completedToday).length;
  const unlocked = new Set<string>(existingIds);

  for (const badge of SKILL_BADGES) {
    if (badge.starsRequired && stars >= badge.starsRequired) {
      unlocked.add(badge.id);
    }
    if (badge.scenarioIdRequired && (completedScenarios[badge.scenarioIdRequired] ?? 0) > 0) {
      unlocked.add(badge.id);
    }
    if (badge.missionsRequired && completedMissionsCount >= badge.missionsRequired) {
      unlocked.add(badge.id);
    }
  }

  return Array.from(unlocked);
}

export interface CelebrationToast {
  id: number;
  title: string;
  starsEarned: number;
  newBadges: SkillBadge[];
}

interface KidHeroContextValue {
  state: KidHeroPersistedState;
  confettiTrigger: number;
  celebration: CelebrationToast | null;
  dismissCelebration: () => void;
  completeScenario: (scenarioId: string, stepsVisited: number) => void;
  toggleMission: (missionId: string) => void;
  incrementMissionStep: (missionId: string) => void;
  addCustomMission: (title: string, description: string, category: MissionCategory, starReward: number) => void;
  deleteMission: (missionId: string) => void;
  resetDailyMissions: () => void;
  updateEmergencyProfile: (updated: EmergencyProfile) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (contactId: string) => void;
  resetAllDemoData: () => void;
}

const KidHeroContext = createContext<KidHeroContextValue | null>(null);

export function KidHeroProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KidHeroPersistedState>(() => loadStateFromStorage());
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [celebration, setCelebration] = useState<CelebrationToast | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [state]);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
  }, []);

  const triggerCelebration = useCallback(
    (title: string, starsEarned: number, newBadgeIds: string[], prevBadgeIds: string[]) => {
      const newlyUnlocked = SKILL_BADGES.filter(
        (b) => newBadgeIds.includes(b.id) && !prevBadgeIds.includes(b.id),
      );
      setConfettiTrigger((c) => c + 1);
      setCelebration({
        id: Date.now(),
        title,
        starsEarned,
        newBadges: newlyUnlocked,
      });
    },
    [],
  );

  const completeScenario = useCallback(
    (scenarioId: string, stepsVisited: number) => {
      const guide = SCENARIO_GUIDES.find((g) => g.id === scenarioId);
      if (!guide) return;

      setState((prev) => {
        const nextStars = prev.stars + guide.starReward;
        const nextCompletedScenarios = {
          ...prev.completedScenarios,
          [scenarioId]: (prev.completedScenarios[scenarioId] ?? 0) + 1,
        };
        const logEntry: PracticeLogEntry = {
          id: `log-${Date.now()}`,
          scenarioId,
          scenarioTitle: guide.title,
          completedAt: new Date().toISOString(),
          stepsVisited,
        };
        const nextBadgeIds = computeUnlockedBadges(
          nextStars,
          nextCompletedScenarios,
          prev.missions,
          prev.unlockedBadgeIds,
        );

        queueMicrotask(() => {
          triggerCelebration(
            `Completed "${guide.title}"`,
            guide.starReward,
            nextBadgeIds,
            prev.unlockedBadgeIds,
          );
        });

        return {
          ...prev,
          stars: nextStars,
          lastActiveDate: getTodayIsoDate(),
          completedScenarios: nextCompletedScenarios,
          practiceLog: [logEntry, ...prev.practiceLog].slice(0, 40),
          unlockedBadgeIds: nextBadgeIds,
        };
      });
    },
    [triggerCelebration],
  );

  const toggleMission = useCallback(
    (missionId: string) => {
      setState((prev) => {
        const target = prev.missions.find((m) => m.id === missionId);
        if (!target) return prev;

        const nowCompleted = !target.completedToday;
        const starDelta = nowCompleted ? target.starReward : -target.starReward;
        const nextStars = Math.max(0, prev.stars + starDelta);

        const nextMissions = prev.missions.map((m) =>
          m.id === missionId
            ? {
                ...m,
                completedToday: nowCompleted,
                currentCount: m.targetCount ? (nowCompleted ? m.targetCount : 0) : m.currentCount,
              }
            : m,
        );

        const nextBadgeIds = computeUnlockedBadges(
          nextStars,
          prev.completedScenarios,
          nextMissions,
          prev.unlockedBadgeIds,
        );

        if (nowCompleted) {
          queueMicrotask(() => {
            triggerCelebration(
              `Mission Done: ${target.title}`,
              target.starReward,
              nextBadgeIds,
              prev.unlockedBadgeIds,
            );
          });
        }

        return {
          ...prev,
          stars: nextStars,
          lastActiveDate: getTodayIsoDate(),
          missions: nextMissions,
          unlockedBadgeIds: nextBadgeIds,
        };
      });
    },
    [triggerCelebration],
  );

  const incrementMissionStep = useCallback(
    (missionId: string) => {
      setState((prev) => {
        const target = prev.missions.find((m) => m.id === missionId);
        if (!target || !target.targetCount) return prev;

        const current = target.currentCount ?? 0;
        const nextCount = current >= target.targetCount ? 0 : current + 1;
        const becameCompleted = nextCount === target.targetCount && !target.completedToday;
        const becameUncompleted = nextCount < target.targetCount && target.completedToday;

        const starDelta = becameCompleted
          ? target.starReward
          : becameUncompleted
            ? -target.starReward
            : 0;
        const nextStars = Math.max(0, prev.stars + starDelta);

        const nextMissions = prev.missions.map((m) =>
          m.id === missionId
            ? {
                ...m,
                currentCount: nextCount,
                completedToday: nextCount >= target.targetCount!,
              }
            : m,
        );

        const nextBadgeIds = computeUnlockedBadges(
          nextStars,
          prev.completedScenarios,
          nextMissions,
          prev.unlockedBadgeIds,
        );

        if (becameCompleted) {
          queueMicrotask(() => {
            triggerCelebration(
              `Goal Reached: ${target.title}`,
              target.starReward,
              nextBadgeIds,
              prev.unlockedBadgeIds,
            );
          });
        }

        return {
          ...prev,
          stars: nextStars,
          lastActiveDate: getTodayIsoDate(),
          missions: nextMissions,
          unlockedBadgeIds: nextBadgeIds,
        };
      });
    },
    [triggerCelebration],
  );

  const addCustomMission = useCallback(
    (title: string, description: string, category: MissionCategory, starReward: number) => {
      const cleanTitle = title.trim();
      if (!cleanTitle) return;
      const newMission: LifeMission = {
        id: `custom-mission-${Date.now()}`,
        title: cleanTitle,
        description: description.trim() || 'Parent-added daily life skill mission.',
        category,
        starReward: Math.max(5, Math.min(50, starReward)),
        completedToday: false,
        isCustom: true,
        iconName: 'CheckCircle2',
      };
      setState((prev) => ({
        ...prev,
        missions: [newMission, ...prev.missions],
      }));
    },
    [],
  );

  const deleteMission = useCallback((missionId: string) => {
    setState((prev) => ({
      ...prev,
      missions: prev.missions.filter((m) => m.id !== missionId),
    }));
  }, []);

  const resetDailyMissions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      missions: prev.missions.map((m) => ({
        ...m,
        completedToday: false,
        currentCount: m.targetCount ? 0 : m.currentCount,
      })),
    }));
  }, []);

  const updateEmergencyProfile = useCallback((updated: EmergencyProfile) => {
    setState((prev) => ({
      ...prev,
      emergencyProfile: updated,
    }));
  }, []);

  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    setState((prev) => ({
      ...prev,
      emergencyProfile: {
        ...prev.emergencyProfile,
        contacts: [
          ...prev.emergencyProfile.contacts,
          { ...contact, id: `contact-${Date.now()}` },
        ],
      },
    }));
  }, []);

  const removeEmergencyContact = useCallback((contactId: string) => {
    setState((prev) => ({
      ...prev,
      emergencyProfile: {
        ...prev.emergencyProfile,
        contacts: prev.emergencyProfile.contacts.filter((c) => c.id !== contactId),
      },
    }));
  }, []);

  const resetAllDemoData = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
  }, []);

  const value = useMemo<KidHeroContextValue>(
    () => ({
      state,
      confettiTrigger,
      celebration,
      dismissCelebration,
      completeScenario,
      toggleMission,
      incrementMissionStep,
      addCustomMission,
      deleteMission,
      resetDailyMissions,
      updateEmergencyProfile,
      addEmergencyContact,
      removeEmergencyContact,
      resetAllDemoData,
    }),
    [
      state,
      confettiTrigger,
      celebration,
      dismissCelebration,
      completeScenario,
      toggleMission,
      incrementMissionStep,
      addCustomMission,
      deleteMission,
      resetDailyMissions,
      updateEmergencyProfile,
      addEmergencyContact,
      removeEmergencyContact,
      resetAllDemoData,
    ],
  );

  return <KidHeroContext.Provider value={value}>{children}</KidHeroContext.Provider>;
}

export function useKidHero() {
  const ctx = useContext(KidHeroContext);
  if (!ctx) {
    throw new Error('useKidHero must be used within a KidHeroProvider');
  }
  return ctx;
}
