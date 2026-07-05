"use client";
import { useState, memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import HeroSection from "@/components/HeroSection";

// ─── Lazy-loaded non-critical sections ────────────────────────────────────
// RightSidebar fires a getDiscussions() API call on mount. If it rendered
// eagerly, that request would race with the papers fetch on the same
// connection pool. By lazy-loading it (ssr:false), we defer its mount until
// after React hydration is complete — papers get a head start on the network.
const RightSidebar = dynamic(() => import("@/components/RightSidebar"), {
  ssr: false,
  loading: () => (
    // Placeholder column keeps layout stable while the sidebar loads.
    <div className="hidden xl:block w-[280px] shrink-0" />
  ),
});

// Memoize the right sidebar wrapper so sticky positioning re-renders don't
// cascade up when paper feed state changes.
const RightSidebarSlot = memo(function RightSidebarSlot() {
  return (
    <div className="hidden xl:block w-[280px] shrink-0 self-start">
      <div className="sticky top-4">
        <RightSidebar />
      </div>
    </div>
  );
});
RightSidebarSlot.displayName = "RightSidebarSlot";

// ─── Homepage ─────────────────────────────────────────────────────────────
export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  // selectedPeriod is wired through PaperTabs → PaperList so tab clicks
  // actually trigger a filtered fetch. Previously PaperTabs managed its own
  // internal state with no way to propagate the value upward.
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Today");

  return (
    // atlasUiFont className removed — Inter is already applied at the <body>
    // level in layout.tsx. Having it here created a second Inter CSS variable
    // scope and an unnecessary class re-application on every render.
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111] tracking-normal">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col">

        {/* Hero Section */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6">
          <HeroSection
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        </div>

        {/* 3-Column Layout */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12 flex items-start gap-6 xl:gap-8">

          <div className="hidden lg:block w-[200px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0 max-w-full">
            {/* PaperTabs now passes selectedPeriod and onPeriodSelect so tab
                clicks propagate to PaperList and trigger a real filtered fetch. */}
            <PaperTabs
              selectedPeriod={selectedPeriod}
              onPeriodSelect={setSelectedPeriod}
            />
            <PaperList
              selectedTag={selectedTag}
              period={
                // "Today" sends no period param — matches the original behaviour.
                // The backend returns the default trending feed when period is omitted.
                selectedPeriod === "This Week" ? "week"
                : selectedPeriod === "This Month" ? "month"
                : selectedPeriod === "All time" ? "all"
                : undefined
              }
            />
          </main>

          {/* RightSidebar is lazy-loaded so it doesn't block the paper feed */}
          <RightSidebarSlot />

        </div>
      </div>
    </div>
  );
}
