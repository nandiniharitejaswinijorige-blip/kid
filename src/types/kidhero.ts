export type ScenarioCategory = 'safety' | 'feelings' | 'school';

export type StepInteractiveType =
  | 'choice'
  | 'breathing'
  | 'checklist'
  | 'safe-info-peek'
  | 'finish';

export interface StepChoice {
  label: string;
  nextStepId: string;
  tone?: 'primary' | 'secondary' | 'calm';
}

export interface BreathingConfig {
  inhaleSec: number;
  holdSec: number;
  exhaleSec: number;
  holdAfterSec?: number;
  cycles: number;
  label: string;
}

export interface StepNode {
  id: string;
  title: string;
  prompt: string;
  helperTip?: string;
  interactiveType: StepInteractiveType;
  breathingConfig?: BreathingConfig;
  checklistItems?: string[];
  choices?: StepChoice[];
  nextStepId?: string;
  celebrationMessage?: string;
}

export interface ScenarioGuide {
  id: string;
  title: string;
  shortDescription: string;
  category: ScenarioCategory;
  iconName: string;
  estimatedMinutes: number;
  starReward: number;
  startStepId: string;
  steps: Record<string, StepNode>;
}

export type MissionCategory = 'morning' | 'school' | 'health' | 'home';

export interface LifeMission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  starReward: number;
  targetCount?: number;
  currentCount?: number;
  completedToday: boolean;
  isCustom?: boolean;
  iconName: string;
}

export interface SkillBadge {
  id: string;
  title: string;
  description: string;
  starsRequired?: number;
  scenarioIdRequired?: string;
  missionsRequired?: number;
  accent: 'sky' | 'amber' | 'mint';
  iconName: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary?: boolean;
}

export interface EmergencyProfile {
  kidName: string;
  kidAge: number;
  homeAddress: string;
  safeLandmark: string;
  allergyMedicalNotes: string;
  contacts: EmergencyContact[];
  parentPin: string;
}

export interface PracticeLogEntry {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  completedAt: string;
  stepsVisited: number;
}

export type AppView = 'help' | 'missions' | 'badges' | 'parent';

export interface KidHeroPersistedState {
  version: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string;
  completedScenarios: Record<string, number>;
  practiceLog: PracticeLogEntry[];
  missions: LifeMission[];
  unlockedBadgeIds: string[];
  emergencyProfile: EmergencyProfile;
}
