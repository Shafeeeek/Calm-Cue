import {colors} from './colors';
import type {BreathPhase, GroundingStep} from '../types/app';

// Timed phases drive both the animated orb and the countdown label.
export const breathPhases: BreathPhase[] = [
  {label: 'Inhale', duration: 4, cue: 'Fill the belly slowly', target: 1},
  {label: 'Hold', duration: 4, cue: 'Let the shoulders drop', target: 1},
  {label: 'Exhale', duration: 6, cue: 'Release your jaw', target: 0},
  {label: 'Rest', duration: 2, cue: 'Notice the chair beneath you', target: 0},
];

export const groundingSteps: GroundingStep[] = [
  {
    key: 'see',
    count: '5',
    title: 'things you can see',
    cue: 'Find edges, colors, light, or shadows.',
    color: colors.green,
  },
  {
    key: 'feel',
    count: '4',
    title: 'things you can feel',
    cue: 'Feet, sleeves, air, phone, or the floor.',
    color: colors.groundingFeel,
  },
  {
    key: 'hear',
    count: '3',
    title: 'sounds you can hear',
    cue: 'Near, far, steady, soft, or brief.',
    color: colors.blue,
  },
  {
    key: 'smell',
    count: '2',
    title: 'things you can smell',
    cue: 'Name them, or name two smells you like.',
    color: colors.groundingSmell,
  },
  {
    key: 'taste',
    count: '1',
    title: 'thing you can taste',
    cue: 'Sip water or notice your mouth.',
    color: colors.danger,
  },
];

export const smallActions = [
  'Put both feet flat',
  'Loosen your hands',
  'Drink water',
  'Text a safe person',
  'Step toward daylight',
  'Name one next task',
];

export const worryChoices = [
  {
    key: 'now',
    label: 'I can act now',
    step: 'Choose one two-minute action and make it smaller than you think it needs to be.',
  },
  {
    key: 'later',
    label: 'I can park it',
    step: 'Write the worry as one sentence and give it a time to revisit.',
  },
  {
    key: 'support',
    label: 'I need support',
    step: 'Send one honest message: "I am anxious and could use a check-in."',
  },
];

export const supportPreferenceOptions = [
  'Daily check-in',
  'Breathing reminders',
  'Grounding practice',
  'Support contact',
];
