"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { CategoryRow } from "@/components/CategoryRow";
import { MethodsHero } from "@/components/MethodsHero";
import { fetchApi } from "@/lib/api";

export function TaxonomyView({ initialTaxonomy }: { initialTaxonomy: any[] }) {
  const [taxonomy, setTaxonomy] = useState(initialTaxonomy);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadCounts() {
      try {
        const json = await fetchApi<any>("/api/v1/methods/taxonomy");
        if (cancelled || !json.data) return;

        const liveData: Record<string, { paperCount: number; description?: string }> = {};
        json.data.forEach((cat: any) => {
          if (cat.methods) {
            cat.methods.forEach((m: any) => {
              liveData[m.slug || m.id] = {
                paperCount: m.paperCount || 0,
                description: m.description,
              };
            });
          }
        });
        setTaxonomy(prev => prev.map(cat => ({
          ...cat,
          methods: cat.methods.map((m: any) => {
            const live = liveData[m.slug || m.id];
            return {
              ...m,
              paperCount: live?.paperCount ?? m.paperCount,
              description: live?.description ?? m.description
            };
          })
        })));
      } catch (err) {
        console.error("Failed to load live paper counts:", err);
      }
    }
    loadCounts();
    return () => { cancelled = true; };
  }, []);

  const filteredTaxonomy = taxonomy
  .map((category: any) => ({
    ...category,
    methods: category.methods.filter((method: any) =>
      method.name.toLowerCase().includes(search.toLowerCase())
    ),
  }))
  .filter((category: any) => category.methods.length > 0);
  return (
  <>
    <MethodsHero taxonomy={taxonomy} />

    <main className="grid grid-cols-[220px_minmax(0,1fr)] gap-8 mt-10">
      <aside className="w-[240px] shrink-0 sticky top-24 h-fit border-r border-[#ececec] pr-6">
  <h3 className="text-[#F55036] font-bold uppercase text-lg mb-4">
  Methods
</h3>


<div className="space-y-3">
  {filteredTaxonomy.map((category: any) => (
    <a
  key={category.id}
  href={`#${category.id}`}
  className="block text-[15px] text-[#555] hover:text-[#F55036] transition-colors"
>
  {category.name}
</a>
  ))}
</div>
</aside>

      <div>
        {filteredTaxonomy.length > 0 ? (
  filteredTaxonomy.map((category: any) => (
            <CategoryRow
              key={category.id}
              category={category}
            />
          ))
        ) : (
          <div className="ds-card flex flex-col items-center justify-center py-24 px-4 text-center">
            <h3 className="text-[16px] font-bold text-[#111111]">
              No methods found
            </h3>
          </div>
        )}
      </div>
    </main>
  </>
);
}
