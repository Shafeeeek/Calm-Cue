import type {Animated} from 'react-native';

export type BreathPhase = {
  label: string;
  duration: number;
  cue: string;
  target: number;
};

export type GroundingStep = {
  key: string;
  count: string;
  title: string;
  cue: string;
  color: string;
};

export type AppScreen = 'calm' | 'videos' | 'bot' | 'registration';

export type AuthScreen = 'welcome' | 'login';

export type ChatRole = 'bot' | 'user';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

export type CalmScreenProps = {
  anxietyLevel: number;
  breathOpacity: Animated.AnimatedInterpolation<string | number>;
  breathScale: Animated.AnimatedInterpolation<string | number>;
  completedGrounding: Record<string, boolean>;
  currentPhase: BreathPhase;
  groundingCount: number;
  isBreathing: boolean;
  moodCopy: string;
  secondsLeft: number;
  selectedAction: string;
  selectedWorry: string;
  selectedWorryStep: string;
  onBreathingPress: () => void;
  onGroundingToggle: (key: string) => void;
  onGroundingReset: () => void;
  onLevelSelect: (level: number) => void;
  onActionSelect: (action: string) => void;
  onWorrySelect: (key: string) => void;
};
