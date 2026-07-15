"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  X,
  BarChart2,
  Database,
  Zap,
  CheckSquare,
  Trophy,
  FolderOpen,
  Plus,
  MessageSquare,
  Brain,
  Eye,
  FileText,
  Code,
  BookOpen,
  BarChart3,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import bgImage from "@/public/bg-image.png";
import { getBenchmarks, type BenchmarkItem } from "@/lib/benchmarks";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   STATUS + META
   ══════════════════════════════════════════════════════════════ */

const STATUS_CFG: Record<string, { color: string; text: string; bg: string; border: string }> = {
  Active:     { color: "#10B981", text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-100"  },
  Saturating: { color: "#F59E0B", text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-100"    },
  Saturated:  { color: "#F87171", text: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-100"     },
  Superseded: { color: "#A78BFA", text: "text-purple-700",  bg: "bg-purple-50",   border: "border-purple-100"   },
  Unmapped:   { color: "#9CA3AF", text: "text-gray-500",    bg: "bg-gray-50",     border: "border-gray-100"     },
};

function getMeta(name: string) {
  const n = name.toLowerCase();
  if (n.includes("ocrbench v2"))        return { task: "Document OCR",           metric: "overall-en-private", status: "Active",     category: "OCR & Document AI", year: "2024" };
  if (n.includes("ocrbench"))           return { task: "Document OCR",           metric: "score",              status: "Unmapped",   category: "OCR & Document AI", year: "2023" };
  if (n.includes("olmocr"))             return { task: "Document Parsing",       metric: "pass-rate",          status: "Active",     category: "OCR & Document AI", year: "2024" };
  if (n.includes("omnidoc"))            return { task: "Document Parsing",       metric: "composite",          status: "Active",     category: "OCR & Document AI", year: "2024" };
  if (n.includes("swe-bench verified")) return { task: "Code Generation",        metric: "resolve-rate",       status: "Saturating", category: "Coding",            year: "2024" };
  if (n.includes("humaneval"))          return { task: "Code Generation",        metric: "pass@1",             status: "Saturated",  category: "Coding",            year: "2021" };
  if (n.includes("math"))               return { task: "Mathematical Reasoning", metric: "accuracy",           status: "Saturating", category: "Mathematics",       year: "2021" };
  if (n.includes("vqa"))                return { task: "Visual QA",              metric: "accuracy",           status: "Saturated",  category: "Vision",            year: "2017" };
  if (n.includes("imagenet"))           return { task: "Image Classification",   metric: "top-1-accuracy",     status: "Saturated",  category: "Computer Vision",   year: "2012" };
  if (n.includes("mmlu"))               return { task: "Question Answering",     metric: "accuracy",           status: "Active",     category: "Language",          year: "2021" };
  if (n.includes("gsm8k"))              return { task: "Math Word Problems",      metric: "accuracy",           status: "Active",     category: "Mathematics",       year: "2021" };
  if (n.includes("hellaswag"))          return { task: "Commonsense Reasoning",  metric: "accuracy",           status: "Saturated",  category: "Reasoning",         year: "2019" };
  if (n.includes("arc"))                return { task: "Science QA",             metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2018" };
  if (n.includes("coco"))               return { task: "Object Detection",       metric: "mAP",                status: "Active",     category: "Computer Vision",   year: "2014" };
  return                                       { task: "General ML Evaluation",  metric: "accuracy",           status: "Active",     category: "General AI",        year: "2024" };
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "General AI": return Trophy;
    case "Language": return BookOpen;
    case "Reasoning": return Brain;
    case "Coding": return Code;
    case "Computer Vision": return Eye;
    case "Vision": return Eye;
    case "OCR & Document AI": return FileText;
    case "Mathematics": return BarChart3;
    default: return Trophy;
  }
};

const iconColors = [
  "#e11d48",
  "#0284c7",
  "#16a34a",
  "#d97706",
  "#9333ea",
  "#0891b2",
  "#7c3aed",
  "#db2777",
  "#0d9488",
  "#ea580c",
  "#4f46e5",
  "#ca8a04",
  "#2563eb",
  "#dc2626",
  "#65a30d",
];

export default function BenchmarksPage() {
  const router = useRouter();
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    getBenchmarks()
      .then((data) => {
        setBenchmarks(data);
        if (data.length > 0) {
          const firstCat = getMeta(data[0].name).category;
          setActiveCategory(firstCat);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const groupedAndFiltered = useMemo(() => {
    const groups: Record<string, BenchmarkItem[]> = {};
    const query = searchQuery.toLowerCase().trim();

    benchmarks.forEach((b) => {
      const meta = getMeta(b.name);
      const category = meta.category || "General AI";

      const categoryMatches = query && category.toLowerCase().includes(query);
      const benchmarkMatches =
        !query ||
        b.name.toLowerCase().includes(query) ||
        b.slug.toLowerCase().includes(query) ||
        meta.task.toLowerCase().includes(query) ||
        meta.metric.toLowerCase().includes(query);

      if (categoryMatches || benchmarkMatches) {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(b);
      }
    });

    return groups;
  }, [searchQuery, benchmarks]);

  const categories = useMemo(() => {
    return Object.keys(groupedAndFiltered).sort();
  }, [groupedAndFiltered]);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container || categories.length === 0) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + 120; // threshold offset for headers
      let currentActive = categories[0];

      for (const cat of categories) {
        const el = document.getElementById(`section-${cat}`);
        if (el) {
          const elTop = el.offsetTop - container.offsetTop;
          if (elTop <= scrollPos) {
            currentActive = cat;
          } else {
            break;
          }
        }
      }
      setActiveCategory(currentActive);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // initial trigger

    return () => container.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const handleCategoryClick = (category: string) => {
    const element = document.getElementById(`section-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(category);
    }
  };

  const handleItemClick = (slug: string) => {
    router.push(`/benchmarks/${slug}`);
  };

  // Stats calculations
  const stats = useMemo(() => {
    const totalCount = benchmarks.length;
    const withResultsCount = benchmarks.filter(b => (b._count?.rankings ?? 0) > 0).length;
    const resultRows = benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0);
    return {
      domains: categories.length || 0,
      benchmarks: totalCount,
      results: resultRows,
    };
  }, [benchmarks, categories]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <main
          id="scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll scroll-smooth"
        >
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            {/* Hero Section */}
            <div className="relative overflow-hidden mb-10 hidden md:flex min-h-[375px]">
              {/* Left Content - 35% */}
              <div className="relative z-10 w-[35%] px-6 md:px-8 py-8 md:py-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-gray-900">
                  All Benchmark
                  <br />
                  <span className="text-[#e11d48]">Domains</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base mb-6 max-w-md leading-relaxed">
                  Tasks answer what problem you are solving. Benchmarks answer whether the evidence is still useful.
                </p>

                <div className="flex items-center gap-5 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-800">
                        {loading ? "—" : stats.domains}
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm">Domains</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-800">
                        {loading ? "—" : stats.benchmarks}
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm">Benchmarks</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                  </div>
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-gray-800">
                        {loading ? "—" : stats.results}
                      </div>
                      <div className="text-gray-500 text-xs md:text-sm">Evaluations</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-2 border-gray-200 rounded-full px-3 py-1 bg-white/50 backdrop-blur-sm ml-2 cursor-pointer hover:shadow-sm">
                    <TrendingUp size={12} className="text-emerald-500" />
                    <span className="text-gray-600 font-medium text-xs md:text-sm">
                      Daily updates
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Image - 65% */}
              <div className="relative w-[65%]">
                <Image
                  src={bgImage}
                  alt="AI Benchmarks Background"
                  fill
                  className="object-contain object-right"
                  priority
                />
              </div>
            </div>

            {/* Content Two-Column Layout */}
            <div className="flex gap-6">
              {/* Left Sticky Sidebar - Hidden on mobile */}
              <aside
                className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm"
                aria-label="Domain navigation"
              >
                <div className="sticky top-0 flex flex-col h-[calc(100vh-10rem)]">
                  <div className="pt-2 pb-4">
                    <h3 className="text-[15px] font-semibold uppercase text-[#e11d48] mb-3">
                      Browse Benchmarks
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Filter benchmarks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white/80 transition-colors"
                      />
                    </div>
                  </div>

                  <nav className="overflow-y-auto px-2 pb-4 flex-1 hide-scroll" aria-label="Domains">
                    <ul className="space-y-0.5" role="list">
                      {categories.map((cat) => {
                        const isActive = activeCategory === cat;
                        return (
                          <li key={cat}>
                            <button
                              onClick={() => handleCategoryClick(cat)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-200 hover:scale-[1.02] ${
                                isActive
                                  ? "bg-[#e11d48]/10 text-[#e11d48] font-semibold border-l-2 border-[#e11d48]"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              {cat}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* Suggest a Benchmark Card */}
                  <div className="px-2 mt-4">
                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl border border-rose-100 p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-100 rounded-full text-rose-500 shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-800">
                            Can’t find what you need?
                          </p>
                          <p className="text-xs text-gray-500">
                            Submit a benchmark to keep our registry up to date.
                          </p>
                        </div>
                      </div>
                      <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                        <Plus size={14} /> Submit Benchmark
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Scrolling Content */}
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-white border border-[#E8E8E2] rounded-2xl p-5 h-[140px] animate-pulse"
                      >
                        <div className="h-4 bg-[#F0F0EA] rounded w-3/4 mb-3.5" />
                        <div className="h-3 bg-[#F0F0EA] rounded w-1/2 mb-5" />
                        <div className="h-3 bg-[#F0F0EA] rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500">No benchmarks match your filter.</p>
                  </div>
                ) : (
                  categories.map((cat) => (
                    <section
                      key={cat}
                      id={`section-${cat}`}
                      className="mb-12 scroll-mt-6"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-[30px] font-bold text-gray-800">
                            {cat}
                          </h2>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupedAndFiltered[cat].map((b, idx) => {
                          const meta = getMeta(b.name);
                          const cfg = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                          const Icon = getCategoryIcon(cat);
                          const color = iconColors[idx % iconColors.length];

                          return (
                            <div
                              key={b.id}
                              onClick={() => handleItemClick(b.slug)}
                              className="bg-white p-5 rounded-sm shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer flex flex-col justify-between min-h-[180px]"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                    <Icon size={20} style={{ color }} />
                                  </div>
                                  <h3 className="font-semibold text-gray-800 text-[15px] leading-snug mb-0.5 truncate">
                                    {b.name}
                                  </h3>
                                </div>
                                <div className="ml-11 text-xs text-gray-500 space-y-1 mt-1.5">
                                  <div>Task: <span className="font-medium text-gray-700">{meta.task}</span></div>
                                  <div className="flex items-center gap-2">
                                    Metric: <span className="font-mono bg-gray-50 px-1 py-0.2 rounded border border-gray-100 text-gray-600 text-[10px]">{meta.metric}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 ml-11 flex items-center justify-between pt-3 border-t border-gray-50">
                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: cfg.color }} />
                                  {meta.status}
                                </span>
                                <span className="text-[11px] font-bold text-[#e11d48] font-mono tabular-nums">
                                  {b._count?.rankings ?? 0} results
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
