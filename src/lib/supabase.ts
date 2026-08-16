import 'react-native-url-polyfill/auto';

import {createClient, processLock} from '@supabase/supabase-js';
import * as Keychain from 'react-native-keychain';
import {AppState} from 'react-native';

const configuredUrl = process.env.SUPABASE_URL?.trim() ?? '';
const configuredKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

export const isSupabaseConfigured =
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(configuredUrl) &&
  configuredKey.length > 20 &&
  !configuredUrl.includes('YOUR_PROJECT_REF') &&
  !configuredKey.includes('YOUR_KEY');

const keychainStorage = {
  async getItem(key: string) {
    const credentials = await Keychain.getGenericPassword({service: key});
    return credentials ? credentials.password : null;
  },
  async removeItem(key: string) {
    await Keychain.resetGenericPassword({service: key});
  },
  async setItem(key: string, value: string) {
    await Keychain.setGenericPassword('calm-cue', value, {
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      service: key,
    });
  },
};

// A harmless fallback keeps imports and local UI development working before
// the developer adds real project values. Every data method checks config first.
export const supabase = createClient(
  isSupabaseConfigured ? configuredUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? configuredKey : 'sb_publishable_placeholder_key',
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      lock: processLock,
      persistSession: true,
      storage: keychainStorage,
    },
  },
);

export function requireSupabaseConfiguration() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env, add the Project URL and publishable key, then restart Metro.',
    );
  }
}

export function initializeSupabaseAutoRefresh() {
  if (!isSupabaseConfigured) {
    return () => undefined;
  }

  if (AppState.currentState === 'active') {
    supabase.auth.startAutoRefresh();
  }

  const subscription = AppState.addEventListener('change', state => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  return () => {
    subscription.remove();
    supabase.auth.stopAutoRefresh();
  };
}
