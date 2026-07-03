"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperTabs from "@/components/PaperTabs";
import RightSidebar from "@/components/RightSidebar";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col">
        
        {/* Hero Section Container */}
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
            <PaperTabs />
            <PaperList selectedTag={selectedTag} />
          </main>
          
          <div className="hidden xl:block w-[280px] shrink-0 self-start">
  <div className="sticky top-4">
    <RightSidebar />
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
