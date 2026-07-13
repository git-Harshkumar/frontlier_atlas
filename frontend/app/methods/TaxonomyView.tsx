"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { CategoryRow } from "@/components/CategoryRow";
import { CategoryPillBar } from "@/components/CategoryPillBar";
import { MethodsHero } from "@/components/MethodsHero";
import { fetchApi } from "@/lib/api";

export function TaxonomyView({ initialTaxonomy }: { initialTaxonomy: any[] }) {
  const [taxonomy, setTaxonomy] = useState(initialTaxonomy);

  useEffect(() => {
    let cancelled = false;
    async function loadCounts() {
      try {
        const json = await fetchApi<any>("/api/v1/methods/taxonomy");
        if (cancelled || !json.data) return;
        
        const counts: Record<string, number> = {};
        json.data.forEach((cat: any) => {
          if (cat.methods) {
            cat.methods.forEach((m: any) => {
              counts[m.slug || m.id] = m.paperCount || 0;
            });
          }
        });

        setTaxonomy(prev => prev.map(cat => ({
          ...cat,
          methods: cat.methods.map((m: any) => ({
            ...m,
            paperCount: counts[m.slug || m.id] || m.paperCount
          }))
        })));
      } catch (err) {
        console.error("Failed to load live paper counts:", err);
      }
    }
    loadCounts();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <MethodsHero taxonomy={taxonomy} />
      <CategoryPillBar categories={taxonomy} />
      <main className="flex flex-col mt-4 gap-4">
        <h2 className="sr-only">Browse Methods by Category</h2>
        {taxonomy.length > 0 ? taxonomy.map((category: any) => (
          <CategoryRow key={category.id} category={category} />
        )) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in bg-white rounded-3xl border border-[#E5E5E0]">
            <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">No methods found</h3>
          </div>
        )}
      </main>
    </>
  );
}
