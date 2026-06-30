"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bot, Brain, Eye, Code2, Cpu, Grid, Loader2 } from "lucide-react";
import { searchPapers, type Paper } from "@/lib/paperApi";
import Link from "next/link";
import { slugify } from "@/lib/methods";

export default function HeroSection({
  selectedTag,
  setSelectedTag,
}: {
  selectedTag?: string;
  setSelectedTag: (tag: string | undefined) => void;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full flex flex-col items-center justify-center pt-3 md:pt-5 pb-3 md:pb-10 px-4 md:px-10 rounded-[24px] relative overflow-hidden shrink-0 text-center border border-[#FDECE8]" style={{ background: "linear-gradient(180deg, #FFF6F3 0%, #F8F7F2 100%)" }}>

      <div className="w-full flex flex-col items-center z-10">
        <h1 className="text-[17px] min-[375px]:text-[19px] sm:text-[24px] md:text-[32px] lg:text-[36px] font-bold leading-[1.2] md:leading-[1.05] tracking-tight text-[#111111] mb-2 md:mb-1.5 whitespace-nowrap">
          Discover what&apos;s next in <span className="text-[#F55036]">AI research.</span>
        </h1>
        <p className="text-[#555555] text-[14px] md:text-[15px] leading-[1.6] md:leading-[1.5] mb-3 md:mb-4 whitespace-normal md:whitespace-nowrap max-w-[400px] md:max-w-none">
          Search, discover, and track papers, methods, benchmarks, and open-source releases.
        </p>

        {/* Search Bar */}
        <div ref={searchRef} className="w-full max-w-[640px] relative shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full bg-white border border-[#E5E5E0] flex items-center px-4 md:px-5 h-11 mb-3 md:mb-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow mx-auto">
          <Search size={18} className="text-[#737373] mr-2 md:mr-3 shrink-0 md:w-[20px] md:h-[20px]" />
          <input
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
            <Loader2 size={16} className="text-[#737373] shrink-0 animate-spin md:w-[20px] md:h-[20px]" />
          ) : (
            <kbd className="inline-flex shrink-0 bg-[#F8F7F2] border border-[#DCDCD7] rounded-md px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-[12px] text-[#737373] font-medium shadow-sm">
              ⌘ K
            </kbd>
          )}

          {/* Dropdown */}
          {showDropdown && query.trim() && (
            <div className="absolute top-[100%] left-0 right-0 mt-2 bg-white border border-[#E5E5E0] rounded-[16px] shadow-[0_12px_40px_rgb(0,0,0,0.12)] max-h-[320px] overflow-y-auto z-50 py-2 text-left cursor-default">
              {isSearching ? (
                <div className="px-4 py-4 text-[13px] text-[#737373] flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Searching...
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((paper) => (
                    <li key={paper.id} className="px-4 py-3 hover:bg-[#F8F7F2] cursor-pointer border-b border-[#F5F5F5] last:border-0 transition-colors">
                      <div className="text-[14px] font-medium text-[#111111] line-clamp-1">{paper.title}</div>
                      <div className="text-[12px] text-[#8B8B8B] truncate mt-1">
                        {paper.authorNames.map((name, i) => (
                          <span key={name}>
                            {i > 0 && <span className="text-[#DCDCD7]">, </span>}
                            <Link
                              href={`/authors/${slugify(name)}`}
                              className="hover:text-[#F55036] transition-colors no-underline"
                            >
                              {name}
                            </Link>
                          </span>
                        ))}
                        <span className="mx-1.5 text-[#DCDCD7]">·</span>
                        {paper.date}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-[13px] text-[#737373] text-center">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-nowrap items-center justify-center gap-1 md:gap-3 w-full max-w-[900px] overflow-hidden whitespace-nowrap px-1 md:px-2 pb-2 md:pb-0">
          {tags.map((tag) => (
            <button
              key={tag.label}
              onClick={() =>
                setSelectedTag(
                  selectedTag === tag.label ? undefined : tag.label
                )
              }
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 min-h-[44px] md:min-h-[32px] transition-all cursor-pointer group ${selectedTag === tag.label
                ? "bg-[#F55036] text-white border-[#F55036]"
                : "bg-white border border-[#E5E5E0] hover:border-[#F55036] hover:shadow-sm"
                }`}
            >
              <tag.icon
                size={16}
                className={`transition-transform group-hover:scale-110 ${selectedTag === tag.label ? "text-white" : "text-[#F55036]"
                  }`}
              />
              <span
                className={`text-[13px] font-bold ${selectedTag === tag.label ? "text-white" : "text-[#111111]"
                  }`}
              >
                {tag.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
