"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bot, Brain, Eye, Code2, Cpu, Grid, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { searchPapers, type Paper } from "@/lib/paperApi";
import { motion } from "framer-motion";
import Link from "next/link";
import { useScrollThreshold } from "@/lib/useScroll";

const formatAuthors = (authorsStr: string) => {
  if (!authorsStr) return "";
  const authorList = authorsStr.split(",").map(a => a.trim());
  if (authorList.length > 3) {
    return `${authorList.slice(0, 3).join(", ")} et al.`;
  }
  return authorsStr;
};

export default function HeroSection({
  selectedTag,
  setSelectedTag,
}: {
  selectedTag?: string;
  setSelectedTag: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const isScrolled = useScrollThreshold(50);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await searchPapers(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const tags = [
    { label: "Agents", icon: Bot },
    { label: "Reasoning", icon: Brain },
    { label: "Vision", icon: Eye },
    { label: "Coding", icon: Code2 },
    { label: "Robotics", icon: Cpu },
    { label: "All Topics", icon: Grid },
  ];

  // Track if tags should show in expanded (multi-row) mode
  const [showAllTags, setShowAllTags] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-4 md:pt-6 pb-6 md:pb-10 relative shrink-0 text-center">
      <div className="w-full flex flex-col items-center z-10">
        <h1 className="text-[17px] min-[375px]:text-[19px] sm:text-[24px] md:text-[32px] lg:text-[36px] font-extrabold leading-[1.2] md:leading-[1.05] tracking-tight text-[#111111] mb-2 md:mb-1.5 whitespace-nowrap">
          Discover what&apos;s next in <span className="text-[#F55036]">AI research.</span>
        </h1>
        <p className="text-[#555555] text-[14px] md:text-[15px] leading-[1.6] md:leading-[1.5] mb-3 md:mb-4 whitespace-normal md:whitespace-nowrap max-w-[400px] md:max-w-none">
          Search, discover, and track papers, methods, benchmarks, and open-source releases.
        </p>

        {/* Search Bar */}
        {!isScrolled && (
          <motion.div 
            layoutId="global-container"
            ref={searchRef} 
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-full max-w-[640px] relative shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[24px] bg-white border border-[#E5E5E0] flex items-center px-4 md:px-5 h-12 mb-3 md:mb-4 hover:shadow-[0_12px_32px_rgb(0,0,0,0.10)] focus-within:border-[#FF5A1F]/40 focus-within:shadow-[0_0_0_3px_rgba(255,90,31,0.08)] transition-all duration-200 mx-auto origin-top z-50"
          >
            <motion.div layoutId="global-icon" transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex items-center text-[#737373] mr-2 md:mr-3 shrink-0">
              <Search size={18} className="md:w-[20px] md:h-[20px]" />
            </motion.div>
            <motion.input
              layoutId="global-input"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search papers, authors, topics, methods..."
              className="bg-transparent outline-none flex-1 text-[#111111] placeholder:text-[#737373] text-[13px] md:text-[15px] truncate mr-2 text-left w-full"
            />
            {isSearching ? (
              <Loader2 size={16} className="text-[#F55036] animate-spin shrink-0" />
            ) : (
              <div className="hidden md:flex items-center justify-center px-2 h-6 rounded-md bg-[#F8F7F2] border border-[#E5E5E0]/80 text-[10px] font-semibold text-[#8B8B8B] shrink-0 gap-0.5 tracking-wide">
                <span>⌘</span><span>K</span>
              </div>
            )}
  
            {/* Dropdown Results */}
            {showDropdown && (debouncedQuery.trim().length > 0 || isSearching) && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#E5E5E0] py-2 z-50 max-h-[400px] overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8 text-[#8B8B8B] gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[14px]">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((paper) => (
                      <Link
                        key={paper.id}
                        href={`/papers/${paper.slug || paper.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="px-4 md:px-5 py-3 hover:bg-[#F8F7F2] cursor-pointer transition-colors border-b border-[#E5E5E0] last:border-0 flex flex-col gap-1 text-left"
                      >
                        <h4 className="text-[14px] font-semibold text-[#111111] leading-snug line-clamp-2">
                          {paper.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#737373]">
                          <span className="truncate max-w-[200px]">{formatAuthors(paper.authors)}</span>
                          {Number(paper.upvotes) > 0 && (
                            <>
                              <span>•</span>
                              <span>{paper.upvotes} stars</span>
                            </>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-[#737373] text-[14px]">
                    No results found for &quot;{debouncedQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Tags - Multi-row responsive layout */}
        <div className="w-full max-w-[900px] px-2 pb-2 md:pb-0">
          {/* Desktop: Always show all tags in a wrapped flex */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag.label}
                onClick={() =>
                  setSelectedTag(
                    selectedTag === tag.label ? undefined : tag.label
                  )
                }
                className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 min-h-[32px] transition-all duration-200 ease-out cursor-pointer select-none
                  ${
                    selectedTag === tag.label
                      ? "bg-[#F55036] text-white border border-[#F55036] scale-[1.04] shadow-[0_2px_8px_rgba(245,80,54,0.30)]"
                      : "bg-white border border-[#E5E5E0] hover:border-[#FF5A1F]/50 hover:bg-[#FFF7F3] hover:scale-[1.03] hover:shadow-sm active:scale-95"
                  }`}
              >
                <tag.icon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    selectedTag === tag.label ? "text-white" : "text-[#F55036]"
                  }`}
                />
                <span
                  className={`text-[12px] font-semibold ${
                    selectedTag === tag.label ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {tag.label}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile: Show 4 tags (or selected), rest in expand/collapse */}
          <div className="flex md:hidden flex-col items-center gap-2">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {tags.filter((tag, idx) => showAllTags || idx < 4 || selectedTag === tag.label).map((tag) => (
                <button
                  key={tag.label}
                  onClick={() =>
                    setSelectedTag(
                      selectedTag === tag.label ? undefined : tag.label
                    )
                  }
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 min-h-[28px] transition-all duration-200 ease-out cursor-pointer select-none
                    ${
                      selectedTag === tag.label
                        ? "bg-[#F55036] text-white border border-[#F55036] scale-[1.04] shadow-[0_2px_8px_rgba(245,80,54,0.30)]"
                        : "bg-white border border-[#E5E5E0] hover:border-[#FF5A1F]/50 hover:bg-[#FFF7F3] hover:scale-[1.03] hover:shadow-sm active:scale-95"
                    }`}
                >
                  <tag.icon
                    className={`w-3 h-3 transition-transform duration-200 ${
                      selectedTag === tag.label ? "text-white" : "text-[#F55036]"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold ${
                      selectedTag === tag.label ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    {tag.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Show More / Show Less toggle on mobile */}
            {tags.length > 4 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="flex items-center gap-1 text-[11px] font-medium text-[#8B8B8B] hover:text-[#F55036] transition-colors duration-200 mt-1"
              >
                {showAllTags ? (
                  <>
                    Show less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
