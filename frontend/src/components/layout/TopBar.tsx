"use client";

import React from "react";

export const TOPBAR_H = 52;

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#EDEAE3] border-b border-[#e5e5e5] h-[52px]">
      <div className="flex items-center h-full px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        {/* Logo - fixed width, no flex-shrink */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 w-auto sm:w-[200px]">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 sm:w-7 sm:h-7 text-[#D94F1E]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span className="font-bold text-lg sm:text-[22px] text-[#111111] tracking-tight hidden sm:inline">Frontier Atlas</span>
          <span className="font-bold text-lg text-[#111111] tracking-tight sm:hidden">FA</span>
        </div>

        {/* Search - expands to fill remaining space */}
        <div className="flex-1 min-w-0">
          <div className="relative max-w-[700px]">
            <svg
              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888]"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="6.5" cy="6.5" r="5.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search papers, authors, topics..."
              className="w-full pl-8 sm:pl-9 pr-10 sm:pr-16 py-1.5 sm:py-2 bg-[#EDEAE3] border border-gray-300 rounded-lg text-xs sm:text-sm text-[#111111] placeholder:text-[#888888] focus:outline-none focus:border-[#D94F1E] transition-colors"
            />
            <kbd className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-medium text-[#888888] bg-[#EDEAE3] border border-[#e5e5e5] rounded">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right actions - fixed width to push search left */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-auto sm:w-[180px] justify-end">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#D94F1E] hover:bg-[#C0451A] text-white font-medium text-sm rounded-lg transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="8" y1="11" x2="8" y2="2" />
              <polyline points="5,5 8,2 11,5" />
              <path d="M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
            </svg>
            Submit
          </button>

          {/* Mobile submit icon button */}
          <button className="sm:hidden flex items-center justify-center w-8 h-8 bg-[#D94F1E] hover:bg-[#C0451A] text-white rounded-lg transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="8" y1="11" x2="8" y2="2" />
              <polyline points="5,5 8,2 11,5" />
              <path d="M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
            </svg>
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 cursor-pointer">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f9f9f9] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#555555]">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#888888] hidden sm:block">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}