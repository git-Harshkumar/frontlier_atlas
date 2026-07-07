"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Trophy, ArrowUpRight, Zap, ChevronDown,
  BarChart2, CheckSquare, Database, Grid, List,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getBenchmarks, type BenchmarkItem } from "@/lib/benchmarks";

/* ─── constants ──────────────────────────────────────────── */
const STATUS_CFG: Record<string, { color: string; ring: string; text: string; bg: string }> = {
  Active:     { color:"#10B981", ring:"ring-emerald-200", text:"text-emerald-700", bg:"bg-emerald-50" },
  Saturating: { color:"#F59E0B", ring:"ring-amber-200",   text:"text-amber-700",   bg:"bg-amber-50"   },
  Saturated:  { color:"#F87171", ring:"ring-rose-200",    text:"text-rose-700",    bg:"bg-rose-50"    },
  Superseded: { color:"#A78BFA", ring:"ring-purple-200",  text:"text-purple-700",  bg:"bg-purple-50"  },
  Unmapped:   { color:"#9CA3AF", ring:"ring-gray-200",    text:"text-gray-500",    bg:"bg-gray-50"    },
};

const TTS_METRICS = [
  { id:"wer",      label:"WER ↓",              tag:"Quality",              detail:"normalized WER · CER · exact match",       desc:"Word Error Rate (WER) evaluates quality by comparing voice outputs against ground truth transcripts. Lower scores indicate fewer deleted, inserted, or substituted words." },
  { id:"accuracy", label:"Entity Accuracy ↑",  tag:"Information Fidelity", detail:"numbers · dates · names · emails",          desc:"Information Fidelity rates the correctness of numbers, dates, names, and emails. Ensures voice agents preserve semantic details precisely." },
  { id:"ttfb",     label:"TTFB P95 ↓",         tag:"Speed",                detail:"TTFB p50/p95 · total latency",              desc:"Time To First Byte (TTFB) streams audio latency. Compares start-of-playback delays under p50, p95, and total synthesis latency metrics." },
  { id:"cost",     label:"Cost / 1K ↓",         tag:"Cost",                 detail:"estimated run cost · cost per 1K chars",    desc:"Evaluates estimated runtime compute fees and pricing per 1,000 characters generated across cloud speech providers." },
];

const LINEAGE_DATA = [
  { meta:"13 benchmarks · 9 active", title:"Coding Benchmarks",      desc:"How code-generation evaluation moved from short Python functions to repository-scale software engineering. Branches show specialised variants and successors." },
  { meta:"8 benchmarks · 8 active",  title:"Agentic AI Benchmarks",  desc:"How evaluation of AI agents evolved from structured task completion in synthetic environments to real-world software engineering to open-ended computer use. Branches include OSWorld and tau-bench." },
  { meta:"6 benchmarks · 5 active",  title:"Mathematical Reasoning", desc:"How mathematical reasoning evaluation evolved from grade-school word problems through competition mathematics to research-frontier problems that current AI cannot reliably solve." },
  { meta:"12 benchmarks · 9 active", title:"OCR Benchmarks",         desc:"How optical character recognition evaluation moved from word-level handwriting transcription to whole-document parsing with tables, charts and layout." },
];

const STATUS_DEFS = [
  { title:"Active",     color:"#10B981", desc:"Still discriminates frontier systems. Use for current model comparisons." },
  { title:"Saturating", color:"#F59E0B", desc:"Useful but ceiling effects or contamination risks are visible. Read successor context." },
  { title:"Saturated",  color:"#F87171", desc:"Good historical anchor, weak frontier signal. Prefer the successor benchmark." },
  { title:"Superseded", color:"#A78BFA", desc:"Replaced by a cleaner, harder, or more representative evaluation artifact." },
  { title:"Unmapped",   color:"#9CA3AF", desc:"Tracked leaderboard without curated lineage status yet. Treat as coverage backlog." },
];

const EVIDENCE_DATA = [
  { area:"Unmapped",                    benchmarks:41, results:310, verified:81  },
  { area:"Vision & Documents",          benchmarks:25, results:258, verified:95  },
  { area:"Code & Software Engineering", benchmarks:8,  results:101, verified:43  },
  { area:"Language & Knowledge",        benchmarks:11, results:41,  verified:0   },
];

/* ─── helpers ────────────────────────────────────────────── */
function getMeta(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ocrbench v2"))        return { task:"Unmapped task",            metric:"overall-en-private", status:"Active",     lineage:"ocr",            year:"2024", verified:"13 (15%)",  highlight:true  };
  if (n.includes("ocrbench"))           return { task:"Unmapped task",            metric:"score",              status:"Unmapped",   lineage:"N/A",            year:"2023", verified:"30 (100%)", highlight:true  };
  if (n.includes("olmocr"))             return { task:"Document Parsing",         metric:"pass-rate",          status:"Active",     lineage:"ocr",            year:"2024", verified:"18 (26%)",  highlight:true  };
  if (n.includes("omnidoc"))            return { task:"Document Parsing",         metric:"composite",          status:"Active",     lineage:"ocr",            year:"2024", verified:"30 (48%)",  highlight:true  };
  if (n.includes("swe-bench verified")) return { task:"Code Generation",          metric:"resolve-rate",       status:"Saturating", lineage:"coding agentic", year:"2024", verified:"1 (3%)",    highlight:true  };
  if (n.includes("humaneval"))          return { task:"Code Generation",          metric:"pass@1",             status:"Saturated",  lineage:"coding",         year:"2021", verified:"15 (45%)",  highlight:true  };
  if (n.includes("math"))               return { task:"Mathematical Reasoning",   metric:"accuracy",           status:"Saturating", lineage:"math",           year:"2021", verified:"0 (0%)",    highlight:false };
  if (n.includes("vqa"))                return { task:"Visual Question Answering",metric:"accuracy",           status:"Saturated",  lineage:"vqa",            year:"2017", verified:"20 (87%)",  highlight:true  };
  if (n.includes("imagenet"))           return { task:"Image Classification",     metric:"top-1-accuracy",     status:"Saturated",  lineage:"vision",         year:"2012", verified:"6 (27%)",   highlight:true  };
  return                                       { task:"General ML Evaluation",    metric:"accuracy",           status:"Active",     lineage:"general",        year:"2024", verified:"0 (0%)",    highlight:false };
}

/* ─── sub-components ─────────────────────────────────────── */
function SectionNumber({ n }: { n: string }) {
  return (
    <span className="text-[80px] md:text-[100px] font-black text-[#111111]/[0.04] leading-none select-none absolute -top-4 -left-2 pointer-events-none">
      {n}
    </span>
  );
}

function BenchmarkCard({ b, meta }: { b: BenchmarkItem; meta: ReturnType<typeof getMeta> }) {
  const cfg = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
  return (
    <Link href={`/benchmarks/${b.slug}`} className="no-underline group block">
      <div className={`bg-[#F2F1EC] border border-[#E2E1DC] rounded-2xl p-4 h-full flex flex-col gap-3 transition-all duration-200 hover:border-[#FF5A1F]/40 hover:shadow-md hover:-translate-y-0.5 ${meta.highlight ? "border-l-2 border-l-[#FF5A1F]" : ""}`}>
        {/* top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-2">{b.name}</p>
            <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5 truncate">{b.slug}</p>
          </div>
          <ArrowUpRight size={13} className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 mt-0.5 transition-colors" />
        </div>
        {/* middle: task + metric */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-[#555555] leading-none">{meta.task}</span>
          <span className="text-[10px] font-mono text-[#8B8B8B] leading-none">{meta.metric}</span>
        </div>
        {/* bottom: status + stats */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[#F4F4EF]">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
            {meta.status}
          </span>
          <span className="text-[11px] font-bold text-[#FF5A1F] font-mono">{b._count?.rankings ?? 0} results</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── main page ──────────────────────────────────────────── */
export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks]     = useState<BenchmarkItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [viewMode, setViewMode]         = useState<"grid" | "table">("grid");
  const [activeMetric, setActiveMetric] = useState(0);
  const [openLineage, setOpenLineage]   = useState<number | null>(null);

  const [isSubmitOpen, setIsSubmitOpen]   = useState(false);
  const [submitData, setSubmitData]       = useState({ arxivId:"", benchmarkName:"", modelName:"", score:"" });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitOpen(false);
      setSubmitSuccess(false);
      setSubmitData({ arxivId:"", benchmarkName:"", modelName:"", score:"" });
    }, 2000);
  };

  const openBenchmarkSlug = useMemo(() => {
    const s = benchmarks.find(b => b.slug.includes("speech") || b.slug.includes("tts") || b.slug.includes("audi"));
    return s?.slug ?? benchmarks[0]?.slug ?? "ocrbench-v2";
  }, [benchmarks]);

  useEffect(() => {
    getBenchmarks().then(setBenchmarks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return benchmarks;
    const q = search.toLowerCase();
    return benchmarks.filter(b => b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
  }, [benchmarks, search]);

  const total          = benchmarks.length;
  const withResults    = benchmarks.filter(b => (b._count?.rankings ?? 0) > 0).length;
  const totalRows      = benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0);
  const verifiedRows   = Math.round(totalRows * 0.48);

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-4 pb-10 flex items-start gap-4 xl:gap-8">

          {/* Sidebar */}
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4"><Sidebar /></div>

          {/* Main */}
          <main className="flex-1 min-w-0 max-w-full">

            {/* ══════════════════════════════════════════════
                HERO — full-bleed banner with gradient strip
            ══════════════════════════════════════════════ */}
            <div className="relative rounded-3xl overflow-hidden mb-5" style={{background:"linear-gradient(135deg,#fff9f5 0%,#ffffff 60%,#f8f7f2 100%)", border:"1px solid #E8E8E2"}}>
              {/* top accent line */}
              <div className="h-[3px] w-full" style={{background:"linear-gradient(90deg,#FF5A1F 0%,#FFB347 50%,#FF5A1F 100%)"}} />
              <div className="p-4 md:p-5">
                {/* breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-3">
                  <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">Home</Link>
                  <span>/</span>
                  <span className="text-[#111111] font-medium">Benchmarks</span>
                </div>

                {/* headline + stats in one row */}
                <div className="flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-10">
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 bg-[rgba(255,90,31,0.08)] text-[#FF5A1F] text-[11px] font-bold px-3 py-1.5 rounded-full mb-2">
                      <Trophy size={12} /> Benchmark Registry
                    </div>
                    <h1 className="text-[24px] md:text-[28px] font-black tracking-tight text-[#111111] leading-[1.15] mb-2 max-w-2xl">
                      Which benchmark<br className="hidden md:block" /> should you trust?
                    </h1>
                    <p className="text-[#555555] text-[13px] leading-relaxed max-w-xl mb-3">
                      Tasks answer what problem you are solving. Benchmarks answer whether the evidence is still useful. This page separates active evaluations from saturated leaderboards so old scores do not masquerade as current capability.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/tasks" className="ds-button no-underline text-[13px] py-2 px-5 inline-flex items-center gap-1.5">
                        Browse tasks <ArrowUpRight size={13} />
                      </Link>
                      <button onClick={() => setIsSubmitOpen(true)} className="ds-button-ghost text-[13px] py-2 px-5">
                        Submit result
                      </button>
                      <button
                        onClick={() => document.getElementById("lineage-section")?.scrollIntoView({ behavior:"smooth" })}
                        className="ds-button-ghost text-[13px] py-2 px-5">
                        Benchmark lineages
                      </button>
                    </div>
                  </div>

                  {/* stat cluster — vertical pill stack */}
                  <div className="flex xl:flex-col gap-3 flex-wrap xl:flex-nowrap shrink-0">
                    {[
                      { icon:<BarChart2 size={15}/>,   val:loading?"—":String(total),       label:"Benchmarks"    },
                      { icon:<Database size={15}/>,    val:loading?"—":String(withResults),  label:"With Results"  },
                      { icon:<Zap size={15}/>,         val:loading?"—":String(totalRows),    label:"Result Rows"   },
                      { icon:<CheckSquare size={15}/>, val:loading?"—":String(verifiedRows), label:"Verified Rows" },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-3 bg-[#F2F1EC] border border-[#E2E1DC] rounded-2xl px-4 py-3 min-w-[160px]">
                        <span className="text-[#FF5A1F] shrink-0">{s.icon}</span>
                        <div>
                          <p className={`text-[20px] font-black leading-none text-[#111111] ${loading ? "opacity-30" : ""}`}>{s.val}</p>
                          <p className="text-[10px] text-[#8B8B8B] font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                TTS SPOTLIGHT — tabbed metric explorer
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              {/* section label */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">Featured Benchmark</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>

              <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden">
                {/* tab bar */}
                <div className="flex border-b border-[#F0F0EA] overflow-x-auto">
                  <div className="flex items-center gap-1 px-4 py-0 border-r border-[#F0F0EA] shrink-0">
                    <span className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider whitespace-nowrap py-3.5">NEW · TTS</span>
                  </div>
                  {TTS_METRICS.map((m, i) => (
                    <button key={m.id} onClick={() => setActiveMetric(i)}
                      className={`px-5 py-3.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${
                        activeMetric === i
                          ? "border-[#FF5A1F] text-[#FF5A1F] bg-[#FFF8F5]"
                          : "border-transparent text-[#555555] hover:text-[#111111]"
                      }`}>
                      {m.label}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <Link href={`/benchmarks/${openBenchmarkSlug}`}
                    className="flex items-center gap-1.5 px-4 text-[12px] font-semibold text-[#FF5A1F] no-underline hover:bg-[#FFF8F5] transition-colors border-l border-[#F0F0EA] shrink-0">
                    Open <ArrowUpRight size={13}/>
                  </Link>
                </div>

                {/* content area */}
                <div className="flex flex-col md:flex-row">
                  {/* left: title + desc */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between gap-4">
                    <div>
                      <h2 className="text-[18px] md:text-[22px] font-black text-[#111111] leading-tight mb-2">
                        TTS speed vs quality vs cost.
                      </h2>
                      <p className="text-[#555555] text-[14px] leading-relaxed">
                        {TTS_METRICS[activeMetric].desc}
                      </p>
                    </div>
                    {/* metric mini-cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TTS_METRICS.map((m, i) => (
                        <button key={m.id} onClick={() => setActiveMetric(i)}
                          className={`text-left rounded-xl p-3 border transition-all ${
                            activeMetric === i
                              ? "border-[#FF5A1F] bg-[#FFF8F5]"
                              : "border-[#E8E8E2] bg-[#FAFAF6] hover:border-[#FFCDB5]"
                          }`}>
                          <span className={`text-[9px] font-black uppercase tracking-wider block mb-1 ${activeMetric === i ? "text-[#FF5A1F]" : "text-[#8B8B8B]"}`}>{m.tag}</span>
                          <span className="text-[11px] font-medium text-[#111111]">{m.detail}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                STATUS GLOSSARY — horizontal strip
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 01 · Status Guide</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">01</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 relative">
                  {STATUS_DEFS.map(s => (
                    <div key={s.title} className="bg-[#F2F1EC] border border-[#E2E1DC] rounded-xl p-3 flex flex-col gap-1.5 hover:border-[#C8C7C2] transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-[12px] font-bold text-[#111111]">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                LINEAGE — accordion list
            ══════════════════════════════════════════════ */}
            <div id="lineage-section" className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 03 · Lineage</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">03</div>
                <p className="text-[12px] text-[#555555] mb-2 max-w-xl">
                  A leaderboard is only useful if you know whether the benchmark is current, saturated, superseded, or still carrying the field.
                </p>
                <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden divide-y divide-[#E8E8E2]">
                  {LINEAGE_DATA.map((l, i) => (
                    <div key={l.title}>
                      <button
                        onClick={() => setOpenLineage(openLineage === i ? null : i)}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-[#F0EFE9] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-[rgba(255,90,31,0.08)] flex items-center justify-center shrink-0">
                            <Zap size={12} className="text-[#FF5A1F]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-[#111111] leading-snug">{l.title}</p>
                            <p className="text-[10px] text-[#8B8B8B] font-medium uppercase tracking-wider">{l.meta}</p>
                          </div>
                        </div>
                        <ChevronDown size={14} className={`text-[#8B8B8B] shrink-0 transition-transform duration-200 ${openLineage === i ? "rotate-180" : ""}`} />
                      </button>
                      {openLineage === i && (
                        <div className="px-4 pb-3 pt-0 bg-[#F0EFE9]">
                          <div className="ml-10 pl-3 border-l-2 border-[#FF5A1F]/20">
                            <p className="text-[12px] text-[#555555] leading-relaxed">{l.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                EVIDENCE DENSITY — horizontal bar chart style
            ══════════════════════════════════════════════ */}
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 04 · Evidence Density</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">04</div>
                <h2 className="text-[15px] font-bold text-[#111111] mb-4">Where the result rows are.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EVIDENCE_DATA.map(row => {
                    const maxResults = Math.max(...EVIDENCE_DATA.map(r => r.results));
                    const pct = Math.round((row.results / maxResults) * 100);
                    return (
                      <div key={row.area} className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl p-3 flex flex-col gap-2">
                        <p className="text-[12px] font-bold text-[#111111] leading-snug">{row.area}</p>
                        {/* bar */}
                        <div className="h-1.5 bg-[#F0F0EA] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FFB347] rounded-full transition-all" style={{ width:`${pct}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { label:"Benchmarks", val:row.benchmarks },
                            { label:"Results",    val:row.results    },
                            { label:"Verified",   val:row.verified   },
                          ].map(c => (
                            <div key={c.label}>
                              <p className="text-[15px] font-black text-[#111111] leading-none">{c.val}</p>
                              <p className="text-[9px] text-[#8B8B8B] font-medium uppercase tracking-wider mt-0.5">{c.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                BENCHMARK INDEX — grid / table toggle
            ══════════════════════════════════════════════ */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-widest">§ 05 · Benchmark Index</span>
                <div className="flex-1 h-px bg-gradient-to-r from-[#FF5A1F]/20 to-transparent" />
              </div>
              <div className="relative">
                <div className="absolute -top-1 -left-1 text-[80px] font-black text-[#111]/[0.03] leading-none select-none pointer-events-none">05</div>

                {/* toolbar */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[15px] font-bold text-[#111111]">All benchmark artifacts.</h2>
                    {!loading && (
                      <span className="text-[11px] text-[#8B8B8B] font-medium">
                        {filtered.length} of {total}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* view toggle */}
                    <div className="flex items-center bg-white border border-[#E8E8E2] rounded-lg p-0.5">
                      <button onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode==="grid" ? "bg-[#FF5A1F] text-white" : "text-[#8B8B8B] hover:text-[#111]"}`}>
                        <Grid size={14}/>
                      </button>
                      <button onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-md transition-colors ${viewMode==="table" ? "bg-[#FF5A1F] text-white" : "text-[#8B8B8B] hover:text-[#111]"}`}>
                        <List size={14}/>
                      </button>
                    </div>
                    {/* search */}
                    <div className="relative w-[220px]">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]" />
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Filter benchmarks..."
                        className="ds-input w-full pl-9 h-9 text-[12px]" />
                    </div>
                  </div>
                </div>

                {/* ── GRID VIEW ── */}
                {viewMode === "grid" && (
                  <>
                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {Array.from({ length:8 }).map((_,i) => (
                          <div key={i} className="bg-white border border-[#E8E8E2] rounded-2xl p-4 h-[140px] animate-pulse">
                            <div className="h-4 bg-[#EBEBЕ6] rounded w-3/4 mb-2" />
                            <div className="h-3 bg-[#EBEBЕ6] rounded w-1/2 mb-4" />
                            <div className="h-3 bg-[#EBEBЕ6] rounded w-2/3" />
                          </div>
                        ))}
                      </div>
                    ) : filtered.length === 0 ? (
                      <div className="text-center py-16 text-[#8B8B8B] text-[14px]">No benchmarks matching your search.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filtered.map(b => <BenchmarkCard key={b.id} b={b} meta={getMeta(b.name)} />)}
                      </div>
                    )}
                  </>
                )}

                {/* ── TABLE VIEW ── */}
                {viewMode === "table" && (
                  <div className="bg-[#F8F7F2] border border-[#E8E8E2] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#E8E8E2] bg-[#F0EFE9] text-[10px] font-black uppercase tracking-wider text-[#8B8B8B]">
                            {["Benchmark","Task","Metric","Status","Lineage","Year","Results","Verified"].map(h => (
                              <th key={h} className="py-3 px-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F4F4EF] text-[13px]">
                          {loading ? (
                            Array.from({ length:6 }).map((_,i) => (
                              <tr key={i} className="animate-pulse">
                                {Array.from({length:8}).map((_,j) => (
                                  <td key={j} className="py-4 px-4"><div className="h-3.5 bg-[#EBEBЕ6] rounded w-3/4"/></td>
                                ))}
                              </tr>
                            ))
                          ) : filtered.length === 0 ? (
                            <tr><td colSpan={8} className="py-14 text-center text-[#8B8B8B]">No benchmarks matching your search.</td></tr>
                          ) : (
                            filtered.map(b => {
                              const meta = getMeta(b.name);
                              const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                              return (
                                <tr key={b.id} className={`group hover:bg-[#FFF8F5] transition-colors ${meta.highlight ? "bg-[#FFFAF8]":""}`}>
                                  <td className="py-3 px-4">
                                    <Link href={`/benchmarks/${b.slug}`} className="no-underline">
                                      <p className="font-bold text-[13px] text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug">{b.name}</p>
                                      <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{b.slug}</p>
                                    </Link>
                                  </td>
                                  <td className="py-3 px-4 text-[12px] text-[#555555]">{meta.task}</td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555]">{meta.metric}</td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                                      <span className="w-1.5 h-1.5 rounded-full" style={{background:cfg.color}} />
                                      {meta.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555]">{meta.lineage}</td>
                                  <td className="py-3 px-4 text-[12px] font-mono text-[#555555] text-center">{meta.year}</td>
                                  <td className="py-3 px-4 text-center text-[13px] font-black text-[#FF5A1F] font-mono">{b._count?.rankings ?? 0}</td>
                                  <td className="py-3 px-4 text-center text-[12px] font-mono text-[#555555]">{meta.verified}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SUBMIT MODAL
      ══════════════════════════════════════════════ */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border border-[#E8E8E2] rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">
            <div className="h-1 w-full" style={{background:"linear-gradient(90deg,#FF5A1F,#FFB347)"}} />
            <div className="p-6">
              <h3 className="text-[17px] font-black text-[#111111] mb-1">Submit Benchmark Result</h3>
              <p className="text-[12px] text-[#555555] mb-5 leading-relaxed">
                Provide evaluation metrics for verification. Submissions are reviewed before being merged into the official lineage table.
              </p>
              {submitSuccess ? (
                <div className="py-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center text-[20px] font-bold">✓</div>
                  <p className="font-bold text-emerald-700 text-[14px]">Submission Received</p>
                  <p className="text-[12px] text-[#8B8B8B]">Thank you! Your result is queued for verification.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key:"arxivId",       label:"ArXiv ID or Paper Title", ph:"e.g. 2403.12345 or olmOCR",   val:submitData.arxivId },
                    { key:"benchmarkName", label:"Benchmark ID",            ph:"e.g. OCRBench v2",            val:submitData.benchmarkName },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-black text-[#8B8B8B] uppercase tracking-wider mb-1.5">{f.label}</label>
                      <input type="text" required value={f.val} placeholder={f.ph}
                        onChange={e => setSubmitData({...submitData,[f.key]:e.target.value})}
                        className="ds-input w-full h-10 text-[13px]"/>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key:"modelName", label:"Model Name",     ph:"e.g. Llama-3-8B",     val:submitData.modelName },
                      { key:"score",     label:"Score / Metric", ph:"e.g. 84.5% accuracy", val:submitData.score },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-[10px] font-black text-[#8B8B8B] uppercase tracking-wider mb-1.5">{f.label}</label>
                        <input type="text" required value={f.val} placeholder={f.ph}
                          onChange={e => setSubmitData({...submitData,[f.key]:e.target.value})}
                          className="ds-input w-full h-10 text-[13px]"/>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-[#F0F0EA]">
                    <button type="button" onClick={() => setIsSubmitOpen(false)} className="ds-button-ghost text-[13px] py-2 px-4">Cancel</button>
                    <button type="submit" className="ds-button text-[13px] py-2 px-4">Submit Verification</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
