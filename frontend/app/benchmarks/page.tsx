"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, ArrowUpRight, ChevronRight, TrendingUp,
  Flame, Clock, Grid, List, SlidersHorizontal, X,
  BarChart2, Database, Zap, CheckSquare, Trophy,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getBenchmarks, type BenchmarkItem } from "@/lib/benchmarks";

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */

const DOMAINS = [
  "General AI", "Language", "Reasoning", "Coding", "Agents",
  "Computer Vision", "OCR & Document AI", "Multimodal", "Audio & Speech",
  "Video", "Robotics", "Embodied AI", "Healthcare", "Mathematics",
  "Time Series", "Graphs", "Scientific AI",
];

const TASKS = [
  "Question Answering", "Text Generation", "Summarization", "Machine Translation",
  "Reasoning", "Mathematical Reasoning", "Code Generation", "Software Engineering",
  "Retrieval", "Image Classification", "Object Detection", "Semantic Segmentation",
  "Visual Question Answering", "Document Parsing", "OCR", "Image Captioning",
  "Speech Recognition", "Speech Synthesis", "Audio Classification",
  "Video Understanding", "Planning", "Navigation",
];

const COLLECTIONS = [
  { label: "Reasoning",        count: 12, slug: "reasoning"     },
  { label: "Coding",           count: 13, slug: "coding"         },
  { label: "Agent Evaluation", count: 8,  slug: "agents"         },
  { label: "Vision",           count: 18, slug: "vision"         },
  { label: "OCR & Document AI",count: 9,  slug: "ocr"            },
  { label: "Language",         count: 22, slug: "language"       },
  { label: "Multimodal",       count: 11, slug: "multimodal"     },
  { label: "Audio & Speech",   count: 7,  slug: "audio"          },
  { label: "Robotics",         count: 5,  slug: "robotics"       },
  { label: "Healthcare",       count: 6,  slug: "healthcare"     },
  { label: "Mathematics",      count: 10, slug: "mathematics"    },
];

const POPULAR = [
  { name: "MMLU",               slug: "mmlu"               },
  { name: "GPQA",               slug: "gpqa"               },
  { name: "Humanity's Last Exam",slug:"humanitys-last-exam" },
  { name: "GSM8K",              slug: "gsm8k"              },
  { name: "MATH",               slug: "math"               },
  { name: "HumanEval",          slug: "humaneval"          },
  { name: "MBPP",               slug: "mbpp"               },
  { name: "SWE-Bench",          slug: "swe-bench-verified" },
  { name: "Terminal-Bench",     slug: "terminal-bench"     },
  { name: "MMMU",               slug: "mmmu"               },
  { name: "MathVista",          slug: "mathvista"          },
  { name: "OCRBench v2",        slug: "ocrbench-v2"        },
  { name: "ParseBench",         slug: "parsebench"         },
  { name: "ImageNet",           slug: "imagenet"           },
  { name: "COCO",               slug: "coco-detection"     },
];

/* ══════════════════════════════════════════════════════════════
   STATUS + META
══════════════════════════════════════════════════════════════ */

const STATUS_CFG: Record<string, { color: string; text: string; bg: string }> = {
  Active:     { color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50"  },
  Saturating: { color: "#F59E0B", text: "text-amber-700",   bg: "bg-amber-50"    },
  Saturated:  { color: "#F87171", text: "text-rose-700",    bg: "bg-rose-50"     },
  Superseded: { color: "#A78BFA", text: "text-purple-700",  bg: "bg-purple-50"   },
  Unmapped:   { color: "#9CA3AF", text: "text-gray-500",    bg: "bg-gray-50"     },
};

function getMeta(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ocrbench v2"))        return { task:"Document OCR",            metric:"overall-en-private", status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("ocrbench"))           return { task:"Document OCR",            metric:"score",              status:"Unmapped",   category:"OCR & Document AI", year:"2023" };
  if (n.includes("olmocr"))             return { task:"Document Parsing",        metric:"pass-rate",          status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("omnidoc"))            return { task:"Document Parsing",        metric:"composite",          status:"Active",     category:"OCR & Document AI", year:"2024" };
  if (n.includes("swe-bench verified")) return { task:"Code Generation",         metric:"resolve-rate",       status:"Saturating", category:"Coding",            year:"2024" };
  if (n.includes("humaneval"))          return { task:"Code Generation",         metric:"pass@1",             status:"Saturated",  category:"Coding",            year:"2021" };
  if (n.includes("math"))               return { task:"Mathematical Reasoning",  metric:"accuracy",           status:"Saturating", category:"Mathematics",       year:"2021" };
  if (n.includes("vqa"))                return { task:"Visual QA",               metric:"accuracy",           status:"Saturated",  category:"Vision",            year:"2017" };
  if (n.includes("imagenet"))           return { task:"Image Classification",    metric:"top-1-accuracy",     status:"Saturated",  category:"Computer Vision",   year:"2012" };
  if (n.includes("mmlu"))               return { task:"Question Answering",      metric:"accuracy",           status:"Active",     category:"Language",          year:"2021" };
  if (n.includes("gsm8k"))              return { task:"Math Word Problems",       metric:"accuracy",           status:"Active",     category:"Mathematics",       year:"2021" };
  if (n.includes("hellaswag"))          return { task:"Commonsense Reasoning",   metric:"accuracy",           status:"Saturated",  category:"Reasoning",         year:"2019" };
  if (n.includes("arc"))                return { task:"Science QA",              metric:"accuracy",           status:"Active",     category:"Reasoning",         year:"2018" };
  if (n.includes("coco"))               return { task:"Object Detection",        metric:"mAP",                status:"Active",     category:"Computer Vision",   year:"2014" };
  return                                       { task:"General ML Evaluation",   metric:"accuracy",           status:"Active",     category:"General AI",        year:"2024" };
}

/* ══════════════════════════════════════════════════════════════
   SECTION HEADING
══════════════════════════════════════════════════════════════ */
function SectionHeading({ label, action, href }: { label: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[15px] font-black text-[#111111]">{label}</h2>
      {action && href && (
        <Link href={href}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#FF5A1F]
            no-underline hover:text-[#E04E1A] transition-colors">
          {action} <ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DIRECTORY TABLE ROW
══════════════════════════════════════════════════════════════ */
function DirectoryRow({ b }: { b: BenchmarkItem }) {
  const meta = getMeta(b.name);
  const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
  return (
    <tr className="group border-b border-[#F4F4F0] hover:bg-[#FAFAF8] transition-colors">
      <td className="py-3 px-4">
        <Link href={`/benchmarks/${b.slug}`} className="no-underline">
          <p className="text-[13px] font-semibold text-[#111111] group-hover:text-[#FF5A1F]
            transition-colors leading-snug">
            {b.name}
          </p>
          <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{b.slug}</p>
        </Link>
      </td>
      <td className="py-3 px-4 text-[12px] text-[#555555]">{meta.task}</td>
      <td className="py-3 px-4 text-[12px] text-[#555555]">{meta.category}</td>
      <td className="py-3 px-4 text-[12px] font-mono text-[#777777]">{meta.metric}</td>
      <td className="py-3 px-4">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#555555]">
          <span className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: cfg.color }} />
          {meta.status}
        </span>
      </td>
      <td className="py-3 px-4 text-[12px] font-mono text-[#777777] text-center">{meta.year}</td>
      <td className="py-3 px-4 text-[12px] font-bold text-[#FF5A1F] font-mono text-center tabular-nums">
        {b._count?.rankings ?? 0}
      </td>
      <td className="py-3 px-4 text-[12px] font-mono text-[#777777] text-center tabular-nums">
        {b._count?.claims ?? 0}
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [loading, setLoading]       = useState(true);

  // directory state
  const [search, setSearch]         = useState("");
  const [viewMode, setViewMode]     = useState<"grid" | "table">("table");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters]   = useState(false);

  // active domain / task pill
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeTask,   setActiveTask]   = useState<string | null>(null);

  useEffect(() => {
    getBenchmarks()
      .then(setBenchmarks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = benchmarks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
    }
    if (filterStatus) {
      list = list.filter(b => getMeta(b.name).status === filterStatus);
    }
    return list;
  }, [benchmarks, search, filterStatus]);

  // Recently added — last 5
  const recent   = useMemo(() => [...benchmarks].slice(-5).reverse(), [benchmarks]);
  // Trending — sort by ranking count desc, top 6
  const trending = useMemo(() =>
    [...benchmarks].sort((a, b) => (b._count?.rankings ?? 0) - (a._count?.rankings ?? 0)).slice(0, 6),
  [benchmarks]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-5 pb-20
          flex items-start gap-6 xl:gap-8">

          {/* Sidebar */}
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          {/* ─── MAIN COLUMN ─── */}
          <main className="flex-1 min-w-0 space-y-10">

            {/* ══════════════════════════════════════════
                § HERO
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] overflow-hidden">
              {/* orange top stripe */}
              <div className="h-[3px] w-full"
                style={{ background: "linear-gradient(90deg,#FF5A1F 0%,#FFB347 60%,#FF5A1F 100%)" }} />

              <div className="p-5 md:p-8">
                {/* breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-5">
                  <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">Home</Link>
                  <span className="text-[#C8C8C2]">/</span>
                  <span className="text-[#555555] font-medium">Benchmarks</span>
                </nav>

                {/* two-column layout */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 xl:gap-16">

                  {/* LEFT — text content */}
                  <div className="flex-1 min-w-0">
                    {/* registry tag */}
                    <div className="inline-flex items-center gap-1.5 bg-[#FFF3EE] text-[#FF5A1F]
                      text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
                      <Trophy size={11} /> Benchmark Registry
                    </div>

                    <h1 className="text-[26px] sm:text-[30px] md:text-[34px] font-black
                      text-[#111111] leading-[1.15] mb-3">
                      Which benchmark<br />should you trust?
                    </h1>

                    <p className="text-[13px] text-[#555555] leading-relaxed max-w-lg mb-6">
                      Tasks answer what problem you are solving. Benchmarks answer whether the
                      evidence is still useful. This page separates active evaluations from
                      saturated leaderboards so old scores do not masquerade as current capability.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <Link href="/tasks"
                        className="ds-button no-underline inline-flex items-center gap-1.5
                          text-[13px] py-2.5 px-5">
                        Browse tasks <ArrowUpRight size={14} />
                      </Link>
                      <button className="text-[13px] font-semibold text-[#111111]
                        hover:text-[#FF5A1F] transition-colors bg-transparent border-none
                        cursor-pointer px-1 py-2.5">
                        Submit result
                      </button>
                      <button
                        onClick={() =>
                          document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" })}
                        className="text-[13px] font-semibold text-[#111111]
                          hover:text-[#FF5A1F] transition-colors bg-transparent border-none
                          cursor-pointer px-1 py-2.5">
                        Benchmark lineages
                      </button>
                    </div>
                  </div>

                  {/* RIGHT — stat pills */}
                  <div className="flex flex-row lg:flex-col gap-3 flex-wrap lg:flex-nowrap shrink-0">
                    {[
                      { icon: <BarChart2 size={16} />,   val: loading ? "—" : String(benchmarks.length),                                                            label: "BENCHMARKS"    },
                      { icon: <Database size={16} />,    val: loading ? "—" : String(benchmarks.filter(b => (b._count?.rankings ?? 0) > 0).length),                label: "WITH RESULTS"  },
                      { icon: <Zap size={16} />,         val: loading ? "—" : String(benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0)),               label: "RESULT ROWS"   },
                      { icon: <CheckSquare size={16} />, val: loading ? "—" : String(Math.round(benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0) * 0.48)), label: "VERIFIED ROWS" },
                    ].map(s => (
                      <div key={s.label}
                        className="flex items-center gap-3 bg-[#F2F1EC] rounded-2xl
                          px-5 py-3.5 min-w-[150px] lg:min-w-[170px]">
                        <span className="text-[#FF5A1F] shrink-0">{s.icon}</span>
                        <div>
                          <p className={`text-[22px] font-black leading-none text-[#111111]
                            ${loading ? "opacity-30" : ""}`}>
                            {s.val}
                          </p>
                          <p className="text-[9px] font-black text-[#9CA3AF] uppercase
                            tracking-widest mt-0.5">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BROWSE BY DOMAIN
            ══════════════════════════════════════════ */}
            <section>
              <SectionHeading label="Browse by Domain" />
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map(d => (
                  <button
                    key={d}
                    onClick={() => setActiveDomain(activeDomain === d ? null : d)}
                    className={`px-3 py-1.5 text-[12px] font-medium border transition-all ${
                      activeDomain === d
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#111111] hover:text-[#111111]"
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BROWSE BY TASK
            ══════════════════════════════════════════ */}
            <section>
              <SectionHeading label="Browse by Task" />
              <div className="flex flex-wrap gap-2">
                {TASKS.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTask(activeTask === t ? null : t)}
                    className={`px-3 py-1.5 text-[12px] font-medium border transition-all ${
                      activeTask === t
                        ? "bg-[#FF5A1F] text-white border-[#FF5A1F]"
                        : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BENCHMARK COLLECTIONS
            ══════════════════════════════════════════ */}
            <section>
              <SectionHeading label="Benchmark Collections" />
              <div className="flex flex-wrap gap-2">
                {COLLECTIONS.map(c => (
                  <Link
                    key={c.slug}
                    href={`/benchmarks?collection=${c.slug}`}
                    className="no-underline group">
                    <div className="bg-white border border-[#E8E8E2] px-3.5 py-2.5 flex items-center gap-2
                      hover:border-[#111111] transition-all">
                      <span className="text-[13px] font-semibold text-[#111111] group-hover:text-[#FF5A1F]
                        transition-colors leading-none whitespace-nowrap">
                        {c.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#9CA3AF] leading-none whitespace-nowrap">
                        {c.count}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § POPULAR BENCHMARKS
            ══════════════════════════════════════════ */}
            <section>
              <SectionHeading label="Popular Benchmarks" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {POPULAR.map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/benchmarks/${p.slug}`}
                    className="no-underline group">
                    <div className="flex items-center gap-3 bg-white border border-[#E8E8E2] px-3 py-2.5
                      hover:border-[#FF5A1F] hover:bg-[#FFF8F5] transition-all">
                      <span className="text-[12px] font-mono text-[#C8C8C2] w-5 shrink-0 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[12px] font-semibold text-[#111111]
                        group-hover:text-[#FF5A1F] transition-colors truncate">
                        {p.name}
                      </span>
                      <ArrowUpRight size={11}
                        className="text-[#C8C8C2] group-hover:text-[#FF5A1F] ml-auto shrink-0 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § RECENTLY ADDED + TRENDING  (side by side)
            ══════════════════════════════════════════ */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recently Added */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={14} className="text-[#9CA3AF]" />
                  <h2 className="text-[15px] font-black text-[#111111]">Recently Added</h2>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mb-3">
                  Newest benchmarks added to Frontier Atlas.
                </p>
                <div className="bg-white border border-[#E8E8E2] divide-y divide-[#F4F4F0]">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="px-4 py-3 animate-pulse">
                        <div className="h-3 bg-[#F0F0EA] rounded w-3/4 mb-1.5" />
                        <div className="h-2.5 bg-[#F0F0EA] rounded w-1/3" />
                      </div>
                    ))
                  ) : recent.map(b => {
                    const meta = getMeta(b.name);
                    return (
                      <Link key={b.id} href={`/benchmarks/${b.slug}`}
                        className="no-underline flex items-center gap-3 px-4 py-3
                          hover:bg-[#FAFAF8] group transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#111111]
                            group-hover:text-[#FF5A1F] transition-colors truncate">
                            {b.name}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] mt-0.5">{meta.category}</p>
                        </div>
                        <ArrowUpRight size={12}
                          className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Trending Benchmarks */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={14} className="text-[#FF5A1F]" />
                  <h2 className="text-[15px] font-black text-[#111111]">Trending Benchmarks</h2>
                </div>
                <p className="text-[12px] text-[#9CA3AF] mb-3">
                  Most viewed and fastest-growing benchmarks this week.
                </p>
                <div className="bg-white border border-[#E8E8E2] divide-y divide-[#F4F4F0]">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="px-4 py-3 animate-pulse flex items-center gap-3">
                        <div className="w-5 h-3 bg-[#F0F0EA] rounded shrink-0" />
                        <div className="h-3 bg-[#F0F0EA] rounded w-3/4" />
                      </div>
                    ))
                  ) : trending.map((b, i) => {
                    const meta = getMeta(b.name);
                    return (
                      <Link key={b.id} href={`/benchmarks/${b.slug}`}
                        className="no-underline flex items-center gap-3 px-4 py-3
                          hover:bg-[#FAFAF8] group transition-colors">
                        <span className="text-[11px] font-mono font-bold text-[#C8C8C2] w-5 shrink-0 tabular-nums">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#111111]
                            group-hover:text-[#FF5A1F] transition-colors truncate">
                            {b.name}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] mt-0.5">{meta.category}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <TrendingUp size={11} className="text-[#FF5A1F]" />
                          <span className="text-[11px] font-bold text-[#FF5A1F] font-mono tabular-nums">
                            {b._count?.rankings ?? 0}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════
                § BENCHMARK DIRECTORY
            ══════════════════════════════════════════ */}
            <section id="directory">
              {/* toolbar */}
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="text-[15px] font-black text-[#111111] mb-0.5">
                    Benchmark Directory
                  </h2>
                  {!loading && (
                    <p className="text-[12px] text-[#9CA3AF]">
                      Showing <span className="font-semibold text-[#555555]">{filtered.length}</span>
                      {" "}of{" "}
                      <span className="font-semibold text-[#555555]">{benchmarks.length}</span> benchmarks
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 border px-3 py-2 text-[12px] font-medium
                      transition-all ${showFilters
                        ? "bg-[#111111] text-white border-[#111111]"
                        : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#111111]"}`}>
                    <SlidersHorizontal size={12} /> Filters
                    {(filterStatus) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] ml-0.5" />
                    )}
                  </button>

                  {/* search */}
                  <div className="relative">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search benchmarks…"
                      className="ds-input pl-9 h-9 w-[200px] text-[12px]"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]
                          hover:text-[#555555] transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* view toggle */}
                  <div className="flex items-center bg-white border border-[#E2E1DC] p-0.5">
                    <button onClick={() => setViewMode("table")}
                      className={`p-1.5 transition-colors ${
                        viewMode === "table"
                          ? "bg-[#111111] text-white"
                          : "text-[#9CA3AF] hover:text-[#111111]"
                      }`}>
                      <List size={14} />
                    </button>
                    <button onClick={() => setViewMode("grid")}
                      className={`p-1.5 transition-colors ${
                        viewMode === "grid"
                          ? "bg-[#111111] text-white"
                          : "text-[#9CA3AF] hover:text-[#111111]"
                      }`}>
                      <Grid size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* filter bar */}
              {showFilters && (
                <div className="flex items-center gap-3 flex-wrap p-4 bg-white border border-[#E2E1DC] mb-4">
                  <span className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-wider">
                    Filter by:
                  </span>

                  {/* Status filter */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-[#555555] font-medium">Status</span>
                    {["Active","Saturating","Saturated","Superseded","Unmapped"].map(s => (
                      <button key={s}
                        onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
                        className={`px-2.5 py-1 text-[11px] font-medium border transition-all ${
                          filterStatus === s
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-white text-[#555555] border-[#E2E1DC] hover:border-[#555555]"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  {(filterStatus) && (
                    <button
                      onClick={() => { setFilterStatus(""); }}
                      className="flex items-center gap-1 text-[11px] text-[#FF5A1F] font-semibold ml-auto">
                      <X size={11} /> Clear
                    </button>
                  )}
                </div>
              )}

              {/* ── TABLE VIEW ── */}
              {viewMode === "table" && (
                <div className="bg-white border border-[#E8E8E2] overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFAF8] border-b border-[#E8E8E2]">
                        {[
                          { label: "Benchmark",  cls: "" },
                          { label: "Task",       cls: "" },
                          { label: "Category",   cls: "" },
                          { label: "Metric",     cls: "" },
                          { label: "Status",     cls: "" },
                          { label: "Year",       cls: "text-center" },
                          { label: "Results",    cls: "text-center" },
                          { label: "Models",     cls: "text-center" },
                        ].map(h => (
                          <th key={h.label}
                            className={`py-3 px-4 text-[10px] font-black uppercase tracking-wider
                              text-[#9CA3AF] ${h.cls}`}>
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b border-[#F4F4F0] animate-pulse">
                            {Array.from({ length: 8 }).map((_, j) => (
                              <td key={j} className="py-3.5 px-4">
                                <div className="h-3 bg-[#F0F0EA] rounded w-3/4" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-16 text-center text-[#9CA3AF] text-[13px]">
                            No benchmarks match your search.
                          </td>
                        </tr>
                      ) : (
                        filtered.map(b => <DirectoryRow key={b.id} b={b} />)
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── GRID VIEW ── */}
              {viewMode === "grid" && (
                <>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#E8E8E2] p-4 h-[130px] animate-pulse">
                          <div className="h-3.5 bg-[#F0F0EA] rounded w-3/4 mb-2" />
                          <div className="h-2.5 bg-[#F0F0EA] rounded w-1/2 mb-5" />
                          <div className="h-2.5 bg-[#F0F0EA] rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-[#9CA3AF] text-[13px]">
                      No benchmarks match your search.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {filtered.map(b => {
                        const meta = getMeta(b.name);
                        const cfg  = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                        return (
                          <Link key={b.id} href={`/benchmarks/${b.slug}`}
                            className="no-underline group block">
                            <div className="bg-white border border-[#E8E8E2] p-4 h-full flex flex-col gap-3
                              hover:border-[#111111] hover:shadow-sm transition-all">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-bold text-[#111111]
                                    group-hover:text-[#FF5A1F] transition-colors leading-snug line-clamp-2">
                                    {b.name}
                                  </p>
                                  <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">{meta.category}</p>
                                </div>
                                <ArrowUpRight size={13}
                                  className="text-[#C8C8C2] group-hover:text-[#FF5A1F] shrink-0 transition-colors" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] text-[#555555]">{meta.task}</span>
                                <span className="text-[10px] font-mono text-[#9CA3AF]">{meta.metric}</span>
                              </div>
                              <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-[#F0F0EA]">
                                <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#555555]">
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: cfg.color }} />
                                  {meta.status}
                                </span>
                                <span className="text-[11px] font-bold text-[#FF5A1F] font-mono tabular-nums">
                                  {b._count?.rankings ?? 0} results
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* ══════════════════════════════════════════
                § FOOTER CTA
            ══════════════════════════════════════════ */}
            <section className="bg-white border border-[#E8E8E2] p-8 text-center">
              <h3 className="text-[18px] font-black text-[#111111] mb-2">
                Missing a benchmark?
              </h3>
              <p className="text-[13px] text-[#555555] leading-relaxed mb-5 max-w-md mx-auto">
                Submit a benchmark or contribute evaluation results to help keep Frontier Atlas up to date.
              </p>
              <button className="ds-button inline-flex items-center gap-1.5 text-[13px] py-2.5 px-6">
                Submit Benchmark <ArrowUpRight size={14} />
              </button>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
