# Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and add the Project URL and **publishable** key from the project's Connect dialog. Never add a `service_role` or secret key to the app.
3. In the Supabase SQL Editor, run `migrations/20260621000000_initial_schema.sql`. If the Supabase CLI is linked, `supabase db push` does the same job.
4. Under Authentication > Providers, enable Email and the Google/Apple providers you use.
5. Under Authentication > Sign In / Providers, enable anonymous sign-ins for the “Explore without login” flow. Add CAPTCHA before production to limit anonymous-account abuse.
6. Restart Metro with `npm start -- --reset-cache`, then rebuild the native app because `react-native-keychain` was added.

The migration enables Row Level Security on every user-data table. Authenticated users—including anonymous Supabase users—can only access rows whose owner ID matches their JWT.
