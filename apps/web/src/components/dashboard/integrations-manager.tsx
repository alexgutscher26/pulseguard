"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Github,
  Cloud,
  Check,
  Loader2,
  ExternalLink,
  ArrowRight,
  Blocks,
  Link as LinkIcon,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  fetchVercelProjects,
  fetchNetlifySites,
  fetchGitHubRepos,
  importThirdPartyMonitors,
  getConnectedIntegrations,
  disconnectIntegration,
  getVercelOAuthUrl,
  connectVercelWithToken,
  connectNetlifyWithToken,
  connectGitHubWithToken,
  type ExternalResource,
} from "@/actions/integrations";

type Provider = "vercel" | "netlify" | "github";

export function IntegrationsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [token, setToken] = useState("");
  const [useDemo, setUseDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<ExternalResource[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [hasSavedToken, setHasSavedToken] = useState(false);
  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([]);

  const loadIntegrations = async () => {
    try {
      const res = await getConnectedIntegrations();
      if (res.success && res.data) {
        setConnectedIntegrations(res.data);
      }
    } catch (err) {
      console.error("Failed to load integrations", err);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const details = searchParams.get("details");

    if (success === "vercel_connected") {
      toast.success("Successfully connected Vercel scope!");
      router.replace("/dashboard/integrations");
      loadIntegrations();
    } else if (error) {
      toast.error(`Integration failed: ${error} ${details ? `(${details})` : ""}`);
      router.replace("/dashboard/integrations");
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeProvider) {
      const savedToken = localStorage.getItem(`pulseguard_token_${activeProvider}`);
      if (savedToken) {
        setToken(savedToken);
        setUseDemo(false);
        setHasSavedToken(true);
      } else {
        // If Vercel, Netlify, or GitHub is active and we have a persistent integration connected in the DB,
        // we default token to "db" so we fetch from the DB.
        const hasDbConfig = connectedIntegrations.some((ci) => ci.provider === activeProvider);
        const isDbProvider =
          activeProvider === "vercel" ||
          activeProvider === "netlify" ||
          activeProvider === "github";
        if (isDbProvider && hasDbConfig) {
          setToken("db");
          setUseDemo(false);
          setHasSavedToken(false);
        } else if (isDbProvider) {
          setToken("");
          setUseDemo(false);
          setHasSavedToken(false);
        } else {
          setToken("");
          setUseDemo(true);
          setHasSavedToken(false);
        }
      }
    }
  }, [activeProvider, connectedIntegrations]);

  const handleClearToken = () => {
    if (activeProvider) {
      localStorage.removeItem(`pulseguard_token_${activeProvider}`);
      setToken("");
      setUseDemo(true);
      setHasSavedToken(false);
      toast.success("Saved credentials cleared successfully");
    }
  };

  const handleVercelDisconnect = async (id: string) => {
    setLoading(true);
    try {
      const res = await disconnectIntegration(id);
      if (res.success) {
        toast.success("Disconnected Vercel scope successfully");
        await loadIntegrations();
      } else {
        toast.error(res.error || "Failed to disconnect integration");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect integration");
    } finally {
      setLoading(false);
    }
  };

  const handleVercelConnectWithToken = async () => {
    if (!token || token === "db") {
      toast.error("Please enter a valid Vercel API token");
      return;
    }
    setLoading(true);
    try {
      const res = await connectVercelWithToken(token);
      if (res.success && res.personalName) {
        toast.success(
          `Successfully connected personal scope "${res.personalName}"${
            res.teamsCount && res.teamsCount > 0 ? ` and ${res.teamsCount} team scopes!` : "!"
          }`,
        );
        setToken("db"); // set to db to fetch projects using db integrations
        setUseDemo(false);
        await loadIntegrations();
      } else {
        toast.error(res.error || "Failed to verify or connect Vercel token");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect token");
    } finally {
      setLoading(false);
    }
  };

  const handleNetlifyConnectWithToken = async () => {
    if (!token || token === "db") {
      toast.error("Please enter a valid Netlify API token");
      return;
    }
    setLoading(true);
    try {
      const res = await connectNetlifyWithToken(token);
      if (res.success && res.name) {
        toast.success(`Successfully connected Netlify account "${res.name}"!`);
        setToken("db"); // set to db to fetch sites using db integrations
        setUseDemo(false);
        await loadIntegrations();
      } else {
        toast.error(res.error || "Failed to verify or connect Netlify token");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect token");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubConnectWithToken = async () => {
    if (!token || token === "db") {
      toast.error("Please enter a valid GitHub API token");
      return;
    }
    setLoading(true);
    try {
      const res = await connectGitHubWithToken(token);
      if (res.success && res.name) {
        toast.success(`Successfully connected GitHub account "${res.name}"!`);
        setToken("db"); // set to db to fetch repos using db integrations
        setUseDemo(false);
        await loadIntegrations();
      } else {
        toast.error(res.error || "Failed to verify or connect GitHub token");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect token");
    } finally {
      setLoading(false);
    }
  };

  const handleVercelConnectOAuth = async () => {
    setLoading(true);
    try {
      const res = await getVercelOAuthUrl();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Failed to initiate Vercel OAuth");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred initiating Vercel OAuth");
    } finally {
      setLoading(false);
    }
  };

  const providerMeta = {
    vercel: {
      title: "Vercel Integration",
      description: "Auto-sync Vercel deployments and project domains.",
      icon: Cloud,
      color: "from-[#000000] to-[#333333] border-white/10",
      accent: "text-white bg-white/5 border-white/20",
      tokenPlaceholder: "Enter Vercel Access Token (API token)",
      docsLink: "https://vercel.com/docs/rest-api",
    },
    netlify: {
      title: "Netlify Integration",
      description: "Sync your deployed static sites and custom URLs.",
      icon: LinkIcon,
      color: "from-[#00AD9F]/10 to-[#00F5D4]/5 border-[#00AD9F]/20",
      accent: "text-[#00F5D4] bg-[#00AD9F]/10 border-[#00AD9F]/30",
      tokenPlaceholder: "Enter Netlify Personal Access Token",
      docsLink: "https://docs.netlify.com/api/get-started/",
    },
    github: {
      title: "GitHub Pages & Repos",
      description: "Import repository endpoints and GitHub Pages websites.",
      icon: Github,
      color: "from-[#24292e]/20 to-[#4078c0]/10 border-[#4078c0]/20",
      accent: "text-[#4078c0] bg-[#4078c0]/10 border-[#4078c0]/30",
      tokenPlaceholder: "Enter GitHub Personal Access Token (PAT)",
      docsLink: "https://github.com/settings/tokens",
    },
  };

  const handleConnectClick = (provider: Provider) => {
    setActiveProvider(provider);
    setToken("");
    setUseDemo(provider !== "vercel" && provider !== "netlify" && provider !== "github");
    setResources([]);
    setSelectedIds(new Set());
  };

  const handleFetchResources = async () => {
    setLoading(true);
    const tokenToUse = useDemo ? "mock" : token;

    if (!useDemo && !token) {
      toast.error("Please enter a valid API access token");
      setLoading(false);
      return;
    }

    try {
      let result;
      if (activeProvider === "vercel") {
        result = await fetchVercelProjects(tokenToUse, useDemo);
      } else if (activeProvider === "netlify") {
        result = await fetchNetlifySites(tokenToUse);
      } else {
        result = await fetchGitHubRepos(tokenToUse);
      }

      if (result.success && result.data) {
        setResources(result.data);
        // Default select all projects
        setSelectedIds(new Set(result.data.map((r) => r.id)));
        toast.success(`Successfully loaded ${result.data.length} projects!`);

        // Save the valid token in localStorage
        if (!useDemo && token && token !== "db" && activeProvider) {
          localStorage.setItem(`pulseguard_token_${activeProvider}`, token);
          setHasSavedToken(true);
        }
      } else {
        toast.error(result.error || "Failed to load projects");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to retrieve deployments");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one deployment to import");
      return;
    }

    setImporting(true);
    const targets = resources
      .filter((r) => selectedIds.has(r.id))
      .map((r) => ({
        name: r.name,
        url: r.url,
        type: r.type,
      }));

    try {
      const result = await importThirdPartyMonitors(targets);
      if (result.success) {
        toast.success(`Successfully imported ${result.count} monitors!`);
        setActiveProvider(null);
        router.push("/dashboard/monitors");
      } else {
        toast.error(result.error || "Failed to complete import");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during import");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Blocks className="size-5 text-primary" />
          Zero-Code Integrations
        </h2>
        <p className="text-xs text-muted-foreground">
          Import websites, repos, and cloud deployments automatically. PulseGuard connects directly
          to your providers.
        </p>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vercel Card */}
        <Card className="relative overflow-hidden border-border bg-card/30 backdrop-blur-md group hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.02)]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="size-5 fill-white" viewBox="0 0 116 100">
                  <path d="M57.5 0L115 100H0L57.5 0Z" />
                </svg>
              </div>
              {connectedIntegrations.some((ci) => ci.provider === "vercel") ? (
                <Badge
                  variant="outline"
                  className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 text-[10px]"
                >
                  Active ({connectedIntegrations.filter((ci) => ci.provider === "vercel").length})
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 text-[10px]"
                >
                  1-Click setup
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-bold">Vercel Integration</CardTitle>
            <CardDescription className="text-[11px] leading-relaxed">
              Auto-sync and import Vercel projects and production domains straight into your active
              monitors list.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              onClick={() => handleConnectClick("vercel")}
              className={`w-full text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 ${
                connectedIntegrations.some((ci) => ci.provider === "vercel")
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                  : "bg-accent hover:bg-accent/80 text-foreground border-border"
              }`}
            >
              {connectedIntegrations.some((ci) => ci.provider === "vercel") ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  Connected
                </>
              ) : (
                <>
                  Connect Vercel
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Netlify Card */}
        <Card className="relative overflow-hidden border-border bg-card/30 backdrop-blur-md group hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.02)]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#00AD9F]/20 to-transparent"></div>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#00AD9F]/5 border border-[#00AD9F]/10 flex items-center justify-center">
                <svg className="size-5 fill-[#00F5D4]" viewBox="0 0 512 512">
                  <path
                    d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                    opacity=".2"
                  />
                  <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm-53 381.7l-90.7-90.7 22.6-22.6 68.1 68.1 143.7-143.7 22.6 22.6-166.3 166.3z" />
                </svg>
              </div>
              {connectedIntegrations.some((ci) => ci.provider === "netlify") ? (
                <Badge
                  variant="outline"
                  className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 text-[10px]"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[#00F5D4] border-[#00AD9F]/20 bg-[#00AD9F]/5 text-[10px]"
                >
                  1-Click setup
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-bold">Netlify Integration</CardTitle>
            <CardDescription className="text-[11px] leading-relaxed">
              Auto-discover Netlify static deployment sites, custom proxy configs, and subdomains
              automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              onClick={() => handleConnectClick("netlify")}
              className={`w-full text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 ${
                connectedIntegrations.some((ci) => ci.provider === "netlify")
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                  : "bg-accent hover:bg-accent/80 text-foreground border-border"
              }`}
            >
              {connectedIntegrations.some((ci) => ci.provider === "netlify") ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  Connected
                </>
              ) : (
                <>
                  Connect Netlify
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* GitHub Card */}
        <Card className="relative overflow-hidden border-border bg-card/30 backdrop-blur-md group hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.02)]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#4078c0]/20 to-transparent"></div>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-xl bg-[#4078c0]/5 border border-[#4078c0]/10 flex items-center justify-center">
                <Github className="size-5 text-white" />
              </div>
              {connectedIntegrations.some((ci) => ci.provider === "github") ? (
                <Badge
                  variant="outline"
                  className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 text-[10px]"
                >
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[#4078c0] border-[#4078c0]/20 bg-[#4078c0]/5 text-[10px]"
                >
                  1-Click setup
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-bold">GitHub Pages & Repos</CardTitle>
            <CardDescription className="text-[11px] leading-relaxed">
              Link codebases directly and deploy HTTP or raw PING check targets for documentation
              and landing projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              onClick={() => handleConnectClick("github")}
              className={`w-full text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 ${
                connectedIntegrations.some((ci) => ci.provider === "github")
                  ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                  : "bg-accent hover:bg-accent/80 text-foreground border-border"
              }`}
            >
              {connectedIntegrations.some((ci) => ci.provider === "github") ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  Connected
                </>
              ) : (
                <>
                  Connect GitHub
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Integration Setup Dialog */}
      <Dialog open={activeProvider !== null} onOpenChange={() => setActiveProvider(null)}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card/90 backdrop-blur-md text-foreground rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {activeProvider && (
            <>
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  {activeProvider === "vercel" && <Cloud className="size-5 text-white" />}
                  {activeProvider === "netlify" && <LinkIcon className="size-5 text-[#00F5D4]" />}
                  {activeProvider === "github" && <Github className="size-5 text-[#4078c0]" />}
                  {providerMeta[activeProvider].title}
                </DialogTitle>
                <DialogDescription className="text-[11px]">
                  {providerMeta[activeProvider].description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {resources.length === 0 ? (
                  /* Credential Entry Mode */
                  <div className="space-y-4">
                    {/* Demo/Mock Mode Selector */}
                    <div className="p-3.5 rounded-xl border border-border bg-accent/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground cursor-pointer flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useDemo}
                            onChange={(e) => setUseDemo(e.target.checked)}
                            className="size-4 accent-primary rounded cursor-pointer"
                          />
                          Use Demo Simulation Mode
                        </label>
                        <Badge
                          variant="outline"
                          className="text-primary border-primary/20 bg-primary/5 text-[9px]"
                        >
                          Instant
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Don't have an API key handy? Enable this checkbox to load virtual
                        repositories/projects instantly and test the zero-code import flow.
                      </p>
                    </div>

                    {/* Vercel Specific Live Token Integration Flow */}
                    {!useDemo && activeProvider === "vercel" && (
                      <div className="space-y-4">
                        {connectedIntegrations.some((ci) => ci.provider === "vercel") && (
                          /* Connected Scopes */
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Connected Vercel Scopes
                            </label>
                            <div className="divide-y divide-border border border-border rounded-xl bg-accent/20 max-h-[160px] overflow-y-auto">
                              {connectedIntegrations
                                .filter((ci) => ci.provider === "vercel")
                                .map((ci) => (
                                  <div
                                    key={ci.id}
                                    className="flex justify-between items-center p-3 text-xs"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-foreground">
                                        {ci.teamName}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Badge
                                          variant="outline"
                                          className="text-[8px] px-1 scale-90 border-primary/20 text-primary bg-primary/5"
                                        >
                                          {ci.teamSlug}
                                        </Badge>
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleVercelDisconnect(ci.id)}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] h-7 px-2.5 rounded-lg border border-red-500/10"
                                    >
                                      Disconnect
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Direct Token Input for Connecting */}
                        <div className="space-y-3 p-4 rounded-xl border border-border bg-accent/10">
                          <label className="text-xs font-bold text-foreground">
                            {connectedIntegrations.some((ci) => ci.provider === "vercel")
                              ? "Connect Another Account / Token"
                              : "Vercel Personal Access Token"}
                          </label>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Create a token in your Vercel Account Settings and paste it below.
                            PulseGuard will persistently link your personal account and all
                            accessible teams to your database account.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              placeholder="Enter Vercel Access Token (sec_...)"
                              value={token === "db" ? "" : token}
                              onChange={(e) => setToken(e.target.value)}
                              className="bg-accent/40 border-border text-foreground text-xs rounded-xl focus-visible:ring-primary/50"
                            />
                            <Button
                              onClick={handleVercelConnectWithToken}
                              disabled={loading || !token || token === "db"}
                              className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4 rounded-xl flex items-center gap-1.5 shrink-0"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="size-3.5 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                "Connect"
                              )}
                            </Button>
                          </div>
                          <div className="pt-1">
                            <a
                              href="https://vercel.com/account/tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline flex items-center gap-1.5"
                            >
                              Where do I get my access token?
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Netlify Specific Live Token Integration Flow */}
                    {!useDemo && activeProvider === "netlify" && (
                      <div className="space-y-4">
                        {connectedIntegrations.some((ci) => ci.provider === "netlify") && (
                          /* Connected Scopes */
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Connected Netlify Account
                            </label>
                            <div className="divide-y divide-border border border-border rounded-xl bg-accent/20 max-h-[160px] overflow-y-auto">
                              {connectedIntegrations
                                .filter((ci) => ci.provider === "netlify")
                                .map((ci) => (
                                  <div
                                    key={ci.id}
                                    className="flex justify-between items-center p-3 text-xs"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-foreground">
                                        {ci.teamName}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Badge
                                          variant="outline"
                                          className="text-[8px] px-1 scale-90 border-primary/20 text-primary bg-primary/5"
                                        >
                                          {ci.teamSlug}
                                        </Badge>
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleVercelDisconnect(ci.id)}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] h-7 px-2.5 rounded-lg border border-red-500/10"
                                    >
                                      Disconnect
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Direct Token Input for Connecting */}
                        <div className="space-y-3 p-4 rounded-xl border border-border bg-accent/10">
                          <label className="text-xs font-bold text-foreground">
                            {connectedIntegrations.some((ci) => ci.provider === "netlify")
                              ? "Connect Another Account / Token"
                              : "Netlify Personal Access Token"}
                          </label>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Create a Personal Access Token in your Netlify User Settings and paste
                            it below. PulseGuard will persistently link your site index to your
                            database account.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              placeholder="Enter Netlify Personal Access Token"
                              value={token === "db" ? "" : token}
                              onChange={(e) => setToken(e.target.value)}
                              className="bg-accent/40 border-border text-foreground text-xs rounded-xl focus-visible:ring-primary/50"
                            />
                            <Button
                              onClick={handleNetlifyConnectWithToken}
                              disabled={loading || !token || token === "db"}
                              className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4 rounded-xl flex items-center gap-1.5 shrink-0"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="size-3.5 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                "Connect"
                              )}
                            </Button>
                          </div>
                          <div className="pt-1">
                            <a
                              href="https://app.netlify.com/user/settings/applications#personal-access-tokens"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#00F5D4] hover:underline flex items-center gap-1.5"
                            >
                              Where do I get my access token?
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GitHub Specific Live Token Integration Flow */}
                    {!useDemo && activeProvider === "github" && (
                      <div className="space-y-4">
                        {connectedIntegrations.some((ci) => ci.provider === "github") && (
                          /* Connected Scopes */
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground">
                              Connected GitHub Account
                            </label>
                            <div className="divide-y divide-border border border-border rounded-xl bg-accent/20 max-h-[160px] overflow-y-auto">
                              {connectedIntegrations
                                .filter((ci) => ci.provider === "github")
                                .map((ci) => (
                                  <div
                                    key={ci.id}
                                    className="flex justify-between items-center p-3 text-xs"
                                  >
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-foreground">
                                        {ci.teamName}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Badge
                                          variant="outline"
                                          className="text-[8px] px-1 scale-90 border-[#4078c0]/20 text-[#4078c0] bg-[#4078c0]/5"
                                        >
                                          {ci.teamSlug}
                                        </Badge>
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleVercelDisconnect(ci.id)}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 text-[10px] h-7 px-2.5 rounded-lg border border-red-500/10"
                                    >
                                      Disconnect
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Direct Token Input for Connecting */}
                        <div className="space-y-3 p-4 rounded-xl border border-border bg-accent/10">
                          <label className="text-xs font-bold text-foreground">
                            {connectedIntegrations.some((ci) => ci.provider === "github")
                              ? "Connect Another Account / Token"
                              : "GitHub Personal Access Token"}
                          </label>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">
                            Create a Personal Access Token (PAT) with `repo` scope in your GitHub
                            Developer Settings and paste it below. PulseGuard will persistently link
                            your repository targets to your database account.
                          </p>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              placeholder="Enter GitHub PAT (ghp_...)"
                              value={token === "db" ? "" : token}
                              onChange={(e) => setToken(e.target.value)}
                              className="bg-accent/40 border-border text-foreground text-xs rounded-xl focus-visible:ring-primary/50"
                            />
                            <Button
                              onClick={handleGitHubConnectWithToken}
                              disabled={loading || !token || token === "db"}
                              className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4 rounded-xl flex items-center gap-1.5 shrink-0"
                            >
                              {loading ? (
                                <>
                                  <Loader2 className="size-3.5 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                "Connect"
                              )}
                            </Button>
                          </div>
                          <div className="pt-1">
                            <a
                              href="https://github.com/settings/tokens/new?scopes=repo"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#4078c0] hover:underline flex items-center gap-1.5"
                            >
                              Where do I get my access token?
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {(useDemo ||
                      connectedIntegrations.some((ci) => ci.provider === activeProvider)) && (
                      <Button
                        onClick={handleFetchResources}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          "Fetch Projects & Deployments"
                        )}
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Resource Selection Checklist Mode */
                  <div className="space-y-4">
                    <div className="border border-border rounded-xl max-h-[220px] overflow-y-auto divide-y divide-border bg-accent/20">
                      {resources.map((res) => {
                        const isSelected = selectedIds.has(res.id);
                        return (
                          <div
                            key={res.id}
                            onClick={() => toggleSelect(res.id)}
                            className="flex items-center justify-between p-3 hover:bg-accent/40 cursor-pointer transition-colors"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-semibold text-foreground">
                                {res.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <LinkIcon className="size-3 shrink-0" />
                                {res.url}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="text-[9px] bg-accent/60 border-border text-foreground hover:bg-accent/60 scale-90">
                                {res.type}
                              </Badge>
                              <div
                                className={`size-5 rounded border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-border bg-accent"
                                }`}
                              >
                                {isSelected && <Check className="size-3.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 justify-between text-[11px] text-muted-foreground bg-accent/10 p-3 border border-border rounded-xl">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="size-3.5 text-yellow-500" />
                        Monitors will check in every 60 seconds (Initiate Tier limit).
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => setResources([])}
                        variant="outline"
                        className="flex-1 text-xs py-2 border-border text-foreground"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleImport}
                        disabled={importing || selectedIds.size === 0}
                        className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2"
                      >
                        {importing ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin mr-1.5" />
                            Importing...
                          </>
                        ) : (
                          `Import Selected (${selectedIds.size})`
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
