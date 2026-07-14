"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
  Profiler,
} from "react";
import { Github, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  getPapers,
  type GetPapersParams,
  type GetPapersResult,
  type Paper,
} from "@/lib/paperApi";
import { prefetchPaperBySlug } from "@/lib/papers";
import Image from "next/image";

// --- Performance Logger ---
const logRender = (
  id: string,
  phase: "mount" | "update" | "nested-update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) => {
  if (process.env.NODE_ENV !== "development") return;
  console.group(`[Profiler] ${id} (${phase})`);
  console.log(`- Actual duration: ${actualDuration.toFixed(2)}ms`);
  console.log(`- Base duration: ${baseDuration.toFixed(2)}ms`);
  console.log(`- Start time: ${startTime.toFixed(2)}ms`);
  console.log(`- Commit time: ${commitTime.toFixed(2)}ms`);
  console.groupEnd();
};

/* ─── Tag color map ──────────────────────────────────────────────────────── */
const TAG_COLORS: Record<
  string,
  { bg: string; text: string; dot: string; border?: string }
> = {
  purple: {
    bg: "bg-[#F3E8FF]",
    text: "text-[#6B21A8]",
    dot: "bg-[#9333EA]",
    border: "border border-[#D8B4FE]",
  },
  blue: {
    bg: "bg-[#E0F2FE]",
    text: "text-[#0369A1]",
    dot: "bg-[#0284C7]",
    border: "border border-[#BAE6FD]",
  },
  green: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#047857]",
    dot: "bg-[#10B981]",
    border: "border border-[#A7F3D0]",
  },
  cyan: {
    bg: "bg-[#CFFAFE]",
    text: "text-[#0E7490]",
    dot: "bg-[#06B6D4]",
    border: "border border-[#CFFAFE]",
  },
  gray: {
    bg: "bg-white",
    text: "text-[#111111]",
    dot: "",
    border: "border border-[#E5E5E0]",
  },
};

const getTagColor = (label: string): string => {
  const map: Record<string, string> = {
    "Reinforcement Learning": "blue",
    "Image Understanding": "blue",
    Agents: "green",
    "Long Context": "purple",
    Robotics: "cyan",
    "World Models": "purple",
  };
  if (map[label]) return map[label];

  const colors = ["purple", "blue", "green", "cyan"];
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/* ─── Pill tag ───────────────────────────────────────────────────────────── */
const Pill = memo(
  ({ label, colorKey }: { label: string; colorKey: string }) => {
    const c = TAG_COLORS[colorKey] || TAG_COLORS.gray;
    const isGray = colorKey === "gray";

    return (
      <span
        className={`group h-[24px] inline-flex items-center px-2.5 rounded-[4px] text-[11px] cursor-pointer transition-all duration-200 hover:-translate-y-px hover:brightness-[0.96] hover:shadow-sm active:scale-95 select-none ${c.bg} ${c.text} ${c.border || ""} whitespace-nowrap`}
      >
        {!isGray && (
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${c.dot}`}
          />
        )}
        {label}
      </span>
    );
  },
);
Pill.displayName = "Pill";

/* ─── SOTA Display ───────────────────────────────────────────────────────── */
const SotaDisplay = memo(({ sota }: { sota: string }) => {
  if (!sota) return null;
  const segments = sota.split(" • ");

  return (
    <div className="mb-[10px] text-[11px] tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1 w-full">
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
            {idx > 0 && (
              <span className="text-[#9CA3AF] mx-1.5 font-normal">•</span>
            )}

            {isSota ? (
              <>
                <span className="text-[#B48C52] font-semibold mr-1 tracking-wide">
                  SOTA
                </span>
                <span className="mr-1 text-[10px]">🏆</span>
                <span className="text-[#8B8B8B] mr-1 font-normal">on</span>
                <span className="text-[#1E40AF] text-[11.5px] tracking-tighter">
                  {benchmarks}
                </span>
              </>
            ) : isOn ? (
              <>
                <span className="text-[#8B8B8B] font-normal mr-1">
                  {prefix}
                </span>
                <span className="text-[#8B8B8B] mr-1 font-normal">on</span>
                <span className="text-[#1E40AF] text-[11.5px] tracking-tighter">
                  {benchmarks}
                </span>
              </>
            ) : (
              <span className="text-[#8B8B8B] font-normal tracking-tight">
                {segment}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
});
SotaDisplay.displayName = "SotaDisplay";

/* ─── Thumbnail ──────────────────────────────────────────────────────────── */
// Deterministic color palette from title string
function getTitleColors(title: string): {
  bg1: string;
  bg2: string;
  accent: string;
} {
  const palettes = [
    { bg1: "#1a1a2e", bg2: "#16213e", accent: "#e94560" },
    { bg1: "#0f3460", bg2: "#533483", accent: "#e94560" },
    { bg1: "#1b262c", bg2: "#0f3460", accent: "#00b4d8" },
    { bg1: "#2d132c", bg2: "#ee4540", accent: "#c72c41" },
    { bg1: "#1a1a2e", bg2: "#2e4057", accent: "#048a81" },
    { bg1: "#212121", bg2: "#37474f", accent: "#ff6f00" },
    { bg1: "#1b1b2f", bg2: "#162447", accent: "#1f4068" },
    { bg1: "#2c003e", bg2: "#1a0533", accent: "#870160" },
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++)
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

function GeneratedCover({ title }: { title: string }) {
  const { bg1, bg2, accent } = getTitleColors(title);
  // Break title into 2-line display (max ~22 chars per line)
  const words = (title || "Untitled").split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 20 && cur) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
    if (lines.length === 3) break;
  }
  if (cur && lines.length < 3) lines.push(cur.trim());
  const displayLines = lines.slice(0, 3);

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 170 240" preserveAspectRatio="none">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <!-- accent bar top -->
      <rect x="0" y="0" width="100%" height="4" fill="${accent}"/>
      <!-- decorative circles -->
      <circle cx="140" cy="50" r="55" fill="${accent}" fill-opacity="0.07"/>
      <circle cx="30" cy="200" r="40" fill="${accent}" fill-opacity="0.06"/>
      <!-- arxiv label -->
      <rect x="12" y="16" width="42" height="14" rx="3" fill="${accent}" fill-opacity="0.9"/>
      <text x="33" y="27" font-family="monospace" font-size="8" fill="white" text-anchor="middle">arXiv</text>
      <!-- title lines -->
      ${displayLines.map((line, i) => `<text x="12" y="${115 + i * 20}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="white" fill-opacity="0.95">${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</text>`).join("")}
      <!-- bottom accent bar -->
      <rect x="12" y="237" width="30" height="3" rx="1.5" fill="${accent}"/>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url("${dataUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

const isValidImageSrc = (src: string) => {
  if (!src || src === "null" || src === "None") return false;
  if (src.startsWith('/')) return true;
  if (src.startsWith('data:image/')) return true;
  try {
    new URL(src);
    return true;
  } catch {
    return false;
  }
};

const PaperThumbnail = memo(
  ({ title, thumbnail }: { title: string; thumbnail: string }) => {
    const [hasError, setHasError] = useState(false);

    return (
      <div className="w-full xl:w-[160px] h-[100px] sm:h-[125px] xl:h-[180px] shrink-0 border border-[#E5E5E0] bg-white rounded-none overflow-hidden shadow-sm relative flex items-center justify-center">
        {isValidImageSrc(thumbnail) && !hasError ? (
          <Image
            src={thumbnail}
            alt={title || "Paper thumbnail"}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 1280px) 100vw, 220px"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full">
             <GeneratedCover title={title} />
          </div>
        )}
      </div>
    );
  },
);
PaperThumbnail.displayName = "PaperThumbnail";

/* ─── Metric block ───────────────────────────────────────────────────────── */
const Metric = memo(
  ({
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
        className={`flex items-center gap-2.5 group/metric px-3 py-1.5 rounded-lg ${isInteractive ? "cursor-pointer hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out" : ""}`}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            e.stopPropagation();
            onClick(e);
          }
        }}
      >
        <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-white/60 border border-[#E5E5E0]/60 ${isInteractive ? "group-hover/metric:border-[#F55036]/20 group-hover/metric:bg-[#F55036]/5 transition-colors" : ""}`}>
           {children}
        </div>
        <div className="flex flex-col items-start justify-center">
          <span
            className={`text-[14px] font-bold text-[#111111] leading-none tabular-nums tracking-tight ${isInteractive ? "group-hover/metric:text-[#F55036] transition-colors" : ""}`}
          >
            {value}
          </span>
          <span
            className={`text-[9px] font-semibold text-[#8B8B8B] uppercase tracking-[0.06em] leading-none mt-1 ${isInteractive ? "group-hover/metric:text-[#F55036]/80 transition-colors" : ""}`}
          >
            {label}
          </span>
        </div>
      </div>
    );
  },
);
Metric.displayName = "Metric";

/* ─── Paper Card ─────────────────────────────────────────────────────────── */
const PaperCard = memo(({ paper }: { paper: Paper }) => {
  const upvotesNum = parseFloat(paper.upvotes) || 0;

  const safeAuthors = paper.authors || [];
  const visibleAuthors = safeAuthors.slice(0, 3);
  const remaining = safeAuthors.length - 3;

  return (
    <Link href={`/papers/${paper.slug}`} className="no-underline block">
      <div className="group flex flex-row gap-3 sm:gap-4 xl:gap-5 p-3 sm:p-4 xl:py-5 bg-white xl:bg-transparent border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] rounded-none cursor-pointer hover:shadow-lg xl:hover:bg-white xl:hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 relative hover:z-10 active:scale-[0.99]">
        {/* LEFT — PDF thumbnail */}
        <div className="shrink-0 w-[72px] sm:w-[90px] xl:w-auto self-start xl:self-stretch">
          <PaperThumbnail title={paper.title} thumbnail={paper.thumbnail} />
        </div>

        {/* RIGHT — Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Title */}
          <h3 className="text-[15px] sm:text-[17px] xl:text-[20px] font-serif font-medium text-[#111111] leading-snug xl:leading-[1.3] mb-1 xl:mb-1.5 group-hover:text-[#F55036] transition-colors line-clamp-3 xl:line-clamp-none">
            {paper.title}
          </h3>

          {/* Authors — clickable, comma-separated */}
          <div className="text-[12.5px] sm:text-[13px] xl:text-[13.5px] text-[#555555] mb-2 xl:mb-2.5 flex flex-wrap items-baseline gap-x-0.5">
            {visibleAuthors.length > 0 ? (
              visibleAuthors.map((a, i) => (
                <span key={a.slug || i}>
                  {i > 0 && <span className="text-[#999]">, </span>}
                  <Link
                    href={`/authors/${a.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-[#FF5A1F] transition-colors no-underline text-[#555555] hover:underline"
                  >
                    {a.name}
                  </Link>
                </span>
              ))
            ) : (
              <span className="text-[#999]">Unknown Author</span>
            )}
            {remaining > 0 && (
              <span className="text-[#999] ml-0.5">et al.</span>
            )}
          </div>

          {/* Date + citations */}
          <div className="flex items-center text-[11.5px] sm:text-[12px] xl:text-[12.5px] text-[#999999] mb-2 xl:mb-2.5 min-w-0 w-full flex-wrap gap-y-1">
            <span className="shrink-0">{paper.date}</span>
            <span className="mx-1.5 hidden sm:inline text-[#ccc]">·</span>
            <span className="shrink-0 hidden sm:inline">{paper.citations || 0} citations</span>
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-[13.5px] xl:text-[14px] text-[#444444] leading-[1.6] mb-3 line-clamp-2 xl:line-clamp-3 hidden sm:block">
            {paper.description}
          </p>

          {/* Benchmark / SOTA (Row 1) */}
          <div className="w-full">
            <SotaDisplay sota={paper.sota} />
          </div>

          {/* Tasks (Row 2) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5 w-full">
            {paper.tags?.map((t) => {
              const colorKey = getTagColor(t);
              return <Pill key={t} label={t} colorKey={colorKey} />;
            })}
          </div>

          {/* Methods (Row 3) */}
          <div className="flex flex-wrap items-center gap-1.5 w-full">
            {paper.additionalTags?.map((t) => {
              return <Pill key={t} label={t} colorKey="gray" />;
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center w-full mt-auto pt-3 gap-1.5 sm:gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open((paper as any).arxivUrl || "https://arxiv.org", "_blank");
              }}
              className="flex-1 flex items-center justify-center sm:justify-between px-2 sm:px-3.5 h-[32px] sm:h-[34px] bg-[#FFF8F4] text-[#E0663B] border border-[#FDE3D6] rounded-[6px] hover:bg-[#FDE3D6]/50 transition-colors"
            >
              <span className="font-medium text-[11px] sm:text-[13px]">arXiv</span>
              <ArrowUpRight size={14} strokeWidth={1.5} className="hidden sm:block" />
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open((paper as any).pdfUrl || "https://arxiv.org/pdf", "_blank");
              }}
              className="flex-1 flex items-center justify-center sm:justify-between px-2 sm:px-3.5 h-[32px] sm:h-[34px] bg-[#FFF4F6] text-[#E54D59] border border-[#FDD4DC] rounded-[6px] hover:bg-[#FDD4DC]/50 transition-colors"
            >
              <span className="font-medium text-[11px] sm:text-[13px]">PDF</span>
              <ArrowUpRight size={14} strokeWidth={1.5} className="hidden sm:block" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(paper.githubUrl || "https://github.com", "_blank");
              }}
              className="flex-1 flex items-center justify-center sm:justify-between px-2 sm:px-3.5 h-[32px] sm:h-[34px] bg-[#F7F8F9] text-[#111111] border border-[#E5E7EB] rounded-[6px] hover:bg-[#E5E7EB]/70 transition-colors"
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Github size={13} strokeWidth={1.5} className="hidden sm:block" />
                <span className="font-medium text-[11px] sm:text-[13px]">GitHub</span>
                {upvotesNum > 0 && <span className="hidden sm:inline text-[#9CA3AF] text-[12.5px] font-normal">{upvotesNum}k</span>}
              </div>
              <ArrowUpRight size={14} strokeWidth={1.5} className="text-[#9CA3AF] hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});
PaperCard.displayName = "PaperCard";

/* ─── Paper Card Skeleton ────────────────────────────────────────────────── */
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

/* ─── List ───────────────────────────────────────────────────────────────── */
interface PaperListProps {
  selectedTag?: string;
  filterParams?: Pick<GetPapersParams, "sort" | "task" | "method" | "model">;
  period?: GetPapersParams["period"];
  searchQuery?: string;
  initialPapers?: GetPapersResult | null;
  initialError?: string;
}

export default function PaperList({
  selectedTag,
  filterParams,
  period,
  searchQuery,
  initialPapers = null,
  initialError,
}: PaperListProps) {
  const [papers, setPapers] = useState<Paper[]>(
    () => initialPapers?.papers ?? [],
  );
  const [page, setPage] = useState(() => initialPapers?.page ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [hasMore, setHasMore] = useState(() => initialPapers?.hasMore ?? true);
  const cacheRef = useRef<Map<string, GetPapersResult>>(new Map());
  const inFlightRef = useRef<Map<string, Promise<GetPapersResult>>>(new Map());
  const loadingRef = useRef(false);
  const normalizedSearchQuery = useMemo(
    () => searchQuery?.trim().toLowerCase() ?? "",
    [searchQuery],
  );
  const sentinelRef = useRef<HTMLDivElement>(null);
  const nextPageRef = useRef<number>(
    initialPapers?.hasMore ? initialPapers.page + 1 : 0,
  );

  // Paper detail prefetching via IntersectionObserver
  const prefetchedRef = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).getAttribute("data-paper-slug");
            if (slug && !prefetchedRef.current.has(slug)) {
              prefetchedRef.current.add(slug);
              prefetchPaperBySlug(slug);
            }
          }
        }
      },
      { rootMargin: "100px" }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const observeCard = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      observerRef.current?.observe(el);
    }
  }, []);

  const matchesSearch = useCallback(
    (paper: Paper) => {
      if (!normalizedSearchQuery) return true;
      const haystack = [
        paper.title,
        (paper.authors || []).map((a) => a.name).join(" "),
        paper.description,
        ...(paper.tags ?? []),
        ...(paper.additionalTags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearchQuery);
    },
    [normalizedSearchQuery],
  );

  // Memoize task from selectedTag
  const task = useMemo(() => {
    if (filterParams?.task) return filterParams.task;
    return selectedTag && selectedTag !== "All Topics"
      ? selectedTag.toLowerCase().replace(/\s+/g, "-")
      : undefined;
  }, [filterParams?.task, selectedTag]);

  // Get cache key
  const getCacheKey = useCallback(
    (pageNumber: number) => {
      return `${task ?? "all"}:${filterParams?.model ?? "none"}:${filterParams?.method ?? "none"}:${filterParams?.sort ?? "none"}:${period ?? "all"}:${pageNumber}`;
    },
    [filterParams?.method, filterParams?.model, filterParams?.sort, period, task],
  );

  // Fetch page with caching
  const fetchPage = useCallback(
    (pageNumber: number): Promise<GetPapersResult> => {
      const key = getCacheKey(pageNumber);
      const cached = cacheRef.current.get(key);
      if (cached) {
        return Promise.resolve(cached);
      }
      if (inFlightRef.current.has(key)) {
        return inFlightRef.current.get(key)!;
      }

      const request = getPapers({
        page: pageNumber,
        task,
        model: filterParams?.model,
        method: filterParams?.method,
        sort: filterParams?.sort,
        period,
      })
        .then((result) => {
          cacheRef.current.set(key, result);
          return result;
        })
        .finally(() => {
          inFlightRef.current.delete(key);
        });

      inFlightRef.current.set(key, request);
      return request;
    },
    [
      filterParams?.method,
      filterParams?.model,
      filterParams?.sort,
      getCacheKey,
      period,
      task,
    ],
  );

  // Append papers with duplicate prevention
  const appendPapers = useCallback((newPapers: Paper[]) => {
    setPapers((prev) => {
      const existingSlugs = new Set(prev.map((paper) => paper.slug));
      const uniquePapers = newPapers.filter(
        (paper) => !existingSlugs.has(paper.slug),
      );
      return uniquePapers.length ? [...prev, ...uniquePapers] : prev;
    });
  }, []);

  // Prefetch next page
  const prefetchPage = useCallback(
    (pageNumber: number) => {
      void fetchPage(pageNumber).catch((err) => {
        console.warn("Failed to prefetch papers:", err);
      });
    },
    [fetchPage],
  );

  // Load page
  const loadPage = useCallback(
    async (pageNumber: number, replace = false) => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const result = await fetchPage(pageNumber);
        const visiblePapers = normalizedSearchQuery
          ? result.papers.filter(matchesSearch)
          : result.papers;

        setPage(result.page);
        setHasMore(result.hasMore);

        if (replace) {
          setPapers(visiblePapers);
        } else {
          appendPapers(visiblePapers);
        }

        if (result.hasMore) {
          nextPageRef.current = result.page + 1;
          prefetchPage(result.page + 1);
        } else {
          nextPageRef.current = 0;
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [
      appendPapers,
      fetchPage,
      matchesSearch,
      normalizedSearchQuery,
      prefetchPage,
    ],
  );

  // Initialize or reset on filter change
  useEffect(() => {
    if (
      initialPapers &&
      !selectedTag &&
      !filterParams?.task &&
      !filterParams?.method &&
      !filterParams?.model &&
      (!filterParams?.sort || filterParams.sort === "latest") &&
      (!period || period === "all") &&
      !normalizedSearchQuery
    ) {
      cacheRef.current.set(getCacheKey(initialPapers.page), initialPapers);
      setPapers(initialPapers.papers);
      setPage(initialPapers.page);
      setHasMore(initialPapers.hasMore);
      setError(initialError ?? null);
      if (initialPapers.hasMore) {
        nextPageRef.current = initialPapers.page + 1;
        prefetchPage(initialPapers.page + 1);
      } else {
        nextPageRef.current = 0;
      }
      return;
    }

    setPapers([]);
    setPage(1);
    setHasMore(true);
    nextPageRef.current = 1;
    void loadPage(1, true);
  }, [
    filterParams?.method,
    filterParams?.model,
    filterParams?.sort,
    filterParams?.task,
    getCacheKey,
    initialError,
    initialPapers,
    loadPage,
    normalizedSearchQuery,
    period,
    prefetchPage,
    selectedTag,
  ]);

  // Infinite scroll: IntersectionObserver triggers next page load
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingRef.current && hasMore) {
          const nextPage = nextPageRef.current;
          if (nextPage > 0) {
            void loadPage(nextPage, false);
          }
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadPage]);

  if (error && papers.length === 0) {
    return (
      <div className="pb-12 pt-8 flex justify-center items-center text-[#F55036]">
        <p className="text-[14px]">{error}</p>
      </div>
    );
  }


  return (
    <Profiler id="PaperList" onRender={logRender}>
      <div
        className="pb-12 bg-transparent grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-col gap-6 xl:gap-0"
        data-page={page}
      >
        {papers.map((paper) => (
          <div key={paper.slug} ref={observeCard} data-paper-slug={paper.slug}>
            <PaperCard paper={paper} />
          </div>
        ))}

        {/* Initial load: show skeleton cards instead of spinner */}
        {loading && papers.length === 0 && (
          <>
            <PaperCardSkeleton />
            <PaperCardSkeleton />
            <PaperCardSkeleton />
          </>
        )}

        {/* Sentinel for infinite scroll trigger */}
        <div ref={sentinelRef} className="h-px" />

        {/* Pagination load: show small spinner at bottom */}
        {loading && papers.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E5E5E0]" />
          </div>
        )}

        {!loading && papers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in w-full col-span-full">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-[#E5E5E0] shadow-sm">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B8B8B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">
              No Papers Found
            </h3>
            <p className="text-[14px] text-[#666666] max-w-[320px] leading-relaxed">
              We couldn't find any papers matching your selected time period or
              category. Try clearing your filters or selecting "All time".
            </p>
          </div>
        )}
      </div>
    </Profiler>
  );
}
