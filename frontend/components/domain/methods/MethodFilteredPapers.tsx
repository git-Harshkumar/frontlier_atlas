"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Clock, Star } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Task {
  id?: string;
  name: string;
}

interface Paper {
  id: string;
  title: string;
  slug?: string;
  authors?: { name: string }[];
  abstract?: string;
  publicationDate?: string;
  conference?: string;
  githubStars?: number;
  githubForks?: number;
  citationCount?: number;
  thumbnailUrl?: string;
  arxivId?: string;
  tasks?: Task[];
}

interface Props {
  papers: Paper[];
  methodName: string;
}

// ─── Filter chip definitions ──────────────────────────────────────────────────
// Filters search the paper's title + abstract for these keywords.
// tasks[] is not returned per-paper by the API, so we use text matching.
const FILTER_CHIPS: { label: string; key: string; keywords: string[] }[] = [
  { label: "All",          key: "all",          keywords: [] },
  { label: "Architecture", key: "architecture", keywords: ["architecture", "transformer", "encoder", "decoder", "network", "layer"] },
  { label: "Optimization", key: "optimization", keywords: ["optim", "gradient", "adam", "sgd", "learning rate", "scheduler", "loss"] },
  { label: "Training",     key: "training",     keywords: ["train", "fine-tun", "pre-train", "finetun", "lora", "rlhf", "peft"] },
  { label: "Attention",    key: "attention",    keywords: ["attention", "self-attention", "multi-head", "cross-attention"] },
  { label: "Generation",   key: "generation",   keywords: ["generat", "language model", "llm", "gpt", "autoregressive", "diffusion"] },
  { label: "Evaluation",   key: "evaluation",   keywords: ["benchmark", "evaluat", "metric", "dataset", "performance"] },
];

type SortKey = "popular" | "recent" | "citations";

const SORT_OPTIONS: { label: string; key: SortKey; Icon: React.ComponentType<any> }[] = [
  { label: "Popular",   key: "popular",   Icon: TrendingUp },
  { label: "Recent",    key: "recent",    Icon: Clock },
  { label: "Citations", key: "citations", Icon: Star },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function matchesFilter(paper: Paper, key: string, keywords: string[]): boolean {
  if (key === "all") return true;
  const haystack = `${paper.title ?? ""} ${paper.abstract ?? ""}`.toLowerCase();
  const taskNames = paper.tasks?.map((t) => (t.name ?? '').toLowerCase()).join(" ") ?? "";
  const combined = `${haystack} ${taskNames}`;
  return keywords.some((kw) => combined.includes(kw.toLowerCase()));
}

function sortPapers(papers: Paper[], sort: SortKey): Paper[] {
  const copy = [...papers];
  if (sort === "recent") {
    return copy.sort(
      (a, b) =>
        new Date(b.publicationDate ?? 0).getTime() -
        new Date(a.publicationDate ?? 0).getTime()
    );
  }
  if (sort === "citations") {
    return copy.sort(
      (a, b) =>
        (b.citationCount ?? b.githubStars ?? 0) -
        (a.citationCount ?? a.githubStars ?? 0)
    );
  }
  return copy.sort((a, b) => (b.githubStars ?? 0) - (a.githubStars ?? 0));
}

// ─── Thumbnail placeholder — deterministic color from paper title ─────────────
const PLACEHOLDER_COLORS = [
  ["#fff5f2", "#ff4d20"],
  ["#eff6ff", "#2563eb"],
  ["#f0fdf4", "#16a34a"],
  ["#faf5ff", "#7c3aed"],
  ["#fff7ed", "#ea580c"],
  ["#ecfeff", "#0891b2"],
  ["#fdf4ff", "#a21caf"],
];

function PaperThumbnail({ paper }: { paper: Paper }) {
  // Try arxiv thumbnail first
  const arxivThumb = paper.arxivId
    ? `https://arxiv.org/html/${paper.arxivId}/thumbnail.png`
    : null;

  const [imgFailed, setImgFailed] = useState(false);

  // Deterministic color pick from first char of title
  const colorIdx = (paper.title?.charCodeAt(0) ?? 0) % PLACEHOLDER_COLORS.length;
  const [bg, fg] = PLACEHOLDER_COLORS[colorIdx];

  // Initials from title words
  const initials = (paper.title ?? "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  // Determine the year
  const year = paper.publicationDate
    ? new Date(paper.publicationDate).getFullYear()
    : "";

  if ((paper.thumbnailUrl || arxivThumb) && !imgFailed) {
    return (
      <Image
        src={paper.thumbnailUrl ?? arxivThumb!}
        alt={paper.title}
        width={96}
        height={128}
        className="w-full h-full object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  // Beautiful generated placeholder
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-1 select-none"
      style={{ background: bg }}
    >
      {/* Decorative lines simulating a paper */}
      <div className="w-full px-2 space-y-1 mb-1">
        <div className="h-1 rounded-full opacity-30" style={{ background: fg, width: "85%" }} />
        <div className="h-1 rounded-full opacity-20" style={{ background: fg, width: "70%" }} />
        <div className="h-1 rounded-full opacity-20" style={{ background: fg, width: "60%" }} />
      </div>
      {/* Initials badge */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-sm"
        style={{ background: fg, color: "#fff" }}
      >
        {initials || "?"}
      </div>
      {year && (
        <span className="text-[9px] font-bold mt-1" style={{ color: fg, opacity: 0.7 }}>
          {year}
        </span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MethodFilteredPapers({ papers, methodName }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("popular");

  // Count how many papers match each filter chip
  const chipCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const chip of FILTER_CHIPS) {
      counts[chip.key] = papers.filter((p) =>
        matchesFilter(p, chip.key, chip.keywords)
      ).length;
    }
    return counts;
  }, [papers]);

  // Apply active filter then sort
  const displayedPapers = useMemo(() => {
    const activeChip = FILTER_CHIPS.find((c) => c.key === activeFilter)!;
    const filtered = papers.filter((p) =>
      matchesFilter(p, activeFilter, activeChip.keywords)
    );
    return sortPapers(filtered, sortBy);
  }, [papers, activeFilter, sortBy]);

  return (
    <>
      {/* ── Filter Bar ─────────────────────────────────────────────────── */}
      <section className="mb-6 lg:mb-8 bg-white border border-gray-100 lg:rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] -mx-5 px-5 lg:mx-0 lg:px-5 py-4">

        {/* Row 1: Label + Chips (wrap on mobile) */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 mr-1">
            Filter
          </span>
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeFilter === chip.key;
            const count = chipCounts[chip.key] ?? 0;
            return (
              <button
                key={chip.key}
                onClick={() => setActiveFilter(chip.key)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150
                  ${
                    isActive
                      ? "bg-[#ff4d20] text-white border-[#ff4d20] shadow-sm"
                      : "border-gray-200 text-gray-600 bg-white hover:border-orange-300 hover:text-orange-600"
                  }`}
              >
                {chip.label}
                {chip.key !== "all" && (
                  <span
                    className={`text-[10px] font-bold min-w-[16px] text-center ${
                      isActive ? "opacity-80" : "opacity-60"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 2: Sort toggle buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest shrink-0 mr-1">
            Sort
          </span>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {SORT_OPTIONS.map(({ label, key, Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150
                  ${
                    sortBy === key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-gray-500 hover:text-slate-700"
                  }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400 font-medium shrink-0">
            {displayedPapers.length} paper{displayedPapers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── Paper List ─────────────────────────────────────────────────── */}
      <div className="space-y-4 pb-20">
        {displayedPapers.length > 0 ? (
          displayedPapers.map((paper) => {
            // ── Fix 404: route is /papers/[slug], use slug, fallback to id ──
            const paperHref = `/papers/${paper.slug ?? paper.id}`;
            const authors =
              (paper.authors?.map((a) => a.name).slice(0, 3).join(", ") ?? "") +
              ((paper.authors?.length ?? 0) > 3 ? " et al." : "");
            const year = paper.publicationDate
              ? new Date(paper.publicationDate).getFullYear()
              : "";

            return (
              <Link key={paper.id} href={paperHref} className="group block">
                <article className="bg-white border border-gray-100 rounded-2xl p-4 lg:p-6 flex gap-4 lg:gap-6 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer relative">

                  {/* Thumbnail */}
                  <div className="w-16 h-24 lg:w-24 lg:h-32 flex-none overflow-hidden rounded-lg border border-gray-100 bg-gray-50 shrink-0">
                    <PaperThumbnail paper={paper} />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <h2 className="text-sm lg:text-lg font-bold text-slate-800 leading-snug mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {paper.title}
                    </h2>
                    <p className="text-xs text-gray-400 mb-2 lg:mb-3">
                      {authors || "Unknown Authors"}
                      {(paper.conference || year) && (
                        <span className="ml-1">
                          • {paper.conference} {year}
                        </span>
                      )}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed hidden sm:block">
                      {paper.abstract || "No abstract available."}
                    </p>

                    {/* Tag pills */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full uppercase">
                        {methodName}
                      </span>
                      {paper.tasks?.slice(0, 2).map((t, idx) => (
                        <span
                          key={t.id ?? idx}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            idx % 2 === 0
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {t.name ?? ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats — desktop sidebar */}
                  <div className="hidden lg:flex flex-col justify-center items-start gap-4 shrink-0 w-36 pl-6 border-l border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <div>
                        <div className="text-sm font-bold text-slate-700">
                          {(paper.citationCount ?? paper.githubStars ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400">Citations</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                      <div>
                        <div className="text-sm font-bold text-slate-700">
                          {(paper.githubForks ?? 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400">Using method</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats — mobile inline below content */}
                  <div className="absolute bottom-3 right-4 flex items-center gap-3 lg:hidden">
                    <span className="text-[10px] text-gray-400 font-medium">
                      ★ {(paper.citationCount ?? paper.githubStars ?? 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex items-center shrink-0 pl-2">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>

                </article>
              </Link>
            );
          })
        ) : (
          /* Empty state */
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-base font-bold text-slate-700 mb-2">No papers found</h3>
            <p className="text-sm text-gray-400 mb-6">
              No papers match the{" "}
              <span className="font-semibold text-orange-600">
                {FILTER_CHIPS.find((c) => c.key === activeFilter)?.label}
              </span>{" "}
              filter.
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className="px-5 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-sm font-semibold hover:bg-orange-100 transition-colors"
            >
              Clear filter — show all papers
            </button>
          </div>
        )}
      </div>
    </>
  );
}
