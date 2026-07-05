"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import { useScrollThreshold } from "@/lib/useScroll";

export default function Navbar({
  activeSort,
  onItemSelect,
}: {
  activeSort?: string;
  onItemSelect?: (item: string) => void;
} = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollThreshold(50);
  const pathname = usePathname();



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
  
  const shouldShowSearch = pathname !== "/" || isScrolled;

  return (
    <>
      <nav className="sticky top-0 h-[56px] xl:h-[52px] w-full bg-[#F8F7F2]/80 backdrop-blur-md border-b border-[#E5E5E0] flex items-center justify-between px-4 md:px-8 xl:px-12 gap-3 xl:gap-4 shrink-0 z-50 transition-all duration-300">
        {/* Mobile Left (Hamburger + Logo) */}
        <div className="flex items-center gap-1 xl:gap-0 xl:w-[240px] shrink-0">
          <button 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-[#EBEBE6] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
          <div className="flex items-center cursor-pointer relative w-[140px] xl:w-[160px] h-8 xl:h-9">
            <Image src="/logo.png" alt="Frontier Atlas" fill className="object-contain object-left" sizes="(max-width: 1280px) 140px, 160px" />
          </div>
        </div>

        {/* Center — Search (Desktop) */}
        <div className="hidden xl:flex flex-1 max-w-md focus-within:max-w-xl mx-8 relative items-center justify-center h-[40px] z-50">
          {shouldShowSearch && (
            <SearchBar variant="compact" placeholder="Search papers, methods..." layoutIdPrefix="global" />
          )}
        </div>

        {/* Right (Desktop) */}
        <div className="hidden xl:flex items-center gap-6 shrink-0">
          <ul role="list" className="flex items-center gap-6 text-[14px] font-medium text-[#111111] m-0 p-0 list-none">
            {[
              { label: "Explore",  href: "#" },
              { label: "Rankings", href: "#" },
              { label: "Tasks",    href: "#" },
              { label: "Methods",  href: "/methods" },
              { label: "About",    href: "#" },
            ].map(({ label, href }) => {
              const isActive = href !== "#" && pathname.startsWith(href);
              return (
                <li key={label} className="relative flex flex-col items-center gap-0.5">
                  <Link
                    href={href}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-[#F55036] font-semibold"
                        : "hover:text-[#F55036]"
                    }`}
                  >
                    {label}
                  </Link>
                  {isActive && (
                    <span className="absolute -bottom-[14px] w-1 h-1 rounded-full bg-[#F55036]" />
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-4 border-l border-[#E5E5E0] pl-4">
            <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-semibold px-4 py-1.5 rounded-md transition-all duration-200 cursor-pointer border-none tracking-wide uppercase hover:shadow-[0_0_0_3px_rgba(245,80,54,0.20)] hover:-translate-y-px active:scale-95">
              Submit
            </button>
            <div className="w-8 h-8 rounded-full bg-[#EBEBE6] flex items-center justify-center cursor-pointer hover:bg-[#DCDCD7] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Right (CTA) */}
        <div className="flex xl:hidden items-center shrink-0">
          <button className="bg-[#F55036] hover:bg-[#E0462D] text-white text-[12px] font-semibold px-4 py-2 rounded-md transition-all duration-200 cursor-pointer border-none tracking-wide uppercase min-h-[40px] hover:shadow-[0_0_0_3px_rgba(245,80,54,0.20)] active:scale-95">
            Submit
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] xl:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div 
        className={`fixed inset-y-0 left-0 w-[80vw] max-w-[300px] bg-[#F8F7F2]/90 backdrop-blur-xl z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out xl:hidden flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
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
          <Sidebar initialActive={activeSort} onItemSelect={onItemSelect} onItemClick={closeMenu} />
        </div>
      </div>
    </>
  );
}
