"use client";
import { useState, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import HeroSection from "@/components/HeroSection";
import BackToTop from "@/components/BackToTop";
import { atlasUiFont } from "@/lib/fonts";

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
  const [activeSort, setActiveSort] = useState<string>("Trending Papers");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Today");
  
  const filterParams = useMemo(() => {
    const isTask = ["Agents", "Reasoning", "Language Modeling", "Coding Agents", "Computer Use", "World Models", "Robotics"].includes(activeSort);
    const isDiscover = ["Trending Papers", "Latest Papers", "Most GitHub Stars"].includes(activeSort);
    // If it's not a known task or discover tab, it might be a dynamic method name.
    
    const toSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return {
      sort: activeSort === "Latest Papers" ? "latest" 
          : activeSort === "Most GitHub Stars" ? "stars" 
          : "trending",
      task: isTask ? toSlug(activeSort) : undefined,
      method: (!isTask && !isDiscover) ? toSlug(activeSort) : undefined,
    };
  }, [activeSort]);

  return (
    <div className={`${atlasUiFont.className} flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <Navbar activeSort={activeSort} onItemSelect={setActiveSort} />
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
            <Sidebar initialActive={activeSort} onItemSelect={setActiveSort} />
          </div>

          <main className="flex-1 min-w-0 max-w-full flex flex-col">
            <div className="block xl:hidden w-full mb-8 border-b border-[#E5E5E0] pb-4">
              <RightSidebar />
            </div>
            
            <PaperTabs selectedPeriod={selectedPeriod} onPeriodSelect={setSelectedPeriod} />
            <PaperList 
              selectedTag={selectedTag} 
              filterParams={filterParams} 
              period={selectedPeriod === "Today" ? "today"
                    : selectedPeriod === "This Week" ? "week"
                    : selectedPeriod === "This Month" ? "month"
                    : "all"} 
            />
          </main>

          {/* RightSidebar is lazy-loaded so it doesn't block the paper feed */}
          <RightSidebarSlot />

        </div>
      </div>
      <BackToTop />
    </div>
  );
}
