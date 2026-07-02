"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getPapers, type GetPapersResult, type Paper } from "@/lib/paperApi";
import Image from "next/image";

/* ─── Tag color map ──────────────────────────────────────────────────────── */
const TAG_COLORS: Record<string, { bg: string; text: string; dot: string; border?: string }> = {
  purple: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]", dot: "bg-[#9333EA]", border: "border border-[#D8B4FE]" },
  blue: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", dot: "bg-[#0284C7]", border: "border border-[#BAE6FD]" },
  green: { bg: "bg-[#ECFDF5]", text: "text-[#047857]", dot: "bg-[#10B981]", border: "border border-[#A7F3D0]" },
  cyan: { bg: "bg-[#CFFAFE]", text: "text-[#0E7490]", dot: "bg-[#06B6D4]", border: "border border-[#CFFAFE]" },
  gray: { bg: "bg-white", text: "text-[#111111]", dot: "", border: "border border-[#E5E5E0]" },
};

const getTagColor = (label: string): string => {
  const map: Record<string, string> = {
    "Reinforcement Learning": "blue",
    "Image Understanding": "blue",
    Agents: "green",
    "Long Context": "purple",
  };
  return map[label] || "gray";
};


/* ─── Pill tag ───────────────────────────────────────────────────────────── */
const Pill = memo(({ label, colorKey }: { label: string; colorKey: string }) => {
  const c = TAG_COLORS[colorKey] || TAG_COLORS.gray;
  const isGray = colorKey === "gray";

  return (
    <span
      className={`h-[28px] xl:h-[24px] inline-flex items-center px-3 xl:px-2 rounded-[4px] text-[11px] font-mono cursor-pointer hover:opacity-80 transition-opacity ${c.bg} ${c.text} ${c.border || ""} whitespace-nowrap`}
    >
      {!isGray && (
        <span className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 ${c.dot}`} />
      )}
      {label}
    </span>
  );
});
Pill.displayName = "Pill";


/* ─── SOTA Display ───────────────────────────────────────────────────────── */
const SotaDisplay = memo(({ sota }: { sota: string }) => {
  if (!sota) return null;
  const segments = sota.split(" • ");

  return (
    <div className="mb-[12px] text-[11.5px] tracking-tight flex flex-nowrap items-center gap-x-2 gap-y-1 overflow-hidden whitespace-nowrap w-full">
      {segments.map((segment, idx) => {
        const isSota = segment.startsWith("SOTA on ");
        const isOn = segment.includes(" on ");

        let prefix = "";
        let benchmarks = segment;

        if (isSota) {
          benchmarks = segment.replace("SOTA on ", "");
        } else if (isOn) {
          const parts = segment.split(" on ");
          prefix = parts[0];
          benchmarks = parts[1];
        }

        return (
          <span key={idx} className="inline-flex items-center">
            {idx > 0 && <span className="text-[#9CA3AF] mx-1.5 font-normal">•</span>}

            {isSota ? (
              <>
                <span className="text-[#B48C52] font-semibold mr-1 tracking-wide">SOTA</span>
                <span className="mr-1 text-[10px]">🏆</span>
                <span className="text-[#8B8B8B] mr-1 font-normal">on</span>
                <span className="text-[#1E40AF] font-mono text-[11.5px] tracking-tighter">{benchmarks}</span>
              </>
            ) : isOn ? (
              <>
                <span className="text-[#8B8B8B] font-normal mr-1">{prefix}</span>
                <span className="text-[#8B8B8B] mr-1 font-normal">on</span>
                <span className="text-[#1E40AF] font-mono text-[11.5px] tracking-tighter">{benchmarks}</span>
              </>
            ) : (
              <span className="text-[#8B8B8B] font-normal tracking-tight">{segment}</span>
            )}
          </span>
        );
      })}
    </div>
  );
});
SotaDisplay.displayName = "SotaDisplay";

/* ─── Thumbnail ──────────────────────────────────────────────────────────── */
const PaperThumbnail = memo(({ title, thumbnail }: { title: string; thumbnail: string }) => {
  return (
    <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 border border-[#E5E5E0] rounded-md xl:rounded-none bg-[#F8F7F2] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.07)] relative flex items-center justify-center">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title || "Paper thumbnail"}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1280px) 100vw, 170px"
        />
      ) : (
        <div className="text-[#8B8B8B] text-[10px] font-mono px-4 text-center">No Cover</div>
      )}
    </div>
  );
});
PaperThumbnail.displayName = "PaperThumbnail";

/* ─── Metric block ───────────────────────────────────────────────────────── */
const Metric = memo(({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        {children}
        <span className="text-[14.5px] font-bold text-[#111111] leading-none tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[8px] font-bold text-[#8B8B8B] uppercase tracking-[0.08em] leading-none">
        {label}
      </span>
    </div>
  );
});
Metric.displayName = "Metric";

/* ─── Paper Card ─────────────────────────────────────────────────────────── */
const PaperCard = memo(({ paper }: { paper: Paper }) => {
  // Parse upvotes string to float for stars/hr, e.g. "11.2K" -> "11.2"
  const upvotesNum = parseFloat(paper.upvotes) || 0;

  return (
    <Link href={`/papers/${paper.slug}`} className="no-underline">
      <div className="group flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent min-w-0 cursor-pointer hover:shadow-md xl:hover:bg-white xl:hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 rounded-xl xl:rounded-none h-full">
        {/* LEFT — PDF thumbnail */}
        <div className="flex flex-col justify-center shrink-0 w-full xl:w-auto">
          <PaperThumbnail title={paper.title} thumbnail={paper.thumbnail} />
        </div>

        {/* RIGHT — Content */}
        <div className="flex-1 min-w-0 flex flex-col xl:pr-8">
          {/* Title */}
          <h3 className="text-[18px] xl:text-[20px] font-serif font-medium text-[#2D2D2D] leading-[1.3] mb-2 group-hover:text-[#F55036] transition-colors line-clamp-3 xl:line-clamp-2">
            {paper.title}
          </h3>

          {/* Authors + date */}
          <p className="text-[13px] font-normal text-[#555555] mb-3 truncate">
            {paper.authors}
            <span className="mx-2 text-[#DCDCD7]">·</span>
            {paper.date}
          </p>

          {/* Description */}
          <p className="text-[14px] font-normal text-[#555555] leading-[1.6] mb-4 line-clamp-3">
            {paper.description}
          </p>

          {/* Benchmark / SOTA (Row 1) */}
          <div className="w-full overflow-hidden">
            <SotaDisplay sota={paper.sota} />
          </div>

          {/* Tasks (Row 2) */}
          <div className="flex flex-nowrap items-center gap-2 mb-2 w-full overflow-hidden">
            {paper.tags?.map((t) => {
              const colorKey = getTagColor(t);
              return <Pill key={t} label={t} colorKey={colorKey} />;
            })}
          </div>

          {/* Methods (Row 3) */}
          <div className="flex flex-nowrap items-center gap-2 w-full overflow-hidden">
            {paper.additionalTags?.map((t) => {
              const colorKey = getTagColor(t);
              return <Pill key={t} label={t} colorKey={colorKey} />;
            })}
          </div>
        </div>

        {/* RIGHT — Metrics */}
        <div className="shrink-0 flex items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] mt-auto xl:mt-0 pt-4 xl:pt-0 w-full xl:w-auto">
          <div className="flex flex-row xl:flex-col justify-around xl:justify-around items-center w-full xl:w-[64px] xl:py-2 gap-2 xl:gap-0">
            <Metric value={`↑${upvotesNum}`} label="Stars / Hr">
              {/* Minimal optional icon if needed */}
            </Metric>

            <Metric value={paper.repo} label="Repo">
              <Github size={13} className="text-[#8B8B8B] shrink-0" />
            </Metric>

            <Metric value={(paper.citations || 0).toString()} label="Citations">
              <MessageCircle size={13} className="text-[#8B8B8B] shrink-0" />
            </Metric>
          </div>
        </div>
      </div>
    </Link>
  );
});
PaperCard.displayName = "PaperCard";

const PaperCardSkeleton = memo(() => {
  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent min-w-0 rounded-xl xl:rounded-none h-full animate-pulse">
      <div className="flex flex-col justify-center shrink-0 w-full xl:w-auto">
        <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 border border-[#E5E5E0] rounded-md xl:rounded-none bg-[#EFEDE6]" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col xl:pr-8">
        <div className="h-6 bg-[#EFEDE6] rounded mb-2 w-11/12" />
        <div className="h-6 bg-[#EFEDE6] rounded mb-3 w-7/12" />
        <div className="h-4 bg-[#EFEDE6] rounded mb-2 w-8/12" />
        <div className="h-4 bg-[#EFEDE6] rounded mb-2 w-full" />
        <div className="h-4 bg-[#EFEDE6] rounded mb-2 w-11/12" />
        <div className="h-4 bg-[#EFEDE6] rounded mb-4 w-9/12" />
        <div className="h-4 bg-[#EFEDE6] rounded mb-[12px] w-10/12" />
        <div className="flex gap-2 mb-2 overflow-hidden">
          <div className="h-[28px] xl:h-[24px] w-24 bg-[#EFEDE6] rounded-[4px]" />
          <div className="h-[28px] xl:h-[24px] w-32 bg-[#EFEDE6] rounded-[4px]" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          <div className="h-[28px] xl:h-[24px] w-28 bg-[#EFEDE6] rounded-[4px]" />
          <div className="h-[28px] xl:h-[24px] w-20 bg-[#EFEDE6] rounded-[4px]" />
        </div>
      </div>

      <div className="shrink-0 flex items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] mt-auto xl:mt-0 pt-4 xl:pt-0 w-full xl:w-auto">
        <div className="flex flex-row xl:flex-col justify-around xl:justify-around items-center w-full xl:w-[64px] xl:py-2 gap-2 xl:gap-0">
          <div className="h-8 w-12 bg-[#EFEDE6] rounded" />
          <div className="h-8 w-12 bg-[#EFEDE6] rounded" />
          <div className="h-8 w-12 bg-[#EFEDE6] rounded" />
        </div>
      </div>
    </div>
  );
});
PaperCardSkeleton.displayName = "PaperCardSkeleton";

const LoadingSkeletons = memo(() => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <PaperCardSkeleton key={index} />
      ))}
    </>
  );
});
LoadingSkeletons.displayName = "LoadingSkeletons";

/* ─── List ───────────────────────────────────────────────────────────────── */
export default function PaperList({
  selectedTag,
  initialPapers,
  initialError,
}: {
  selectedTag?: string;
  initialPapers: GetPapersResult | null;
  initialError?: string;
}) {
  const [papers, setPapers] = useState<Paper[]>(() => initialPapers?.papers ?? []);
  const [page, setPage] = useState(() => initialPapers?.page ?? 1);
  const [loadingPage, setLoadingPage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [hasMore, setHasMore] = useState(() => initialPapers?.hasMore ?? false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cacheRef = useRef<Map<string, GetPapersResult>>(new Map());
  const inFlightRef = useRef<Map<string, Promise<GetPapersResult>>>(new Map());
  const loadingPageRef = useRef<number | null>(null);

  const task = useMemo(() => {
    return selectedTag && selectedTag !== "All Topics"
      ? selectedTag.toLowerCase().replace(/\s+/g, "-")
      : undefined;
  }, [selectedTag]);

  const getCacheKey = useCallback((pageNumber: number) => {
    return `${task || "all"}:${pageNumber}`;
  }, [task]);

  const fetchPage = useCallback((pageNumber: number) => {
    const key = getCacheKey(pageNumber);
    const cached = cacheRef.current.get(key);
    if (cached) return Promise.resolve(cached);

    const inFlight = inFlightRef.current.get(key);
    if (inFlight) return inFlight;

    const request = getPapers({ page: pageNumber, task })
      .then((result) => {
        cacheRef.current.set(key, result);
        return result;
      })
      .finally(() => {
        inFlightRef.current.delete(key);
      });

    inFlightRef.current.set(key, request);
    return request;
  }, [getCacheKey, task]);

  const appendPapers = useCallback((newPapers: Paper[]) => {
    setPapers((prev) => {
      const existingSlugs = new Set(prev.map((paper) => paper.slug));
      const uniquePapers = newPapers.filter((paper) => !existingSlugs.has(paper.slug));
      return uniquePapers.length ? [...prev, ...uniquePapers] : prev;
    });
  }, []);

  const loadPage = useCallback(async (pageNumber: number, replace = false) => {
    if (loadingPageRef.current !== null) return;

    try {
      loadingPageRef.current = pageNumber;
      setLoadingPage(pageNumber);
      setError(null);
      const result = await fetchPage(pageNumber);
      setPage(result.page);
      setHasMore(result.hasMore);

      if (replace) {
        setPapers(result.papers);
      } else {
        appendPapers(result.papers);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load papers. Please try again later.");
    } finally {
      loadingPageRef.current = null;
      setLoadingPage(null);
    }
  }, [appendPapers, fetchPage]);

  const prefetchPage = useCallback((pageNumber: number) => {
    void fetchPage(pageNumber).catch((err) => {
      console.warn("Failed to prefetch papers:", err);
    });
  }, [fetchPage]);

  useEffect(() => {
    if (!task && initialPapers) {
      cacheRef.current.set(getCacheKey(initialPapers.page), initialPapers);
      setPapers(initialPapers.papers);
      setPage(initialPapers.page);
      setHasMore(initialPapers.hasMore);
      setError(initialError ?? null);
      if (initialPapers.hasMore) prefetchPage(initialPapers.page + 1);
      return;
    }

    setPapers([]);
    setPage(1);
    setHasMore(false);
    void loadPage(1, true);
  }, [getCacheKey, initialError, initialPapers, loadPage, prefetchPage, task]);

  useEffect(() => {
    if (!hasMore || loadingPage !== null || papers.length === 0) return;

    const scrollContainer = document.getElementById("scroll-container") as HTMLElement | null;
    const sentinel = sentinelRef.current;
    if (!scrollContainer || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadPage(page + 1);
        }
      },
      {
        root: scrollContainer,
        rootMargin: "900px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadPage, loadingPage, page, papers.length]);

  useEffect(() => {
    if (hasMore && loadingPage === null && papers.length > 0) {
      prefetchPage(page + 1);
    }
  }, [hasMore, loadingPage, page, papers.length, prefetchPage]);

  if (error && papers.length === 0) {
    return (
      <div className="pb-12 pt-8 flex justify-center items-center text-[#F55036]">
        <p className="text-[14px]">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-12 bg-transparent grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-col gap-6 xl:gap-0">
      {papers.map((paper) => (
        <PaperCard key={paper.slug} paper={paper} />
      ))}

      {papers.length === 0 && loadingPage !== null && <LoadingSkeletons />}

      {papers.length === 0 && loadingPage === null && !error && (
        <div className="pb-12 pt-8 flex justify-center items-center text-[#737373]">
          <p className="text-[14px]">No papers found.</p>
        </div>
      )}

      {papers.length > 0 && error && (
        <div className="py-6 flex justify-center items-center text-[#F55036]">
          <p className="text-[14px]">{error}</p>
        </div>
      )}

      {papers.length > 0 && loadingPage !== null && <LoadingSkeletons />}

      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {!hasMore && papers.length > 0 && (
        <div className="py-6 flex justify-center items-center text-[#737373]">
          <p className="text-[12px]">No more papers to load.</p>
        </div>
      )}
    </div>
  );
}
