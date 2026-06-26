"use client";

import React from "react";

export const TOPBAR_H = 65;

export default function TopBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 bg-white border-b-[0.5px] border-gray-300"
      style={{ height: TOPBAR_H }}
    >
      <div className="flex items-center h-full pl-20 pr-8 gap-4">
        <div className="flex items-center gap-2 flex-shrink-0 w-[280px] pl-0">
          <span className="font-bold text-[25px] text-gray-900 tracking-tight">Frontier Atlas</span>
        </div>

        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.4"
            >
              <circle cx="6.5" cy="6.5" r="5.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search papers, methods, tasks, authors..."
              className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors border-[#c9cdd4]"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 ml-auto pr-14">
          <button className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-gray-900 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="8" y1="11" x2="8" y2="2" />
              <polyline points="5,5 8,2 11,5" />
              <path d="M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" />
            </svg>
            Submit
          </button>
          <button className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-gray-900 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M13 10.5c.5 1 1 1.5 1 1.5H2s.5-.5 1-1.5C3.5 9.5 4 7 4 6a4 4 0 0 1 8 0c0 1.5.5 3.5 1 4.5z" />
              <path d="M9.7 13a2 2 0 0 1-3.4 0" />
            </svg>
            Alerts
          </button>
          <button className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-gray-900 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12.5l-5-2.7-5 2.7V2z" />
            </svg>
            Saved
          </button>
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-700 flex-shrink-0">
              <svg viewBox="0 0 28 28" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" fill="#c2856a" />
                <ellipse cx="14" cy="9" rx="7" ry="7" fill="#3b1f0e" />
                <rect x="7" y="9" width="14" height="6" fill="#3b1f0e" />
                <ellipse cx="14" cy="13" rx="5.5" ry="6" fill="#e8b89a" />
                <rect x="11.5" y="18" width="5" height="4" fill="#e8b89a" />
                <ellipse cx="14" cy="26" rx="10" ry="5" fill="#7c3aed" />
              </svg>
            </div>
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-500">
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </div>
        </div>

        <div className="flex md:hidden items-center gap-3 ml-auto pr-0">
          <button className="text-gray-500 hover:text-gray-700">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
              <circle cx="6.5" cy="6.5" r="5.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" strokeLinecap="round" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-700 flex-shrink-0">
            <svg viewBox="0 0 28 28" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" fill="#c2856a" />
              <ellipse cx="14" cy="9" rx="7" ry="7" fill="#3b1f0e" />
              <rect x="7" y="9" width="14" height="6" fill="#3b1f0e" />
              <ellipse cx="14" cy="13" rx="5.5" ry="6" fill="#e8b89a" />
              <rect x="11.5" y="18" width="5" height="4" fill="#e8b89a" />
              <ellipse cx="14" cy="26" rx="10" ry="5" fill="#7c3aed" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}