export const RuntimeConfig: Record<string, string> = {};

let initialized = false;

/**
 * Initialise RuntimeConfig en chargeant config.json depuis public/
 */
export const initRuntimeConfig = async () => {
  if (initialized) return;

  let configJson: Record<string, string> = {};

  try {
    const res = await fetch("/config.json");
    if (res.ok) {
      configJson = await res.json();
    } else {
      throw new Error("config.json introuvable dans public/");
    }
  } catch (err) {
    console.error("Impossible de charger config.json côté client", err);
    throw err;
  }

  // Remplit RuntimeConfig
  for (const key in configJson) {
    if (Object.prototype.hasOwnProperty.call(configJson, key)) {
      RuntimeConfig[key] = configJson[key];
    }
  }

  console.log("RuntimeConfig chargé :", RuntimeConfig);
  initialized = true;
};
