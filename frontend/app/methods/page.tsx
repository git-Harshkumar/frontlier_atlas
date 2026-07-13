export const runtime = "edge";
import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MethodsHero } from "@/components/MethodsHero";
import Navbar from "@/components/Navbar";
import { atlasUiFont } from "@/lib/fonts";

const TaxonomyList = dynamic(() => import("./TaxonomyList"), {
  loading: () => (
    <div className="flex flex-col gap-6 py-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-b border-[#E5E5E0] last:border-0 animate-pulse">
          <div className="flex items-center gap-3 md:w-44 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="h-8 bg-gray-100 rounded-full w-20" />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
});

export default function MethodsPage() {
  return (
    <div className={`${atlasUiFont.className} flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <style>{`body { overflow: hidden !important; }`}</style>
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
            <h2 className="sr-only">Browse Methods by Category</h2>
            <TaxonomyList />
          </main>
        </div>
      </div>
    </div>
  );
}
