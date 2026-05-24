"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonitors, checkMonitor } from "@/actions/monitors";
import { getMonitorLatencyHistory } from "@/actions/latency";
import { useTerminalStore } from "@/hooks/use-terminal-store";
import { X, Terminal, ArrowRight, CornerDownLeft } from "lucide-react";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "stream" | "info";
  timestamp: string;
}

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";

export function TerminalView() {
  const { isTerminalMode, setTerminalMode } = useTerminalStore();
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<LogLine[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch monitors for commands
  const { data: monitors = [] } = useQuery({
    queryKey: ["monitors"],
    queryFn: () => getMonitors(),
    refetchInterval: 10000, // Sync monitors list every 10s
  });

  // ASCII Welcome Banner
  const asciiBanner = `
██████╗ ██╗   ██╗██╗     ███████╗███████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ 
██╔══██╗██║   ██║██║     ██╔════╝██╔════╝██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
██████╔╝██║   ██║██║     ███████╗█████╗  ██║  ███╗██║   ██║███████║██████╔╝██║  ██║
██╔═══╝ ██║   ██║██║     ╚════██║██╔══╝  ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
██║     ╚██████╔╝███████╗███████║███████╗╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
                 -- CYBERNETIC INTEL NODE v1.0.0 --
  `;

  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

  const addLog = (text: string, type: LogLine["type"] = "output") => {
    setHistory((prev) => [...prev, { text, type, timestamp: getTimestamp() }]);
  };

  // Initialize terminal welcome log
  useEffect(() => {
    if (isTerminalMode && history.length === 0) {
      const initLogs: LogLine[] = [
        { text: asciiBanner, type: "info", timestamp: getTimestamp() },
        { text: "ESTABLISHING SECURE PROTOCOL LAYER...", type: "output", timestamp: getTimestamp() },
        { text: "CONNECTING TO GLOBAL EDGE PULSE RESIDENTS...", type: "output", timestamp: getTimestamp() },
        { text: "TERMINAL CONNECTION ONLINE.", type: "success", timestamp: getTimestamp() },
        { text: "Type 'help' to review operators database. Press 'Tab' to autocomplete.", type: "info", timestamp: getTimestamp() },
        { text: "Press 'Esc' or type 'exit' to return to standard telemetry interface.", type: "info", timestamp: getTimestamp() },
        { text: "--------------------------------------------------------------------------------", type: "output", timestamp: getTimestamp() },
      ];
      setHistory(initLogs);
    }
  }, [isTerminalMode]);

  // Focus and Scroll helper
  useEffect(() => {
    if (isTerminalMode) {
      inputRef.current?.focus();
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isTerminalMode]);

  // Global Esc Key bind to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTerminalMode) {
        setTerminalMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTerminalMode, setTerminalMode]);

  // Live WebSocket Streaming for monitors pings
  useEffect(() => {
    if (!isTerminalMode || monitors.length === 0) return;

    // Determine WebSocket base URL
    let wsBaseUrl = WORKER_URL;
    if (wsBaseUrl.startsWith("http://")) {
      wsBaseUrl = wsBaseUrl.replace("http://", "ws://");
    } else if (wsBaseUrl.startsWith("https://")) {
      wsBaseUrl = wsBaseUrl.replace("https://", "wss://");
    } else if (!wsBaseUrl.includes("://")) {
      const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
      wsBaseUrl = `${protocol}${wsBaseUrl}`;
    }

    const sockets: WebSocket[] = [];

    monitors.forEach((monitor: any) => {
      try {
        const url = `${wsBaseUrl}/ws/monitors/${monitor.id}`;
        const ws = new WebSocket(url);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "check_result") {
              const time = getTimestamp();
              const logText = `[STREAM] Target "${monitor.name}" (${monitor.id.substring(0, 8)}) check: ${data.status} (${data.latency}ms) [Region: ${data.region || "Global"}]`;
              setHistory((prev) => [...prev, { text: logText, type: "stream", timestamp: time }]);
            }
          } catch {
            // Silently catch parsing failures
          }
        };

        sockets.push(ws);
      } catch (err) {
        console.warn("Failed to open WebSocket in Terminal Mode:", monitor.id, err);
      }
    });

    return () => {
      sockets.forEach((ws) => {
        ws.onmessage = null;
        ws.close();
      });
    };
  }, [isTerminalMode, monitors]);

  if (!isTerminalMode) return null;

  // Commands autocomplete suggestions
  const commandsList = ["help", "list", "ls", "check", "logs", "clear", "exit"];

  const handleAutocomplete = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const matches = commandsList.filter((c) => c.startsWith(trimmed));
    if (matches.length === 1) {
      setInputVal(matches[0] + " ");
    } else if (matches.length > 1) {
      addLog(`Autocomplete matches: ${matches.join(", ")}`, "info");
    }
  };

  // Process typed command
  const executeCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Add to input history
    addLog(`PG_operator@pulseguard:~$ ${trimmed}`, "input");
    setCmdHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)]);
    setHistoryIndex(-1);
    setInputVal("");

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        addLog("PulseGuard System Console Commands:", "info");
        addLog("  list / ls              List all active monitors and statuses", "info");
        addLog("  check <id/name>        Initiate query diagnostics check on monitor target", "info");
        addLog("  logs <id/name>         Fetch last 10 latency log sequences", "info");
        addLog("  clear                  Reset interface screen log", "info");
        addLog("  exit                   Return to standard telemetry", "info");
        break;

      case "list":
      case "ls":
        if (monitors.length === 0) {
          addLog("No active monitor targets detected in configuration.", "error");
          break;
        }
        addLog("--------------------------------------------------------------------------------", "output");
        addLog("ID         NAME                 STATUS    TARGET URL", "info");
        addLog("--------------------------------------------------------------------------------", "output");
        monitors.forEach((m: any) => {
          const shortId = m.id.substring(0, 8);
          const name = m.name.padEnd(20).substring(0, 20);
          const status = m.status.padEnd(9);
          addLog(`${shortId}   ${name} ${status} ${m.url}`, m.status === "UP" ? "success" : m.status === "DOWN" ? "error" : "output");
        });
        addLog("--------------------------------------------------------------------------------", "output");
        break;

      case "check": {
        if (args.length === 0) {
          addLog("Syntax error: check <id/name>. Specify monitor node ID or name.", "error");
          break;
        }
        const searchArg = args.join(" ").toLowerCase();
        const target = monitors.find(
          (m: any) => m.id.startsWith(searchArg) || m.name.toLowerCase().includes(searchArg)
        );

        if (!target) {
          addLog(`Target check error: Monitor matching "${searchArg}" not found.`, "error");
          break;
        }

        addLog(`[INIT] Querying diagnostic check sequence on node "${target.name}" (${target.id.substring(0, 8)})...`, "output");
        try {
          const result = await checkMonitor(target.id);
          if (result.success) {
            addLog(`[SUCCESS] Ping complete. Target online. Status: UP.`, "success");
          } else {
            addLog(`[FAIL] Target unreachable. Reason: ${result.error || "Timeout"}. Status: DOWN.`, "error");
          }
        } catch (e: any) {
          addLog(`[ERROR] Diagnostic exception: ${e.message || e}`, "error");
        }
        break;
      }

      case "logs": {
        if (args.length === 0) {
          addLog("Syntax error: logs <id/name>. Specify monitor node ID or name.", "error");
          break;
        }
        const searchArg = args.join(" ").toLowerCase();
        const target = monitors.find(
          (m: any) => m.id.startsWith(searchArg) || m.name.toLowerCase().includes(searchArg)
        );

        if (!target) {
          addLog(`Logs fetch error: Monitor matching "${searchArg}" not found.`, "error");
          break;
        }

        addLog(`[FETCH] Loading latency history segments for "${target.name}"...`, "output");
        try {
          const historyLogs = await getMonitorLatencyHistory(target.id);
          if (!historyLogs || historyLogs.length === 0) {
            addLog("No history events available for this monitor.", "info");
            break;
          }
          addLog("--------------------------------------------------", "output");
          addLog("TIMESTAMP             AVG       P95       STATUS", "info");
          addLog("--------------------------------------------------", "output");
          historyLogs.slice(0, 10).forEach((h: any) => {
            const time = new Date(h.timestamp).toLocaleString().substring(0, 19);
            const avg = `${h.avgLatency}ms`.padEnd(9);
            const p95 = `${h.p95Latency}ms`.padEnd(9);
            const status = h.avgLatency > 1000 ? "DOWN" : "UP";
            addLog(`${time}   ${avg} ${p95} ${status}`, status === "UP" ? "success" : "error");
          });
          addLog("--------------------------------------------------", "output");
        } catch (e: any) {
          addLog(`[ERROR] Failed to fetch metrics: ${e.message || e}`, "error");
        }
        break;
      }

      case "clear":
        setHistory([]);
        break;

      case "exit":
        setTerminalMode(false);
        break;

      default:
        addLog(`Console error: Command "${command}" not recognized. Type 'help' for manual database.`, "error");
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col font-mono text-xs crt-screen p-6 md:p-12 overflow-hidden select-none select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Immersive CRT style injection */}
      <style dangerouslySetInnerHTML={{__html: `
        .crt-screen {
          position: fixed;
          background-color: #030704;
          color: #22c55e;
          font-family: 'Courier New', Courier, monospace;
        }
        .crt-screen::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.18) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%;
          pointer-events: none;
          z-index: 100;
        }
        .crt-screen::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle, transparent 70%, rgba(0, 0, 0, 0.4) 100%);
          pointer-events: none;
          z-index: 99;
        }
        .terminal-log-glow-success {
          color: #4ade80;
          text-shadow: 0 0 5px rgba(74, 222, 128, 0.5);
        }
        .terminal-log-glow-error {
          color: #f87171;
          text-shadow: 0 0 5px rgba(248, 113, 113, 0.5);
        }
        .terminal-log-glow-info {
          color: #60a5fa;
          text-shadow: 0 0 5px rgba(96, 165, 250, 0.5);
        }
        .terminal-log-glow-input {
          color: #ffffff;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }
        .terminal-log-glow-stream {
          color: #eab308;
          text-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
        }
        .crt-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: currentColor }
        }
      `}} />

      {/* Header Overlay Toolbar */}
      <div className="flex justify-between items-center border-b border-green-500/20 pb-4 mb-4 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="size-4.5 text-green-500 animate-pulse" />
          <span className="font-extrabold uppercase tracking-widest text-[10px] text-green-500/80">
            Secure Console Terminal Matrix
          </span>
        </div>
        <button
          onClick={() => setTerminalMode(false)}
          className="p-1 hover:bg-green-500/10 border border-green-500/20 text-green-500 hover:text-green-400 transition-colors rounded-sm cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Output Console Log LogStream */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 relative z-10 scrollbar-thin scrollbar-thumb-green-500/20">
        {history.map((line, i) => {
          const glowClass = 
            line.type === "success" 
              ? "terminal-log-glow-success" 
              : line.type === "error" 
              ? "terminal-log-glow-error" 
              : line.type === "info" 
              ? "terminal-log-glow-info" 
              : line.type === "input"
              ? "terminal-log-glow-input"
              : line.type === "stream"
              ? "terminal-log-glow-stream"
              : "";
          return (
            <div 
              key={i} 
              className={`whitespace-pre-wrap leading-relaxed tracking-tight ${glowClass}`}
            >
              {line.type !== "info" && line.type !== "input" && (
                <span className="text-green-500/40 text-[9px] mr-2 select-none">[{line.timestamp}]</span>
              )}
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Line prompt */}
      <div className="flex items-center gap-2 border-t border-green-500/20 pt-4 mt-4 relative z-10 shrink-0">
        <ArrowRight className="size-3 text-green-500 shrink-0" />
        <span className="font-bold text-green-500/80 tracking-tight shrink-0">PG_operator@pulseguard:~$</span>
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-white font-mono placeholder-green-900 caret-transparent"
            placeholder="Type 'help' for node instructions..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {/* Custom Blinking Monospace Cursor */}
          <div 
            className="absolute pointer-events-none border-l-[6px] border-white h-4 crt-blink"
            style={{
              left: `${inputVal.length * 7.2}px`, // Simple approximation of Courier character width
              transform: 'translateY(1px)'
            }}
          />
        </div>
        <div className="flex items-center gap-1 text-green-500/40 text-[9px] select-none shrink-0 font-sans">
          <span>ENTER TO EXECUTE</span>
          <CornerDownLeft className="size-2.5" />
        </div>
      </div>
    </div>
  );
}
