"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wand2, Save, FileDown, Loader2 } from "lucide-react";
import { upsertPostMortem, generatePostMortemSummary } from "@/actions/post-mortem";
import { toast } from "sonner";

interface PostMortemData {
  summary: string;
  rootCause: string;
  impactScope: string;
  detectionMethod: string;
  actionItems: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface PostMortemEditorProps {
  incidentId: string;
  incidentTitle: string;
  initialData?: PostMortemData | null;
}

export function PostMortemEditor({
  incidentId,
  incidentTitle,
  initialData,
}: PostMortemEditorProps) {
  const [formData, setFormData] = useState<PostMortemData>(
    initialData || {
      summary: "",
      rootCause: "",
      impactScope: "",
      detectionMethod: "",
      actionItems: "",
      status: "DRAFT",
    },
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof PostMortemData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await upsertPostMortem(incidentId, formData);
      if (result.success) {
        toast.success("Post-mortem saved successfully");
      } else {
        toast.error(result.error || "Failed to save post-mortem");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePostMortemSummary(incidentId);
      if (result.success && result.summary) {
        setFormData((prev) => ({ ...prev, summary: result.summary }));
        toast.success("Summary generated successfully");
      } else {
        toast.error(result.error || "Failed to generate summary");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = () => {
    const markdown = `
# Post-Mortem: ${incidentTitle}
**Date:** ${new Date().toLocaleDateString()}
**Status:** ${formData.status}

## Executive Summary
${formData.summary || "(No summary provided)"}

## Root Cause Analysis
${formData.rootCause || "(No root cause provided)"}

## Impact & Scope
${formData.impactScope || "(No impact details provided)"}

## Detection
${formData.detectionMethod || "(No detection method provided)"}

## Action Items
${formData.actionItems || "(No action items provided)"}
    `.trim();

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `post-mortem-${incidentId}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown report downloaded");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Post-Mortem Report</CardTitle>
              <CardDescription>
                Analyze the incident, document the root cause, and define action items to prevent
                recurrence.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                <FileDown className="mr-2 size-4" />
                Export MD
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="summary">Executive Summary</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-muted-foreground"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 size-3 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 size-3" />
                )}
                Auto-Generate with AI
              </Button>
            </div>
            <Textarea
              id="summary"
              placeholder="Brief overview of the incident..."
              className="min-h-[100px]"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rootCause">Root Cause Analysis (RCA)</Label>
            <Textarea
              id="rootCause"
              placeholder="Why did this happen? (5 Whys)"
              className="min-h-[100px]"
              value={formData.rootCause}
              onChange={(e) => handleInputChange("rootCause", e.target.value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="impactScope">Impact & Scope</Label>
              <Textarea
                id="impactScope"
                placeholder="Who was affected? How long?"
                className="min-h-[100px]"
                value={formData.impactScope}
                onChange={(e) => handleInputChange("impactScope", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detectionMethod">Detection Method</Label>
              <Textarea
                id="detectionMethod"
                placeholder="How was it detected? (Alert, Customer, etc.)"
                className="min-h-[100px]"
                value={formData.detectionMethod}
                onChange={(e) => handleInputChange("detectionMethod", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionItems">Action Items</Label>
            <Textarea
              id="actionItems"
              placeholder="- [ ] Fix bug in worker &#10;- [ ] Add monitoring for X"
              className="min-h-[100px] font-mono"
              value={formData.actionItems}
              onChange={(e) => handleInputChange("actionItems", e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Status: <span className="font-semibold">{formData.status}</span> • Last saved:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
