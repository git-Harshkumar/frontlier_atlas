"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Inbox,
  Layers3,
} from "lucide-react";
import PaperFeed from "@/components/PaperFeed";
import ModelCard from "@/components/ModelCard";
import ModelSearchInput from "@/components/ModelSearchInput";
import Navbar from "@/components/Navbar";
import { getModels, type ModelItem } from "@/lib/models";
import { getTasks, type TaskItem } from "@/lib/tasks";

const LIMIT = 12;


type SortKey = "papers" | "name" | "newest" | "oldest";

type PaperTaskChip = TaskItem | { id: "all"; name: "All"; slug: "all"; color: null };

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "papers", label: "Most Papers" },
  { key: "name", label: "Name A-Z" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

function SkeletonCard() {
  return (
    <div className="ds-card p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 bg-[#E5E5E0] rounded w-2/3" />
        <div className="h-4 bg-[#E5E5E0] rounded w-16" />
      </div>
      <div className="h-4 bg-[#E5E5E0] rounded w-5/6" />
      <div className="h-4 bg-[#E5E5E0] rounded w-1/3" />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}



export default function ModelsPage() {
  const searchParams = useSearchParams();
  const modelSlug = searchParams.get("model") ?? undefined;

  const [allModels, setAllModels] = useState<ModelItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTask, setActiveTask] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("papers");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const sortMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, activeTask]);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [models, tasksData] = await Promise.all([
        getModels(),
        getTasks(),
      ]);
      const uniqueTasks = Array.from(new Map(tasksData.map(t => [t.slug, t])).values());
      setAllModels(models);
      setTasks(uniqueTasks);

    } catch (err) {
      console.error("Failed to fetch models:", err);
      setError("Failed to load models. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);



  const filteredModels = useMemo(() => {
    let result = allModels;

    if (activeTask !== "all") {
      result = result.filter((model) => model.tasks.some((task) => task.slug === activeTask));
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((model) => {
        const haystack = `${model.name} ${model.slug}`.toLowerCase();
        return haystack.includes(q);
      });
    }

    const sorted = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return b.paperCount - a.paperCount || a.name.localeCompare(b.name);
    });

    return sorted;
  }, [allModels, activeTask, debouncedSearch, sortBy]);

  const total = filteredModels.length;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const displayedModels = filteredModels.slice((page - 1) * LIMIT, page * LIMIT);

  const totalPaperLinks = useMemo(
    () => allModels.reduce((sum, model) => sum + model.paperCount, 0),
    [allModels],
  );

  const totalCitations = useMemo(
    () => allModels.reduce((sum, model) => sum + model.citationCount, 0),
    [allModels],
  );

  const totalStars = useMemo(
    () => allModels.reduce((sum, model) => sum + model.githubStars, 0),
    [allModels],
  );

  const selectedSortLabel = SORT_OPTIONS.find((option) => option.key === sortBy)?.label ?? "Sort";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <style>{`body { overflow: hidden !important; }`}</style>
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 pb-14">
          <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
          <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#555555] font-medium">Models</span>
        </nav>

        <section className="mb-8">
          <div className="inline-flex items-center gap-2 ds-chip text-[11px] mb-5">
            <Layers3 size={13} />
            FOUNDATION DIRECTORY
          </div>

          <h1 className="text-[34px] md:text-[40px] font-bold tracking-tight mb-3">
            Models
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#555555] leading-relaxed max-w-5xl mb-7">
            Explore state-of-the-art foundation models evaluated across verified academic benchmarks, reasoning tasks, and real-world agentic workflows.
          </p>

        <div className="flex flex-wrap items-center gap-6 text-[15px] md:text-[16px] text-[#555555] font-medium">
          <span><strong className="text-[#111111] font-semibold">{formatCompact(allModels.length)}</strong> Models</span>
          <span><strong className="text-[#111111] font-semibold">{formatCompact(totalPaperLinks)}</strong> Papers</span>
          <span><strong className="text-[#111111] font-semibold">{formatCompact(totalCitations)}</strong> Citations</span>
          <span><strong className="text-[#111111] font-semibold">{formatCompact(totalStars)}</strong> GitHub Stars</span>
        </div>
        </section>

        <section className="border-t border-[#EAE6DE] pt-6 mb-5">
          <div className="text-[11px] uppercase tracking-[0.36em] text-[#B0ABA0] mb-4">
            Tasks
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: "all", name: "All Papers", slug: "all", color: null },
              ...tasks,
            ] as PaperTaskChip[]).map((chip) => {
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

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="w-full lg:max-w-[460px]">
          <ModelSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search models..."
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
                <div className="absolute right-0 z-20 mt-2 w-full min-w-[216px] overflow-hidden rounded-2xl border border-[#E5E5E0] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
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
        </div>

        {loading && <SkeletonGrid />}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle size={32} className="text-[#FF5A1F]" />
            <p className="text-[14px] text-[#FF5A1F]">{error}</p>
            <button onClick={fetchModels} className="ds-button text-[12px]">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 className="text-[20px] md:text-[22px] font-bold tracking-tight">
                Top Evaluated Foundation Models
              </h2>
              <div className="text-[13px] text-[#8B8B8B] text-right">
                Showing all {formatCompact(total)} models
              </div>
            </div>

            {displayedModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Inbox size={32} className="text-[#8B8B8B]" />
                <p className="text-[14px] text-[#555555]">
                  {debouncedSearch
                    ? `No models match “${debouncedSearch}”`
                    : "No models found."}
                </p>
                {(debouncedSearch || activeTask !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setDebouncedSearch("");
                      setActiveTask("all");
                    }}
                    className="ds-button-ghost text-[12px]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedModels.map((model, index) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      rank={(page - 1) * LIMIT + index + 1}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                    <button
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                      disabled={page === 1}
                      className="ds-button-ghost text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((item) => {
                        if (totalPages <= 7) return true;
                        if (item === 1 || item === totalPages) return true;
                        if (Math.abs(item - page) <= 1) return true;
                        return false;
                      })
                      .map((item, index, items) => {
                        const showEllipsis = index > 0 && item - items[index - 1] > 1;
                        return (
                          <span key={item} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-1 text-[#8B8B8B] text-[13px]">...</span>
                            )}
                            <button
                              onClick={() => setPage(item)}
                              className={`w-8 h-8 rounded-full text-[12px] font-medium transition-colors ${
                                page === item
                                  ? "bg-[#FF5A1F] text-white"
                                  : "text-[#555555] hover:bg-[#EBEBE6]"
                              }`}
                            >
                              {item}
                            </button>
                          </span>
                        );
                      })}

                    <button
                      onClick={() => setPage((current) => current + 1)}
                      disabled={page >= totalPages}
                      className="ds-button-ghost text-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-[22px] md:text-[24px] font-bold tracking-tight mb-1">
                All Papers
              </h2>
              <p className="text-[14px] text-[#555555]">
                Browse all papers for the selected model and filter using the topics above.
              </p>
            </div>
          </div>

          <PaperFeed
            selectedTag={activeTask === "all" ? undefined : tasks.find((task) => task.slug === activeTask)?.name}
            filterParams={{ task: activeTask === "all" ? undefined : activeTask, model: modelSlug }}
          />
        </section>
      </div>
      </div>
    </div>
  );
}
