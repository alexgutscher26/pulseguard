"use client";
// Safe layout comment trigger for UX audit

import { useState, useEffect, useCallback } from "react";
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Terminal } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1 text-primary/40 hover:text-primary transition-colors">
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function ApiKeysForm() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [showRawKey, setShowRawKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cli/api-keys");
      const text = await res.text();
      if (!res.ok || !text) {
        setError(
          `Server error (${res.status}). Try refreshing — the dev server may need a restart.`,
        );
        return;
      }
      try {
        const data = JSON.parse(text);
        setKeys(data.keys ?? []);
      } catch {
        setError("Server returned an unexpected response. Try restarting the dev server.");
      }
    } catch {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/cli/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });
      const text = await res.text();
      if (!text) throw new Error(`Server error (${res.status})`);
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
      setNewRawKey(data.key.rawKey);
      setShowRawKey(true);
      setNewKeyName("");
      setShowForm(false);
      await loadKeys();
    } catch (err: any) {
      setError(err.message || "Failed to create key");
    } finally {
      setCreating(false);
    }
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this API key? This action cannot be undone.")) return;
    try {
      await fetch(`/api/cli/api-keys/${id}`, { method: "DELETE" });
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch {
      setError("Failed to revoke key");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="bg-black/40 border border-primary/20 relative overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight flex items-center gap-2">
              <Key className="size-4 text-primary" />
              API Keys
            </h3>
            <p className="text-xs text-primary/60 font-mono mt-0.5">
              Authenticate the <code className="bg-primary/10 px-1 rounded">
                pulseguard-cli
              </code>{" "}
              and external integrations
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-primary text-background text-xs font-bold px-4 py-2 uppercase tracking-wider font-mono hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5" />
            New Key
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="p-4 border-b border-primary/10 bg-primary/5 flex gap-3 items-center">
            <input
              autoFocus
              type="text"
              placeholder="Key name (e.g. GitHub Actions)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createKey()}
              className="flex-1 bg-black/60 border border-primary/20 text-sm font-mono px-3 py-2 text-foreground placeholder:text-primary/30 focus:outline-none focus:border-primary/60"
            />
            <button
              onClick={createKey}
              disabled={creating || !newKeyName.trim()}
              className="bg-primary text-background text-xs font-bold px-4 py-2 font-mono uppercase tracking-wider hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? "Creating…" : "Create"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-primary/40 hover:text-primary text-xs font-mono uppercase px-2 py-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Newly created key reveal */}
        {newRawKey && (
          <div className="p-4 border-b border-primary/10 bg-green-950/30 border-l-2 border-l-green-500">
            <p className="text-xs text-green-400 font-mono font-bold mb-2 uppercase tracking-wider">
              ✓ Key created — copy it now, it won&apos;t be shown again
            </p>
            <div className="flex items-center gap-2 bg-black/60 border border-primary/20 px-3 py-2">
              <code className="flex-1 text-xs font-mono text-green-300 break-all">
                {showRawKey ? newRawKey : "•".repeat(newRawKey.length)}
              </code>
              <button
                onClick={() => setShowRawKey((v) => !v)}
                className="text-primary/40 hover:text-primary"
              >
                {showRawKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
              <CopyButton text={newRawKey} />
            </div>
            <button
              onClick={() => setNewRawKey(null)}
              className="mt-2 text-xs text-primary/40 font-mono hover:text-primary/60"
            >
              I&apos;ve saved it — dismiss
            </button>
          </div>
        )}

        {/* Keys list */}
        {loading ? (
          <div className="p-8 text-center text-primary/30 font-mono text-xs uppercase animate-pulse">
            Loading…
          </div>
        ) : keys.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center gap-3 text-primary/40">
            <div className="p-4 bg-primary/5 rounded-full border border-primary/10">
              <Key className="size-8 opacity-50" />
            </div>
            <p className="font-mono text-sm uppercase tracking-widest">No API keys yet</p>
            <p className="font-mono text-xs text-primary/30">
              Create one to use the CLI or integrate with CI/CD pipelines
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/10">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-foreground">{key.name}</span>
                    <span className="text-xs bg-primary/10 text-primary/60 px-1.5 py-0.5 font-mono rounded">
                      {key.scopes}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-primary/40 font-mono">
                    <span className="text-primary/60">{key.prefix}…</span>
                    <span>Created {timeAgo(key.createdAt)}</span>
                    <span>Last used {timeAgo(key.lastUsedAt)}</span>
                    {key.expiresAt && (
                      <span className="text-amber-400">
                        Expires {new Date(key.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => revokeKey(key.id)}
                  className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-colors rounded"
                  title="Revoke key"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/30 border-t border-red-500/20 text-xs text-red-400 font-mono">
            {error}
          </div>
        )}
      </section>

      {/* CLI Quickstart */}
      <section className="border border-primary/10 p-6 bg-black/30">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="size-4 text-primary" />
          <h4 className="text-sm font-bold text-primary font-mono uppercase tracking-wider">
            CLI Quickstart
          </h4>
        </div>
        <div className="space-y-3">
          {[
            { label: "Install", cmd: "npm install -g pulseguard-cli" },
            { label: "Login with key", cmd: "pulse auth login --key pg_live_..." },
            { label: "List monitors", cmd: "pulse monitors list" },
            { label: "Apply from YAML", cmd: "pulse monitors apply -f pulseguard.yaml" },
            { label: "CI/CD gate", cmd: "pulse wait <monitor-id> --timeout 300" },
          ].map(({ label, cmd }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-primary/40 font-mono w-24 shrink-0">{label}</span>
              <div className="flex items-center gap-2 bg-black/60 border border-primary/10 px-3 py-1.5 flex-1 rounded-sm">
                <code className="text-xs font-mono text-primary/80 flex-1">{cmd}</code>
                <CopyButton text={cmd} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security note */}
      <section className="border border-primary/10 p-4 bg-amber-950/10 border-amber-500/20">
        <p className="text-xs text-amber-400/70 font-mono leading-relaxed">
          <strong className="text-amber-400">Security:</strong> API keys grant full read/write
          access to your monitors. Never commit them to version control. Use environment variables
          or secret managers in CI/CD.
        </p>
      </section>
    </div>
  );
}
