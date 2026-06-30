"use client";
import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PaperList from "@/components/PaperFeed";
import PaperFilters from "@/components/PaperFilters";
import RightSidebar from "@/components/RightSidebar";
import HeroSection from "@/components/HeroSection";
import type { PaperFilters as Filters } from "@/lib/paperApi";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
    if (newFilters.task) {
      setSelectedTag(undefined);
    }
  }, []);

  const handleTagChange = useCallback((tag: string | undefined) => {
    setSelectedTag(tag);
    if (tag && tag !== "All Topics") {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      setFilters((prev) => ({ ...prev, task: slug }));
    } else {
      setFilters((prev) => {
        const next = { ...prev };
        delete next.task;
        return next;
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col">
        
        {/* Hero Section Container */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-6">
          <HeroSection
            selectedTag={selectedTag}
            setSelectedTag={handleTagChange}
          />
        </div>

        {/* 3-Column Layout */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-12 flex items-start gap-6 xl:gap-8">
          
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0 max-w-full">
            <PaperFilters filters={filters} onChange={handleFilterChange} />
            <PaperList filters={filters} />
          </main>
          
          <div className="hidden xl:block w-[280px] shrink-0 sticky top-4">
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  );
}
