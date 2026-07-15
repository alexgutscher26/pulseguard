export type MonitorStatus = "UP" | "DOWN" | "MAINTENANCE";

export type MonitorType =
  | "HTTP"
  | "HTTPS"
  | "PING"
  | "PORT"
  | "DNS"
  | "SSL"
  | "DOMAIN"
  | "HEARTBEAT"
  | "BROWSER"
  | "SEQUENCE"
  | "GRAPHQL"
  | "WEBSOCKET"
  | "DATABASE"
  | "BGP"
  | "MCP";

export interface ProbeJob {
  id: string;
  monitorId: string;
  url: string;
  type: string;
  timeout: number;
  method?: string;
  headers?: string;
  body?: string;
  expectation?: string;
  script?: string;
}

export interface CheckResult {
  monitorId: string;
  status: MonitorStatus;
  latency: number;
  errorReason?: string;
  timestamp: string;
  region: string;
  probeId?: string;
}
