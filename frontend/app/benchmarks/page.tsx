"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  ArrowUpRight,
  TrendingUp,
  Plus,
  MessageSquare,
  Brain,
  Eye,
  FileText,
  Code,
  BookOpen,
  BarChart3,
  Trophy,
  Bot,
  Music,
  Video,
  Heart,
  Network,
  Activity,
  Cpu,
  Layers,
  Target,
  Mic,
  ChevronDown,
  SlidersHorizontal,
  X,
  Clock,
  Flame,
  Star,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import bgImage from "@/public/bg-image.png";
import { getBenchmarks, type BenchmarkItem } from "@/lib/benchmarks";
import { useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   STATUS CONFIG
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
  if (n.includes("parsebench"))         return { task: "Document Parsing",       metric: "accuracy",           status: "Active",     category: "OCR & Document AI", year: "2024" };
  if (n.includes("swe-bench verified")) return { task: "Software Engineering",   metric: "resolve-rate",       status: "Saturating", category: "Coding",            year: "2024" };
  if (n.includes("swe-bench"))          return { task: "Software Engineering",   metric: "resolve-rate",       status: "Active",     category: "Coding",            year: "2023" };
  if (n.includes("terminal-bench"))     return { task: "Software Engineering",   metric: "solve-rate",         status: "Active",     category: "Coding",            year: "2024" };
  if (n.includes("humaneval"))          return { task: "Code Generation",        metric: "pass@1",             status: "Saturated",  category: "Coding",            year: "2021" };
  if (n.includes("mbpp"))               return { task: "Code Generation",        metric: "pass@1",             status: "Active",     category: "Coding",            year: "2021" };
  if (n.includes("gpqa"))               return { task: "Expert QA",              metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2023" };
  if (n.includes("humanity"))           return { task: "Expert QA",              metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2024" };
  if (n.includes("big-bench"))          return { task: "Reasoning",              metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2022" };
  if (n.includes("arc-agi"))            return { task: "Abstract Reasoning",     metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2019" };
  if (n.includes("hellaswag"))          return { task: "Commonsense Reasoning",  metric: "accuracy",           status: "Saturated",  category: "Reasoning",         year: "2019" };
  if (n.includes("arc"))                return { task: "Science QA",             metric: "accuracy",           status: "Active",     category: "Reasoning",         year: "2018" };
  if (n.includes("mathvista"))          return { task: "Mathematical Reasoning", metric: "accuracy",           status: "Active",     category: "Mathematics",       year: "2023" };
  if (n.includes("math"))               return { task: "Mathematical Reasoning", metric: "accuracy",           status: "Saturating", category: "Mathematics",       year: "2021" };
  if (n.includes("gsm8k"))              return { task: "Math Word Problems",     metric: "accuracy",           status: "Active",     category: "Mathematics",       year: "2021" };
  if (n.includes("mmmu"))               return { task: "Multimodal Understanding",metric: "accuracy",          status: "Active",     category: "Multimodal",        year: "2023" };
  if (n.includes("mmlu"))               return { task: "Question Answering",     metric: "accuracy",           status: "Active",     category: "Language",          year: "2021" };
  if (n.includes("vqa"))                return { task: "Visual QA",              metric: "accuracy",           status: "Saturated",  category: "Computer Vision",   year: "2017" };
  if (n.includes("imagenet"))           return { task: "Image Classification",   metric: "top-1-accuracy",     status: "Saturated",  category: "Computer Vision",   year: "2012" };
  if (n.includes("coco"))               return { task: "Object Detection",       metric: "mAP",                status: "Active",     category: "Computer Vision",   year: "2014" };
  return                                       { task: "General ML Evaluation",  metric: "accuracy",           status: "Active",     category: "General AI",        year: "2024" };
}

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════ */

const DOMAINS = [
  { label: "General AI",       icon: Trophy,   color: "#e11d48" },
  { label: "Language",         icon: BookOpen, color: "#0284c7" },
  { label: "Reasoning",        icon: Brain,    color: "#9333ea" },
  { label: "Coding",           icon: Code,     color: "#16a34a" },
  { label: "Agents",           icon: Bot,      color: "#d97706" },
  { label: "Computer Vision",  icon: Eye,      color: "#0891b2" },
  { label: "OCR & Document AI",icon: FileText, color: "#7c3aed" },
  { label: "Multimodal",       icon: Layers,   color: "#db2777" },
  { label: "Audio & Speech",   icon: Mic,      color: "#0d9488" },
  { label: "Video",            icon: Video,    color: "#ea580c" },
  { label: "Robotics",         icon: Cpu,      color: "#4f46e5" },
  { label: "Embodied AI",      icon: Activity, color: "#ca8a04" },
  { label: "Healthcare",       icon: Heart,    color: "#dc2626" },
  { label: "Mathematics",      icon: BarChart3,color: "#2563eb" },
  { label: "Time Series",      icon: TrendingUp,color: "#65a30d"},
  { label: "Graphs",           icon: Network,  color: "#c026d3" },
  { label: "Scientific AI",    icon: Target,   color: "#0284c7" },
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
  { label: "Reasoning",        icon: Brain,    color: "#9333ea", bg: "#f3e8ff" },
  { label: "Coding",           icon: Code,     color: "#16a34a", bg: "#dcfce7" },
  { label: "Agent Evaluation", icon: Bot,      color: "#d97706", bg: "#fef3c7" },
  { label: "Vision",           icon: Eye,      color: "#0891b2", bg: "#e0f2fe" },
  { label: "OCR & Document AI",icon: FileText, color: "#7c3aed", bg: "#ede9fe" },
  { label: "Language",         icon: BookOpen, color: "#0284c7", bg: "#dbeafe" },
  { label: "Multimodal",       icon: Layers,   color: "#db2777", bg: "#fce7f3" },
  { label: "Audio & Speech",   icon: Music,    color: "#0d9488", bg: "#ccfbf1" },
  { label: "Robotics",         icon: Cpu,      color: "#4f46e5", bg: "#e0e7ff" },
  { label: "Healthcare",       icon: Heart,    color: "#dc2626", bg: "#fee2e2" },
  { label: "Mathematics",      icon: BarChart3,color: "#2563eb", bg: "#dbeafe" },
];

const POPULAR_BENCHMARK_NAMES = [
  "MMLU", "GPQA", "Humanity's Last Exam", "GSM8K", "MATH",
  "HumanEval", "MBPP", "SWE-Bench", "Terminal-Bench", "MMMU",
  "MathVista", "OCRBench v2", "ParseBench", "ImageNet", "COCO",
];

const getCategoryIcon = (category: string) => {
  const found = DOMAINS.find(d => d.label === category);
  return found?.icon ?? Trophy;
};

const getCategoryColor = (category: string) => {
  const found = DOMAINS.find(d => d.label === category);
  return found?.color ?? "#e11d48";
};

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function BenchmarksPage() {
  const router = useRouter();
  const directoryRef = useRef<HTMLDivElement>(null);

  const [benchmarks, setBenchmarks]   = useState<BenchmarkItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [taskFilter, setTaskFilter]     = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter]     = useState<string | null>(null);
  const [showFilters, setShowFilters]   = useState(false);

  useEffect(() => {
    getBenchmarks()
      .then((data) => setBenchmarks(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Stats
  const stats = useMemo(() => ({
    domains:    DOMAINS.length,
    benchmarks: benchmarks.length,
    results:    benchmarks.reduce((s, b) => s + (b._count?.rankings ?? 0), 0),
  }), [benchmarks]);

  // Popular benchmarks matched from API
  const popularBenchmarks = useMemo(() =>
    POPULAR_BENCHMARK_NAMES.map(name => {
      const found = benchmarks.find(b =>
        b.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(b.name.toLowerCase())
      );
      return found ?? { id: name, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), _count: { rankings: 0, claims: 0 } };
    }),
  [benchmarks]);

  // Recently added = first 8 from API
  const recentlyAdded = useMemo(() => benchmarks.slice(0, 8), [benchmarks]);

  // Trending = top 8 by results
  const trending = useMemo(() =>
    [...benchmarks].sort((a, b) => (b._count?.rankings ?? 0) - (a._count?.rankings ?? 0)).slice(0, 8),
  [benchmarks]);

  // Directory filtered data
  const directoryData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return benchmarks.filter(b => {
      const meta = getMeta(b.name);
      if (domainFilter && meta.category !== domainFilter) return false;
      if (taskFilter && !meta.task.toLowerCase().includes(taskFilter.toLowerCase())) return false;
      if (statusFilter && meta.status !== statusFilter) return false;
      if (yearFilter && meta.year !== yearFilter) return false;
      if (q) {
        return (
          b.name.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          meta.task.toLowerCase().includes(q) ||
          meta.metric.toLowerCase().includes(q) ||
          meta.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [benchmarks, searchQuery, domainFilter, taskFilter, statusFilter, yearFilter]);

  const scrollToDirectory = (domain?: string) => {
    if (domain) setDomainFilter(domain);
    directoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleItemClick = (slug: string) => router.push(`/benchmarks/${slug}`);

  const clearFilters = () => {
    setDomainFilter(null);
    setTaskFilter(null);
    setStatusFilter(null);
    setYearFilter(null);
    setSearchQuery("");
  };

  const activeFilterCount = [domainFilter, taskFilter, statusFilter, yearFilter].filter(Boolean).length;

  // Benchmark card — same style as Browse by Domain cards
  const BenchmarkCard = ({ b }: { b: BenchmarkItem }) => {
    const meta = getMeta(b.name);
    const Icon = getCategoryIcon(meta.category);
    const color = getCategoryColor(meta.category);
    return (
      <div
        onClick={() => handleItemClick(b.slug)}
        className="bg-white border border-gray-100 rounded-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col h-full min-h-[130px] p-5 w-full"
      >
        <div className="flex items-start gap-2.5 mb-2">
          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
            <Icon size={20} style={{ color }} />
          </div>
          <h3 className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0">{b.name}</h3>
        </div>
        <p className="text-sm text-gray-400 ml-[2.375rem] flex-1">{meta.task}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <main
          id="scroll-container"
          className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll scroll-smooth"
        >
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            
            {/* ══ HERO SECTION (Preserved original dimensions/split: 35% / 65%) ══ */}
            <div className="relative overflow-hidden mb-10 hidden md:flex min-h-[375px]">
              {/* Left Content - 35% */}
              <div className="relative z-10 w-[35%] px-6 md:px-8 py-8 md:py-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-gray-900">
                  Benchmarks
                </h1>
                <p className="text-gray-600 text-sm md:text-base mb-6 max-w-md leading-relaxed">
                  Discover benchmark datasets, evaluation metrics, leaderboards, and state-of-the-art results used to measure AI systems across language, vision, reasoning, coding, agents, multimodal, robotics, and more.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-6">
                  <button
                    onClick={() => scrollToDirectory()}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-xs transition-colors shadow-sm"
                  >
                    Browse Benchmarks <ArrowUpRight size={12} />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-xs transition-colors shadow-sm">
                    <Plus size={12} /> Submit Benchmark
                  </button>
                </div>

                <div className="flex items-center gap-5 whitespace-nowrap text-sm flex-wrap">
                  <div>
                    <div className="text-xl font-bold text-gray-800">{loading ? "—" : stats.domains}</div>
                    <div className="text-gray-500 text-xs">Domains</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <div className="text-xl font-bold text-gray-800">{loading ? "—" : stats.benchmarks}</div>
                    <div className="text-gray-500 text-xs">Benchmarks</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <div className="text-xl font-bold text-gray-800">{loading ? "—" : stats.results}</div>
                    <div className="text-gray-500 text-xs">Evaluations</div>
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

            {/* ══ CONTENT TWO-COLUMN LAYOUT (Preserved sidebar layout) ══ */}
            <div className="flex gap-6">
              
              {/* Left Sticky Sidebar (w-64) */}
              <aside
                className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm"
                aria-label="Benchmark navigation"
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
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white/80 transition-colors"
                      />
                    </div>
                  </div>

                  <nav className="overflow-y-auto px-2 pb-4 flex-1 hide-scroll" aria-label="Domains">
                    <ul className="space-y-0.5" role="list">
                      {DOMAINS.map((domain) => {
                        const isActive = domainFilter === domain.label;
                        return (
                          <li key={domain.label}>
                            <button
                              onClick={() => {
                                setDomainFilter(domain.label);
                                scrollToDirectory();
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-200 hover:scale-[1.02] ${
                                isActive
                                  ? "bg-[#e11d48]/10 text-[#e11d48] font-semibold border-l-2 border-[#e11d48]"
                                  : "text-gray-600 hover:text-gray-900"
                              }`}
                            >
                              {domain.label}
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
              <div className="flex-1 min-w-0 space-y-16">
                
                {/* ══ 2. BROWSE BY DOMAIN ══ */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Browse by Domain</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                    {DOMAINS.map(({ label, icon: Icon, color }) => (
                      <button
                        key={label}
                        onClick={() => scrollToDirectory(label)}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group text-left flex flex-col h-full min-h-[130px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
                            <Icon size={20} style={{ color }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0">{label}</span>
                        </div>
                        <p className="text-sm text-gray-400 ml-[2.375rem] flex-1">Browse benchmarks</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* ══ 3. BROWSE BY TASK ══ */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Browse by Task</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                    {TASKS.map(task => (
                      <button
                        key={task}
                        onClick={() => {
                          setTaskFilter(task);
                          scrollToDirectory();
                        }}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-[#e11d48] transition-all group text-left flex flex-col h-full min-h-[130px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: "#e11d4812" }}>
                            <Target size={20} style={{ color: "#e11d48" }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0 group-hover:text-[#e11d48] transition-colors">{task}</span>
                        </div>
                        <p className="text-sm text-gray-400 ml-[2.375rem] flex-1">Filter benchmarks</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* ══ 4. BENCHMARK COLLECTIONS ══ */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Benchmark Collections</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                    {COLLECTIONS.map(({ label, icon: Icon, color, bg }) => (
                      <button
                        key={label}
                        onClick={() => scrollToDirectory(label)}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group text-left flex flex-col h-full min-h-[130px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: bg }}>
                            <Icon size={20} style={{ color }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0">{label}</span>
                        </div>
                        <p className="text-sm text-gray-400 ml-[2.375rem] flex-1">View collection</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Each collection shows all related benchmarks in the directory below.</p>
                </section>

                {/* ══ 5. POPULAR BENCHMARKS ══ */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={18} className="text-amber-500" />
                    <h2 className="text-xl font-bold text-gray-800">Popular Benchmarks</h2>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-sm p-5 min-h-[130px] animate-pulse">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {popularBenchmarks.slice(0, 12).map(b => <BenchmarkCard key={b.id} b={b} />)}
                    </div>
                  )}
                </section>

                {/* ══ 6. RECENTLY ADDED ══ */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-[#0284c7]" />
                    <h2 className="text-xl font-bold text-gray-800">Recently Added</h2>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-sm p-5 min-h-[130px] animate-pulse">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {recentlyAdded.map((b, idx) => {
                        const meta = getMeta(b.name);
                        const cfg = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                        const Icon = getCategoryIcon(meta.category);
                        const color = getCategoryColor(meta.category);
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleItemClick(b.slug)}
                            className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md cursor-pointer group transition-all flex flex-col h-full min-h-[130px]"
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
                                <Icon size={20} style={{ color }} />
                              </div>
                              <h3 className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0">{b.name}</h3>
                            </div>
                            <div className="ml-[2.375rem] text-sm text-gray-500 flex-1">
                              <div className="truncate">{meta.task}</div>
                              <div className="text-xs text-gray-400">{meta.year}</div>
                            </div>
                            <div className="ml-[2.375rem] pt-2 mt-2 border-t border-gray-50 shrink-0">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />
                                {meta.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* ══ 7. TRENDING BENCHMARKS ══ */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Flame size={18} className="text-[#e11d48]" />
                    <h2 className="text-xl font-bold text-gray-800">Trending Benchmarks</h2>
                  </div>
                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-sm p-5 min-h-[130px] animate-pulse">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch">
                      {trending.map((b, idx) => {
                        const meta = getMeta(b.name);
                        const Icon = getCategoryIcon(meta.category);
                        const color = getCategoryColor(meta.category);
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleItemClick(b.slug)}
                            className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md cursor-pointer group transition-all flex flex-col h-full min-h-[130px]"
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
                                <Icon size={20} style={{ color }} />
                              </div>
                              <h3 className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5 flex-1 min-w-0">{b.name}</h3>
                            </div>
                            <div className="ml-[2.375rem] text-sm text-gray-500 flex-1 truncate">{meta.task}</div>
                            <div className="ml-[2.375rem] pt-2 mt-2 border-t border-gray-50 shrink-0">
                              <span className="text-[12px] font-bold text-[#e11d48] font-mono tabular-nums">{b._count?.rankings ?? 0} results</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* ══ 8. BENCHMARK DIRECTORY ══ */}
                <section ref={directoryRef} className="scroll-mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <SlidersHorizontal size={18} className="text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-800">Benchmark Directory</h2>
                    <span className="ml-auto text-sm text-gray-400 font-mono">{directoryData.length} benchmarks</span>
                  </div>

                  {/* Filter bar */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
                    <div className="flex flex-wrap gap-3 items-center">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search benchmarks..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-gray-50 transition-colors"
                        />
                      </div>

                      {/* Toggle advanced filters */}
                      <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                      >
                        <Filter size={14} />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="bg-[#e11d48] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                          </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
                      </button>

                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <X size={13} /> Clear
                        </button>
                      )}
                    </div>

                    {/* Advanced filters */}
                    {showFilters && (
                      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
                        {/* Domain */}
                        <select
                          value={domainFilter ?? ""}
                          onChange={e => setDomainFilter(e.target.value || null)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-400 text-gray-700"
                        >
                          <option value="">All Domains</option>
                          {DOMAINS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
                        </select>

                        {/* Task */}
                        <select
                          value={taskFilter ?? ""}
                          onChange={e => setTaskFilter(e.target.value || null)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-400 text-gray-700"
                        >
                          <option value="">All Tasks</option>
                          {TASKS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        {/* Status */}
                        <select
                          value={statusFilter ?? ""}
                          onChange={e => setStatusFilter(e.target.value || null)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-400 text-gray-700"
                        >
                          <option value="">All Statuses</option>
                          {Object.keys(STATUS_CFG).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Year */}
                        <select
                          value={yearFilter ?? ""}
                          onChange={e => setYearFilter(e.target.value || null)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-rose-400 text-gray-700"
                        >
                          <option value="">All Years</option>
                          {["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2014", "2012"].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Active filter pills */}
                    {activeFilterCount > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {domainFilter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e11d48]/10 text-[#e11d48] text-xs font-medium rounded-full">
                            Domain: {domainFilter}
                            <button onClick={() => setDomainFilter(null)}><X size={10} /></button>
                          </span>
                        )}
                        {taskFilter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0284c7]/10 text-[#0284c7] text-xs font-medium rounded-full">
                            Task: {taskFilter}
                            <button onClick={() => setTaskFilter(null)}><X size={10} /></button>
                          </span>
                        )}
                        {statusFilter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Status: {statusFilter}
                            <button onClick={() => setStatusFilter(null)}><X size={10} /></button>
                          </span>
                        )}
                        {yearFilter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Year: {yearFilter}
                            <button onClick={() => setYearFilter(null)}><X size={10} /></button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-sm p-5 h-[140px] animate-pulse">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                          <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : directoryData.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                      <Search size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">No benchmarks match your filters.</p>
                      <button onClick={clearFilters} className="mt-3 text-[#e11d48] text-sm hover:underline">Clear filters</button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Benchmark</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Task</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Category</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Metric</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden xl:table-cell">Status</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden xl:table-cell">Year</th>
                            <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Results</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {directoryData.map((b) => {
                            const meta = getMeta(b.name);
                            const cfg = STATUS_CFG[meta.status] ?? STATUS_CFG["Unmapped"];
                            const Icon = getCategoryIcon(meta.category);
                            const color = getCategoryColor(meta.category);
                            return (
                              <tr
                                key={b.id}
                                onClick={() => handleItemClick(b.slug)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors group"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-md flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
                                      <Icon size={13} style={{ color }} />
                                    </div>
                                    <span className="font-medium text-gray-800 group-hover:text-[#e11d48] transition-colors">{b.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{meta.task}</td>
                                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{meta.category}</td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                  <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-gray-600 text-[11px]">{meta.metric}</span>
                                </td>
                                <td className="px-4 py-3 hidden xl:table-cell">
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                    <span className="w-1 h-1 rounded-full" style={{ background: cfg.color }} />
                                    {meta.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 hidden xl:table-cell">{meta.year}</td>
                                <td className="px-4 py-3 text-right font-bold text-[#e11d48] font-mono text-xs">{b._count?.rankings ?? 0}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* ══ 9. FOOTER CTA ══ */}
                <section className="py-8 text-center border-t border-gray-100">
                  <div className="max-w-xl mx-auto space-y-4">
                    <h3 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
                      Missing a benchmark?
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Submit a benchmark or contribute evaluation results to help keep Frontier Atlas up to date.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        <Plus size={14} /> Submit Benchmark
                      </button>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
