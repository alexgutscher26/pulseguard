"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateLanguageSettings } from "@/actions/i18n";
import { useRouter } from "next/navigation";

const EDITABLE_KEYS = [
  {
    group: "Status Labels",
    keys: [
      { key: "status.operational", label: "Operational Message" },
      { key: "status.major_outage", label: "Major Outage Message" },
      { key: "status.partial_outage", label: "Partial Outage Message" },
      { key: "status.issue_detected", label: "Issue Detected Banner" },
    ],
  },
  {
    group: "Headings",
    keys: [
      { key: "headings.past_incidents", label: "Past Incidents" },
      { key: "headings.current_status", label: "Current Status" },
      { key: "headings.subscribe", label: "Subscribe Button" },
      { key: "common.powered_by", label: "Footer 'Powered By'" },
    ],
  },
];

interface Props {
  pageId: string;
  locale: string;
  initialOverrides: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatusPageMessageEditor({
  pageId,
  locale,
  initialOverrides,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Flatten overrides for form state?
  // initialOverrides are likely flat from DB or nested?
  // In `getLanguageSettings` action, we cast overrides to Record<string, string>.
  // The DB stores JSON. If we store flat keys `{"status.operational": "Foo"}`, it's easier.
  // My logic in `page.tsx` used `set(messages, key, value)` which works with flat dot-notation keys.
  // So we will assume flat keys state.

  const [formData, setFormData] = useState<Record<string, string>>(
    initialOverrides || {},
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      // Filter out empty strings to avoid overriding with empty? Or allow empty?
      // Let's filter out undefined/null.

      await updateLanguageSettings(pageId, locale, {
        overrides: formData,
      });
      toast.success("Translations updated");
      router.refresh(); // Refresh to update parent `page` prop
      onOpenChange(false);
    } catch (e) {
      toast.error("Failed to save translations");
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#0A0A0A] border border-primary/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono uppercase font-bold text-primary">
            Edit Translations ({locale.toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {EDITABLE_KEYS.map((group) => (
            <div key={group.group} className="space-y-4">
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-white/10 pb-2">
                {group.group}
              </h4>
              <div className="grid gap-4">
                {group.keys.map((item) => (
                  <div key={item.key} className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary/70 uppercase">
                      {item.label}{" "}
                      <span className="text-muted-foreground opacity-50 lowercase ml-1">
                        ({item.key})
                      </span>
                    </label>
                    <input
                      value={formData[item.key] || ""}
                      placeholder="Default value..."
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full bg-black/50 border border-white/10 p-2 rounded-sm text-sm font-mono focus:border-primary/50 outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-mono uppercase text-muted-foreground hover:text-foreground mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-black font-bold font-mono text-xs uppercase px-4 py-2 rounded-sm flex items-center gap-2"
          >
            {loading && <Loader2 className="size-3 animate-spin" />}
            Save Translations
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
