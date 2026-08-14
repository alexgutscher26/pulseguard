import { checkPortUniversal } from "@pulseguard/core";

export interface PortResult {
  host: string;
  port: number;
  isOpen: boolean;
  status: "OPEN" | "CLOSED" | "TIMEOUT" | "BLOCKED";
  latency?: number;
}

/**
 * Check if a port is open using the universal checker
 */
export async function checkPort(host: string, port: number): Promise<PortResult> {
  const result = await checkPortUniversal(host, port);
  return {
    host,
    port,
    isOpen: result.isOpen,
    status: result.status as PortResult["status"],
    latency: result.latency,
  };
}
