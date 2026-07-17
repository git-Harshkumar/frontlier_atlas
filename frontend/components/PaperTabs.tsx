"use client";

import { useState } from "react";

const TABS = ["Today", "This Week", "This Month", "All time"];

interface PaperTabsProps {
  selectedPeriod?: string;
  onPeriodSelect?: (period: string) => void;
}

export default function PaperTabs({
  selectedPeriod,
  onPeriodSelect,
}: PaperTabsProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState("Today");
  const activeTab = selectedPeriod ?? internalActiveTab;

  const handleTabClick = (tab: string) => {
    if (selectedPeriod === undefined) {
      setInternalActiveTab(tab);
    }
    onPeriodSelect?.(tab);
  };

  return (
    <div className="border-b border-[#E5E5E0] mb-0 sm:mb-1">
      <div className="flex gap-4 sm:gap-8 overflow-x-auto hide-scroll snap-x snap-mandatory">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`py-3.5 sm:py-3 text-[14px] sm:text-[13px] border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap snap-start sm:snap-none
              ${activeTab === tab
                ? "text-[#111111] border-[#F55036] font-semibold"
                : "text-[#8B8B8B] border-transparent hover:text-[#555555] hover:border-[#E5E5E0] font-normal"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
