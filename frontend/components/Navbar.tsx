"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMethodsActive = pathname.startsWith("/methods");
  const isTasksActive = pathname.startsWith("/tasks");
  const isModelsActive = pathname.startsWith("/models");
  const isDatasetsActive = pathname.startsWith("/datasets");
  const isAuthorsActive = pathname.startsWith("/authors");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="h-[56px] lg:h-[52px] w-full bg-[#F8F7F2] border-b border-[#E5E5E0] flex items-center justify-between px-4 md:px-8 xl:px-12 gap-3 lg:gap-4 shrink-0 z-50">
        {/* Mobile Left (Hamburger + Logo) */}
        <div className="flex items-center gap-1 lg:gap-0 lg:w-[240px] shrink-0">
          <button 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
          <Link href="/" className="flex items-center relative w-[140px] lg:w-[160px] h-8 lg:h-9">
            <Image src="/logo.png" alt="Frontier Atlas" fill className="object-contain object-left" sizes="(max-width: 1024px) 140px, 160px" />
          </Link>
        </div>

        {/* Center — Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 items-center justify-center max-w-[400px]">
          <SearchBar variant="compact" placeholder="Search..." initialQuery="" />
        </div>

        {/* Center — Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/tasks"
            className={cn(
              "text-[13px] font-medium transition-colors no-underline",
              isTasksActive
                ? "text-[#F55036] font-bold"
                : "text-[#555555] hover:text-[#F55036]"
            )}
          >
            Tasks
          </Link>
          <Link
            href="/methods"
            className={cn(
              "text-[13px] font-medium transition-colors no-underline",
              isMethodsActive
                ? "text-[#F55036] font-bold"
                : "text-[#555555] hover:text-[#F55036]"
            )}
          >
            Methods
          </Link>
          <Link
            href="/models"
            className={cn(
              "text-[13px] font-medium transition-colors no-underline",
              isModelsActive
                ? "text-[#F55036] font-bold"
                : "text-[#555555] hover:text-[#F55036]"
            )}
          >
            Models
          </Link>
          <Link
            href="/datasets"
            className={cn(
              "text-[13px] font-medium transition-colors no-underline",
              isDatasetsActive
                ? "text-[#F55036] font-bold"
                : "text-[#555555] hover:text-[#F55036]"
            )}
          >
            Datasets
          </Link>
          <Link
            href="/authors"
            className={cn(
              "text-[13px] font-medium transition-colors no-underline",
              isAuthorsActive
                ? "text-[#F55036] font-bold"
                : "text-[#555555] hover:text-[#F55036]"
            )}
          >
            Authors
          </Link>
        </div>

        {/* Right (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-bold px-4 py-1.5 rounded-md transition-colors cursor-pointer border-none tracking-wide uppercase">
            Submit
          </button>
          <div className="w-8 h-8 rounded-full bg-[#EBEBE6] flex items-center justify-center cursor-pointer hover:bg-[#DCDCD7] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Mobile Right (Search + CTA) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <Link href="/search" className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
          <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-bold px-4 py-2 rounded-md transition-colors cursor-pointer border-none tracking-wide uppercase min-h-[40px]">
            Submit
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-[80vw] max-w-[300px] bg-[#F8F7F2] z-[70] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="h-[52px] border-b border-[#E5E5E0] flex items-center justify-between px-4 shrink-0">
          <div className="relative w-[120px] h-6">
            <Image src="/logo.png" alt="Frontier Atlas" fill className="object-contain object-left" sizes="120px" />
          </div>
          <button 
             onClick={closeMenu}
             aria-label="Close menu"
             className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors -mr-2"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
             </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <Sidebar onItemClick={closeMenu} />
        </div>
      </div>
    </>
  );
}
