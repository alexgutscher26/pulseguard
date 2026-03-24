
import { connect } from "cloudflare:sockets";

export interface PortResult {
  host: string;
  port: number;
  isOpen: boolean;
  status: "OPEN" | "CLOSED" | "TIMEOUT" | "BLOCKED";
  latency?: number;
}

/**
 * Check if a port is open using Cloudflare Sockets
 */
export async function checkPort(host: string, port: number): Promise<PortResult> {
  const start = Date.now();
  
  // Basic validation
  if (!host) return { host, port, isOpen: false, status: "CLOSED" };
  
  // Standard Port Handover (Cloudflare Workers often block raw socket to 80/443 in favor of fetch)
  // We use fetch for these to be reliable.
  if (port === 80 || port === 443) {
      try {
          const protocol = port === 443 ? "https" : "http";
          await fetch(`${protocol}://${host}`, {
             method: "HEAD",
             signal: AbortSignal.timeout(3000)
          });
          return {
             host, port, isOpen: true, status: "OPEN", latency: Date.now() - start
          };
      } catch (e) {
          return { host, port, isOpen: false, status: "CLOSED", latency: 0 };
      }
  }

  try {
    const socket = connect({ hostname: host, port });
    
    // We race the connection against a timeout
    const timeoutPromise = new Promise<void>((_, reject) => 
       setTimeout(() => reject(new Error("Timeout")), 3000)
    );

    await Promise.race([
       socket.opened,
       timeoutPromise
    ]);
    
    // If we get here, connection opened!
    const latency = Date.now() - start;
    
    // Clean up
    await socket.close();
    
    return {
        host,
        port,
        isOpen: true,
        status: "OPEN",
        latency
    };

  } catch (error: any) {
    let status: "CLOSED" | "TIMEOUT" | "BLOCKED" = "CLOSED";
    
    if (error.message === "Timeout") {
        status = "TIMEOUT";
    } else if (error.message && error.message.includes("not permitted")) {
        // Cloudflare blocked this port
        status = "BLOCKED";
    }

    return {
        host,
        port,
        isOpen: false,
        status,
        latency: 0
    };
  }
}
