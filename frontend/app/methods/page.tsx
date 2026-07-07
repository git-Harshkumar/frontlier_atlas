export const runtime = "edge"; 
import * as React from "react";
import Link from "next/link";
import { MethodsHero } from "@/components/MethodsHero";
import { CategoryRow } from "@/components/CategoryRow";
import Navbar from "@/components/Navbar";
import { atlasUiFont } from "@/lib/fonts";
import { fetchApi } from "@/lib/api";

async function getTaxonomy() {
  try {
    const json = await fetchApi<any>("/api/v1/methods/taxonomy", { cache: "no-store" });
    return json.data || [];
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Failed to fetch taxonomy:", error);
    return [];
  }
}

export default async function MethodsPage() {
  const taxonomy = await getTaxonomy();

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
            {taxonomy.length > 0 ? taxonomy.map((category: any) => (
              <CategoryRow key={category.id} category={category} />
            )) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
                <div className="w-20 h-20 bg-[#F8F7F2] rounded-full flex items-center justify-center mb-6 border border-[#E5E5E0] shadow-sm">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B8B8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">No methods found</h3>
                <p className="text-[14px] text-[#666666] max-w-[300px] leading-relaxed">
                  We couldn't find any methods matching your criteria. Please adjust your filters and try again.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
