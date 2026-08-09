"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm text-xs">
      <div className="flex items-center gap-2 mb-3 font-semibold text-foreground tracking-tight">
        <List className="size-3.5 text-primary" />
        <span>Table of Contents</span>
      </div>
      <ul className="space-y-1.5 list-none m-0 p-0">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={item.level === 3 ? "pl-3.5" : item.level === 4 ? "pl-6" : ""}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(item.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", `#${item.id}`);
                    setActiveId(item.id);
                  }
                }}
                className={`block py-1 transition-colors leading-snug line-clamp-2 ${
                  isActive
                    ? "text-primary font-semibold border-l-2 border-primary -ml-[calc(theme(spacing.4)+1px)] pl-[calc(theme(spacing.4)-1px)]"
                    : "text-muted-foreground/80 hover:text-foreground"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TableOfContents;
