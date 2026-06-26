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

interface NavItemProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ label, active, onClick }: NavItemProps) {
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className={`flex items-center px-0 rounded-md cursor-pointer transition-colors no-underline leading-5 nav-item ${
        active
          ? "bg-[#fff1ee] text-[#E8442A] font-semibold"
          : "text-gray-600 font-medium hover:bg-gray-50 hover:text-[#F97316]"
      }`}
    >
      <span>{label}</span>
    </a>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-0 section-label font-semibold tracking-[0.1em] uppercase text-gray-400">
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
      className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 flex items-center px-4 gap-3 lg:hidden"
      style={{ height: TOPBAR_H }}
    >
      <div onClick={onToggle} className="cursor-pointer p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
        <HamburgerIcon open={menuOpen} />
      </div>
      <span className="text-base font-bold text-gray-900 flex-1 text-center">Frontier Atlas</span>
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
        className="fixed left-0 hidden lg:flex flex-col bg-white border-r border-gray-200 z-20 w-[260px] overflow-visible pl-20 pr-8"
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

      {/* Mobile drawer — starts at top:0, full 100dvh, close button sits below topbar via padding */}
      <div
        className={`fixed left-0 top-0 w-[320px] max-w-[85vw] bg-white border-r border-gray-200 z-50 flex flex-col h-dvh shadow-[4px_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden overflow-y-auto pl-4 pr-8 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Spacer that matches topbar height so content starts below it */}
        <div style={{ height: TOPBAR_H, flexShrink: 0 }} />

        {/* Close button row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
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