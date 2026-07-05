"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { Github, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getPapers, type GetPapersParams, type Paper } from "@/lib/paperApi";
import Image from "next/image";

/* ─── Tag color map ──────────────────────────────────────────────────────── */
const TAG_COLORS: Record<string, { bg: string; text: string; dot: string; border?: string }> = {
  purple: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]", dot: "bg-[#9333EA]", border: "border border-[#D8B4FE]" },
  blue: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", dot: "bg-[#0284C7]", border: "border border-[#BAE6FD]" },
  green: { bg: "bg-[#ECFDF5]", text: "text-[#047857]", dot: "bg-[#10B981]", border: "border border-[#A7F3D0]" },
  cyan: { bg: "bg-[#CFFAFE]", text: "text-[#0E7490]", dot: "bg-[#06B6D4]", border: "border border-[#CFFAFE]" },
  gray: { bg: "bg-white", text: "text-[#111111]", dot: "", border: "border border-[#E5E5E0]" },
};

const TAG_COLOR_MAP: Record<string, string> = {
  "Reinforcement Learning": "blue",
  "Image Understanding": "blue",
  Agents: "green",
  "Long Context": "purple",
  Robotics: "cyan",
  "World Models": "purple",
};

const COLOR_CYCLE = ["purple", "blue", "green", "cyan"] as const;

const getTagColor = (label: string): string => {
  if (TAG_COLOR_MAP[label]) return TAG_COLOR_MAP[label];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_CYCLE[Math.abs(hash) % COLOR_CYCLE.length];
};


/* ─── Skeleton shimmer ───────────────────────────────────────────────────── */
// Shows immediately while waiting for API, matching PaperCard dimensions exactly.
// Gives users instant visual feedback (FCP / perceived performance win).
const PaperCardSkeleton = memo(() => (
  <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent rounded-xl xl:rounded-none animate-pulse">
    {/* Thumbnail placeholder */}
    <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 rounded-md xl:rounded-none bg-[#EBEBEB]" />

    {/* Content placeholder */}
    <div className="flex-1 min-w-0 flex flex-col xl:pr-8">
      {/* Title */}
      <div className="h-5 bg-[#EBEBEB] rounded w-3/4 mb-2" />
      <div className="h-4 bg-[#EBEBEB] rounded w-1/2 mb-3" />
      {/* Description lines */}
      <div className="h-3.5 bg-[#EBEBEB] rounded w-full mb-1.5" />
      <div className="h-3.5 bg-[#EBEBEB] rounded w-full mb-1.5" />
      <div className="h-3.5 bg-[#EBEBEB] rounded w-2/3 mb-4" />
      {/* Tags */}
      <div className="flex gap-2 mb-2">
        <div className="h-7 bg-[#EBEBEB] rounded w-20" />
        <div className="h-7 bg-[#EBEBEB] rounded w-24" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-[#EBEBEB] rounded w-16" />
        <div className="h-7 bg-[#EBEBEB] rounded w-20" />
      </div>
    </div>

    {/* Metrics placeholder */}
    <div className="shrink-0 flex items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] mt-auto xl:mt-0 pt-4 xl:pt-0 w-full xl:w-auto">
      <div className="flex flex-row xl:flex-col justify-around xl:justify-around items-center w-full xl:w-[64px] xl:py-2 gap-2 xl:gap-0">
        <div className="h-8 w-12 bg-[#EBEBEB] rounded" />
        <div className="h-8 w-12 bg-[#EBEBEB] rounded" />
        <div className="h-8 w-12 bg-[#EBEBEB] rounded" />
      </div>
    </div>
  </div>
));
PaperCardSkeleton.displayName = "PaperCardSkeleton";

/* ─── Pill tag ───────────────────────────────────────────────────────────── */
const Pill = memo(({ label, colorKey }: { label: string; colorKey: string }) => {
  const c = TAG_COLORS[colorKey] || TAG_COLORS.gray;
  const isGray = colorKey === "gray";

  return (
    <span
      className={`h-[28px] xl:h-[24px] inline-flex items-center px-3 xl:px-2 rounded-[4px] text-[11px] cursor-pointer hover:opacity-80 transition-opacity ${c.bg} ${c.text} ${c.border || ""} whitespace-nowrap`}
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
                <span className="text-[#1E40AF] text-[11.5px] tracking-tighter">{benchmarks}</span>
              </>
            ) : isOn ? (
              <>
                <span className="text-[#8B8B8B] font-normal mr-1">{prefix}</span>
                <span className="text-[#8B8B8B] mr-1 font-normal">on</span>
                <span className="text-[#1E40AF] text-[11.5px] tracking-tighter">{benchmarks}</span>
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
// `priority` is true for the first few cards so Next.js injects a <link rel="preload">
// for those images in the document head — this is the single biggest LCP win.
const PaperThumbnail = memo(({ title, thumbnail, priority }: { title: string; thumbnail: string; priority?: boolean }) => {
  return (
    <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 border border-[#E5E5E0] rounded-md xl:rounded-none bg-[#F8F7F2] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.07)] relative flex items-center justify-center">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title || "Paper thumbnail"}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1280px) 100vw, 170px"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      ) : (
        <div className="text-[#8B8B8B] text-[10px] px-4 text-center">No Cover</div>
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
  onClick,
  interactive = false,
}: {
  value: string;
  label: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  interactive?: boolean;
}) => {
  const isInteractive = interactive || !!onClick;
  return (
    <div
      className={`flex flex-col items-center gap-1 group/metric ${isInteractive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();
          onClick(e);
        }
      }}
    >
      <div className="flex items-center gap-1.5">
        {children}
        <span className={`text-[14.5px] font-bold text-[#111111] leading-none tabular-nums ${isInteractive ? 'group-hover/metric:text-[#F55036] transition-colors' : ''}`}>
          {value}
        </span>
      </div>
      <span className={`text-[8px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em] leading-none ${isInteractive ? 'group-hover/metric:text-[#F55036] transition-colors' : ''}`}>
        {label}
      </span>
    </div>
  );
});
Metric.displayName = "Metric";

/* ─── Paper Card ─────────────────────────────────────────────────────────── */
// `index` is used to decide whether to preload the thumbnail image.
// Cards 0-2 (above the fold) get priority=true so Next.js adds a <link rel="preload">
// for those images in the <head>, dramatically improving LCP.
const PaperCard = memo(({ paper, index }: { paper: Paper; index: number }) => {
  const upvotesNum = parseFloat(paper.upvotes) || 0;
  const isPriority = index < 3;

  let displayAuthors = paper.authors;
  if (paper.authors) {
    const authorList = paper.authors.split(",").map(a => a.trim());
    if (authorList.length > 3) {
      displayAuthors = `${authorList.slice(0, 3).join(", ")} et al.`;
    }
  }

  return (
    <Link href={`/papers/${paper.slug}`} className="no-underline">
      <div className="group flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent min-w-0 cursor-pointer hover:shadow-md xl:hover:bg-white xl:hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-200 rounded-xl xl:rounded-none h-full">
        {/* LEFT — PDF thumbnail */}
        <div className="flex flex-col justify-center shrink-0 w-full xl:w-auto">
          <PaperThumbnail title={paper.title} thumbnail={paper.thumbnail} priority={isPriority} />
        </div>

        {/* RIGHT — Content */}
        <div className="flex-1 min-w-0 flex flex-col xl:pr-8">
          {/* Title */}
          <h3 className="text-[18px] xl:text-[20px] font-semibold text-[#2D2D2D] leading-[1.3] mb-2 group-hover:text-[#F55036] transition-colors line-clamp-3 xl:line-clamp-2">
            {paper.title}
          </h3>

          {/* Authors + date */}
          <div className="flex items-center text-[13px] font-normal text-[#555555] mb-3 min-w-0 w-full">
            <span className="truncate">{displayAuthors}</span>
            <span className="mx-2 text-[#DCDCD7] shrink-0">·</span>
            <span className="shrink-0">{paper.date}</span>
          </div>

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
              return <Pill key={t} label={t} colorKey="gray" />;
            })}
          </div>
        </div>

        {/* RIGHT — Metrics */}
        <div className="shrink-0 flex items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] mt-auto xl:mt-0 pt-4 xl:pt-0 w-full xl:w-auto">
          <div className="flex flex-row xl:flex-col justify-around xl:justify-around items-center w-full xl:w-[64px] xl:py-2 gap-2 xl:gap-0">
            <Metric
              value={`↑${upvotesNum}`}
              label="Stars / Hr"
              onClick={paper.githubUrl ? () => window.open(paper.githubUrl, '_blank', 'noopener,noreferrer') : undefined}
              interactive={!!paper.githubUrl}
            >
            </Metric>

            <Metric
              value={paper.repo}
              label="Repo"
              onClick={paper.githubUrl ? () => window.open(paper.githubUrl, '_blank', 'noopener,noreferrer') : undefined}
              interactive={!!paper.githubUrl}
            >
              <Github size={13} className="text-[#8B8B8B] shrink-0" />
            </Metric>

            <Metric
              value={(paper.citations || 0).toString()}
              label="Citations"
              interactive={true}
            >
              <MessageCircle size={13} className="text-[#8B8B8B] shrink-0" />
            </Metric>
          </div>
        </div>
      </div>
    </Link>
  );
});
PaperCard.displayName = "PaperCard";

/* ─── List ───────────────────────────────────────────────────────────────── */
interface PaperListProps {
  selectedTag?: string;
  filterParams?: Pick<GetPapersParams, "sort" | "task" | "method">;
  period?: GetPapersParams["period"];
}

const SKELETON_COUNT = 5;

export default function PaperList({
  selectedTag,
  filterParams,
  period,
}: PaperListProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [page, setPage] = useState(1);
  // Start with true so skeletons are shown immediately on mount.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Reset list when filters change.
  useEffect(() => {
    setPapers([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTag, filterParams, period]);

  // Handle scroll logic for infinite loading.
  const handleScroll = useCallback(() => {
    const scrollContainer = document.getElementById("scroll-container") as HTMLElement;
    if (!scrollContainer) return;

    const nearBottom =
      scrollContainer.scrollTop + scrollContainer.clientHeight >=
      scrollContainer.scrollHeight - 500;

    if (nearBottom && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  // Setup scroll listener with requestAnimationFrame throttling.
  useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container") as HTMLElement;
    if (!scrollContainer) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Main data-fetch effect.
  // The `cancelled` flag discards results from stale in-flight requests when
  // filters or page changes before the previous fetch resolves.
  useEffect(() => {
    let cancelled = false;

    async function loadPapers() {
      try {
        setLoading(true);
        const selectedTask =
          selectedTag && selectedTag !== "All Topics"
            ? selectedTag.toLowerCase().replace(/\s+/g, "-")
            : undefined;

        const result = await getPapers({
          page,
          ...filterParams,
          task: selectedTask ?? filterParams?.task,
          period,
        });

        if (cancelled) return;

        setHasMore(result.hasMore);
        setPapers((prev) => {
          const existingSlugs = new Set(prev.map(p => p.slug));
          const newPapers = result.papers.filter(p => !existingSlugs.has(p.slug));
          return [...prev, ...newPapers];
        });
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('Failed to load papers. Please try again later.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPapers();

    return () => { cancelled = true; };
  }, [page, selectedTag, filterParams, period]);

  if (error) {
    return (
      <div className="pb-12 pt-8 flex justify-center items-center text-[#F55036]">
        <p className="text-[14px]">{error}</p>
      </div>
    );
  }

  const showSkeletons = loading && papers.length === 0;

  return (
    <div className="pb-12 bg-transparent grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-col gap-6 xl:gap-0">
      {/* Real paper cards — rendered immediately as data arrives */}
      {papers.map((paper, index) => (
        <PaperCard key={paper.slug} paper={paper} index={index} />
      ))}

      {/* Skeleton cards — shown immediately on initial load so the feed is
          never blank. They disappear the moment the first page of papers lands.
          This is the primary FCP / perceived-performance improvement. */}
      {showSkeletons &&
        Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PaperCardSkeleton key={`skeleton-${i}`} />
        ))
      }

      {/* Pagination spinner — only after first page has loaded */}
      {loading && papers.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E40AF]" />
        </div>
      )}
    </div>
  );
}
