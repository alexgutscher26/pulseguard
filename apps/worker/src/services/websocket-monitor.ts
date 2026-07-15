interface WebSocketEventTarget {
  close(): void;
  addEventListener(
    type: "open" | "message" | "error" | "close",
    listener: (...args: any[]) => void,
  ): void;
}

export interface WebSocketAssertion {
  minMessages?: number;
  maxMessages?: number;
  messageContains?: string;
  messagePattern?: string;
}

export interface WebSocketResult {
  url: string;
  status: "UP" | "DOWN";
  latency: number;
  errorReason?: string;
  messagesReceived: number;
  listenDuration: number;
  firstMessageLatency: number | null;
  lastMessageContent: string | null;
}

export async function checkWebSocket(
  url: string,
  listenSeconds: number = 5,
  assertion?: WebSocketAssertion,
): Promise<WebSocketResult> {
  const start = performance.now();

  // Cloudflare Workers WebSocket API uses addEventListener, not on* handlers
  const ws = new WebSocket(url) as unknown as WebSocketEventTarget;
  if (!ws) {
    return {
      url,
      status: "DOWN",
      latency: 0,
      errorReason: "WEBSOCKET_NOT_SUPPORTED",
      messagesReceived: 0,
      listenDuration: 0,
      firstMessageLatency: null,
      lastMessageContent: null,
    };
  }

  return new Promise((resolve) => {
    let messagesReceived = 0;
    let firstMessageLatency: number | null = null;
    let lastMessageContent: string | null = null;
    let closed = false;

    const finish = (result: WebSocketResult) => {
      if (closed) return;
      closed = true;
      try {
        ws.close();
      } catch {}
      resolve(result);
    };

    const connectTimeout = setTimeout(() => {
      finish({
        url,
        status: "DOWN",
        latency: Math.round(performance.now() - start),
        errorReason: "CONNECTION_TIMEOUT",
        messagesReceived: 0,
        listenDuration: 0,
        firstMessageLatency: null,
        lastMessageContent: null,
      });
    }, 5000);

    ws.addEventListener("open", () => {
      clearTimeout(connectTimeout);
      const connectedAt = performance.now();

      setTimeout(() => {
        const latency = Math.round(performance.now() - start);
        const errors: string[] = [];

        if (assertion) {
          if (assertion.minMessages !== undefined && messagesReceived < assertion.minMessages) {
            errors.push(`Expected min ${assertion.minMessages} messages, got ${messagesReceived}`);
          }
          if (assertion.maxMessages !== undefined && messagesReceived > assertion.maxMessages) {
            errors.push(`Expected max ${assertion.maxMessages} messages, got ${messagesReceived}`);
          }
          if (assertion.messageContains && lastMessageContent) {
            if (!lastMessageContent.includes(assertion.messageContains)) {
              errors.push(`Last message does not contain "${assertion.messageContains}"`);
            }
          }
          if (assertion.messagePattern && lastMessageContent) {
            try {
              const re = new RegExp(assertion.messagePattern);
              if (!re.test(lastMessageContent)) {
                errors.push(`Last message does not match pattern "${assertion.messagePattern}"`);
              }
            } catch {
              errors.push("Invalid message pattern regex");
            }
          }
        }

        finish({
          url,
          status: errors.length === 0 ? "UP" : "DOWN",
          latency,
          errorReason: errors.length > 0 ? errors.join("; ") : undefined,
          messagesReceived,
          listenDuration: listenSeconds,
          firstMessageLatency:
            firstMessageLatency !== null ? Math.round(firstMessageLatency - connectedAt) : null,
          lastMessageContent,
        });
      }, listenSeconds * 1000);
    });

    ws.addEventListener("message", (event: any) => {
      messagesReceived++;
      if (firstMessageLatency === null) {
        firstMessageLatency = performance.now();
      }
      const content = typeof event.data === "string" ? event.data : String(event.data);
      lastMessageContent = content;
    });

    ws.addEventListener("error", () => {
      clearTimeout(connectTimeout);
      if (messagesReceived === 0) {
        finish({
          url,
          status: "DOWN",
          latency: Math.round(performance.now() - start),
          errorReason: "CONNECTION_ERROR",
          messagesReceived: 0,
          listenDuration: 0,
          firstMessageLatency: null,
          lastMessageContent: null,
        });
      }
    });

    ws.addEventListener("close", () => {
      clearTimeout(connectTimeout);
      if (!closed) {
        const latency = Math.round(performance.now() - start);
        const errors: string[] = [];
        if (messagesReceived === 0) {
          errors.push("Connection closed without receiving messages");
        }
        finish({
          url,
          status: errors.length === 0 ? "UP" : "DOWN",
          latency,
          errorReason: errors.length > 0 ? errors.join("; ") : undefined,
          messagesReceived,
          listenDuration: (performance.now() - start) / 1000,
          firstMessageLatency:
            firstMessageLatency !== null ? Math.round(firstMessageLatency - start) : null,
          lastMessageContent,
        });
      }
    });
  });
}
