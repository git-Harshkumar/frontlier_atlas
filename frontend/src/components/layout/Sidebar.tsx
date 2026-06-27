"use client";

import React, { useState, useEffect } from "react";
import { TOPBAR_H } from "./TopBar";

function useLoadFont() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.getElementById("inter-font");
    if (existing) return;
    const link = document.createElement("link");
    link.id = "inter-font";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);
}

// ── SVG icon components (stroke-based, matching the reference design) ──────────

function IconFlame({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
    </svg>
  );
}

function IconClock({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconStar({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function IconCrosshair({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="22" y1="12" x2="18" y2="12"/>
      <line x1="6" y1="12" x2="2" y2="12"/>
      <line x1="12" y1="6" x2="12" y2="2"/>
      <line x1="12" y1="22" x2="12" y2="18"/>
    </svg>
  );
}

function IconLayers({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function IconCode({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function IconShield({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconGrid({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function IconSettings({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}

function IconTarget({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function IconBarChart({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}

function IconAlignLeft({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="15" y2="12"/>
      <line x1="3" y1="18" x2="18" y2="18"/>
    </svg>
  );
}

function IconImage({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function IconVideo({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  );
}

function IconMusic({ active }: { active?: boolean }) {
  const c = active ? "#D94F1E" : "#9ca3af";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  );
}

// ── Nav item map ───────────────────────────────────────────────────────────────

type IconComponent = React.FC<{ active?: boolean }>;

const NAV_ICONS: Record<string, IconComponent> = {
  "Trending Papers": IconFlame,
  "Latest Papers": IconClock,
  "Most GitHub Stars": IconStar,
  "Agents": IconCrosshair,
  "Reasoning": IconLayers,
  "Language Modeling": IconLayers,
  "Coding Agents": IconCode,
  "Computer Use": IconShield,
  "World Models": IconGrid,
  "Robotics": IconSettings,
  "Transformer": IconSettings,
  "Chain of Thought": IconTarget,
  "ReAct": IconBarChart,
  "LoRA": IconBarChart,
  "RLHF": IconLayers,
  "DPO": IconLayers,
  "MCP": IconSettings,
  "Text Generation": IconAlignLeft,
  "Image Generation": IconImage,
  "Video Generation": IconVideo,
  "Audio Generation": IconMusic,
};

// ── Components ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ label, active, onClick }: NavItemProps) {
  const Icon = NAV_ICONS[label];
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors no-underline leading-5 nav-item relative ${
        active
          ? "bg-[#fff1ee] text-[#D94F1E] font-semibold"
          : "text-gray-600 font-medium hover:bg-[#fff1ee] hover:text-[#D94F1E]"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#D94F1E] rounded-r-full" />
      )}
      {Icon && <span className="flex-shrink-0 flex items-center"><Icon active={active} /></span>}
      <span>{label}</span>
    </a>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 section-label font-semibold tracking-[0.1em] uppercase text-gray-400">
      {label}
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <button className="flex flex-col justify-center items-center w-6 h-6 bg-transparent border-none cursor-pointer p-0 gap-[5px]" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
      <span className={`block w-5 h-0.5 bg-gray-700 rounded-sm transition-all duration-250 ease-in-out origin-center ${open ? "translate-y-[7px] rotate-45" : ""}`} />
      <span className={`block w-5 h-0.5 bg-gray-700 rounded-sm transition-all duration-250 ease-in-out origin-center ${open ? "opacity-0 scale-x-0" : ""}`} />
      <span className={`block w-5 h-0.5 bg-gray-700 rounded-sm transition-all duration-250 ease-in-out origin-center ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
    </button>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="flex flex-col w-full sidebar-content">
      <SectionLabel label="Discover" />
      <NavItem active label="Trending Papers" onClick={onItemClick} />
      <NavItem label="Latest Papers" onClick={onItemClick} />
      <NavItem label="Most GitHub Stars" onClick={onItemClick} />

      <SectionLabel label="Tasks" />
      <NavItem label="Agents" onClick={onItemClick} />
      <NavItem label="Reasoning" onClick={onItemClick} />
      <NavItem label="Language Modeling" onClick={onItemClick} />
      <NavItem label="Coding Agents" onClick={onItemClick} />
      <NavItem label="Computer Use" onClick={onItemClick} />
      <NavItem label="World Models" onClick={onItemClick} />
      <NavItem label="Robotics" onClick={onItemClick} />

      <SectionLabel label="Methods" />
      <NavItem label="Transformer" onClick={onItemClick} />
      <NavItem label="Chain of Thought" onClick={onItemClick} />
      <NavItem label="ReAct" onClick={onItemClick} />
      <NavItem label="LoRA" onClick={onItemClick} />
      <NavItem label="RLHF" onClick={onItemClick} />
      <NavItem label="DPO" onClick={onItemClick} />
      <NavItem label="MCP" onClick={onItemClick} />

      <SectionLabel label="Generation" />
      <NavItem label="Text Generation" onClick={onItemClick} />
      <NavItem label="Image Generation" onClick={onItemClick} />
      <NavItem label="Video Generation" onClick={onItemClick} />
      <NavItem label="Audio Generation" onClick={onItemClick} />
    </div>
  );
}

function MobileHeader({ onToggle, menuOpen }: { onToggle: () => void; menuOpen: boolean }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bg-[#EDEAE3] border-b border-gray-200 z-30 flex items-center px-3 sm:px-4 gap-2 sm:gap-3 lg:hidden"
      style={{ height: TOPBAR_H }}
    >
      <div onClick={onToggle} className="cursor-pointer p-2 -ml-2 rounded-lg hover:bg-[#fff1ee] transition-colors">
        <HamburgerIcon open={menuOpen} />
      </div>
      <span className="text-sm sm:text-base font-bold text-gray-900 flex-1 text-center">Frontier Atlas</span>
      <div className="w-10" />
    </div>
  );
}

export default function Sidebar() {
  useLoadFont();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape" && menuOpen) setMenuOpen(false); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "sidebar-dynamic-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .sidebar-content {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: visible;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 0.8vh;
        padding-bottom: 1vh;
        padding-left: 0;
      }
      .sidebar-content .nav-item {
        font-size: clamp(12px, 1.6vh, 17px);
        padding-top: 0.35vh;
        padding-bottom: 0.35vh;
        line-height: 1.25;
      }
      .sidebar-content .section-label {
        font-size: clamp(9px, 1.1vh, 13px);
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0.4vh;
        margin-bottom: 0.15vh;
        letter-spacing: 0.08em;
      }
      .sidebar-content .section-label:first-child {
        margin-top: 0;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      {/* Desktop sidebar — static, no scroll */}
      <aside
        className="fixed left-0 hidden lg:flex flex-col bg-[#EDEAE3] border-r border-gray-300 z-20 w-[220px] overflow-visible pl-4 pr-8"
        style={{ top: TOPBAR_H, height: `calc(100dvh - ${TOPBAR_H}px)` }}
      >
        <SidebarContent />
      </aside>

      <MobileHeader onToggle={() => setMenuOpen(p => !p)} menuOpen={menuOpen} />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-250 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 w-[280px] sm:w-[320px] max-w-[85vw] bg-[#EDEAE3] border-r border-gray-200 z-50 flex flex-col h-dvh shadow-[4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden overflow-y-auto pl-3 sm:pl-4 pr-6 sm:pr-8 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#fff1ee] transition-colors text-gray-500 hover:text-[#D94F1E]"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <SidebarContent onItemClick={() => setMenuOpen(false)} />
      </div>
    </>
  );
}