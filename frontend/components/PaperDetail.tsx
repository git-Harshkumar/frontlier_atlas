"use client";

import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  Calendar,
  Star,
  GitBranch,
  ArrowLeft,
  BookOpen,
  Globe,
  FileText,
  Quote,
  BookMarked,
  Clock,
  Tag,
  Hash,
  Layers,
  Award,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import type { PaperDetail as PaperDetailType } from "@/lib/papers";
import { getPapers, type Paper } from "@/lib/paperApi";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getCitationYear(dateStr: string | null): string {
  if (!dateStr) return "n.d.";
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return "n.d.";
  }
}

type CitationFormat = "apa" | "mla" | "chicago";

function generateCitation(paper: PaperDetailType, format: CitationFormat): string {
  const year = getCitationYear(paper.publicationDate);
  const authors = paper.authors.map((pa) => pa.author.name);
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown Author";
  const title = paper.title;
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const arxiv = paper.arxivId ? `arXiv:${paper.arxivId}` : null;
  const source = arxiv || "Online";

  switch (format) {
    case "apa":
      return `${authorStr} (${year}). ${title}. ${source}.${doi ? ` https://doi.org/${paper.doi}` : ""}`;
    case "mla":
      return `${authorStr}. "${title}." ${source}, ${year}.${doi ? ` doi:${paper.doi}.` : ""}`;
    case "chicago":
      return `${authorStr}. ${year}. "${title}." ${source}.${doi ? ` https://doi.org/${paper.doi}.` : ""}`;
  }
}

function formatCompactNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

function SidebarButton({ href, icon, label, primary }: { href?: string | null; icon: React.ReactNode; label: string; primary?: boolean }) {
  if (!href) return null;
  const cls = primary
    ? "w-full inline-flex items-center justify-center gap-2 ds-button text-[12px] px-3 py-2 no-underline"
    : "w-full inline-flex items-center justify-center gap-2 ds-button-ghost text-[12px] px-3 py-2 no-underline";
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {icon} {label}
    </a>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-6">
      <h2 className="text-[14px] font-bold tracking-tight mb-2 text-[#111111]">{title}</h2>
      {children}
    </section>
  );
}

function ChipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="ds-chip text-[11px] no-underline hover:opacity-80 transition-opacity inline-block">
      {children}
    </Link>
  );
}

export default function PaperDetail({ paper }: { paper: PaperDetailType }) {
  const [copied, setCopied] = useState(false);
  const [citationCopied, setCitationCopied] = useState<string | null>(null);
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const abstractTruncated = paper.abstract && paper.abstract.length > 400;

  const arxivUrl = paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : null;
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: paper.title, url: window.location.href });
      } catch { /* ignore */ }
    } else {
      handleCopyLink();
    }
  }, [paper.title, handleCopyLink]);

  const handleCopyCitation = useCallback(async (format: CitationFormat) => {
    const text = generateCitation(paper, format);
    try {
      await navigator.clipboard.writeText(text);
      setCitationCopied(format);
      setTimeout(() => setCitationCopied(null), 2000);
    } catch { /* ignore */ }
  }, [paper]);

  useEffect(() => {
    async function loadRelated() {
      if (paper.tasks.length === 0) {
        setRelatedLoading(false);
        return;
      }
      try {
        const taskSlug = paper.tasks[0].task.slug;
        const data = await getPapers(1, { task: taskSlug });
        setRelatedPapers(data.filter((p) => String(p.id) !== String(paper.id)).slice(0, 4));
      } catch { /* ignore */ }
      setRelatedLoading(false);
    }
    loadRelated();
  }, [paper]);

  const citationFormats: { key: CitationFormat; label: string }[] = [
    { key: "apa", label: "APA" },
    { key: "mla", label: "MLA" },
    { key: "chicago", label: "Chicago" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12pt; color: #000; background: #fff; }
          a { color: #000 !important; text-decoration: underline !important; }
        }
      `}</style>

      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-4 md:py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[12px] text-[#8B8B8B] mb-4 no-print">
          <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">Home</Link>
          <span>/</span>
          <span className="text-[#555555] font-medium truncate max-w-[300px]">{paper.title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-[22px] md:text-[30px] lg:text-[34px] font-bold tracking-tight leading-[1.15] mb-2">
          {paper.title}
        </h1>

        {/* Authors */}
        {paper.authors.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[13px] text-[#555555] mb-3">
            {paper.authors.map((pa, i) => (
              <span key={pa.author.id}>
                {i > 0 && <span className="text-[#DCDCD7] mx-1">,</span>}
                <Link href={`/authors/${pa.author.slug}`} className="hover:text-[#F55036] transition-colors no-underline font-medium">
                  {pa.author.name}
                </Link>
              </span>
            ))}
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#8B8B8B] mb-6">
          {paper.publicationDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#BFBFBA]" />
              {formatDate(paper.publicationDate)}
            </span>
          )}
          {paper.submissionDate && paper.submissionDate !== paper.publicationDate && (
            <span className="flex items-center gap-1.5" title="Submitted">
              <Clock size={13} className="text-[#BFBFBA]" />
              Submitted {formatDate(paper.submissionDate)}
            </span>
          )}
          {paper.citationCount > 0 && (
            <span className="flex items-center gap-1.5" title="Citations">
              <Quote size={13} className="text-[#BFBFBA]" />
              {formatCompactNumber(paper.citationCount)} citations
            </span>
          )}
          {paper.githubStars != null && paper.githubStars > 0 && (
            <span className="flex items-center gap-1.5" title="GitHub Stars">
              <Star size={13} className="text-[#BFBFBA]" />
              {formatCompactNumber(paper.githubStars)} stars
            </span>
          )}
          {paper.githubForks != null && paper.githubForks > 0 && (
            <span className="flex items-center gap-1.5" title="GitHub Forks">
              <GitBranch size={13} className="text-[#BFBFBA]" />
              {formatCompactNumber(paper.githubForks)} forks
            </span>
          )}
          {paper.language && (
            <span className="flex items-center gap-1.5">
              <Tag size={13} className="text-[#BFBFBA]" />
              {paper.language}
            </span>
          )}
        </div>

        {/* Paper preview image */}
        {paper.thumbnailUrl && (
          <div className="mb-6 rounded-lg overflow-hidden border border-[#E5E5E0] bg-white">
            <img
              src={paper.thumbnailUrl}
              alt={`Preview of ${paper.title}`}
              className="w-full object-contain max-h-[400px]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10 items-start">
          {/* ===== LEFT COLUMN ===== */}
          <div className="min-w-0">
            {/* TL;DR */}
            {paper.tlDr && (
              <Section title="TL;DR">
                <p className="text-[14px] text-[#555555] leading-[1.7]">{paper.tlDr}</p>
              </Section>
            )}

            {/* Abstract */}
            {paper.abstract && (
              <Section title="Abstract">
                <div className="bg-white border border-[#E5E5E0] rounded-lg p-4 md:p-5">
                  <p className={`text-[14px] text-[#555555] leading-[1.8] ${abstractExpanded || !abstractTruncated ? "" : "line-clamp-4"}`}>
                    {paper.abstract}
                  </p>
                  {abstractTruncated && (
                    <button onClick={() => setAbstractExpanded(!abstractExpanded)} className="mt-2 text-[12px] text-[#F55036] hover:underline cursor-pointer">
                      {abstractExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </Section>
            )}

            {/* Short Title */}
            {paper.shortTitle && paper.shortTitle !== paper.title && (
              <Section title="Also known as">
                <p className="text-[14px] text-[#555555]">{paper.shortTitle}</p>
              </Section>
            )}

            {/* Conferences */}
            {paper.conferences.length > 0 && (
              <Section title="Venue">
                <div className="flex flex-wrap gap-2">
                  {paper.conferences.map((pc) => (
                    <ChipLink key={pc.conference.id} href={`/conferences/${pc.conference.slug}`}>
                      {pc.conference.name}
                    </ChipLink>
                  ))}
                </div>
              </Section>
            )}

            {/* Tasks */}
            {paper.tasks.length > 0 && (
              <Section title="Tasks">
                <div className="flex flex-wrap gap-2">
                  {paper.tasks.map((pt) => (
                    <ChipLink key={pt.task.id} href={`/tasks/${pt.task.slug}`}>
                      {pt.task.name}
                    </ChipLink>
                  ))}
                </div>
              </Section>
            )}

            {/* Methods */}
            {paper.methods.length > 0 && (
              <Section title="Methods">
                <div className="flex flex-wrap gap-2">
                  {paper.methods.map((pm) => (
                    <ChipLink key={pm.method.id} href={`/methods/${pm.method.slug}`}>
                      {pm.method.name}
                    </ChipLink>
                  ))}
                </div>
              </Section>
            )}

            {/* Models */}
            {paper.models.length > 0 && (
              <Section title="Models">
                <div className="flex flex-wrap gap-2">
                  {paper.models.map((pm) => (
                    <ChipLink key={pm.model.id} href={`/models/${pm.model.slug}`}>
                      {pm.model.name}
                    </ChipLink>
                  ))}
                </div>
              </Section>
            )}

            {/* Datasets */}
            {paper.datasets.length > 0 && (
              <Section title="Datasets">
                <div className="flex flex-wrap gap-2">
                  {paper.datasets.map((pd) => (
                    <ChipLink key={pd.dataset.id} href={`/datasets/${pd.dataset.slug}`}>
                      {pd.dataset.name}
                    </ChipLink>
                  ))}
                </div>
              </Section>
            )}

            {/* Rankings / SOTA */}
            {paper.rankings.length > 0 && (
              <Section title="Benchmark Rankings">
                <div className="space-y-1.5">
                  {paper.rankings.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 text-[13px] text-[#555555]">
                      <TrendingUp size={14} className="text-[#8B8B8B]" />
                      <span className="font-medium">#{r.rank}</span>
                      <span>on</span>
                      <span className="text-[#F55036] font-medium">{r.benchmark.name}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {paper.sotaClaims.length > 0 && (
              <Section title="State of the Art">
                <div className="space-y-1.5">
                  {paper.sotaClaims.map((sc) => (
                    <div key={sc.id} className="flex items-center gap-2 text-[13px] text-[#555555]">
                      <Award size={14} className="text-[#8B8B8B]" />
                      <span className="text-[#B48C52] font-semibold">SOTA</span>
                      <span>on</span>
                      <span className="text-[#F55036] font-medium">{sc.benchmark.name}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Related Papers */}
            {!relatedLoading && relatedPapers.length > 0 && (
              <Section title="Related Papers">
                <div className="space-y-2">
                  {relatedPapers.map((rp) => (
                    <Link key={rp.id} href={`/papers/${rp.slug}`} className="block no-underline group">
                      <div className="bg-white border border-[#E5E5E0] rounded-lg p-3 hover:border-[#F55036]/30 hover:shadow-sm transition-all duration-200">
                        <h3 className="text-[13px] font-semibold text-[#111111] group-hover:text-[#F55036] transition-colors line-clamp-2 mb-1">{rp.title}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-[#8B8B8B]">
                          <span>{rp.authorNames.slice(0, 3).join(", ")}{rp.authorNames.length > 3 ? " et al." : ""}</span>
                          <span>·</span>
                          <span>{rp.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="space-y-4 no-print lg:sticky lg:top-4">
            {/* Action Buttons */}
            <div className="bg-white border border-[#E5E5E0] rounded-lg p-4">
              <div className="space-y-1.5">
                <SidebarButton href={paper.pdfUrl} icon={<FileText size={14} />} label="PDF" primary />
                <SidebarButton href={arxivUrl} icon={<ExternalLink size={14} />} label="arXiv" />
                <SidebarButton href={doiUrl} icon={<Globe size={14} />} label="DOI" />
                <SidebarButton href={paper.githubUrl} icon={<GitBranch size={14} />} label="Code" />
                <SidebarButton href={paper.sourceUrl} icon={<ExternalLink size={14} />} label="Source" />
                <SidebarButton href={paper.projectUrl} icon={<ExternalLink size={14} />} label="Project Page" />
                {paper.paperUrl && !paper.pdfUrl && (
                  <SidebarButton href={paper.paperUrl} icon={<ExternalLink size={14} />} label="Publisher Page" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E5E0]">
                <button onClick={handleShare} className="flex-1 inline-flex items-center justify-center gap-1.5 ds-button-ghost text-[11px] px-2 py-1.5" aria-label="Share">
                  <Share2 size={12} /> Share
                </button>
                <button onClick={handleCopyLink} className="flex-1 inline-flex items-center justify-center gap-1.5 ds-button-ghost text-[11px] px-2 py-1.5" aria-label={copied ? "Link copied" : "Copy link"}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* GitHub Stats */}
            {(paper.githubStars != null && paper.githubStars > 0) || (paper.githubForks != null && paper.githubForks > 0) ? (
              <div className="bg-white border border-[#E5E5E0] rounded-lg p-4">
                <h3 className="text-[11px] font-bold tracking-tight mb-2 uppercase text-[#8B8B8B]">GitHub</h3>
                <div className="flex items-center gap-4">
                  {paper.githubStars != null && paper.githubStars > 0 && (
                    <span className="flex items-center gap-1.5 text-[13px] text-[#555555]">
                      <Star size={14} className="text-[#8B8B8B]" />
                      {formatCompactNumber(paper.githubStars)} stars
                    </span>
                  )}
                  {paper.githubForks != null && paper.githubForks > 0 && (
                    <span className="flex items-center gap-1.5 text-[13px] text-[#555555]">
                      <GitBranch size={14} className="text-[#8B8B8B]" />
                      {formatCompactNumber(paper.githubForks)} forks
                    </span>
                  )}
                </div>
              </div>
            ) : null}

            {/* Details */}
            <div className="bg-white border border-[#E5E5E0] rounded-lg p-4">
              <h3 className="text-[11px] font-bold tracking-tight mb-2 uppercase text-[#8B8B8B]">Details</h3>
              <div className="space-y-2.5 text-[12px]">
                {paper.doi && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="truncate text-[#111111]">
                      DOI:{" "}
                      <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#F55036] hover:underline">
                        {paper.doi}
                      </a>
                    </span>
                  </div>
                )}
                {paper.arxivId && (
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">
                      arXiv:{" "}
                      <a href={`https://arxiv.org/abs/${paper.arxivId}`} target="_blank" rel="noopener noreferrer" className="text-[#F55036] hover:underline">
                        {paper.arxivId}
                      </a>
                    </span>
                  </div>
                )}
                {paper.paperType && (
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">Type: {paper.paperType}</span>
                  </div>
                )}
                {paper.language && (
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{paper.language}</span>
                  </div>
                )}
                {paper.license && (
                  <div className="flex items-center gap-2">
                    <BookMarked size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{paper.license}</span>
                  </div>
                )}
                {paper.status && (
                  <div className="flex items-center gap-2">
                    <Hash size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{paper.status}</span>
                  </div>
                )}
                {paper.pageCount != null && (
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{paper.pageCount} pages</span>
                  </div>
                )}
                {paper.citationCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Quote size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{formatCompactNumber(paper.citationCount)} citations</span>
                  </div>
                )}
                {paper.referenceCount > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">{paper.referenceCount} references</span>
                  </div>
                )}
                {paper.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">Added {formatDateTime(paper.createdAt)}</span>
                  </div>
                )}
                {paper.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#8B8B8B] shrink-0" />
                    <span className="text-[#111111]">Updated {formatDateTime(paper.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Citation */}
            <div className="bg-white border border-[#E5E5E0] rounded-lg p-4">
              <h3 className="text-[11px] font-bold tracking-tight mb-2 uppercase text-[#8B8B8B]">Cite</h3>
              <div className="space-y-1.5">
                {citationFormats.map((fmt) => {
                  const isCopied = citationCopied === fmt.key;
                  return (
                    <button
                      key={fmt.key}
                      onClick={() => handleCopyCitation(fmt.key)}
                      className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px] text-[#555555] hover:text-[#F55036] hover:bg-[#F8F7F2] rounded-md transition-colors border border-[#E5E5E0]"
                    >
                      <span className="font-medium">{fmt.label}</span>
                      {isCopied ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="flex justify-start mt-6 pt-4 border-t border-[#E5E5E0] no-print">
          <Link href="/" className="inline-flex items-center gap-1.5 ds-button-ghost text-[12px] px-4 py-2 no-underline">
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
