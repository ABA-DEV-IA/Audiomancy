/**
 * Application configuration management.
 *
 * This module provides a helper function to safely retrieve environment
 * variables and a `getConfig` function that loads them lazily at runtime.
 *
 * Benefits:
 * - Prevents Next.js build from failing when env vars are missing.
 * - Still enforces strict validation at runtime in production.
 */

type Config = {
  speechKey: string;
  speechRegion: string;
  fastApiUrl: string;
  fastApiKey: string;
};

/**
 * Retrieve an environment variable safely.
 *
 * @param name - The name of the environment variable.
 * @param required - Whether the variable must be present.
 * @returns The variable value or a dummy value in non-production builds.
 * @throws Error if the variable is missing in production and marked as required.
 */
function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (!value) {
    if (required && process.env.NODE_ENV === "production") {
      throw new Error(`[CONFIG ERROR] Missing required environment variable: ${name}`);
    }
    // Provide a fallback during build or development
    return "dummy";
  }
  return value;
}

/**
 * Load application configuration lazily at runtime.
 *
 * @returns Config object containing required environment variables.
 */
export function getConfig(): Config {
  return {
    speechKey: getEnvVar("SPEECH_KEY"),
    speechRegion: getEnvVar("SPEECH_REGION"),
    fastApiUrl: getEnvVar("FASTAPI_URL"),
    fastApiKey: getEnvVar("API_KEY"),
  };
}
