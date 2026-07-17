"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import HeroSection from "@/components/HeroSection";
import type { GetPapersResult } from "@/lib/paperApi";

export default function HomeContent({
  initialPapers,
  initialError,
}: {
  initialPapers: GetPapersResult | null;
  initialError?: string;
}) {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [activeSort, setActiveSort] = useState<string>("Latest Papers");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("All time");

  const isMounted = useRef(false);

  // Stealthy Memory Check: Restore filters from sessionStorage if they exist
  useEffect(() => {
    const savedSort = sessionStorage.getItem("atlas_activeSort");
    const savedPeriod = sessionStorage.getItem("atlas_selectedPeriod");
    if (savedSort && savedSort !== "undefined" && savedSort !== "null") setActiveSort(savedSort);
    if (savedPeriod && savedPeriod !== "undefined" && savedPeriod !== "null") setSelectedPeriod(savedPeriod);

    // Mark as mounted after we've read the saved values
    setTimeout(() => {
      isMounted.current = true;
    }, 0);
  }, []);

  // Save user preferences to memory when they change
  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("atlas_activeSort", activeSort);
    }
  }, [activeSort]);

  useEffect(() => {
    if (isMounted.current) {
      sessionStorage.setItem("atlas_selectedPeriod", selectedPeriod);
    }
  }, [selectedPeriod]);

  // Map the UI tab to API parameters
  const apiPeriod =
    selectedPeriod === "Today" ? "today" :
      selectedPeriod === "This Week" ? "week" :
        selectedPeriod === "This Month" ? "month" : "all";

  const apiSort = activeSort === "Trending Papers" ? "trending" : "latest";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div
        id="scroll-container"
        className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col"
      >
        {/* Hero Section Container */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6">
          <HeroSection
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        </div>

        {/* 3-Column Layout */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12 flex items-start gap-6 xl:gap-8">
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-3 h-[calc(100vh-80px)]">
            <Sidebar initialActive={activeSort} onItemSelect={setActiveSort} />
          </div>

          <main className="flex-1 min-w-0">
            <PaperTabs selectedPeriod={selectedPeriod} onPeriodSelect={setSelectedPeriod} />
            <PaperList
              selectedTag={selectedTag}
              period={apiPeriod}
              filterParams={{ sort: apiSort }}
              initialPapers={initialPapers}
              initialError={initialError}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
