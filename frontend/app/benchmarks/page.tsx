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
  Languages,
  FileSearch,
  ImageIcon,
  Scissors,
  Headphones,
  Speaker,
  Film,
  Radar,
  Scan,
  Sparkles,
  Puzzle,
  Shield,
  Stethoscope,
  FlaskConical,
  Binary,
  Move,
  Satellite,
  Fingerprint,
  Zap,
  Database,
  Box,
  Users,
  Palette,
  ScanEye,
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
  { label: "General AI",       icon: Trophy,    color: "#e11d48", desc: "Measures overall AI capability across diverse tasks spanning language, vision, reasoning & planning" },
  { label: "Language",         icon: BookOpen,  color: "#0284c7", desc: "NLP benchmarks for comprehension, fluent text generation & cross-lingual translation quality" },
  { label: "Reasoning",        icon: Brain,     color: "#9333ea", desc: "Evaluates logical, causal & commonsense inference across multi-step problem chains" },
  { label: "Coding",           icon: Code,      color: "#16a34a", desc: "Code generation, debugging & software engineering evaluations across real-world repositories" },
  { label: "Agents",           icon: Bot,       color: "#d97706", desc: "Tool use, long-horizon planning & multi-turn decision-making in interactive environments" },
  { label: "Computer Vision",  icon: Eye,       color: "#0891b2", desc: "Detection, segmentation, classification & other pixel-level visual understanding tasks" },
  { label: "OCR & Document AI",icon: FileText,  color: "#7c3aed", desc: "Text recognition, layout parsing & structured extraction from scanned documents & PDFs" },
  { label: "Multimodal",       icon: Layers,    color: "#db2777", desc: "Cross-modal reasoning across image, text & audio inputs requiring joint understanding" },
  { label: "Audio & Speech",   icon: Mic,       color: "#0d9488", desc: "Speech recognition, synthesis quality & audio classification measured by WER and MOS" },
  { label: "Video",            icon: Video,     color: "#ea580c", desc: "Temporal action recognition, video QA & long-form understanding across frame sequences" },
  { label: "Robotics",         icon: Cpu,       color: "#4f46e5", desc: "Manipulation, navigation & embodied control tasks across simulated & real-world settings" },
  { label: "Embodied AI",      icon: Activity,  color: "#ca8a04", desc: "Agents acting, exploring & solving goals in simulated 3D environments with physical constraints" },
  { label: "Healthcare",       icon: Heart,     color: "#dc2626", desc: "Medical QA, clinical NLP & diagnostic imaging benchmarks for biomedical AI systems" },
  { label: "Mathematics",      icon: BarChart3, color: "#2563eb", desc: "From arithmetic word problems to formal proof verification across multiple difficulty levels" },
  { label: "Time Series",      icon: TrendingUp,color: "#65a30d", desc: "Forecasting future values & anomaly detection across temporal signals and sensor streams" },
  { label: "Graphs",           icon: Network,   color: "#c026d3", desc: "Node classification, link prediction & graph-level reasoning on structured relational data" },
  { label: "Scientific AI",    icon: Target,    color: "#0284c7", desc: "Biology, chemistry & physics evaluations measuring AI progress on scientific discovery tasks" },
];

const TASKS = [
  {
    label: "Question Answering",
    icon: MessageSquare,
    color: "#9333ea",
    bg: "#f3e8ff",
    desc: "Comprehension & factual recall evaluated on open-domain and reading-comprehension datasets",
  },
  {
    label: "Text Generation",
    icon: Puzzle,
    color: "#0284c7",
    bg: "#e0f2fe",
    desc: "Producing coherent, fluent text from prompts, dialogue history or structured inputs",
  },
  {
    label: "Summarization",
    icon: Zap,
    color: "#16a34a",
    bg: "#dcfce7",
    desc: "Condense long documents into concise, accurate summaries scored by ROUGE & BERTScore",
  },
  {
    label: "Machine Translation",
    icon: Languages,
    color: "#d97706",
    bg: "#fef3c7",
    desc: "Translate text across language pairs and evaluate fidelity using BLEU & COMET scores",
  },
  {
    label: "Reasoning",
    icon: Shield,
    color: "#7c3aed",
    bg: "#ede9fe",
    desc: "Multi-step logical & commonsense inference evaluated on chains of thought and proofs",
  },
  {
    label: "Mathematical Reasoning",
    icon: Binary,
    color: "#1d4ed8",
    bg: "#dbeafe",
    desc: "Arithmetic word problems to olympiad-level formal proofs across difficulty tiers",
  },
  {
    label: "Code Generation",
    icon: Database,
    color: "#059669",
    bg: "#d1fae5",
    desc: "Generate correct, executable code from natural language specifications & test suites",
  },
  {
    label: "Software Engineering",
    icon: Box,
    color: "#0891b2",
    bg: "#cffafe",
    desc: "Resolve real-world GitHub issues end-to-end, measured by patch resolve rate",
  },
  {
    label: "Retrieval",
    icon: FileSearch,
    color: "#e11d48",
    bg: "#ffe4e6",
    desc: "Fetch semantically relevant documents ranked by precision, recall & NDCG metrics",
  },
  {
    label: "Image Classification",
    icon: ImageIcon,
    color: "#6366f1",
    bg: "#e0e7ff",
    desc: "Assign category labels to images measured by top-1 and top-5 accuracy on held-out sets",
  },
  {
    label: "Object Detection",
    icon: Radar,
    color: "#ea580c",
    bg: "#fff7ed",
    desc: "Locate & classify objects in images using mean average precision across IoU thresholds",
  },
  {
    label: "Semantic Segmentation",
    icon: Scissors,
    color: "#65a30d",
    bg: "#f7fee7",
    desc: "Per-pixel scene labeling on benchmarks like ADE20K, evaluated by mean IoU score",
  },
  {
    label: "Visual Question Answering",
    icon: Fingerprint,
    color: "#db2777",
    bg: "#fce7f3",
    desc: "Answer open-ended questions grounded in image content across diverse VQA datasets",
  },
  {
    label: "Document Parsing",
    icon: FlaskConical,
    color: "#7e22ce",
    bg: "#f5f3ff",
    desc: "Extract structured tables, figures & text from complex PDF and scanned documents",
  },
  {
    label: "OCR",
    icon: Scan,
    color: "#4f46e5",
    bg: "#eef2ff",
    desc: "Digitize printed & handwritten text from images and scanned pages with high accuracy",
  },
  {
    label: "Image Captioning",
    icon: Sparkles,
    color: "#f59e0b",
    bg: "#fef9c3",
    desc: "Generate descriptive captions for images, evaluated by BLEU, CIDEr & SPICE metrics",
  },
  {
    label: "Speech Recognition",
    icon: Headphones,
    color: "#0d9488",
    bg: "#ccfbf1",
    desc: "Transcribe spoken audio to text across accents & noise conditions measured by WER",
  },
  {
    label: "Speech Synthesis",
    icon: Speaker,
    color: "#c026d3",
    bg: "#fae8ff",
    desc: "Generate natural, intelligible speech from text evaluated by MOS & naturalness scores",
  },
  {
    label: "Audio Classification",
    icon: Move,
    color: "#ca8a04",
    bg: "#fefce8",
    desc: "Categorize audio clips into sound events, music genres or environmental class labels",
  },
  {
    label: "Video Understanding",
    icon: Film,
    color: "#dc2626",
    bg: "#fee2e2",
    desc: "Action recognition, video QA & temporal reasoning across long-form video sequences",
  },
  {
    label: "Planning",
    icon: Satellite,
    color: "#10b981",
    bg: "#ecfdf5",
    desc: "Step-by-step goal planning, task decomposition & sequential decision-making in agents",
  },
  {
    label: "Navigation",
    icon: Network,
    color: "#f97316",
    bg: "#fff7ed",
    desc: "Reach spatial targets efficiently via path planning measured by SPL & success rate",
  },
];

const COLLECTIONS = [
  { label: "Reasoning",        icon: Stethoscope,  color: "#9333ea", bg: "#f3e8ff", desc: "GPQA, ARC-AGI & commonsense evals covering logical, causal & abstract reasoning" },
  { label: "Coding",           icon: Palette,      color: "#16a34a", bg: "#dcfce7", desc: "HumanEval, SWE-Bench & code generation tasks across multiple languages & environments" },
  { label: "Agent Evaluation", icon: ScanEye,      color: "#d97706", bg: "#fef3c7", desc: "Tool use, long-horizon planning & multi-turn agent tasks in interactive environments" },
  { label: "Vision",           icon: Clock,        color: "#0891b2", bg: "#e0f2fe", desc: "Object detection, semantic segmentation & image classification recognition benchmarks" },
  { label: "OCR & Document AI",icon: Flame,        color: "#7c3aed", bg: "#ede9fe", desc: "Parsing, OCR accuracy & table extraction from scanned and digitally-born documents" },
  { label: "Language",         icon: ArrowUpRight, color: "#0284c7", bg: "#dbeafe", desc: "QA, summarization & translation evals measuring fluency, faithfulness & comprehension" },
  { label: "Multimodal",       icon: Star,         color: "#db2777", bg: "#fce7f3", desc: "Cross-modal vision-language reasoning across images, charts, video & audio inputs" },
  { label: "Audio & Speech",   icon: Music,        color: "#0d9488", bg: "#ccfbf1", desc: "ASR transcription, TTS naturalness & audio classification across diverse sound domains" },
  { label: "Robotics",         icon: Plus,         color: "#4f46e5", bg: "#e0e7ff", desc: "Manipulation dexterity & embodied navigation control in simulated & physical settings" },
  { label: "Healthcare",       icon: Filter,       color: "#dc2626", bg: "#fee2e2", desc: "Medical QA, clinical note NLP & diagnostic imaging benchmarks for biomedical AI" },
  { label: "Mathematics",      icon: Trophy,       color: "#2563eb", bg: "#dbeafe", desc: "Arithmetic to olympiad-level proof verification across structured mathematical domains" },
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

// ── Popular Benchmarks icon pool (12 unique icons) ──────────────────────────
const POPULAR_ICON_POOL = [
  { icon: Trophy,      color: "#e11d48", bg: "#ffe4e6" },
  { icon: Brain,       color: "#9333ea", bg: "#f3e8ff" },
  { icon: Code,        color: "#059669", bg: "#d1fae5" },
  { icon: Eye,         color: "#0891b2", bg: "#e0f2fe" },
  { icon: BarChart3,   color: "#1d4ed8", bg: "#dbeafe" },
  { icon: Layers,      color: "#db2777", bg: "#fce7f3" },
  { icon: Mic,         color: "#0d9488", bg: "#ccfbf1" },
  { icon: Heart,       color: "#dc2626", bg: "#fee2e2" },
  { icon: Network,     color: "#7c3aed", bg: "#ede9fe" },
  { icon: Activity,    color: "#ea580c", bg: "#fff7ed" },
  { icon: Target,      color: "#65a30d", bg: "#f7fee7" },
  { icon: BookOpen,    color: "#0284c7", bg: "#dbeafe" },
] as const;

// ── Recently Added icon pool (12 unique icons — none from POPULAR_ICON_POOL) ─
const RECENT_ICON_POOL = [
  { icon: Bot,         color: "#d97706", bg: "#fef3c7" },
  { icon: FileText,    color: "#7c3aed", bg: "#ede9fe" },
  { icon: Video,       color: "#e11d48", bg: "#ffe4e6" },
  { icon: Cpu,         color: "#4f46e5", bg: "#e0e7ff" },
  { icon: TrendingUp,  color: "#16a34a", bg: "#dcfce7" },
  { icon: MessageSquare, color: "#0891b2", bg: "#e0f2fe" },
  { icon: Puzzle,      color: "#9333ea", bg: "#f3e8ff" },
  { icon: Zap,         color: "#ca8a04", bg: "#fef9c3" },
  { icon: Languages,   color: "#0d9488", bg: "#ccfbf1" },
  { icon: Shield,      color: "#c026d3", bg: "#fae8ff" },
  { icon: Binary,      color: "#1d4ed8", bg: "#dbeafe" },
  { icon: Database,    color: "#059669", bg: "#d1fae5" },
] as const;

// ── Trending Benchmarks icon pool (12 unique icons — none from above pools) ──
const TRENDING_ICON_POOL = [
  { icon: Box,         color: "#ea580c", bg: "#fff7ed" },
  { icon: FileSearch,  color: "#db2777", bg: "#fce7f3" },
  { icon: ImageIcon,   color: "#6366f1", bg: "#e0e7ff" },
  { icon: Radar,       color: "#0284c7", bg: "#e0f2fe" },
  { icon: Scissors,    color: "#65a30d", bg: "#f7fee7" },
  { icon: Fingerprint, color: "#7e22ce", bg: "#f5f3ff" },
  { icon: FlaskConical,color: "#0891b2", bg: "#cffafe" },
  { icon: Scan,        color: "#dc2626", bg: "#fee2e2" },
  { icon: Sparkles,    color: "#f59e0b", bg: "#fef9c3" },
  { icon: Headphones,  color: "#0d9488", bg: "#ccfbf1" },
  { icon: Speaker,     color: "#9333ea", bg: "#f3e8ff" },
  { icon: Film,        color: "#d97706", bg: "#fef3c7" },
] as const;

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

  const BenchmarkCard = ({ b, index }: { b: BenchmarkItem; index: number }) => {
    const meta = getMeta(b.name);
    const { icon: Icon, color } = POPULAR_ICON_POOL[index % POPULAR_ICON_POOL.length];
    return (
      <div
        onClick={() => handleItemClick(b.slug)}
        className="bg-white border border-gray-100 rounded-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group flex flex-col h-[180px] p-5 w-full"
      >
        <div className="flex items-start gap-2.5 mb-2">
          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
            <Icon size={18} style={{ color }} />
          </div>
          <h3 className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 line-clamp-1">{b.name}</h3>
        </div>
        <div className="text-xs text-gray-500 leading-normal h-[3.375rem] overflow-hidden flex flex-col justify-between">
          <span className="truncate">Task: {meta.task}</span>
          <span className="truncate">Domain: {meta.category}</span>
          <span className="truncate">Status: {meta.status}</span>
        </div>
        <div className="pt-2 mt-auto border-t border-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Metric: {meta.metric}</span>
          <span className="text-[10px] text-gray-400 font-mono">{meta.year}</span>
        </div>
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
          <div className="max-w-7xl mx-auto px-6 py-4 w-full">
            
            {/* ══ HERO SECTION — responsive image scales to ~1/3 hero height ══ */}
            <div className="relative overflow-hidden mb-5 flex items-center min-h-[160px] md:min-h-[200px] lg:min-h-[240px]">
              {/* Left Content — grows, takes available space */}
              <div className="relative z-10 flex-1 px-4 md:px-6 py-3 md:py-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight text-gray-900">
                  Benchmarks
                </h1>
                <p className="text-gray-600 text-sm md:text-base mb-3 max-w-md leading-relaxed">
                  Discover benchmark datasets, evaluation metrics, and state-of-the-art results used to measure AI systems across language, reasoning, and more.
                </p>


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

            </div>

            {/* ══ CONTENT TWO-COLUMN LAYOUT (Preserved sidebar layout) ══ */}
            <div className="flex gap-6">
              
              {/* Left Sticky Sidebar (w-64) */}
              <aside
                className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm"
                aria-label="Benchmark navigation"
              >
                <div className="sticky top-0 flex flex-col h-[calc(100vh-10rem)]">
                  <h3 className="text-[15px] font-semibold uppercase text-[#FF5A1F] mb-3">
                      Browse Benchmarks
                    </h3>

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
              <div className="flex-1 min-w-0 space-y-8">
                
                {/* ══ 2. BROWSE BY DOMAIN ══ */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Browse by Domain</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {DOMAINS.map(({ label, icon: Icon, color, desc }) => (
                      <button
                        key={label}
                        onClick={() => scrollToDirectory(label)}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group text-left flex flex-col h-[180px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: color + "18" }}>
                            <Icon size={18} style={{ color }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 line-clamp-1">{label}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-normal overflow-hidden h-[3.375rem]">{desc}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* ══ 3. BROWSE BY TASK ══ */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Browse by Task</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {TASKS.map(({ label, icon: Icon, color, bg, desc }) => (
                      <button
                        key={label}
                        onClick={() => {
                          setTaskFilter(label);
                          scrollToDirectory();
                        }}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group text-left flex flex-col h-[180px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: bg }}>
                            <Icon size={18} style={{ color }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 group-hover:text-[#FF5A1F] transition-colors line-clamp-1">{label}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-normal overflow-hidden h-[3.375rem]">{desc}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* ══ 4. BENCHMARK COLLECTIONS ══ */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Benchmark Collections</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {COLLECTIONS.map(({ label, icon: Icon, color, bg, desc }) => (
                      <button
                        key={label}
                        onClick={() => scrollToDirectory(label)}
                        className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group text-left flex flex-col h-[180px] w-full cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: bg }}>
                            <Icon size={18} style={{ color }} />
                          </div>
                          <span className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 line-clamp-1">{label}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-normal overflow-hidden h-[3.375rem]">{desc}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Each collection shows all related benchmarks in the directory below.</p>
                </section>

                {/* ══ 5. POPULAR BENCHMARKS ══ */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
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
                      {popularBenchmarks.slice(0, 12).map((b, idx) => <BenchmarkCard key={b.id} b={b} index={idx} />)}
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {recentlyAdded.map((b, idx) => {
                        const meta = getMeta(b.name);
                        const { icon: Icon, color, bg } = RECENT_ICON_POOL[idx % RECENT_ICON_POOL.length];
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleItemClick(b.slug)}
                            className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md cursor-pointer group transition-all flex flex-col h-[180px]"
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: bg }}>
                                <Icon size={18} style={{ color }} />
                              </div>
                              <h3 className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 line-clamp-1">{b.name}</h3>
                            </div>
                            <div className="text-xs text-gray-500 leading-normal h-[3.375rem] overflow-hidden flex flex-col justify-between">
                              <span className="truncate">Task: {meta.task}</span>
                              <span className="truncate">Domain: {meta.category}</span>
                              <span className="truncate">Status: {meta.status}</span>
                            </div>
                            <div className="pt-2 mt-auto border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[11px] text-gray-400">Metric: {meta.metric}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{meta.year}</span>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {trending.map((b, idx) => {
                        const meta = getMeta(b.name);
                        const { icon: Icon, color, bg } = TRENDING_ICON_POOL[idx % TRENDING_ICON_POOL.length];
                        return (
                          <div
                            key={b.id}
                            onClick={() => handleItemClick(b.slug)}
                            className="bg-white border border-gray-100 rounded-sm p-5 hover:shadow-md cursor-pointer group transition-all flex flex-col h-[180px]"
                          >
                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform" style={{ background: bg }}>
                                <Icon size={18} style={{ color }} />
                              </div>
                              <h3 className="font-semibold text-gray-800 text-[14px] leading-snug pt-0.5 flex-1 min-w-0 line-clamp-1">{b.name}</h3>
                            </div>
                            <div className="text-xs text-gray-500 leading-normal h-[3.375rem] overflow-hidden flex flex-col justify-between">
                              <span className="truncate">Task: {meta.task}</span>
                              <span className="truncate">Domain: {meta.category}</span>
                              <span className="truncate">Status: {meta.status}</span>
                            </div>
                            <div className="pt-2 mt-auto border-t border-gray-50 flex items-center justify-between">
                              <span className="text-[11px] text-gray-400">Metric: {meta.metric}</span>
                              <span className="text-[12px] font-bold text-[#FF5A1F] font-mono tabular-nums">{b._count?.rankings ?? 0} results</span>
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
                          {TASKS.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
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
