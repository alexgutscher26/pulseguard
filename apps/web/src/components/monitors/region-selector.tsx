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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        Monitoring Regions
        <span className="ml-2 text-xs text-gray-400">
          ({selectedRegions.length} selected)
        </span>
      </label>

      <div className="text-xs text-gray-400 mb-2">
        Select regions to monitor your service from. Leave empty for
        single-region monitoring.
      </div>

      <div className="border border-cyan-500/20 rounded-lg bg-black/20 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-cyan-500/5 transition-colors"
        >
          <span className="text-sm text-gray-300">
            {selectedRegions.length === 0
              ? "Select regions..."
              : `${selectedRegions.length} region${selectedRegions.length > 1 ? "s" : ""} selected`}
          </span>
          <svg
            className={`w-4 h-4 text-cyan-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
          <div className="border-t border-cyan-500/20 p-4 max-h-96 overflow-y-auto">
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
                    className="flex items-center gap-2 mb-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <div
                      className={`w-4 h-4 border rounded flex items-center justify-center ${
                        allSelected
                          ? "bg-cyan-500 border-cyan-500"
                          : someSelected
                            ? "bg-cyan-500/50 border-cyan-500"
                            : "border-cyan-500/30"
                      }`}
                    >
                      {(allSelected || someSelected) && (
                        <Check className="w-3 h-3 text-white" />
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
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isSelected
                              ? "bg-cyan-500/10 text-cyan-300"
                              : "text-gray-400 hover:bg-cyan-500/5 hover:text-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 border rounded flex items-center justify-center ${
                              isSelected
                                ? "bg-cyan-500 border-cyan-500"
                                : "border-cyan-500/30"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
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
