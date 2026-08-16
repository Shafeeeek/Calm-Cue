import {
  requireSupabaseConfiguration,
  supabase,
} from '../lib/supabase';
import type {ChatRole} from '../types/app';

export type ProfileInput = {
  allowReminders: boolean;
  email: string;
  fullName: string;
  phone: string;
  primaryGoal: string;
  supportContact: string;
};

export type StoredChatMessage = {
  body: string;
  created_at: string;
  id: string;
  role: ChatRole;
};

async function getUserId() {
  requireSupabaseConfiguration();
  const {data, error} = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Sign in before saving cloud data.');
  }

  return data.user.id;
}

export async function saveProfile(input: ProfileInput) {
  const userId = await getUserId();
  const {data, error} = await supabase
    .from('profiles')
    .upsert(
      {
        email: input.email.trim().toLowerCase(),
        full_name: input.fullName.trim(),
        id: userId,
        phone: input.phone.trim() || null,
        primary_goal: input.primaryGoal,
        reminders_enabled: input.allowReminders,
        support_contact: input.supportContact.trim() || null,
      },
      {onConflict: 'id'},
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveMoodCheckIn(anxietyLevel: number) {
  const userId = await getUserId();
  const {error} = await supabase.from('mood_check_ins').insert({
    anxiety_level: anxietyLevel,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function saveBreathingSession(input: {
  durationSeconds: number;
  startedAt: string;
}) {
  const userId = await getUserId();
  const {error} = await supabase.from('breathing_sessions').insert({
    completed_at: new Date().toISOString(),
    duration_seconds: input.durationSeconds,
    started_at: input.startedAt,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function saveGroundingSession(completedSteps: string[]) {
  const userId = await getUserId();
  const {error} = await supabase.from('grounding_sessions').insert({
    completed_steps: completedSteps,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function getChatMessages(): Promise<StoredChatMessage[]> {
  const userId = await getUserId();
  const {data, error} = await supabase
    .from('chat_messages')
    .select('id, role, body, created_at')
    .eq('user_id', userId)
    .order('created_at', {ascending: true})
    .limit(100);

  if (error) {
    throw error;
  }

  return (data ?? []) as StoredChatMessage[];
}

export async function saveChatMessages(
  messages: Array<{body: string; role: ChatRole}>,
) {
  const userId = await getUserId();
  const {error} = await supabase.from('chat_messages').insert(
    messages.map(message => ({
      body: message.body,
      role: message.role,
      user_id: userId,
    })),
  );

  if (error) {
    throw error;
  }
}
