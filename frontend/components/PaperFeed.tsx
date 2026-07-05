"use client";

import { useState, useEffect, useCallback, memo, Profiler } from "react";
import { Github, MessageCircle, Star } from "lucide-react";
import Link from "next/link";
import { getPapers, type GetPapersParams, type Paper } from "@/lib/paperApi";
import Image from "next/image";

// --- Performance Logger ---
const logRender = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
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
    "Robotics": "cyan",
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
const Pill = memo(({ label, colorKey }: { label: string; colorKey: string }) => {
  const c = TAG_COLORS[colorKey] || TAG_COLORS.gray;
  const isGray = colorKey === "gray";

  return (
    <span
      className={`group h-[28px] xl:h-[24px] inline-flex items-center px-3 xl:px-2 rounded-[4px] text-[11px] cursor-pointer transition-all duration-200 hover:-translate-y-px hover:brightness-[0.96] hover:shadow-sm active:scale-95 select-none ${c.bg} ${c.text} ${c.border || ""} whitespace-nowrap`}
    >
      {!isGray && (
        <span className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 transition-transform duration-200 group-hover:scale-110 ${c.dot}`} />
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
// Deterministic color palette from title string
function getTitleColors(title: string): { bg1: string; bg2: string; accent: string } {
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
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

function GeneratedCover({ title }: { title: string }) {
  const { bg1, bg2, accent } = getTitleColors(title);
  // Break title into 2-line display (max ~22 chars per line)
  const words = (title || "Untitled").split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 20 && cur) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + " " + w).trim();
    if (lines.length === 3) break;
  }
  if (cur && lines.length < 3) lines.push(cur.trim());
  const displayLines = lines.slice(0, 3);

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="170" height="240" viewBox="0 0 170 240">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg1}"/>
          <stop offset="100%" stop-color="${bg2}"/>
        </linearGradient>
      </defs>
      <rect width="170" height="240" fill="url(#bg)"/>
      <!-- accent bar top -->
      <rect x="0" y="0" width="170" height="4" fill="${accent}"/>
      <!-- decorative circles -->
      <circle cx="140" cy="50" r="55" fill="${accent}" fill-opacity="0.07"/>
      <circle cx="30" cy="200" r="40" fill="${accent}" fill-opacity="0.06"/>
      <!-- arxiv label -->
      <rect x="12" y="16" width="42" height="14" rx="3" fill="${accent}" fill-opacity="0.9"/>
      <text x="33" y="27" font-family="monospace" font-size="8" fill="white" text-anchor="middle">arXiv</text>
      <!-- title lines -->
      ${displayLines.map((line, i) => `<text x="12" y="${105 + i * 18}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="white" fill-opacity="0.95">${line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}</text>`).join("")}
      <!-- bottom accent bar -->
      <rect x="12" y="210" width="30" height="3" rx="1.5" fill="${accent}"/>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;

  return (
    <div
      className="w-full h-full"
      style={{ backgroundImage: `url("${dataUrl}")`, backgroundSize: 'cover', backgroundPosition: 'top' }}
    />
  );
}

const PaperThumbnail = memo(({ title, thumbnail }: { title: string; thumbnail: string }) => {
  return (
    <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 border border-[#E5E5E0] rounded-md xl:rounded-none overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.07)] relative flex items-center justify-center">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title || "Paper thumbnail"}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1280px) 100vw, 170px"
        />
      ) : (
        <GeneratedCover title={title} />
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

/* ─── Paper Card Skeleton ────────────────────────────────────────────────── */
function PaperCardSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full xl:w-[170px] h-[180px] sm:h-[220px] xl:h-[240px] shrink-0 bg-[#F8F7F2] rounded-md xl:rounded-none border border-[#E5E5E0]" />

      {/* Content placeholder */}
      <div className="flex-1 min-w-0 flex flex-col xl:pr-8 gap-3 pt-1">
        {/* Title lines */}
        <div className="h-5 w-3/4 bg-[#F8F7F2] rounded-md" />
        <div className="h-5 w-1/2 bg-[#F8F7F2] rounded-md" />
        {/* Authors */}
        <div className="h-3.5 w-2/5 bg-[#F8F7F2] rounded" />
        {/* Description */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="h-3 w-full bg-[#F8F7F2] rounded" />
          <div className="h-3 w-full bg-[#F8F7F2] rounded" />
          <div className="h-3 w-4/5 bg-[#F8F7F2] rounded" />
        </div>
        {/* Tags */}
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 bg-[#F8F7F2] rounded-full border border-[#E5E5E0]" />
          <div className="h-6 w-20 bg-[#F8F7F2] rounded-full border border-[#E5E5E0]" />
          <div className="h-6 w-14 bg-[#F8F7F2] rounded-full border border-[#E5E5E0]" />
        </div>
      </div>

      {/* Metrics placeholder */}
      <div className="shrink-0 flex items-center xl:items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] pt-4 xl:pt-0 w-full xl:w-auto">
        <div className="flex flex-row xl:flex-col justify-around items-center w-full xl:w-[64px] xl:py-2 gap-4 xl:gap-0">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-8 bg-[#F8F7F2] rounded" />
            <div className="h-2.5 w-10 bg-[#F8F7F2] rounded" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-8 bg-[#F8F7F2] rounded" />
            <div className="h-2.5 w-10 bg-[#F8F7F2] rounded" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-4 w-8 bg-[#F8F7F2] rounded" />
            <div className="h-2.5 w-10 bg-[#F8F7F2] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Paper Card ─────────────────────────────────────────────────────────── */
const PaperCard = memo(({ paper }: { paper: Paper }) => {
  // Parse upvotes string to float for stars/hr, e.g. "11.2K" -> "11.2"
  const upvotesNum = parseFloat(paper.upvotes) || 0;

  // Format authors to avoid long lines
  let displayAuthors = paper.authors;
  if (paper.authors) {
    const authorList = paper.authors.split(",").map(a => a.trim());
    if (authorList.length > 3) {
      displayAuthors = `${authorList.slice(0, 3).join(", ")} et al.`;
    }
  }

  return (
    <Link href={`/papers/${paper.slug}`} className="no-underline">
      <div className="group flex flex-col xl:flex-row gap-4 xl:gap-6 p-4 xl:py-6 xl:px-6 border xl:border-x-0 xl:border-t-0 border-[#E5E5E0] bg-white xl:bg-transparent min-w-0 cursor-pointer hover:shadow-lg xl:hover:bg-white xl:hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out rounded-xl xl:rounded-none h-full hover:-translate-y-[2px] xl:hover:-translate-y-1 relative hover:z-10 active:scale-[0.99]">
        {/* LEFT — PDF thumbnail */}
        <div className="flex flex-col justify-center shrink-0 w-full xl:w-auto">
          <PaperThumbnail title={paper.title} thumbnail={paper.thumbnail} />
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
          <p className="text-[14px] font-normal text-[#555555] leading-[1.6] mb-4 line-clamp-3 xl:line-clamp-2">
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
              return <Pill key={t} label={t} colorKey="gray" /> ;
            })}
          </div>
        </div>

        {/* RIGHT — Metrics */}
        <div className="shrink-0 flex items-stretch xl:pl-[24px] xl:pr-[32px] border-t xl:border-t-0 xl:border-l border-[#E5E5E0] mt-auto xl:mt-0 pt-4 xl:pt-0 w-full xl:w-auto">
          <div className="flex flex-row xl:flex-col justify-around xl:justify-around items-center w-full xl:w-[64px] xl:py-2 gap-2 xl:gap-0">
            <Metric
              value={`${upvotesNum}`}
              label="Stars / Hr"
              onClick={paper.githubUrl ? () => window.open(paper.githubUrl, '_blank', 'noopener,noreferrer') : undefined}
              interactive={!!paper.githubUrl}
            >
              <Star size={12} className="text-[#8B8B8B] shrink-0 fill-current" />
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

export default function PaperList({
  selectedTag,
  filterParams,
  period,
}: PaperListProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Track page load performance
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[PaperList] Page ${page} selectedTag="${selectedTag}" start loading papers count:`, papers.length);
    }
    const startTime = performance.now();
    const endLoad = () => {
      const duration = performance.now() - startTime;
      if (process.env.NODE_ENV === "development") {
        console.log(`[PaperList] Load complete in ${duration.toFixed(2)}ms`);
      }
    };
    endLoad();
  }, [page, selectedTag, filterParams, period, papers.length]);

  // Handle scroll logic
  const handleScroll = useCallback(() => {
    const scrollContainer = document.getElementById("scroll-container") as HTMLElement;
    if (!scrollContainer) return;

    const nearBottom =
      scrollContainer.scrollTop + scrollContainer.clientHeight >=
      scrollContainer.scrollHeight - 500;

    if (nearBottom && !loading && hasMore) {
      if (process.env.NODE_ENV === "development") console.log(`[PaperList] Near bottom, loading page ${page + 1}`);
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, page]);

  // Setup scroll listener with requestAnimationFrame throttling
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

    return () => {
      scrollContainer.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setPapers([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTag, filterParams, period]);

  useEffect(() => {
    async function loadPapers() {
      try {
        setLoading(true);
        const selectedTask =
          selectedTag && selectedTag !== "All Topics"
            ? selectedTag.toLowerCase().replace(/\s+/g, "-")
            : undefined;

        const apiStartTime = performance.now();
        const result = await getPapers({
          page,
          ...filterParams,
          task: selectedTask ?? filterParams?.task,
          period,
        });
        const apiDuration = performance.now() - apiStartTime;
        if (process.env.NODE_ENV === "development") console.log(`[PaperList] API call completed in ${apiDuration.toFixed(2)}ms`);

        setHasMore(result.hasMore);

        setPapers((prev) => {
          const existingSlugs = new Set(prev.map(p => p.slug));
          const newPapers = result.papers.filter(p => !existingSlugs.has(p.slug));
          if (process.env.NODE_ENV === "development") console.log(`[PaperList] Adding ${newPapers.length} new papers, total now ${prev.length + newPapers.length}`);
          return [...prev, ...newPapers];
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load papers. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, [page, selectedTag, filterParams, period]);

  if (error) {
    return (
      <div className="pb-12 pt-8 flex justify-center items-center text-[#F55036]">
        <p className="text-[14px]">{error}</p>
      </div>
    );
  }

  return (
    <Profiler id="PaperList" onRender={logRender}>
      <div className="pb-12 bg-transparent grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-col gap-6 xl:gap-0">
        {papers.map((paper) => (
          <Profiler key={paper.slug} id={`PaperCard-${paper.slug}`} onRender={logRender}>
            <PaperCard key={paper.slug} paper={paper} />
          </Profiler>
        ))}

        {/* Initial load: show skeleton cards instead of spinner */}
        {loading && papers.length === 0 && (
          <>
            <PaperCardSkeleton />
            <PaperCardSkeleton />
            <PaperCardSkeleton />
          </>
        )}

        {/* Pagination load: show small spinner at bottom */}
        {loading && papers.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E5E5E0]" />
          </div>
        )}

        {!loading && papers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in w-full col-span-full">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-[#E5E5E0] shadow-sm">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B8B8B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">No Papers Found</h3>
            <p className="text-[14px] text-[#666666] max-w-[320px] leading-relaxed">
              We couldn't find any papers matching your selected time period or category. Try clearing your filters or selecting "All time".
            </p>
          </div>
        )}
      </div>
    </Profiler>
  );
}
