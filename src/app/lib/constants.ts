/**
 * Application constants
 * Centralized configuration values
 */

// Password hashing
export const BCRYPT_ROUNDS = 10;

// Password reset token
export const RESET_TOKEN_BYTES = 32;
export const RESET_TOKEN_EXPIRY_HOURS = 1;
export const RESET_TOKEN_EXPIRY_MS = RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

// Session
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// Validation limits
export const MAX_EMAIL_LENGTH = 254;
export const MAX_NAME_LENGTH = 100;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

// API
export const MAX_REQUEST_BODY_SIZE = 1024 * 1024; // 1MB
