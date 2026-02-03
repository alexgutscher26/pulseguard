"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Settings,
  Trash2,
  Check,
  Loader2,
  Bell,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  getSubscriberByManageToken,
  updateSubscriptionPreferences,
  unsubscribe,
} from "@/actions/subscriptions";
import { MonitorSelector } from "@/components/status-pages/monitor-selector";

interface ManagePageClientProps {
  manageToken: string;
}

interface Subscriber {
  id: string;
  email: string;
  verified: boolean;
  notifyIncidents: boolean;
  notifyMaintenance: boolean;
  statusPage: {
    id: string;
    slug: string;
    title: string;
    monitors: Array<{
      id: string;
      monitorId: string;
      displayName: string | null;
      monitor: {
        id: string;
        name: string;
      };
    }>;
  };
  monitorSubscriptions: Array<{
    monitorId: string;
  }>;
}

export default function ManagePageClient({
  manageToken,
}: ManagePageClientProps) {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  // Preferences state
  const [notifyIncidents, setNotifyIncidents] = useState(true);
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadSubscriber() {
      const data = await getSubscriberByManageToken(manageToken);
      if (data) {
        setSubscriber(data as Subscriber);
        setNotifyIncidents(data.notifyIncidents);
        setNotifyMaintenance(data.notifyMaintenance);
        setSelectedMonitorIds(
          data.monitorSubscriptions.map((ms) => ms.monitorId),
        );
      }
      setIsLoading(false);
    }
    loadSubscriber();
  }, [manageToken]);

  const handleSave = () => {
    startTransition(async () => {
      const response = await updateSubscriptionPreferences(manageToken, {
        notifyIncidents,
        notifyMaintenance,
        monitorIds: selectedMonitorIds,
      });
      setResult(response);
      setTimeout(() => setResult(null), 3000);
    });
  };

  const handleUnsubscribe = () => {
    startTransition(async () => {
      const response = await unsubscribe(manageToken);
      if (response.success) {
        setIsUnsubscribed(true);
      }
      setResult(response);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!subscriber || isUnsubscribed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="bg-[#0a0a0f] border border-primary/30 rounded-lg p-8 max-w-md w-full text-center">
          <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Check className="size-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary mb-2">
            {isUnsubscribed
              ? "Successfully Unsubscribed"
              : "Subscription Not Found"}
          </h1>
          <p className="text-primary/60 mb-6">
            {isUnsubscribed
              ? result?.message ||
                "You have been unsubscribed from all updates."
              : "This subscription link is invalid or has expired."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-md text-primary text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/status-page/${subscriber.statusPage.slug}`}
            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Status Page
          </Link>
          <h1 className="text-2xl font-bold text-primary font-mono">
            Manage Subscription
          </h1>
          <p className="text-primary/60 mt-1">
            {subscriber.email} • {subscriber.statusPage.title}
          </p>
        </div>

        {/* Result Message */}
        {result && !isUnsubscribed && (
          <div
            className={`mb-6 p-4 rounded-md ${
              result.success
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {result.success && <Check className="inline size-4 mr-2" />}
            {result.message}
          </div>
        )}

        {/* Card */}
        <div className="bg-[#0a0a0f] border border-primary/30 rounded-lg overflow-hidden">
          {/* Notification Preferences */}
          <div className="p-6 border-b border-primary/10">
            <h2 className="text-sm font-bold text-primary/60 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Settings className="size-4" />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 bg-black/30 border border-primary/20 rounded-md cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="size-5 text-primary/60" />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Incidents
                    </p>
                    <p className="text-xs text-primary/50">
                      Major outages and issues
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyIncidents}
                  onChange={(e) => setNotifyIncidents(e.target.checked)}
                  className="size-5 rounded border-primary/30 bg-black/50 text-primary focus:ring-primary/50"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-black/30 border border-primary/20 rounded-md cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="size-5 text-primary/60" />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Maintenance
                    </p>
                    <p className="text-xs text-primary/50">
                      Scheduled maintenance windows
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMaintenance}
                  onChange={(e) => setNotifyMaintenance(e.target.checked)}
                  className="size-5 rounded border-primary/30 bg-black/50 text-primary focus:ring-primary/50"
                />
              </label>
            </div>
          </div>

          {/* Monitor Selection */}
          <div className="p-6 border-b border-primary/10">
            <h2 className="text-sm font-bold text-primary/60 uppercase tracking-wider mb-4">
              Subscribed Monitors
            </h2>
            <MonitorSelector
              monitors={subscriber.statusPage.monitors}
              selectedIds={selectedMonitorIds}
              onChange={setSelectedMonitorIds}
            />
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full py-3 px-4 bg-primary/20 hover:bg-primary/30 disabled:bg-primary/10 border border-primary/30 rounded-md text-primary font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Save Changes
                </>
              )}
            </button>

            {/* Unsubscribe */}
            {!showUnsubscribeConfirm ? (
              <button
                onClick={() => setShowUnsubscribeConfirm(true)}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md text-red-400 font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="size-4" />
                Unsubscribe
              </button>
            ) : (
              <div className="p-4 bg-red-500/5 border border-red-500/30 rounded-md">
                <p className="text-sm text-red-400 mb-3">
                  Are you sure you want to unsubscribe? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUnsubscribe}
                    disabled={isPending}
                    className="flex-1 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-md text-red-400 text-sm font-medium transition-all"
                  >
                    Yes, Unsubscribe
                  </button>
                  <button
                    onClick={() => setShowUnsubscribeConfirm(false)}
                    className="flex-1 py-2 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-md text-primary text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary/30 text-xs mt-6 font-mono">
          Powered by PulseGuard
        </p>
      </div>
    </div>
  );
}
