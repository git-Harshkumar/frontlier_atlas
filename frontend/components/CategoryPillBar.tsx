"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { getCategoryColors } from "@/lib/categoryColors";

export function CategoryPillBar({ categories }: { categories: any[] }) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id || "");
  const pillBarRef = useRef<HTMLDivElement>(null);

  // track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    categories.forEach((group) => {
      const el = document.getElementById(group.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(group.id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  // scroll pill into view when activeId changes
  useEffect(() => {
    const pill = pillBarRef.current?.querySelector(
      `[data-id="${activeId}"]`
    ) as HTMLElement | null;
    pill?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  const scrollPillBar = useCallback((offset: number) => {
    if (pillBarRef.current) {
      pillBarRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, []);

  const handlePillClick = useCallback((id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    
    if (!el) return;
    
    // Navbar height (56px) + Pill Bar height (48px) + tiny visual breathing room = 110px
    const offset = 110; 
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top: top,
      behavior: "smooth"
    });
  }, []);

  return (
    <div className="sticky top-[56px] xl:top-[52px] z-50 bg-[#F8F7F2]/95 backdrop-blur-md border-b border-[#E8E8E3] mb-8 -mx-4 md:-mx-8 xl:-mx-12 px-4 md:px-8 xl:px-12">
      <div className="relative group flex items-center">
        {/* Left Scroll Button */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F8F7F2] to-transparent z-10 pointer-events-none flex items-center justify-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scrollPillBar(-300)}
            className="w-7 h-7 ml-1 rounded-full bg-white border border-[#E8E8E3] shadow-sm flex items-center justify-center text-[#555] hover:text-[#FF5A1F] hover:border-[#FF5A1F] pointer-events-auto transition-colors"
            aria-label="Scroll left"
          >
            <LucideIcons.ChevronLeft className="w-4 h-4 -ml-0.5" />
          </button>
        </div>

        <div
          ref={pillBarRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto py-3 hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {categories.map((group) => {
            const active = activeId === group.id;
            const colors = getCategoryColors(group.id);
            const Icon = group.iconName ? LucideIcons[group.iconName as keyof typeof LucideIcons] as React.ElementType : LucideIcons.Layers;
            
            return (
              <button
                key={group.id}
                data-id={group.id}
                onClick={() => handlePillClick(group.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all duration-200 border"
                style={{
                  background: active ? colors.accent : "#fff",
                  color: active ? "#fff" : "#555",
                  borderColor: active ? colors.accent : "#E2E2DE",
                  boxShadow: active ? `0 2px 8px ${colors.accent}35` : "none",
                  transform: active ? "scale(1.04)" : "scale(1)",
                }}
              >
                <Icon className="w-3 h-3 shrink-0" strokeWidth={2} />
                {group.name}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F8F7F2] to-transparent z-10 pointer-events-none flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scrollPillBar(300)}
            className="w-7 h-7 mr-1 rounded-full bg-white border border-[#E8E8E3] shadow-sm flex items-center justify-center text-[#555] hover:text-[#FF5A1F] hover:border-[#FF5A1F] pointer-events-auto transition-colors"
            aria-label="Scroll right"
          >
            <LucideIcons.ChevronRight className="w-4 h-4 -mr-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
