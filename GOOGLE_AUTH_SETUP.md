# Google OAuth Setup Guide for Times Of GIKI

## Current Status
✅ **Google OAuth has been disabled** for now to simplify authentication
✅ **Email Magic Link authentication is active** and working properly

## Why Google OAuth is disabled
Google OAuth requires additional setup and configuration that involves:
1. Creating a Google Cloud Console project
2. Configuring OAuth consent screen
3. Setting up authorized domains
4. Adding client credentials to Supabase

## If you want to enable Google OAuth (FREE but requires setup):

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen:
   - User Type: External (for testing) or Internal (for organization only)
   - Add your domain (localhost for development)
   - Add authorized domains

### Step 2: Get OAuth Credentials
1. Create OAuth 2.0 Client ID
2. Application type: Web application
3. Authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
4. Copy Client ID and Client Secret

### Step 3: Configure Supabase
1. Go to your Supabase project → Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Step 4: Update Code
```typescript
// In UserAuth.tsx, change:
providers={[]}
// to:
providers={['google']}
```

## Current Authentication Features
✅ **Email Magic Link** - Users receive a secure login link via email
✅ **Automatic user profile creation** - User profiles are created automatically
✅ **Role-based access control** - Admin, editor, contributor roles
✅ **Secure sign out** - Proper session management

## Recommendation
**Keep the current email authentication setup** because:
- ✅ It's simpler and more secure
- ✅ No additional Google setup required
- ✅ Works immediately without configuration
- ✅ Better for internal/organization use
- ✅ No dependency on Google services

The current system is production-ready and perfect for your needs!
