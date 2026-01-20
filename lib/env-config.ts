/**
 * Environment validation utility
 * Ensures all required environment variables are present at startup
 * 
 * This module is intended for server-side use only.
 * For client-side environment variables, use NEXT_PUBLIC_* prefix in .env
 */

interface EnvConfig {
  ANTHROPIC_API_KEY?: string;
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_API_BASE_URL?: string;
  PI_API_KEY?: string;
  NODE_ENV?: string;
}

const REQUIRED_ENV_VARS: (keyof EnvConfig)[] = [
  'NEXT_PUBLIC_APP_URL',
];

const OPTIONAL_ENV_VARS: (keyof EnvConfig)[] = [
  'ANTHROPIC_API_KEY',
  'PI_API_KEY',
  'NEXT_PUBLIC_API_BASE_URL',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalProcess = (globalThis as any).process;

/**
 * Validate environment variables
 * @throws Error if any required variables are missing
 */
export function validateEnv(): void {
  if (!globalProcess || !globalProcess.env) {
    return; // Skip validation in browser context
  }

  const missing: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(globalProcess.env as any)[envVar as string]) {
      missing.push(envVar as string);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Copy .env.example to .env.local and fill in the required values.`
    );
  }

  // Warn about missing optional variables in development
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((globalProcess.env as any).NODE_ENV === 'development') {
    for (const envVar of OPTIONAL_ENV_VARS) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(globalProcess.env as any)[envVar as string]) {
        console.warn(
          `Optional environment variable ${envVar} is not set. ` +
          `Some features may not work correctly.`
        );
      }
    }
  }
}

/**
 * Get validated environment configuration
 */
export function getEnvConfig(): Required<EnvConfig> {
  validateEnv();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (globalProcess.env as any) || {};

  return {
    ANTHROPIC_API_KEY: env.ANTHROPIC_API_KEY || '',
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL || '',
    NEXT_PUBLIC_API_BASE_URL: env.NEXT_PUBLIC_API_BASE_URL || '/api',
    PI_API_KEY: env.PI_API_KEY || '',
    NODE_ENV: env.NODE_ENV || 'development',
  };
}
