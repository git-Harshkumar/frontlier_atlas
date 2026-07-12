"use client";
export const runtime = "edge";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import ModelDetailComponent from "@/components/ModelDetail";
import PaperFeed from "@/components/PaperFeed";
import ModelSearchInput from "@/components/ModelSearchInput";
import Navbar from "@/components/Navbar";
import { getModelBySlug, type ModelDetail } from "@/lib/models";

const SORT_OPTIONS = [
  { key: "trending", label: "Trending" },
  { key: "latest", label: "Latest" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];
type PaperTaskChip = ModelDetail["tasks"][number] | { id: "all"; name: "All Papers"; slug: "all"; color: null };

function SkeletonSection() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="ds-card-hero p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-[#E5E5E0] rounded w-1/2" />
            <div className="h-5 bg-[#E5E5E0] rounded w-20" />
            <div className="h-4 bg-[#E5E5E0] rounded w-32" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-[#E5E5E0] rounded-full w-20" />
            <div className="h-9 bg-[#E5E5E0] rounded-full w-24" />
          </div>
        </div>
      </div>

      <div className="h-10 bg-[#E5E5E0] rounded-2xl w-full max-w-[520px]" />
      <div className="h-24 bg-[#E5E5E0] rounded-2xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[220px] bg-white border border-[#E5E5E0] rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}

export default function ModelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [model, setModel] = useState<ModelDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("trending");
  const [sortOpen, setSortOpen] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!sortMenuRef.current) return;
      if (!sortMenuRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const fetchModel = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const modelData = await getModelBySlug(slug);
      setModel(modelData);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("404")) {
        setError("Model not found");
      } else {
        setError("Failed to load model. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
        <style>{`body { overflow: hidden !important; }`}</style>
        <Navbar />
        <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8 pb-14">
            <SkeletonSection />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
        <style>{`body { overflow: hidden !important; }`}</style>
        <Navbar />
        <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8">
            <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
              <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">Home</Link>
              <span>/</span>
              <Link href="/models" className="hover:text-[#F55036] transition-colors no-underline">Models</Link>
              <span>/</span>
              <span className="text-[#555555] font-medium">{slug}</span>
            </nav>

            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertCircle size={32} className="text-[#FF5A1F]" />
              <p className="text-[14px] text-[#FF5A1F]">{error}</p>
              <button onClick={fetchModel} className="ds-button text-[12px]">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredTaskChips: PaperTaskChip[] = model
    ? [{ id: "all", name: "All Papers", slug: "all", color: null }, ...model.tasks]
    : [{ id: "all", name: "All Papers", slug: "all", color: null }];

  if (!model) return null;

  const selectedSortLabel = SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? "Sort";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <style>{`body { overflow: hidden !important; }`}</style>
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8 pb-14">
          <ModelDetailComponent model={model}>
          <section className="border-t border-[#EAE6DE] pt-6 mb-5">
            <div className="text-[11px] uppercase tracking-[0.36em] text-[#B0ABA0] mb-4">Tasks</div>
            <div className="flex flex-wrap items-center gap-2">
              {filteredTaskChips.map((chip) => {
                const active = activeTask === chip.slug;
                return (
                  <button
                    key={chip.slug}
                    onClick={() => setActiveTask(active ? "all" : chip.slug)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                        : "bg-white text-[#555555] border-[#E5E5E0] hover:border-[#FF5A1F] hover:text-[#F55036]"
                    }`}
                  >
                    <span>{chip.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
            <div className="w-full lg:max-w-[460px]">
              <ModelSearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search papers..."
              />
            </div>

            <div className="flex items-center gap-3 lg:ml-auto">
              <div ref={sortMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((value) => !value)}
                  className="ds-button-ghost text-[12px] px-4 py-2.5 min-w-[176px] justify-between gap-3"
                  aria-expanded={sortOpen}
                  aria-haspopup="menu"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowUpDown size={14} className="text-[#8B8B8B]" />
                    {selectedSortLabel}
                  </span>
                  <ChevronDown size={14} className={`text-[#8B8B8B] transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-full min-w-[200px] overflow-hidden rounded-2xl border border-[#E5E5E0] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                    {SORT_OPTIONS.map((option) => {
                      const active = sortBy === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => {
                            setSortBy(option.key);
                            setSortOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-[13px] transition-colors ${
                            active ? "bg-[#FFF4EE] text-[#F55036]" : "text-[#555555] hover:bg-[#F8F7F2]"
                          }`}
                        >
                          <span>{option.label}</span>
                          {active && <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Active</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="hidden xl:flex items-center gap-2 text-[12px] text-[#8B8B8B]">
                <ArrowUpDown size={14} />
                Sorted by {selectedSortLabel}
              </div>
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-[22px] md:text-[24px] font-bold tracking-tight mb-1">All Papers</h2>
                <p className="text-[14px] text-[#555555]">
                  Browse all papers for this model and filter using the topics above.
                </p>
              </div>
            </div>

            <PaperFeed
              filterParams={{
                model: model.slug,
                task: activeTask === "all" ? undefined : activeTask,
                sort: sortBy,
              }}
              searchQuery={search}
            />
          </section>
        </ModelDetailComponent>
        </div>
      </div>
    </div>
  );
}
