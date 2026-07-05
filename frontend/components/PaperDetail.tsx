"use client";

import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Globe,
  FileText,
  Sparkles,
  Github,
  Trophy,
  ChevronDown,
  ChevronUp,
  Calendar,
  BookOpen,
  Quote,
  Star,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect, type ReactNode } from "react";
import type { PaperDetail as PaperDetailType, PaperRanking, PaperSotaClaim } from "@/lib/papers";
import { getPapers, type Paper } from "@/lib/paperApi";
import { atlasUiFont } from "@/lib/fonts";

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

function formatCompactNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

type CitationFormat = "bibtex" | "apa" | "mla" | "chicago";
type ChipVariant = "tasks" | "methods" | "models" | "datasets";

const CITATION_FORMATS: { key: CitationFormat; label: string }[] = [
  { key: "bibtex", label: "BibTeX" },
  { key: "apa", label: "APA" },
  { key: "mla", label: "MLA" },
  { key: "chicago", label: "Chicago" },
];

function parseGitHubRepo(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.replace("www.", "") !== "github.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch {
    // ignore
  }
  return null;
}


function generateCitation(paper: PaperDetailType, format: CitationFormat): string {
  const year = getCitationYear(paper.publicationDate);
  const authors = paper.authors.map((pa) => pa.author.name);
  const authorStr = authors.length > 0 ? authors.join(", ") : "Unknown Author";
  const title = paper.title;
  const doi = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const arxiv = paper.arxivId ? `arXiv:${paper.arxivId}` : null;
  const source = arxiv || "Online";
  const lastName = authors[0]?.split(/\s+/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "unknown";
  const citeKey = `${lastName}${year}`;

  switch (format) {
    case "bibtex": {
      const lines = [
        `@article{${citeKey},`,
        `  author = {${authorStr}},`,
        `  title = {${title}},`,
        `  year = {${year}},`,
      ];
      if (paper.arxivId) lines.push(`  eprint = {${paper.arxivId}},`, `  archivePrefix = {arXiv},`);
      if (paper.doi) lines.push(`  doi = {${paper.doi}},`);
      lines.push(`}`);
      return lines.join("\n");
    }
    case "apa":
      return `${authorStr} (${year}). ${title}. ${source}.${doi ? ` https://doi.org/${paper.doi}` : ""}`;
    case "mla":
      return `${authorStr}. "${title}." ${source}, ${year}.${doi ? ` doi:${paper.doi}.` : ""}`;
    case "chicago":
      return `${authorStr}. ${year}. "${title}." ${source}.${doi ? ` https://doi.org/${paper.doi}.` : ""}`;
  }
}

function Section({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#ECE7DD] pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold tracking-tight text-[#111111]">{title}</h2>
        {meta ? <div className="text-[11px] text-[#8B8B8B]">{meta}</div> : null}
      </div>
      {children}
    </section>
  );
}

function SidebarCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E5E0] bg-white shadow-[0_1px_3px_rgba(17,17,17,0.04)] transition-shadow duration-200 hover:shadow-[0_4px_18px_rgba(17,17,17,0.07)]">
      <div className="flex items-center gap-2.5 border-b border-[#EFECE6] bg-[#FBFBF9] px-5 py-3.5">
        {icon ? <span className="shrink-0 text-[#8B8B8B]">{icon}</span> : null}
        <h3 className="text-[11px] font-black uppercase tracking-[0.12em] text-[#555555]">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function MetadataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F2EEE6] py-3 last:border-b-0 last:pb-0 first:pt-0">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B8B]">{label}</span>
      <div className="min-w-0 text-right text-[13px] font-medium leading-snug text-[#111111] break-words">{value}</div>
    </div>
  );
}

function CitationPreview({ text, format }: { text: string; format: CitationFormat }) {
  if (format !== "bibtex") {
    return (
      <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-[1.75] text-[#484037]">
        {text}
      </pre>
    );
  }

  const lines = text.split("\n");
  return (
    <pre className="whitespace-pre-wrap break-words font-mono text-[11.5px] leading-[1.75]">
      {lines.map((line, index) => {
        const entryMatch = line.match(/^(@\w+\{)([^,]+)(,)?$/);
        const fieldMatch = line.match(/^(\s+)(\w+)(\s*=\s*)(\{.*\}),?$/);

        if (entryMatch) {
          return (
            <span key={index}>
              <span className="text-[#6B21A8]">{entryMatch[1]}</span>
              <span className="text-[#B45309]">{entryMatch[2]}</span>
              <span className="text-[#6B21A8]">{entryMatch[3] ?? ""}</span>
              {"\n"}
            </span>
          );
        }

        if (fieldMatch) {
          return (
            <span key={index}>
              {fieldMatch[1]}
              <span className="text-[#0369A1]">{fieldMatch[2]}</span>
              {fieldMatch[3]}
              <span className="text-[#047857]">{fieldMatch[4]}</span>
              {line.endsWith(",") ? "," : ""}
              {"\n"}
            </span>
          );
        }

        return (
          <span key={index} className="text-[#484037]">
            {line}
            {"\n"}
          </span>
        );
      })}
    </pre>
  );
}

function RepositoryPanel({ paper }: { paper: PaperDetailType }) {
  const repoName = parseGitHubRepo(paper.githubUrl);
  const hasRepo = !!paper.githubUrl;
  const hasStars = paper.githubStars != null && paper.githubStars > 0;
  const hasForks = paper.githubForks != null && paper.githubForks > 0;

  if (!hasRepo) {
    return (
      <SidebarCard title="Repository" icon={<Github size={14} />}>
        <div className="flex flex-col items-center rounded-xl border border-dashed border-[#E5E5E0] bg-[#FBFBF9] px-4 py-9 text-center">
          <Github size={22} className="mb-2.5 text-[#DCDCD7]" strokeWidth={1.5} />
          <p className="text-[13px] font-semibold text-[#555555]">No official repository available</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#8B8B8B]">
            A linked GitHub repository has not been added for this paper.
          </p>
        </div>
      </SidebarCard>
    );
  }

  return (
    <SidebarCard title="Repository" icon={<Github size={14} />}>
      <div className="space-y-4">
        <div className="rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] p-4 transition-colors hover:border-[#E5D5C8] hover:bg-[#FFF8F5]">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-mono text-[14px] font-bold text-[#111111]">
                {repoName ?? "GitHub Repository"}
              </p>
              {paper.isOfficialCode === true ? (
                <span className="mt-2 inline-flex items-center rounded-full border border-[#BAE6FD] bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#0369A1]">
                  Official
                </span>
              ) : null}
            </div>
            <Github size={18} className="shrink-0 text-[#111111]" />
          </div>

          {(hasStars || hasForks) && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-[#EFECE6] pt-3.5">
              {hasStars ? (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#444444]">
                  <Star size={13} className="text-[#F55036]" fill="#F55036" />
                  {formatCompactNumber(paper.githubStars!)}
                  <span className="font-medium text-[#8B8B8B]">stars</span>
                </span>
              ) : null}
              {hasForks ? (
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#444444]">
                  <GitBranch size={13} className="text-[#F55036]" />
                  {formatCompactNumber(paper.githubForks!)}
                  <span className="font-medium text-[#8B8B8B]">forks</span>
                </span>
              ) : null}
            </div>
          )}
        </div>

        {paper.isOfficialCode != null ? (
          <p className="text-[12px] font-medium text-[#6F665D]">
            {paper.isOfficialCode ? "Official implementation from the authors" : "Community-maintained repository"}
          </p>
        ) : null}

        <a
          href={paper.githubUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#E5E5E0] bg-white px-4 py-2.5 text-[13px] font-bold text-[#111111] no-underline transition-all hover:border-[#FF5A1F]/30 hover:bg-[#FFF7F3] hover:text-[#F55036]"
        >
          Open Repository
          <ExternalLink size={14} />
        </a>
      </div>
    </SidebarCard>
  );
}


function CitationPanel({
  paper,
  selectedFormat,
  onFormatChange,
  onCopy,
  copiedFormat,
}: {
  paper: PaperDetailType;
  selectedFormat: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
  onCopy: (format: CitationFormat) => void;
  copiedFormat: CitationFormat | null;
}) {
  const citationText = generateCitation(paper, selectedFormat);
  const isCopied = copiedFormat === selectedFormat;

  return (
    <SidebarCard title="Citation" icon={<Quote size={14} />}>
      <div className="space-y-4">
        <div className="flex rounded-lg border border-[#E5E5E0] bg-[#F8F7F2] p-1">
          {CITATION_FORMATS.map((fmt) => {
            const active = selectedFormat === fmt.key;
            return (
              <button
                key={fmt.key}
                type="button"
                onClick={() => onFormatChange(fmt.key)}
                className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] transition-all ${
                  active
                    ? "bg-white text-[#111111] shadow-sm"
                    : "text-[#8B8B8B] hover:text-[#555555]"
                }`}
              >
                {fmt.label}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-[#EAE6DE] bg-[#FCFBF8] p-4">
          <CitationPreview text={citationText} format={selectedFormat} />
        </div>

        <button
          type="button"
          onClick={() => onCopy(selectedFormat)}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
            isCopied
              ? "scale-[0.98] border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]"
              : "border-[#E5E5E0] bg-white text-[#111111] hover:border-[#FF5A1F]/30 hover:bg-[#FFF7F3] hover:text-[#F55036]"
          }`}
        >
          {isCopied ? (
            <>
              <Check size={15} className="animate-[pulse_0.4s_ease-in-out_1]" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={15} className="text-[#F55036]" />
              Copy citation
            </>
          )}
        </button>
      </div>
    </SidebarCard>
  );
}

function PaperMetadataPanel({
  paper,
  arxivUrl,
  doiUrl,
}: {
  paper: PaperDetailType;
  arxivUrl: string | null;
  doiUrl: string | null;
}) {
  const categoryLabels = paper.tasks.map((t) => t.task.name);
  const conferenceLabels = paper.conferences.map((c) => c.conference.name);

  const rows: { label: string; value: ReactNode }[] = [];

  if (paper.publicationDate) rows.push({ label: "Published", value: formatDate(paper.publicationDate) });
  if (paper.updatedAt) rows.push({ label: "Updated", value: formatDateTime(paper.updatedAt) });
  if (paper.doi) {
    rows.push({
      label: "DOI",
      value: doiUrl ? (
        <a href={doiUrl} target="_blank" rel="noopener noreferrer" className="text-[#4A7AA0] no-underline hover:text-[#F55036] hover:underline">
          {paper.doi}
        </a>
      ) : (
        paper.doi
      ),
    });
  }
  if (paper.arxivId) {
    rows.push({
      label: "arXiv",
      value: arxivUrl ? (
        <a href={arxivUrl} target="_blank" rel="noopener noreferrer" className="text-[#4A7AA0] no-underline hover:text-[#F55036] hover:underline">
          {paper.arxivId}
        </a>
      ) : (
        paper.arxivId
      ),
    });
  }
  if (paper.license) rows.push({ label: "License", value: paper.license });
  if (paper.discoverySource) rows.push({ label: "Source", value: paper.discoverySource });
  if (paper.referenceCount > 0) rows.push({ label: "References", value: formatCompactNumber(paper.referenceCount) });
  if (paper.citationCount > 0) rows.push({ label: "Citations", value: formatCompactNumber(paper.citationCount) });
  if (categoryLabels.length > 0) rows.push({ label: "Categories", value: categoryLabels.join(", ") });
  if (conferenceLabels.length > 0) rows.push({ label: "Conferences", value: conferenceLabels.join(", ") });
  if (paper.submissionDate && paper.submissionDate !== paper.publicationDate) {
    rows.push({ label: "Submitted", value: formatDate(paper.submissionDate) });
  }
  if (paper.paperType) rows.push({ label: "Type", value: paper.paperType });
  if (paper.status) rows.push({ label: "Status", value: paper.status });
  if (paper.language) rows.push({ label: "Language", value: paper.language });
  if (paper.pageCount != null) rows.push({ label: "Pages", value: paper.pageCount });

  if (rows.length === 0) return null;

  return (
    <SidebarCard title="Paper Details" icon={<BookOpen size={14} />}>
      <div>
        {rows.map((row) => (
          <MetadataRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </SidebarCard>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-[13.5px] text-[#555555]">
      <div className="shrink-0 text-[#8B8B8B]">{icon}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-bold text-[#111111]">{value}</span>
        <span className="text-[#8B8B8B] font-medium">{label}</span>
      </div>
    </div>
  );
}

function TrendingBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A1F]/10 px-3 py-1 text-[12px] font-bold text-[#FF5A1F]">
      <Sparkles size={13} className="fill-[#FF5A1F]" />
      <span>Trending</span>
    </div>
  );
}

function RankingHighlight({ rank, benchmarkName }: { rank: number; benchmarkName: string }) {
  return (
    <div className="flex items-center gap-2 text-[14px] font-semibold text-[#111111]">
      <span className="text-[#FF5A1F]">#{rank}</span>
      <span className="text-[#8B8B8B] font-medium">on</span>
      <span className="hover:text-[#FF5A1F] transition-colors cursor-pointer border-b border-transparent hover:border-[#FF5A1F]/30">{benchmarkName}</span>
    </div>
  );
}

function RankDisplay({ rank }: { rank: number }) {
  const isTopThree = rank <= 3;

  return (
    <div className="flex items-center gap-1.5">
      {rank === 1 ? <Trophy size={15} className="shrink-0 text-[#B48C52]" strokeWidth={2.25} /> : null}
      <span
        className={`tabular-nums tracking-tight ${
          rank === 1
            ? "text-[22px] font-black text-[#FF5A1F]"
            : rank === 2
              ? "text-[20px] font-black text-[#555555]"
              : rank === 3
                ? "text-[18px] font-bold text-[#6B6258]"
                : isTopThree
                  ? "text-[17px] font-bold text-[#111111]"
                  : "text-[15px] font-semibold text-[#444444]"
        }`}
      >
        #{rank}
      </span>
    </div>
  );
}

function RankDelta({ rank, previousRank }: { rank: number; previousRank: number | null }) {
  if (previousRank == null || previousRank === rank) return null;

  const improved = rank < previousRank;
  const delta = Math.abs(previousRank - rank);

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
        improved ? "bg-[#ECFDF5] text-[#047857]" : "bg-[#FEF2F2] text-[#B91C1C]"
      }`}
    >
      {improved ? "↑" : "↓"}
      {delta}
    </span>
  );
}

function BenchmarksSection({
  rankings,
  models,
  sotaClaims,
}: {
  rankings: PaperRanking[];
  models: PaperDetailType["models"];
  sotaClaims: PaperSotaClaim[];
}) {
  const sotaBenchmarkIds = new Set(sotaClaims.map((claim) => claim.benchmark_id));
  const sortedRankings = [...rankings].sort((a, b) => a.rank - b.rank);
  const modelName = models[0]?.model.name ?? null;
  const showRankDelta = sortedRankings.some((ranking) => ranking.previous_rank != null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#8B8B8B] flex min-w-0 flex-1 items-center gap-4">
          BENCHMARKS
          <div className="h-px flex-1 bg-[#E5E5E0]" />
        </h2>
        {sortedRankings.length > 0 ? (
          <span className="shrink-0 text-[11px] font-bold text-[#8B8B8B]">
            {sortedRankings.length} result{sortedRankings.length !== 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {sortedRankings.length > 0 ? (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-[#E5E5E0] bg-white shadow-[0_1px_3px_rgba(17,17,17,0.04)] md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#EDE8DF] bg-[#FBFBF9]">
                  <th className="w-[88px] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                    Rank
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                    Benchmark
                  </th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                    Model
                  </th>
                  {showRankDelta ? (
                    <th className="w-[88px] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                      Change
                    </th>
                  ) : null}
                  <th className="w-[108px] px-5 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-[#8B8B8B]">
                    Compare
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRankings.map((ranking) => {
                  const isSota = sotaBenchmarkIds.has(ranking.benchmark_id);

                  return (
                    <tr
                      key={ranking.id}
                      className="group border-b border-[#F2EEE6] last:border-b-0 transition-colors hover:bg-[#FFF8F5]"
                    >
                      <td className="px-5 py-4 align-middle">
                        <RankDisplay rank={ranking.rank} />
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="text-[14px] font-semibold leading-snug text-[#111111] transition-colors group-hover:text-[#4A7AA0]">
                            {ranking.benchmark.name}
                          </span>
                          {isSota ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#F0DECF] bg-[#FFF9F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#B48C52]">
                              <Trophy size={10} className="shrink-0" />
                              SOTA
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <span className="text-[13px] font-medium text-[#555555]">{modelName ?? "—"}</span>
                      </td>
                      {showRankDelta ? (
                        <td className="px-4 py-4 align-middle">
                          <RankDelta rank={ranking.rank} previousRank={ranking.previous_rank} />
                        </td>
                      ) : null}
                      <td className="px-5 py-4 text-right align-middle">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4A7AA0] opacity-70 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                          Compare
                          <span aria-hidden="true">→</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {sortedRankings.map((ranking) => {
              const isSota = sotaBenchmarkIds.has(ranking.benchmark_id);

              return (
                <div
                  key={ranking.id}
                  className="rounded-xl border border-[#E5E5E0] bg-white p-4 transition-colors active:bg-[#FFF8F5]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <RankDisplay rank={ranking.rank} />
                    {isSota ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#F0DECF] bg-[#FFF9F4] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#B48C52]">
                        <Trophy size={10} className="shrink-0" />
                        SOTA
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[15px] font-semibold leading-snug text-[#111111]">{ranking.benchmark.name}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#F2EEE6] pt-3">
                    <span className="text-[12px] text-[#8B8B8B]">
                      Model{" "}
                      <span className="font-semibold text-[#444444]">{modelName ?? "—"}</span>
                    </span>
                    <RankDelta rank={ranking.rank} previousRank={ranking.previous_rank} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {sotaClaims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-center gap-3 rounded-xl border border-[#F0DECF] bg-[#FFF9F4] px-4 py-3.5"
            >
              <Trophy size={16} className="shrink-0 text-[#B48C52]" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#B48C52]">SOTA claim</span>
                <p className="text-[14px] font-semibold text-[#111111]">{claim.benchmark.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaxonomyLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: ChipVariant;
}) {
  const tone = {
    tasks: "border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]",
    methods: "border-[#D8B4FE] bg-[#F3E8FF] text-[#6B21A8]",
    models: "border-[#E5E5E0] bg-white text-[#111111]",
    datasets: "border-[#BAE6FD] bg-[#E0F2FE] text-[#0369A1]",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[12px] font-medium no-underline transition-opacity hover:opacity-85 ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </Link>
  );
}

function HeroPreview({ paper, previewHref }: { paper: PaperDetailType; previewHref: string | null }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showThumbnail = !!paper.thumbnailUrl && !imageFailed;

  if (!showThumbnail && !previewHref) return null;

  return (
    <div className="relative group w-full md:w-[220px] lg:w-[260px] shrink-0">
      <a 
        href={previewHref || "#"} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`block overflow-hidden rounded-[24px] border border-[#E5E5E0] bg-white shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl ${!previewHref ? 'pointer-events-none' : ''}`}
      >
        {showThumbnail ? (
          <Image
            src={paper.thumbnailUrl!}
            alt={`Preview of ${paper.title}`}
            width={300}
            height={400}
            unoptimized
            className="aspect-[3/4] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex aspect-[3/4] items-center justify-center bg-[#FBFBF9] p-8 text-center text-[13px] font-medium text-[#8B8B8B]">
            Open paper preview
          </div>
        )}
      </a>
    </div>
  );
}

function RelatedPaperCard({ paper }: { paper: Paper }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showThumbnail = !!paper.thumbnail && !thumbnailFailed;

  // Format authors for compact display
  const displayAuthors = (() => {
    if (!paper.authors) return "";
    const list = paper.authors.split(",").map((a) => a.trim());
    if (list.length > 2) return `${list[0]}, ${list[1]} et al.`;
    return paper.authors;
  })();

  const hasCode = !!paper.githubUrl;
  const visibleTasks = (paper.tags || []).slice(0, 2);

  return (
    <Link
      href={`/papers/${paper.slug || paper.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E5E0] bg-white no-underline transition-all duration-200 hover:border-[#F2B7A7] hover:shadow-[0_4px_20px_rgba(245,80,54,0.08)] hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      {showThumbnail ? (
        <div className="relative overflow-hidden border-b border-[#F0EBE3] bg-[#FAFAF8]">
          <Image
            src={paper.thumbnail}
            alt={`Preview of ${paper.title}`}
            width={300}
            height={169}
            unoptimized
            className="aspect-[16/9] h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setThumbnailFailed(true)}
          />
          {/* Gradient overlay for readability */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
      ) : (
        /* Placeholder when no thumbnail */
        <div className="flex items-center justify-center border-b border-[#F0EBE3] bg-[#F8F7F4] h-[80px]">
          <FileText size={28} className="text-[#D5CFC7]" strokeWidth={1.2} />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        {/* Indicator badges */}
        {(hasCode || paper.conference) && (
          <div className="flex flex-wrap items-center gap-1">
            {paper.conference && paper.conference !== "" && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[9.5px] font-bold uppercase tracking-wide">
                {paper.conference}
              </span>
            )}
            {hasCode && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[3px] bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-[9.5px] font-bold">
                <Github size={8} />
                Code
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h4 className="text-[13.5px] font-semibold leading-[1.4] text-[#111111] transition-colors group-hover:text-[#F55036] line-clamp-3">
          {paper.title}
        </h4>

        {/* Authors */}
        {displayAuthors && (
          <p className="text-[11.5px] leading-snug text-[#6B7280] line-clamp-1">
            {displayAuthors}
          </p>
        )}

        {/* Tasks */}
        {visibleTasks.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {visibleTasks.map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[#F3E8FF] border border-[#D8B4FE] text-[#6B21A8] text-[10px] font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer: date + citations */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#F3F0EB]">
          {paper.date ? (
            <span className="text-[11px] text-[#9CA3AF]">{paper.date}</span>
          ) : (
            <span />
          )}
          {paper.citations > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-[#9CA3AF] font-medium">
              <Quote size={10} className="text-[#C0BDB8]" />
              {paper.citations >= 1000
                ? `${(paper.citations / 1000).toFixed(1)}k`
                : paper.citations}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PaperDetail({ paper }: { paper: PaperDetailType }) {
  const [citationCopied, setCitationCopied] = useState<CitationFormat | null>(null);
  const [selectedCitationFormat, setSelectedCitationFormat] = useState<CitationFormat>("bibtex");
  const [abstractExpanded, setAbstractExpanded] = useState(false);
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const arxivUrl = paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : null;
  const doiUrl = paper.doi ? `https://doi.org/${paper.doi}` : null;
  const previewHref =
    paper.pdfUrl || paper.paperUrl || arxivUrl || doiUrl || paper.sourceUrl || paper.projectUrl;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: paper.title, url: window.location.href });
      } catch {
        // user dismissed or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // ignore
    }
  }, [paper.title]);

  const handleCopyCitation = useCallback(
    async (format: CitationFormat) => {
      const text = generateCitation(paper, format);
      try {
        await navigator.clipboard.writeText(text);
        setCitationCopied(format);
        setTimeout(() => setCitationCopied(null), 2000);
      } catch {
        // ignore
      }
    },
    [paper]
  );

  useEffect(() => {
    async function loadRelated() {
      if (paper.tasks.length === 0) {
        setRelatedLoading(false);
        return;
      }

      try {
        const taskSlug = paper.tasks[0].task.slug;
        const result = await getPapers({ page: 1, task: taskSlug });
        setRelatedPapers(
          result.papers.filter((p) => String(p.id) !== String(paper.id)).slice(0, 4)
        );
      } catch {
        // ignore
      }

      setRelatedLoading(false);
    }

    loadRelated();
  }, [paper]);

  return (
    <div className={`${atlasUiFont.className} min-h-screen bg-[#F8F7F2] text-[#111111] tracking-tight selection:bg-[#FF5A1F]/20`}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 12pt; color: #000; background: #fff; }
          a { color: #000 !important; text-decoration: underline !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 md:px-12 lg:px-16 lg:py-6">
        {/* Breadcrumbs */}
        <nav className="no-print mb-6 lg:mb-10 flex items-center gap-2 text-[12.5px] font-semibold text-[#8B8B8B]" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-[#FF5A1F]">Trending</Link>
          <span className="text-[#DCDCD7] font-normal" aria-hidden="true">/</span>
          <span className="text-[#555555] truncate max-w-[200px] sm:max-w-none">
            {paper.arxivId ? `arXiv:${paper.arxivId}` : "Research"}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px] xl:gap-12">
          <main className="space-y-10 lg:space-y-12 min-w-0">
            {/* Header Section */}
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  {paper.trendingScore && paper.trendingScore > 0 ? <TrendingBadge /> : null}
                  {paper.arxivId && <span className="text-[13px] font-bold tracking-wider text-[#8B8B8B] uppercase">arXiv:{paper.arxivId}</span>}
                </div>

                <h1 className="text-[24px] font-black leading-[1.1] tracking-[-0.03em] text-[#111111] md:text-[32px] lg:text-[36px]">
                  {paper.title}
                </h1>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-relaxed text-[#555555]">
                    {paper.authors.slice(0, 8).map((pa, i) => (
                      <span key={pa.author.id} className="inline-flex items-center">
                        {i > 0 && <span className="mr-2 text-[#DCDCD7]">·</span>}
                        <Link href={`/authors/${pa.author.slug}`} className="font-semibold text-[#444444] hover:text-[#FF5A1F] hover:underline decoration-2 underline-offset-4">
                          {pa.author.name}
                        </Link>
                      </span>
                    ))}
                    {paper.authors.length > 8 && (
                      <span className="ml-2 font-bold text-[#FF5A1F]">+{paper.authors.length - 8} more</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E5E5E0] pt-5">
                    {paper.publicationDate && (
                      <InfoTile icon={<Calendar size={16} />} label="submitted" value={formatDate(paper.publicationDate)} />
                    )}
                    {paper.citationCount > 0 && (
                      <InfoTile icon={<Quote size={16} />} label="citations" value={paper.citationCount} />
                    )}
                    {paper.conferences.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {paper.conferences.map((c) => (
                          <span
                            key={c.conference_id}
                            className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[11px] font-bold uppercase tracking-wide"
                          >
                            {c.conference.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <a 
                    href={paper.pdfUrl || arxivUrl || "#"} 
                    className="ds-button h-11 px-6 gap-2 text-[14px]"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View PDF"
                  >
                    <FileText size={18} />
                    View PDF
                  </a>
                  {arxivUrl && (
                    <a 
                      href={arxivUrl}
                      className="ds-button-ghost h-11 px-6 gap-2 text-[14px] border-2"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open arXiv page"
                    >
                      <Globe size={18} />
                      arXiv page
                    </a>
                  )}
                  {paper.githubUrl && (
                    <a
                      href={paper.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ds-button-ghost h-11 px-6 gap-2 text-[14px] border-2"
                      aria-label="Open code repository"
                    >
                      <Github size={18} className="text-[#111111]" />
                      Code
                      {paper.githubStars ? (
                        <span className="ml-1 text-[#8B8B8B] font-bold">
                          {formatCompactNumber(paper.githubStars)}
                        </span>
                      ) : null}
                    </a>
                  )}
                  <div className="flex items-center gap-2 ml-auto lg:ml-0">
                    <button 
                      type="button"
                      onClick={() => handleCopyCitation("apa")}
                      className="ds-button-ghost h-11 w-11 p-0 border-2" 
                      title="Cite"
                      aria-label="Copy citation"
                    >
                      <Quote size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="ds-button-ghost h-11 w-11 p-0 border-2"
                      title="Share"
                      aria-label="Share this paper"
                    >
                      <Share2 size={18} />
                    </button>
                    <button type="button" className="ds-button-ghost h-11 w-11 p-0 border-2" title="Save" aria-label="Save paper">
                      <Star size={18} />
                    </button>
                  </div>
                </div>

                {/* Benchmark Highlights */}
                {paper.rankings && paper.rankings.length > 0 && (
                  <div className="flex flex-col gap-3 pt-4 border-l-4 border-[#FF5A1F]/20 pl-6">
                    {paper.rankings.slice(0, 3).map((ranking) => (
                      <RankingHighlight key={ranking.id} rank={ranking.rank} benchmarkName={ranking.benchmark.name} />
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden lg:block">
                <HeroPreview paper={paper} previewHref={previewHref} />
              </div>
            </div>

            {/* AI Summary Section */}
            {paper.tlDr && (
              <div className="ds-card-hero p-8 md:p-10 border-2 border-[#FF5A1F]/10 bg-white/80 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/30">
                      <Sparkles size={15} fill="currentColor" />
                    </div>
                    <span className="text-[15px] font-black uppercase tracking-widest text-[#111111]">TL;DR</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E0] bg-[#F8F7F2] px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8B8B8B]" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8B8B8B]">AI-GENERATED</span>
                  </div>
                </div>
                <p className="text-[17px] font-medium leading-[1.8] text-[#222222]">
                  {paper.tlDr}
                </p>
              </div>
            )}

            <div className="space-y-16 pt-6">
              {paper.abstract && (
                <div className="space-y-5">
                  <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#8B8B8B] flex items-center gap-4">
                    ABSTRACT
                    <div className="h-px flex-1 bg-[#E5E5E0]" />
                  </h2>
                  <div className="relative">
                    <p className={`text-[16px] leading-[1.9] text-[#444444] font-medium transition-all ${abstractExpanded ? "" : "line-clamp-[8]"}`}>
                      {paper.abstract}
                    </p>
                    {!abstractExpanded && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#F8F7F2] via-[#F8F7F2]/70 to-transparent" />
                    )}
                  </div>
                  <button
                    onClick={() => setAbstractExpanded((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#FF5A1F] hover:text-[#FF6C37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A1F]/40 rounded"
                    aria-expanded={abstractExpanded}
                    aria-label={abstractExpanded ? "Collapse abstract" : "Expand full abstract"}
                  >
                    {abstractExpanded ? (
                      <>
                        <ChevronUp size={15} />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={15} />
                        Read full abstract
                      </>
                    )}
                  </button>
                </div>
              )}

              {paper.tasks.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#8B8B8B] flex items-center gap-4">
                    TASKS
                    <div className="h-px flex-1 bg-[#E5E5E0]" />
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {paper.tasks.map((t) => (
                      <Link 
                        key={t.task.id} 
                        href={`/tasks/${t.task.slug}`}
                        className="ds-chip h-10 px-5 text-[14px] font-bold hover:bg-[#FF5A1F]/20 transition-all border-[#FF5A1F]/20"
                      >
                        {t.task.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {paper.methods.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-[#8B8B8B] flex items-center gap-4">
                    METHODS
                    <div className="h-px flex-1 bg-[#E5E5E0]" />
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {paper.methods.map((m) => (
                      <Link 
                        key={m.method.id} 
                        href={`/methods/${m.method.slug}`}
                        className="inline-flex h-10 items-center rounded-full border-2 border-[#E5E5E0] bg-white px-5 text-[14px] font-bold text-[#111111] transition-all hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
                      >
                        {m.method.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Preservation of existing Phase 2+ sections (Rankings, Results, etc.) */}
              {paper.models.length > 0 && (
                <Section title="Models">
                  <div className="flex flex-wrap gap-2">
                    {paper.models.map((item) => (
                      <TaxonomyLink
                        key={item.model.id}
                        href={`/models/${item.model.slug}`}
                        label={item.model.name}
                        variant="models"
                      />
                    ))}
                  </div>
                </Section>
              )}

              {paper.datasets.length > 0 && (
                <Section title="Datasets">
                  <div className="flex flex-wrap gap-2">
                    {paper.datasets.map((item) => (
                      <TaxonomyLink
                        key={item.dataset.id}
                        href={`/datasets/${item.dataset.slug}`}
                        label={item.dataset.name}
                        variant="datasets"
                      />
                    ))}
                  </div>
                </Section>
              )}

              {(paper.rankings.length > 0 || paper.sotaClaims.length > 0) && (
                <BenchmarksSection
                  rankings={paper.rankings}
                  models={paper.models}
                  sotaClaims={paper.sotaClaims}
                />
              )}

              {(relatedLoading || relatedPapers.length > 0) && (
                <Section
                  title="Related Papers"
                  meta={
                    !relatedLoading ? (
                      <span>{relatedPapers.length} paper{relatedPapers.length !== 1 ? "s" : ""}</span>
                    ) : undefined
                  }
                >
                  {relatedLoading ? (
                    /* Skeleton loading state */
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col overflow-hidden rounded-xl border border-[#E5E5E0] bg-white animate-pulse"
                        >
                          <div className="h-[80px] bg-[#F3F0EB]" />
                          <div className="p-3.5 space-y-2">
                            <div className="h-3.5 bg-[#EEEBE6] rounded w-full" />
                            <div className="h-3.5 bg-[#EEEBE6] rounded w-5/6" />
                            <div className="h-3 bg-[#F3F0EB] rounded w-1/2 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {relatedPapers.map((relatedPaper) => (
                        <RelatedPaperCard key={relatedPaper.slug || relatedPaper.id} paper={relatedPaper} />
                      ))}
                    </div>
                  )}
                </Section>
              )}
            </div>

            <div className="no-print mt-5 border-t border-[#E5E5E0] pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#555555] no-underline hover:text-[#FF5A1F] transition-colors"
                aria-label="Back to papers list"
              >
                <ArrowLeft size={14} />
                Back to papers
              </Link>
            </div>
          </main>

          <aside className="no-print space-y-4 xl:self-start xl:sticky xl:top-6" aria-label="Paper details sidebar">
            <RepositoryPanel paper={paper} />
            <CitationPanel
              paper={paper}
              selectedFormat={selectedCitationFormat}
              onFormatChange={setSelectedCitationFormat}
              onCopy={handleCopyCitation}
              copiedFormat={citationCopied}
            />
            <PaperMetadataPanel paper={paper} arxivUrl={arxivUrl} doiUrl={doiUrl} />
          </aside>
        </div>
      </div>
    </div>
  );
}
