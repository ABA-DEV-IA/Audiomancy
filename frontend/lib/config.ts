// lib/config.ts
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

type Config = {
  speechKey: string;
  speechRegion: string;
  fastApiUrl: string;
  fastApiKey: string;
};

const baseConfig: Config = {
  speechKey: process.env.SPEECH_KEY || "",
  speechRegion: process.env.SPEECH_REGION || "",
  fastApiUrl: process.env.FASTAPI_URL || "",
  fastApiKey: process.env.API_KEY || "",
};

let loadedConfig: Config | null = null;

export async function getConfig(): Promise<Config> {
  if (loadedConfig) return loadedConfig; // cache si déjà chargé

  const config: Config = { ...baseConfig };
  const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
  if (keyVaultUrl) {
    try {
      const credential = new DefaultAzureCredential();
      const client = new SecretClient(keyVaultUrl, credential);

      for await (const secretProperties of client.listPropertiesOfSecrets()) {
        const secretName = secretProperties.name.toLowerCase().replace(/-/g, "_");
        const secretValue = (await client.getSecret(secretProperties.name)).value;

        if (secretValue && secretName in config) {
          (config as any)[secretName] = secretValue;
        }
      }

      console.log("[INFO] Config loaded from Azure Key Vault");
    } catch (err) {
      console.warn("[WARNING] Could not load secrets from Key Vault:", err);
    }
  }

  loadedConfig = config;
  return config;
}
