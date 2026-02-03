"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2 text-[10px] font-mono uppercase tracking-widest border border-primary/20 rounded-full px-3 py-1 bg-primary/5">
      {["en", "es", "fr", "de"].map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          className={`transition-colors ${locale === l ? "text-primary font-bold shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "text-primary/40 hover:text-primary/80"}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
