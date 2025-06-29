import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import type { Express } from "express";
import { storage } from "./storage";

// OAuth provider configurations
const PROVIDERS = {
  google: {
    issuer: "https://accounts.google.com",
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    scope: "openid email profile",
    name: "Google"
  },
  apple: {
    issuer: "https://appleid.apple.com",
    client_id: process.env.APPLE_CLIENT_ID,
    client_secret: process.env.APPLE_CLIENT_SECRET,
    scope: "openid email name",
    name: "Apple"
  },
  github: {
    issuer: "https://github.com",
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    scope: "user:email",
    name: "GitHub"
  }
};

export async function setupOAuth(app: Express) {
  // Set up OAuth strategies for each provider
  for (const [providerId, config] of Object.entries(PROVIDERS)) {
    if (!config.client_id || !config.client_secret) {
      console.log(`Skipping ${config.name} OAuth - missing credentials`);
      continue;
    }

    try {
      const issuer = await client.discovery(new URL(config.issuer), config.client_id);
      
      const verify: VerifyFunction = async (
        tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
        verified: passport.AuthenticateCallback
      ) => {
        try {
          const claims = tokens.claims();
          
          if (!claims || !claims.email) {
            throw new Error('No email provided by OAuth provider');
          }
          
          const email = claims.email as string;
          const name = (claims.name as string) || '';
          const firstName = (claims.given_name as string) || name.split(' ')[0] || null;
          const lastName = (claims.family_name as string) || name.split(' ').slice(1).join(' ') || null;
          
          // Check if user already exists
          let user = await storage.getUserByEmail(email);
          
          if (!user) {
            // Create new user from OAuth data
            const newUser = await storage.createUser({
              email: email,
              username: email.split('@')[0] + '_' + providerId,
              firstName: firstName,
              lastName: lastName,
              role: 'student', // Default role, can be changed later
              password: '', // OAuth users don't need passwords
            });
            user = newUser;
          }
          
          verified(null, user);
        } catch (error) {
          console.error(`OAuth verification error for ${config.name}:`, error);
          verified(error);
        }
      };

      const strategy = new Strategy(
        {
          name: `oauth-${providerId}`,
          config: issuer,
          scope: config.scope,
          callbackURL: `/api/auth/${providerId}/callback`,
        },
        verify
      );

      passport.use(strategy);

      // OAuth login routes
      app.get(`/api/auth/${providerId}`, (req, res, next) => {
        passport.authenticate(`oauth-${providerId}`, {
          scope: config.scope.split(' '),
        })(req, res, next);
      });

      app.get(`/api/auth/${providerId}/callback`, (req, res, next) => {
        passport.authenticate(`oauth-${providerId}`, {
          successRedirect: '/',
          failureRedirect: '/auth?error=oauth_failed',
        })(req, res, next);
      });

      console.log(`✓ ${config.name} OAuth configured`);
    } catch (error) {
      console.error(`Failed to configure ${config.name} OAuth:`, error);
    }
  }
}

export { PROVIDERS };