import {Platform} from 'react-native';

let GoogleSignin: any = null;
let AppleAuthentication: any = null;

const EMAIL_AUTH_ENDPOINT = '';
const DEMO_EMAIL = 'demo@calmcue.app';
const DEMO_PASSWORD = 'calm123';

type GoogleSignInConfig = {
  webClientId: string;
  iosClientId?: string;
};

type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  photoUrl?: string | null;
  fullName?: string | null;
};

type AuthTokens = {
  accessToken?: string | null;
  idToken?: string | null;
  identityToken?: string | null;
  sessionToken?: string | null;
};

type AuthSuccess = {
  success: true;
  user: AuthUser;
  tokens?: AuthTokens;
};

type AuthFailure = {
  success: false;
  error: string;
  cancelled?: boolean;
};

type AuthResult = AuthSuccess | AuthFailure;

type EmailSignInInput = {
  email: string;
  password: string;
};

type BackendLoginResponse = {
  accessToken?: string;
  error?: string;
  message?: string;
  sessionToken?: string;
  token?: string;
  user?: {
    email?: string;
    id?: string;
    name?: string;
    photoUrl?: string;
  };
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const parseResponseBody = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

// Lazy load Google Sign-In
const getGoogleSignIn = async () => {
  if (!GoogleSignin) {
    try {
      GoogleSignin = await import('@react-native-google-signin/google-signin').then(
        module => module.GoogleSignin,
      );
    } catch (error) {
      console.warn('Google Sign-In not available:', error);
      return null;
    }
  }
  return GoogleSignin;
};

// Lazy load Apple Authentication
const getAppleAuthentication = async () => {
  if (!AppleAuthentication && Platform.OS === 'ios') {
    try {
      const module = await import('@invertase/react-native-apple-authentication');
      AppleAuthentication = module.default ?? module.appleAuth ?? module;
    } catch (error) {
      console.warn('Apple Authentication not available:', error);
      return null;
    }
  }
  return AppleAuthentication;
};

// Initialize Google Sign-In
export const initializeGoogleSignIn = async ({
  webClientId,
  iosClientId,
}: GoogleSignInConfig) => {
  try {
    const GoogleSignInModule = await getGoogleSignIn();
    if (!GoogleSignInModule) return;

    GoogleSignInModule.configure({
      webClientId,
      iosClientId,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    });
  } catch (error) {
    console.error('Error configuring Google Sign-In:', error);
  }
};

export const emailSignIn = async ({
  email,
  password,
}: EmailSignInInput): Promise<AuthResult> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail.includes('@') || password.trim().length < 6) {
    return {
      success: false,
      error: 'Enter a valid email and a password with 6 or more characters.',
    };
  }

  if (!EMAIL_AUTH_ENDPOINT) {
    const isDemoAccount =
      normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD;

    if (!isDemoAccount) {
      return {
        success: false,
        error:
          'This demo build only accepts demo@calmcue.app with password calm123.',
      };
    }

    return {
      success: true,
      user: {
        id: 'demo-user',
        email: DEMO_EMAIL,
        name: 'Demo User',
      },
      tokens: {
        sessionToken: 'demo-session',
      },
    };
  }

  try {
    const response = await fetch(EMAIL_AUTH_ENDPOINT, {
      body: JSON.stringify({email: normalizedEmail, password}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    });
    const data = (await parseResponseBody(response)) as BackendLoginResponse;

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Invalid email or password.',
      };
    }

    const token = data.sessionToken || data.accessToken || data.token;

    return {
      success: true,
      user: {
        id: data.user?.id || normalizedEmail,
        email: data.user?.email || normalizedEmail,
        name: data.user?.name || normalizedEmail,
        photoUrl: data.user?.photoUrl,
      },
      tokens: {
        accessToken: data.accessToken,
        sessionToken: token,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'Unable to reach the login server.'),
    };
  }
};

// Google Sign-In
export const googleSignIn = async (): Promise<AuthResult> => {
  try {
    const GoogleSignInModule = await getGoogleSignIn();
    if (!GoogleSignInModule) {
      return {
        success: false,
        error: 'Google Sign-In not available',
      };
    }

    await GoogleSignInModule.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    const userInfo = await GoogleSignInModule.signIn();
    const tokens = await GoogleSignInModule.getTokens().catch(() => ({
      accessToken: null,
      idToken: userInfo.idToken,
    }));

    return {
      success: true,
      user: {
        id: userInfo.user.id,
        email: userInfo.user.email,
        name: userInfo.user.name,
        photoUrl: userInfo.user.photo,
      },
      tokens: {
        idToken: tokens.idToken || userInfo.idToken,
        accessToken: tokens.accessToken,
      },
    };
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    return {
      success: false,
      error: error.message || 'Google Sign-In failed',
    };
  }
};

// Google Sign-Out
export const googleSignOut = async () => {
  try {
    const GoogleSignInModule = await getGoogleSignIn();
    if (!GoogleSignInModule) return { success: false };

    await GoogleSignInModule.signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Google Sign-Out error:', error);
    return { success: false, error: error.message };
  }
};

// Check if user is already signed in with Google
export const isGoogleSignedIn = async () => {
  try {
    const GoogleSignInModule = await getGoogleSignIn();
    if (!GoogleSignInModule) return false;

    return Boolean(
      GoogleSignInModule.hasPreviousSignIn?.() ||
        GoogleSignInModule.getCurrentUser?.(),
    );
  } catch (error) {
    console.error('Error checking Google sign-in status:', error);
    return false;
  }
};

// Apple Sign-In
export const appleSignIn = async (): Promise<AuthResult> => {
  try {
    const AppleAuthModule = await getAppleAuthentication();
    if (!AppleAuthModule) {
      return {
        success: false,
        error: 'Apple Sign-In not available',
      };
    }

    const appleAuthRequestResponse = await AppleAuthModule.performRequest({
      requestedOperation: AppleAuthModule.Operation.LOGIN,
      requestedScopes: [
        AppleAuthModule.Scope.FULL_NAME,
        AppleAuthModule.Scope.EMAIL,
      ],
    });

    // Ensure identityToken is present
    if (
      appleAuthRequestResponse.identityToken === null ||
      appleAuthRequestResponse.identityToken === undefined
    ) {
      throw new Error('Apple Sign-In failed - no identity token');
    }

    const { identityToken, user } = appleAuthRequestResponse;
    const fullName = [
      appleAuthRequestResponse.fullName?.givenName,
      appleAuthRequestResponse.fullName?.familyName,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      success: true,
      user: {
        id: user,
        email: appleAuthRequestResponse.email,
        fullName: fullName || null,
      },
      tokens: {
        identityToken,
      },
    };
  } catch (error: any) {
    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'User canceled Apple Sign-In',
        cancelled: true,
      };
    }

    console.error('Apple Sign-In error:', error);
    return {
      success: false,
      error: error.message || 'Apple Sign-In failed',
    };
  }
};

// Check if Apple authentication is available
export const isAppleAuthenticationAvailable = async () => {
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    const AppleAuthModule = await getAppleAuthentication();
    if (!AppleAuthModule) return false;

    return Boolean(AppleAuthModule.isSupported);
  } catch (error) {
    console.error('Error checking Apple authentication availability:', error);
    return false;
  }
};
