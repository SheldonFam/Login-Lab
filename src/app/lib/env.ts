/**
 * Environment variable validation and configuration
 * Validates all required environment variables at startup
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Please check your .env file or environment configuration.`
    );
  }

  return value;
}

function getOptionalEnvVar(
  key: string,
  defaultValue?: string
): string | undefined {
  return process.env[key] ?? defaultValue;
}

// Database
export const DATABASE_URL = getEnvVar("DATABASE_URL");

// NextAuth
export const NEXTAUTH_SECRET = getEnvVar("NEXTAUTH_SECRET");
export const NEXTAUTH_URL = getOptionalEnvVar(
  "NEXTAUTH_URL",
  "http://localhost:3000"
);

// OAuth Providers (optional)
export const GOOGLE_CLIENT_ID = getOptionalEnvVar("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getOptionalEnvVar("GOOGLE_CLIENT_SECRET");
export const GITHUB_CLIENT_ID = getOptionalEnvVar("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getOptionalEnvVar("GITHUB_CLIENT_SECRET");

// Email Configuration
export const EMAIL_FROM = getOptionalEnvVar("EMAIL_FROM");
export const EMAIL_SERVER_HOST = getOptionalEnvVar("EMAIL_SERVER_HOST");
export const EMAIL_SERVER_PORT = getOptionalEnvVar("EMAIL_SERVER_PORT");
export const EMAIL_SERVER_USER = getOptionalEnvVar("EMAIL_SERVER_USER");
export const EMAIL_SERVER_PASSWORD = getOptionalEnvVar("EMAIL_SERVER_PASSWORD");

// Legacy Gmail support (for backward compatibility)
export const GMAIL = getOptionalEnvVar("GMAIL");
export const GOOGLE_APP_PASSWORD = getOptionalEnvVar("GOOGLE_APP_PASSWORD");

// App URL
export const NEXT_PUBLIC_APP_URL = getOptionalEnvVar(
  "NEXT_PUBLIC_APP_URL",
  NEXTAUTH_URL
);

// Validation helpers
export function hasGoogleOAuth(): boolean {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

export function hasGitHubOAuth(): boolean {
  return !!(GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET);
}

export function hasEmailConfig(): boolean {
  return !!(
    (GMAIL && GOOGLE_APP_PASSWORD) ||
    (EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD)
  );
}
