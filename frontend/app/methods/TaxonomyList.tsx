"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CategoryRow } from "@/components/CategoryRow";
import { fetchApi } from "@/lib/api";

function LoadingSkeleton() {
  return (
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
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-[#FFF0EE] rounded-full flex items-center justify-center mb-6 border border-[#FFD7D2] shadow-sm">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">Failed to load methods</h3>
      <p className="text-[14px] text-[#666666] max-w-[400px] leading-relaxed mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#111111] transition-all duration-300 ease-out hover:border-[#FF5A1F]/40 hover:bg-[#FFF7F3] hover:text-[#FF5A1F] shadow-sm hover:shadow-md active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
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
        We couldn&apos;t find any methods matching your criteria. Please adjust your filters and try again.
      </p>
    </div>
  );
}

export default function TaxonomyList() {
  const [taxonomy, setTaxonomy] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const json = await fetchApi<any>("/api/v1/methods/taxonomy", { cache: "no-store" });
        if (!cancelled) setTaxonomy(json.data || []);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load methods");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (taxonomy.length === 0) return <EmptyState />;
  return taxonomy.map((category: any) => (
    <CategoryRow key={category.id} category={category} />
  ));
}
