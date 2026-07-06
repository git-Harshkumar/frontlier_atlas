import * as React from "react";
import Link from "next/link";
import { MethodsHero } from "@/components/MethodsHero";
import Navbar from "@/components/Navbar";
import { atlasUiFont } from "@/lib/fonts";

export default function Loading() {
  return (
    <div className={`${atlasUiFont.className} flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 py-8 pb-20">
          
          <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
            <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#555555] font-medium">Methods</span>
          </nav>

          <MethodsHero />
          
          <main className="flex flex-col mt-4 bg-white rounded-3xl border border-[#E5E5E0] shadow-soft p-6 md:p-10">
            <h2 className="sr-only">Loading Methods...</h2>
            {/* Skeleton Rows */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-b border-[#E5E5E0] last:border-0 -mx-4 px-4 rounded-xl animate-pulse">
                {/* Left Column: Icon and Title Skeleton */}
                <div className="flex items-center gap-3 md:w-48 shrink-0 md:pt-1.5">
                  <div className="w-[20px] h-[20px] rounded-full bg-[#E5E5E0]"></div>
                  <div className="h-[20px] w-[80px] bg-[#E5E5E0] rounded"></div>
                </div>
                
                {/* Right Column: Methods Pills Skeleton */}
                <ul className="flex flex-wrap gap-2.5 flex-1 m-0 p-0">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <li key={j} className="shrink-0">
                      <div className="h-[32px] w-[80px] rounded-full bg-[#F8F7F2] border border-[#E5E5E0]"></div>
                    </li>
                  ))}
                  {/* Random width pill */}
                  <li className="shrink-0">
                    <div className="h-[32px] w-[120px] rounded-full bg-[#F8F7F2] border border-[#E5E5E0]"></div>
                  </li>
                </ul>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
