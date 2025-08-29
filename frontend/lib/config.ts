type Config = {
  speechKey: string;
  speechRegion: string;
  fastApiUrl: string;
  fastApiKey: string;
};

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`[CONFIG ERROR] Missing required environment variable: ${name}`);
  }
  return value || "";
}

const config: Config = {
  speechKey: getEnvVar("SPEECH_KEY"),
  speechRegion: getEnvVar("SPEECH_REGION"),
  fastApiUrl: getEnvVar("FASTAPI_URL"),
  fastApiKey: getEnvVar("API_KEY"),
};

export default config;