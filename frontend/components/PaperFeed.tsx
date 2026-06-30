"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Quote, Calendar, FileText, GitBranch, ExternalLink } from "lucide-react";
import { getPapers, type Paper, type PaperFilters } from "@/lib/paperApi";
import { slugify } from "@/lib/methods";
import Link from "next/link";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  purple: { bg: "bg-[#F3E8FF]", text: "text-[#6B21A8]" },
  blue: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]" },
  green: { bg: "bg-[#ECFDF5]", text: "text-[#047857]" },
  cyan: { bg: "bg-[#CFFAFE]", text: "text-[#0E7490]" },
  gray: { bg: "bg-white", text: "text-[#111111]" },
};

function getTagColor(label: string): string {
  const map: Record<string, string> = {
    "Reinforcement Learning": "blue",
    "Image Understanding": "blue",
    Agents: "green",
    "Long Context": "purple",
  };
  return map[label] || "gray";
}

function Pill({ label, colorKey }: { label: string; colorKey: string }) {
  const c = TAG_COLORS[colorKey] || TAG_COLORS.gray;
  return (
    <span className={`h-[20px] inline-flex items-center px-1.5 rounded text-[10px] font-medium ${c.bg} ${c.text} whitespace-nowrap`}>
      {label}
    </span>
  );
}

function FormatNumber({ n }: { n: number }) {
  return <span className="tabular-nums">{n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n)}</span>;
}

function PaperCard({ paper }: { paper: Paper }) {
  const starCount = parseInt(paper.upvotes) || 0;
  const citationCount = paper.citations || 0;
  const hasActions = !!(paper.pdfUrl || paper.githubUrl || paper.arxivId);
  const previewUrl = paper.thumbnailUrl;

  return (
    <div className="bg-white border border-[#E5E5E0] rounded-lg hover:border-[#F55036]/30 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 flex">
      {/* Thumbnail */}
      {previewUrl && (
        <Link href={`/papers/${paper.slug}`} className="shrink-0 w-[100px] md:w-[120px] no-underline">
          <div className="relative w-full h-full min-h-[140px] bg-[#F8F7F2] rounded-l-lg overflow-hidden">
            <img
              src={previewUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </Link>
      )}

      <div className="flex-1 min-w-0 p-3 md:p-4">
        <Link href={`/papers/${paper.slug}`} className="no-underline">
          {/* Title */}
          <h3 className="text-[15px] md:text-[16px] font-bold text-[#111111] leading-[1.3] mb-1 hover:text-[#F55036] transition-colors line-clamp-2">
            {paper.title}
          </h3>
        </Link>

        {/* Authors */}
        {paper.authorNames.length > 0 && (
          <p className="text-[12px] text-[#555555] mb-1.5 truncate">
            {paper.authorNames.slice(0, 5).join(", ")}
            {paper.authorNames.length > 5 ? " et al." : ""}
          </p>
        )}

        {/* Abstract preview */}
        {paper.description && (
          <p className="text-[12px] text-[#8B8B8B] leading-[1.5] mb-2 line-clamp-2">
            {paper.description}
          </p>
        )}

        {/* Tags */}
        {(paper.tags.length > 0 || paper.additionalTags.length > 0) && (
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {paper.tags.map((t) => (
              <Link
                key={t}
                href={`/tasks/${slugify(t)}`}
                className="no-underline hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Pill label={t} colorKey={getTagColor(t)} />
              </Link>
            ))}
            {paper.additionalTags.map((t) => (
              <Link
                key={t}
                href={`/methods/${slugify(t)}`}
                className="no-underline hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Pill label={t} colorKey={getTagColor(t)} />
              </Link>
            ))}
          </div>
        )}

        {/* Bottom row: metadata + actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8B8B8B]">
            {paper.date && paper.date !== "Unknown Date" && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {paper.date}
              </span>
            )}
            {citationCount > 0 && (
              <span className="flex items-center gap-1">
                <Quote size={11} />
                <FormatNumber n={citationCount} />
              </span>
            )}
            {starCount > 0 && (
              <span className="flex items-center gap-1">
                <Star size={11} />
                {starCount >= 1000 ? `${(starCount / 1000).toFixed(1)}k` : starCount}
              </span>
            )}
            {paper.language && (
              <span className="text-[10px] text-[#BFBFBA]">{paper.language}</span>
            )}
            {paper.conference && (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F8F7F2] border border-[#E5E5E0] rounded text-[10px] font-medium text-[#555555]">
                {paper.conference}
              </span>
            )}
          </div>

          {/* Action buttons */}
          {hasActions && (
            <div className="flex items-center gap-1 shrink-0">
              {paper.pdfUrl && (
                <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#555555] hover:text-[#F55036] hover:bg-[#F8F7F2] rounded-md border border-[#E5E5E0] transition-colors no-underline" title="PDF">
                  <FileText size={11} />
                </a>
              )}
              {paper.githubUrl && (
                <a href={paper.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#555555] hover:text-[#F55036] hover:bg-[#F8F7F2] rounded-md border border-[#E5E5E0] transition-colors no-underline" title="Code">
                  <GitBranch size={11} />
                </a>
              )}
              {paper.arxivId && (
                <a href={`https://arxiv.org/abs/${paper.arxivId}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[#555555] hover:text-[#F55036] hover:bg-[#F8F7F2] rounded-md border border-[#E5E5E0] transition-colors no-underline" title="arXiv">
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaperList({ filters }: { filters?: PaperFilters }) {
  const filtersStr = JSON.stringify(filters);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  loadingRef.current = loading;
  hasMoreRef.current = hasMore;

  useEffect(() => {
    const scrollContainer = document.getElementById("scroll-container") as HTMLElement;
    if (!scrollContainer) return;

    function handleScroll() {
      const nearBottom =
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 500;

      if (nearBottom && !loadingRef.current && hasMoreRef.current) {
        setPage((prev) => prev + 1);
      }
    }

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setPapers([]);
    setPage(1);
    setHasMore(true);
  }, [filtersStr]);

  useEffect(() => {
    async function loadPapers() {
      try {
        setLoading(true);
        const data = await getPapers(page, filters);
        if (data.length === 0) {
          setHasMore(false);
        }

        setPapers((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPapers = data.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPapers];
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load papers. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, [page, filtersStr]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="pb-12 pt-8 flex justify-center items-center">
        <p className="text-[14px] text-[#F55036]">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}

      {loading && (
        <div className="flex justify-center py-8 col-span-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E40AF]" />
        </div>
      )}
    </div>
  );
}
