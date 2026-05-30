import { useEffect, useState } from "react";
import { getSessionToken } from "@/actions/monitors";

// Default to localhost:8787 if not set.
// Ensure your worker is running on this port or update .env
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

export type LiveCheckResult = {
  type: "check_result";
  monitorId: string;
  status: "UP" | "DOWN" | "MAINTENANCE";
  latency: number;
  region: string;
  timestamp: number;
};

export function useLiveMonitor(monitorId: string) {
  const [lastEvent, setLastEvent] = useState<LiveCheckResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!monitorId) return;

    let active = true;
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    async function init() {
      const token = await getSessionToken();
      if (!active) return;

      // Determine WebSocket URL
      // If WORKER_URL starts with http, replace with ws. If https, wss.
      let wsBaseUrl = WORKER_URL;
      if (wsBaseUrl.startsWith("http://")) {
        wsBaseUrl = wsBaseUrl.replace("http://", "ws://");
      } else if (wsBaseUrl.startsWith("https://")) {
        wsBaseUrl = wsBaseUrl.replace("https://", "wss://");
      } else if (!wsBaseUrl.includes("://")) {
        // Fallback if just domain given
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        wsBaseUrl = `${protocol}${wsBaseUrl}`;
      }

      const urlObj = new URL(`${wsBaseUrl}/ws/monitors/${monitorId}`);
      if (token) {
        urlObj.searchParams.set("token", token);
      }

      const connect = () => {
        console.log("[PulseGuard] Connecting to Live Feed:", urlObj.toString());
        ws = new WebSocket(urlObj.toString());

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "check_result") {
              setLastEvent(data);
            }
          } catch (e) {
            console.warn("[PulseGuard] Failed to parse live event:", e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          clearTimeout(reconnectTimer);
          // Reconnect after 5s to be less aggressive
          if (active) {
            reconnectTimer = setTimeout(connect, 5000);
          }
        };

        ws.onerror = () => {
          console.warn(
            "[PulseGuard] Live Feed WebSocket connection encountered an error (reconnecting...).",
          );
          ws?.close();
        };
      };

      connect();
    }

    init();

    return () => {
      active = false;
      if (ws) {
        // Remove listeners before closing to prevent reconnect on unmount
        ws.onclose = null;
        ws.onerror = null;
        ws.close();
      }
      clearTimeout(reconnectTimer);
    };
  }, [monitorId]);

  return { lastEvent, isConnected };
}
