# Google & Apple Authentication Setup Guide

This document explains how to complete the Google and Apple authentication integration.

## Installation

The required packages have been added to `package.json`:
- `@react-native-google-signin/google-signin` - Google Sign-In
- `@invertase/react-native-apple-authentication` - Apple Sign-In

Run the following to install dependencies:

```bash
npm install
# or
yarn install
```

Then rebuild the native modules:

```bash
cd ios && pod install && cd ..
npm run ios
# or for Android:
npm run android
```

## Google Sign-In Setup

### 1. Create a Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project
- Enable the Google+ API

### 2. Create OAuth 2.0 Credentials

#### For Android:
1. Go to Credentials → Create OAuth 2.0 Client ID
2. Select "Android" as the application type
3. Get your SHA-1 fingerprint:
   ```bash
   cd android && ./gradlew signingReport
   ```
4. Copy the SHA-1 from the output
5. Add your package name and SHA-1 to the Google Cloud Console
6. Copy the resulting Client ID

#### For iOS:
1. Go to Credentials → Create OAuth 2.0 Client ID
2. Select "iOS" as the application type
3. Get your Bundle ID from `ios/newapp.xcodeproj` or `app.json`
4. Get your App Store ID (or leave blank for development)
5. Copy the resulting Client ID (Web Client ID)

### 3. Update Configuration

In `src/screens/login-screen.tsx`, replace `YOUR_GOOGLE_WEB_CLIENT_ID` with your actual Web Client ID:

```typescript
initializeGoogleSignIn('YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com');
```

### 4. Android Configuration

Add to `android/app/build.gradle`:

```gradle
dependencies {
  implementation 'com.google.android.gms:play-services-auth:21.0.0'
}
```

### 5. iOS Configuration

1. Open `ios/newapp.xcodeproj` in Xcode
2. Add your Google Client ID and URL Schemes:
   - Go to Info.plist
   - Add `CFBundleURLTypes` array with your Google Client ID
   - Example: `com.googleusercontent.apps.YOUR_CLIENT_ID`

## Apple Sign-In Setup

### 1. Apple Developer Account
- Ensure you have an active Apple Developer account

### 2. Configure Signing Capabilities

1. Open `ios/newapp.xcodeproj` in Xcode
2. Select the project → Targets → newapp
3. Go to Signing & Capabilities
4. Click "+ Capability"
5. Add "Sign In with Apple"

### 3. Development Team
- Make sure your development team is properly configured in Xcode

## Backend Integration

The authentication service returns user data and tokens. You need to:

1. **For Google**: Send the `idToken` and `accessToken` to your backend
2. **For Apple**: Send the `identityToken` to your backend

### Example Backend Integration

Uncomment and update the TODO sections in `src/screens/login-screen.tsx`:

```typescript
const result = await googleSignIn();

if (result.success) {
  const response = await fetch('https://your-api.com/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idToken: result.tokens?.idToken,
      user: result.user,
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    // Save auth token/session
    onLoginComplete();
  }
}
```

## Testing

### Google Sign-In
- Click "Continue with Google" button
- Select your test Google account
- Should receive user data and tokens

### Apple Sign-In
- Click "Continue with Apple" button (iOS only)
- Authenticate with Face ID/Touch ID or Apple ID
- Should receive user data and identity token

## Troubleshooting

### Google Sign-In Not Working
- Verify Web Client ID is correct
- Check that your app's package name matches the one registered
- Ensure SHA-1 fingerprint is correct (run `./gradlew signingReport`)
- Check logcat/console for error messages

### Apple Sign-In Not Working
- Ensure "Sign In with Apple" capability is added in Xcode
- Verify development team is set
- Check that the bundle ID matches your app configuration
- Apple Sign-In only works on iOS 13+

### Native Build Errors
- Clear build cache: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
- Reinstall pods: `cd ios && rm -rf Pods && pod install && cd ..`
- Clean build: `npm run ios -- --clean` or `npm run android -- --clean`

## Files Modified

- `package.json` - Added OAuth dependencies
- `src/services/auth-service.ts` - New authentication service
- `src/screens/login-screen.tsx` - Updated login UI with OAuth integration

## Security Notes

1. Never commit your Client IDs or API keys
2. Use environment variables for sensitive data
3. Always verify tokens on your backend
4. Implement proper session management
5. Store auth tokens securely using AsyncStorage or native keychain
