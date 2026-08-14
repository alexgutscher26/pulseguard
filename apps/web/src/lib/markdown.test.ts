import { describe, expect, it } from "vitest";
import { slugify, extractHeadings } from "@/lib/markdown";

describe("markdown utilities", () => {
  describe("slugify", () => {
    it("converts strings to clean URL slugs", () => {
      expect(slugify("Why 60-Second Checks Matter")).toBe("why-60-second-checks-matter");
      expect(slugify("Consensus Across 50 Regions (Sub-Second Latency!)")).toBe(
        "consensus-across-50-regions-sub-second-latency",
      );
      expect(slugify("SLA 99.9% Uptime")).toBe("sla-999-uptime");
      expect(slugify("PulseGuard vs. Better Stack: 2026 Comparison")).toBe(
        "pulseguard-vs-better-stack-2026-comparison",
      );
    });
  });

  describe("extractHeadings", () => {
    it("extracts h2, h3, and h4 headings with proper levels and clean slugs", () => {
      const markdown = `
# Main Title (h1 is skipped from TOC)

Intro paragraph.

## First Big Section
Some details.

### Subsection A
Inner details.

## Second Big Section
More details.

\`\`\`ts
## This is code, not a heading
\`\`\`

#### Detailed Subheading
`;

      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(4);
      expect(headings[0]).toEqual({
        id: "first-big-section",
        text: "First Big Section",
        level: 2,
      });
      expect(headings[1]).toEqual({
        id: "subsection-a",
        text: "Subsection A",
        level: 3,
      });
      expect(headings[2]).toEqual({
        id: "second-big-section",
        text: "Second Big Section",
        level: 2,
      });
      expect(headings[3]).toEqual({
        id: "detailed-subheading",
        text: "Detailed Subheading",
        level: 4,
      });
    });

    it("ignores headings inside fenced code blocks", () => {
      const markdown = `
## Visible Heading

\`\`\`markdown
## Hidden Heading 1
### Hidden Heading 2
\`\`\`

## Another Visible Heading
`;
      const headings = extractHeadings(markdown);
      expect(headings).toHaveLength(2);
      expect(headings[0].id).toBe("visible-heading");
      expect(headings[1].id).toBe("another-visible-heading");
    });
  });
});
