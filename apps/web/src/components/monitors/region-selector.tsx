"use client";

import { useState } from "react";
import { AVAILABLE_REGIONS, CONTINENTS } from "@pulseguard/shared/regions";
import { Check } from "lucide-react";

interface RegionSelectorProps {
  selectedRegions: string[];
  onChange: (regions: string[]) => void;
}

export function RegionSelector({
  selectedRegions,
  onChange,
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleRegion = (regionCode: string) => {
    if (selectedRegions.includes(regionCode)) {
      onChange(selectedRegions.filter((r) => r !== regionCode));
    } else {
      onChange([...selectedRegions, regionCode]);
    }
  };

  const selectAllInContinent = (continent: string) => {
    const continentRegions = AVAILABLE_REGIONS.filter(
      (r) => r.continent === continent,
    ).map((r) => r.code);

    const allSelected = continentRegions.every((code) =>
      selectedRegions.includes(code),
    );

    if (allSelected) {
      // Deselect all from this continent
      onChange(
        selectedRegions.filter((code) => !continentRegions.includes(code)),
      );
    } else {
      // Select all from this continent
      const newSelection = [
        ...new Set([...selectedRegions, ...continentRegions]),
      ];
      onChange(newSelection);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
        Monitoring Regions
        <span className="ml-2 text-[10px] text-muted-foreground/60">
          ({selectedRegions.length} selected)
        </span>
      </label>

      <div className="text-sm text-primary/60 font-mono mb-2">
        Select regions to monitor your service from. Leave empty for
        single-region monitoring.
      </div>

      <div className="border border-primary/20 bg-secondary/20 backdrop-blur-sm relative group/regions">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-primary/5 transition-colors font-mono"
        >
          <span className="text-sm text-foreground">
            {selectedRegions.length === 0
              ? "SELECT REGIONS..."
              : `${selectedRegions.length} REGION${selectedRegions.length > 1 ? "S" : ""} ACTIVE`}
          </span>
          <svg
            className={`w-4 h-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="border-t border-primary/20 p-4 max-h-96 overflow-y-auto custom-scrollbar bg-background/50">
            {CONTINENTS.map((continent) => {
              const continentRegions = AVAILABLE_REGIONS.filter(
                (r) => r.continent === continent,
              );
              const allSelected = continentRegions.every((r) =>
                selectedRegions.includes(r.code),
              );
              const someSelected = continentRegions.some((r) =>
                selectedRegions.includes(r.code),
              );

              return (
                <div key={continent} className="mb-4 last:mb-0">
                  <button
                    type="button"
                    onClick={() => selectAllInContinent(continent)}
                    className="flex items-center gap-2 mb-2 text-xs font-bold font-mono text-primary/80 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        allSelected
                          ? "bg-primary border-primary"
                          : someSelected
                            ? "bg-primary/50 border-primary"
                            : "border-primary/30"
                      }`}
                    >
                      {(allSelected || someSelected) && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    {continent}
                  </button>

                  <div className="space-y-1 ml-6">
                    {continentRegions.map((region) => {
                      const isSelected = selectedRegions.includes(region.code);

                      return (
                        <button
                          key={region.code}
                          type="button"
                          onClick={() => toggleRegion(region.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-mono transition-all ${
                            isSelected
                              ? "bg-primary/10 text-primary border-l-2 border-primary"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 border flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-primary/20"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-lg">{region.flag}</span>
                          <span className="flex-1 text-left">
                            {region.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="checkRegions"
        value={JSON.stringify(selectedRegions)}
      />
    </div>
  );
}
