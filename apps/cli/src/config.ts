import Conf from "conf";

interface PulseConfig {
  apiKey?: string;
  baseUrl?: string;
  email?: string;
}

const conf = new Conf<PulseConfig>({
  projectName: "pulseguard-cli",
  schema: {
    apiKey: { type: "string" },
    baseUrl: { type: "string" },
    email: { type: "string" },
  },
});

export const DEFAULT_BASE_URL = "https://pulseguard.io";

export function getConfig(): PulseConfig {
  return {
    apiKey: getApiKey(),
    baseUrl: getBaseUrl(),
    email: conf.get("email"),
  };
}

export function setConfig(updates: Partial<PulseConfig>) {
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) conf.set(key as keyof PulseConfig, value);
  }
}

export function clearConfig() {
  conf.clear();
}

export function getApiKey(): string | undefined {
  return (
    process.env.PULSEGUARD_API_KEY ||
    process.env.PULSE_API_KEY ||
    conf.get("apiKey")
  );
}

export function getBaseUrl(): string {
  return (
    process.env.PULSEGUARD_BASE_URL ||
    process.env.PULSE_BASE_URL ||
    conf.get("baseUrl") ||
    DEFAULT_BASE_URL
  );
}
