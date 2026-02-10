import { useEffect, useState } from "react";

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

    const url = `${wsBaseUrl}/ws/monitors/${monitorId}`;
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      console.log("[PulseGuard] Connecting to Live Feed:", url);
      ws = new WebSocket(url);

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
          console.error("Failed to parse live event", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Reconnect after 3s
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket Error:", err);
        ws?.close();
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimer);
    };
  }, [monitorId]);

  return { lastEvent, isConnected };
}
