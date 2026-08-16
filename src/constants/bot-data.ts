import type {ChatMessage} from '../types/app';

export const initialBotMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'bot',
    text: "Hi, I'm Calm Bot. I can help you slow down, name what you feel, and choose one small next step.",
  },
  {
    id: 'safety',
    role: 'bot',
    text: "I'm not a licensed therapist. If you might hurt yourself or someone else, call emergency services now. In the U.S., you can call or text 988 for crisis support.",
  },
];

export const botQuickPrompts = [
  'I feel anxious',
  'I am panicking',
  'I cannot sleep',
  'I feel sad',
  'Help me ground',
];

const crisisKeywords = [
  'suicide',
  'kill myself',
  'end my life',
  'self harm',
  'hurt myself',
  'unsafe',
  'not safe',
  'die',
];

const panicKeywords = ['panic', 'panicking', 'heart racing', 'attack'];
const sleepKeywords = ['sleep', 'insomnia', 'tired', 'night'];
const sadnessKeywords = ['sad', 'depressed', 'lonely', 'hopeless'];
const anxietyKeywords = ['anxious', 'anxiety', 'worry', 'worried', 'stress'];
const groundingKeywords = ['ground', 'grounding', 'present', 'overthinking'];

function hasKeyword(message: string, keywords: string[]) {
  return keywords.some(keyword => message.includes(keyword));
}

export function buildBotReply(input: string) {
  const message = input.trim().toLowerCase();

  if (hasKeyword(message, crisisKeywords)) {
    return 'I am really glad you said that. Please stop using the app for a moment and contact immediate help now. If you are in the U.S., call or text 988. If you are elsewhere, call local emergency services or a trusted person who can stay with you.';
  }

  if (hasKeyword(message, panicKeywords)) {
    return 'Panic can feel intense, but it often rises and falls like a wave. Try this: put both feet down, unclench your jaw, inhale for 4, exhale for 6, and name 3 things you can see.';
  }

  if (hasKeyword(message, sleepKeywords)) {
    return 'For tonight, make the goal rest instead of perfect sleep. Dim the screen, relax your shoulders, and repeat: "I only need to rest my body for the next few minutes."';
  }

  if (hasKeyword(message, sadnessKeywords)) {
    return 'That sounds heavy. Try not to solve your whole life right now. Name one feeling, one need, and one safe person or place you can move toward today.';
  }

  if (hasKeyword(message, groundingKeywords)) {
    return 'Let us ground gently: 5 things you see, 4 things you feel, 3 sounds, 2 smells, and 1 taste. Go slowly. You are bringing your attention back to now.';
  }

  if (hasKeyword(message, anxietyKeywords)) {
    return 'Anxiety is trying to protect you, even when it gets too loud. Ask: "What is one thing I can control in the next two minutes?" Then choose the smallest version of that.';
  }

  return 'I hear you. Let us make it smaller: what is the strongest feeling in your body right now, and what is one kind thing you can do for yourself in the next two minutes?';
}
