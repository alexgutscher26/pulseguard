"use client";

import { useState } from "react";
import {
  Globe,
  Database,
  ShoppingCart,
  Code,
  Container,
  FileText,
  LayoutDashboard,
  Server,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  Layers,
  Activity,
  ShieldCheck,
  Heart,
  Radio,
} from "lucide-react";
import {
  stackTemplates,
  getTemplateById,
  type StackTemplate,
  type StackMonitorPreset,
} from "@pulseguard/shared/stack-templates";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Database,
  ShoppingCart,
  Code,
  Container,
  FileText,
  LayoutDashboard,
  Server,
};

const monitorTypeIcons: Record<string, React.ElementType> = {
  HTTP: Globe,
  PING: Activity,
  PORT: Radio,
  SSL: ShieldCheck,
  DNS: Server,
  HEARTBEAT: Heart,
};

function TemplateCard({
  template,
  onApply,
}: {
  template: StackTemplate;
  onApply: (id: string) => void;
}) {
  const Icon = iconMap[template.icon] || Globe;
  const difficultyColor =
    template.difficulty === "beginner"
      ? "text-green-500 bg-green-500/10 border-green-500/20"
      : template.difficulty === "intermediate"
        ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
        : "text-red-500 bg-red-500/10 border-red-500/20";

  return (
    <div className="group relative bg-black/40 border border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden backdrop-blur-sm flex flex-col">
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 group-hover:border-primary/50 transition-colors" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between">
          <div className="p-2.5 bg-primary/5 border border-primary/10 group-hover:border-primary/20 group-hover:bg-primary/10 transition-all">
            <Icon className="size-5 text-primary" />
          </div>
          <span
            className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 border ${difficultyColor}`}
          >
            {template.difficulty}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-tight leading-tight">
            {template.name}
          </h3>
          <p className="text-[11px] text-primary/60 font-mono leading-relaxed line-clamp-2">
            {template.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {template.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-mono text-primary/50 border border-primary/10 px-1.5 py-0.5"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <Layers className="size-3 text-primary/50" />
          <span className="text-[10px] font-mono text-primary/50">
            {template.monitors.length} monitor{template.monitors.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="border-t border-primary/10 p-4">
        <button
          onClick={() => onApply(template.id)}
          className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-[10px] uppercase tracking-widest py-2.5 transition-all font-mono flex items-center justify-center gap-1.5"
        >
          Apply Template
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}

function DifficultyFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = [
    { label: "All", value: "all" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`text-[10px] font-bold font-mono uppercase tracking-wider px-3 py-1.5 border transition-all ${
            value === opt.value
              ? "bg-primary text-black border-primary"
              : "bg-transparent text-primary/50 border-primary/20 hover:border-primary/40 hover:text-primary/80"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TemplateDetailModal({
  template,
  onClose,
}: {
  template: StackTemplate;
  onClose: () => void;
}) {
  const [urlMapping, setUrlMapping] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const m of template.monitors) {
      if (m.type !== "HEARTBEAT" && m.type !== "DNS") {
        const url = m.url.replace(/\/$/, "");
        map[m.name] = url;
      }
    }
    return map;
  });
  const [applying, setApplying] = useState(false);
  const [result, setResult] = useState<{
    created: { name: string; id: string }[];
    errors: { name: string; reason: string }[];
  } | null>(null);
  const router = useRouter();

  const handleApply = async () => {
    setApplying(true);
    setResult(null);
    try {
      const { applyTemplate } = await import("@/actions/stack-templates");
      const res = await applyTemplate(template.id, urlMapping);
      setResult(res);
      if (res.created.length > 0) {
        toast.success(`Created ${res.created.length} monitor${res.created.length > 1 ? "s" : ""}`);
        router.refresh();
      }
      if (res.errors.length > 0) {
        toast.error(`${res.errors.length} monitor${res.errors.length > 1 ? "s" : ""} failed`);
      }
    } catch (error) {
      toast.error("Failed to apply template");
      console.error(error);
    } finally {
      setApplying(false);
    }
  };

  const handleVisitMonitors = () => {
    router.push("/dashboard/monitors");
  };

  const handleVisitNew = () => {
    router.push("/dashboard/monitors/new");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-primary/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary/50 hover:text-primary transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="p-6 border-b border-primary/10 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 border border-primary/20">
              {(() => {
                const Icon = iconMap[template.icon] || Globe;
                return <Icon className="size-5 text-primary" />;
              })()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
                {template.name}
              </h2>
              <p className="text-xs text-primary/60 font-mono">{template.description}</p>
            </div>
          </div>
        </div>

        {!result ? (
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[11px] font-mono text-primary/70 border-l-2 border-primary/30 pl-3 leading-relaxed">
              Review the monitors this template will create. Replace the example URLs with your
              actual endpoints before applying.
            </p>

            <div className="flex flex-col gap-3">
              {template.monitors.map((monitor, idx) => {
                const TypeIcon = monitorTypeIcons[monitor.type] || Globe;
                return (
                  <div key={idx} className="border border-primary/10 bg-black/30 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-primary/10 border border-primary/20">
                        <TypeIcon className="size-3 text-primary" />
                      </div>
                      <span className="text-xs font-bold font-mono text-foreground">
                        {monitor.name}
                      </span>
                      <span className="text-[9px] font-mono text-primary/40 px-1.5 py-0.5 border border-primary/10 ml-auto">
                        {monitor.type}
                      </span>
                    </div>
                    {monitor.type !== "HEARTBEAT" && monitor.type !== "DNS" ? (
                      <input
                        type="text"
                        value={urlMapping[monitor.name] ?? ""}
                        onChange={(e) =>
                          setUrlMapping({ ...urlMapping, [monitor.name]: e.target.value })
                        }
                        className="w-full bg-black/50 border border-primary/20 text-xs font-mono p-2 text-primary placeholder:text-primary/20 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="https://your-actual-url.com"
                      />
                    ) : monitor.type === "HEARTBEAT" ? (
                      <p className="text-[10px] text-primary/40 font-mono">
                        Heartbeat URL will be auto-generated on creation
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={urlMapping[monitor.name] ?? monitor.url}
                        onChange={(e) =>
                          setUrlMapping({ ...urlMapping, [monitor.name]: e.target.value })
                        }
                        className="w-full bg-black/50 border border-primary/20 text-xs font-mono p-2 text-primary placeholder:text-primary/20 focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="example.com"
                      />
                    )}
                    {monitor.description && (
                      <p className="text-[10px] text-primary/40 font-mono mt-1.5">
                        {monitor.description}
                      </p>
                    )}
                    {monitor.port && (
                      <p className="text-[10px] text-primary/40 font-mono mt-1">
                        Port: {monitor.port}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2 border-t border-primary/10">
              <button
                onClick={onClose}
                className="flex-1 border border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 text-[10px] font-bold font-mono uppercase tracking-widest py-2.5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold text-[10px] uppercase tracking-widest py-2.5 transition-all font-mono disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Layers className="size-3" />
                    Create {template.monitors.length} Monitor
                    {template.monitors.length > 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              {result.errors.length === 0 ? (
                <CheckCircle2 className="size-5 text-green-500" />
              ) : result.created.length > 0 ? (
                <AlertTriangle className="size-5 text-yellow-500" />
              ) : (
                <AlertTriangle className="size-5 text-red-500" />
              )}
              <span className="text-sm font-bold font-mono text-foreground">
                {result.created.length > 0
                  ? `Created ${result.created.length} monitor${result.created.length > 1 ? "s" : ""}`
                  : "No monitors created"}
              </span>
            </div>

            {result.created.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold font-mono text-green-500/70 uppercase tracking-wider">
                  Created Successfully
                </span>
                {result.created.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 border border-green-500/10 bg-green-500/5 p-2.5"
                  >
                    <CheckCircle2 className="size-3 text-green-500 shrink-0" />
                    <span className="text-[11px] font-mono text-foreground">{m.name}</span>
                  </div>
                ))}
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold font-mono text-red-500/70 uppercase tracking-wider">
                  Failed
                </span>
                {result.errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 border border-red-500/10 bg-red-500/5 p-2.5"
                  >
                    <AlertTriangle className="size-3 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono text-foreground">{err.name}</span>
                      <span className="text-[9px] font-mono text-red-500/70">{err.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-primary/10">
              <button
                onClick={handleVisitMonitors}
                className="flex-1 border border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 text-[10px] font-bold font-mono uppercase tracking-widest py-2.5 transition-all"
              >
                View Monitors
              </button>
              <button
                onClick={handleVisitNew}
                className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold text-[10px] uppercase tracking-widest py-2.5 transition-all font-mono"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TemplateGallery() {
  const [difficulty, setDifficulty] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filtered =
    difficulty === "all"
      ? stackTemplates
      : stackTemplates.filter((t) => t.difficulty === difficulty);

  const selected = selectedTemplate ? getTemplateById(selectedTemplate) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold font-mono text-foreground uppercase tracking-wider">
          Stack Templates
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          One-click monitoring setups for your specific tech stack. Pick a template, replace the
          example URLs, and deploy in seconds.
        </p>
      </div>

      <DifficultyFilter value={difficulty} onChange={setDifficulty} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onApply={(id) => setSelectedTemplate(id)}
          />
        ))}
      </div>

      {selected && (
        <TemplateDetailModal template={selected} onClose={() => setSelectedTemplate(null)} />
      )}
    </div>
  );
}
