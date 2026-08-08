import React from "react";

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let listBuffer: string[] = [];

  const flushList = (keyPrefix: number) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="my-4 space-y-2 list-disc list-inside text-muted-foreground">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // Basic inline formatting: **bold**, *italic*, `code`, [link](url)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="italic text-muted-foreground">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary">{part.slice(1, -1)}</code>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a key={i} href={linkMatch[2]} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-lg bg-black/80 border border-border p-4 font-mono text-xs overflow-x-auto text-zinc-200">
            <pre>{codeBuffer.join("\n")}</pre>
          </div>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList(i);
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Unordered lists
    if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
      continue;
    } else {
      flushList(i);
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(<h1 key={`h1-${i}`} className="text-2xl font-bold tracking-tight text-foreground mt-8 mb-4">{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold tracking-tight text-foreground mt-6 mb-3">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-semibold tracking-tight text-foreground mt-4 mb-2">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(<p key={`p-${i}`} className="text-muted-foreground leading-relaxed my-3">{renderInline(line)}</p>);
    }
  }

  flushList(lines.length);

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{elements}</div>;
}
