# Social Login Setup Guide

Your platform now supports Google, Apple, and GitHub login! Here's how to set up the OAuth credentials:

## Quick Setup

### 1. Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `https://your-domain.replit.app/api/auth/google/callback`
6. Copy your Client ID and Client Secret

### 2. Apple OAuth Setup
1. Visit [Apple Developer Console](https://developer.apple.com/account/)
2. Go to "Certificates, Identifiers & Profiles"
3. Create a new Service ID
4. Configure Sign in with Apple
5. Set return URL: `https://your-domain.replit.app/api/auth/apple/callback`
6. Copy your Client ID and generate Client Secret

### 3. GitHub OAuth Setup
1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `https://your-domain.replit.app/api/auth/github/callback`
4. Copy your Client ID and Client Secret

## Environment Variables

Add these to your Replit secrets:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Testing

1. Restart your application after adding the secrets
2. Visit the login page
3. You'll see the social login buttons below the regular login form
4. Click any provider to test the OAuth flow

## How It Works

- Users can sign up/login with their social accounts
- New users are automatically created with their social profile info
- Default role is set to "student" (can be changed in user settings)
- OAuth users don't need passwords - they authenticate through the provider

## Current Status

✅ Social login buttons added to auth page
✅ OAuth routes configured for Google, Apple, GitHub
✅ User creation from social profiles
✅ Session management integration
⚠️ Credentials needed to activate (see setup above)

The social login is ready to use once you add the OAuth credentials!