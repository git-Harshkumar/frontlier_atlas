"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Binary,
  BookOpen,
  Bot,
  Box,
  ChevronRight,
  Brain,
  Car,
  Code,
  Database,
  Eye,
  FileSearch,
  FileText,
  Film,
  Fingerprint,
  Headphones,
  ImageIcon,
  Languages,
  Layers,
  LayoutGrid,
  List,
  MessageSquare,
  Mic,
  Monitor,
  Move,
  Music,
  Network,
  Palette,
  Pencil,
  Plus,
  Puzzle,
  Radar,
  Scan,
  ScanEye,
  Scissors,
  Shield,
  Speaker,
  Sparkles,
  Stethoscope,
  Tablet,
  Target,
  TrendingUp,
  Users,
  Video,
  Waves,
  Zap,
  Satellite,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/public/bg-image.png";
import { getTaskPaperCounts, type TaskPaperCounts } from "@/lib/tasks";

interface CapabilityItem {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  desc: string;
  count: string; // This will be populated from backend
  slug: string;
}

type DomainItem = string;

interface SectionData {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  iconColor: string;
  data: CapabilityItem[] | DomainItem[];
}

type SectionsType = Record<string, SectionData>;

const isCapabilityItem = (
  item: CapabilityItem | DomainItem,
): item is CapabilityItem => {
  return (
    typeof item === "object" &&
    item !== null &&
    "icon" in item &&
    "title" in item
  );
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

// Missing icons - using fallbacks
const Wand = ({
  size,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) => <Sparkles size={size} className={className} style={style} />;

// Icon mapping for domain items
const domainIconMap: Record<
  string,
  React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>
> = {
  "3D Generation": Box,
  "3D Instance Segmentation": Scan,
  "3D Object Detection": Target,
  "3D Semantic Segmentation": Layers,
  "Depth Estimation": Eye,
  "Document Layout Analysis": FileSearch,
  "Earth Observation": Satellite,
  "Face Recognition": Fingerprint,
  "Image Classification": ImageIcon,
  "Image Editing": Palette,
  "Image Generation": Sparkles,
  "Image Segmentation": Scissors,
  "Image Super-Resolution": Scan,
  "Image Restoration": Wand,
  "Medical Imaging": Stethoscope,
  "Object Counting": Target,
  "Object Detection": Radar,
  "Pose Estimation": Move,
  "Semi-Supervised Image Classification": Binary,
  "Text-to-Image": ImageIcon,
  "Audio Generation": Music,
  "Audio Understanding": Mic,
  "Motion Generation": Activity,
  "Optical Flow": Waves,
  "Text-to-SQL": Database,
  "Text Generation": Pencil,
  "Video Generation": Video,
  "Video Understanding": Video,
  "Video Restoration": Film,
  "Entity Typing": Users,
  "Machine Translation": Languages,
  "Named Entity Recognition": FileText,
  "Part-of-Speech Tagging": BookOpen,
  "Question Answering": MessageSquare,
  "Relation Extraction": Network,
  Summarization: FileText,
  "Table Question Answering": Tablet,
  "Text Classification": Binary,
  "Audio Classification": Headphones,
  "Audio Restoration": Speaker,
};

const getDomainIcon = (
  item: string,
): React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}> => {
  return domainIconMap[item] || Sparkles;
};

// Skeleton loader component for paper count
const PaperCountSkeleton: React.FC = () => (
  <div className="flex items-center gap-1.5">
    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
  </div>
);

const FrontierAtlas: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<string>("All Domains");
  const [paperCounts, setPaperCounts] = useState<TaskPaperCounts>({});
  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(true);

  useEffect(() => {
    getTaskPaperCounts()
      .then((counts) => {
        setPaperCounts(counts);
        setIsLoadingCounts(false);
      })
      .catch((error) => {
        console.error("Failed to load task counts:", error);
        setIsLoadingCounts(false);
      });
  }, []);

  const sections: SectionsType = useMemo(
    () => ({
      "Core Capabilities": {
        icon: Users,
        color: "#fce8ec",
        iconColor: "#e11d48",
        data: [
          {
            icon: Bot,
            title: "Agents",
            desc: "Autonomous systems that perceive, reason, and act.",
            count: "", // Will be populated from backend
            slug: "agents",
          },
          {
            icon: Zap,
            title: "Anomaly Detection",
            desc: "Identifying unusual patterns in data.",
            count: "",
            slug: "anomaly-detection",
          },
          {
            icon: Car,
            title: "Autonomous Driving",
            desc: "AI for self-driving and intelligent vehicles.",
            count: "",
            slug: "autonomous-driving",
          },
          {
            icon: Code,
            title: "Coding Agents",
            desc: "AI agents for code generation and assistance.",
            count: "",
            slug: "coding-agents",
          },
          {
            icon: Monitor,
            title: "Computer Use Agents",
            desc: "Agents that interact with computers.",
            count: "",
            slug: "computer-use-agents",
          },
          {
            icon: Shield,
            title: "Deepfake & Forensics",
            desc: "Synthesizing detection and media forensics.",
            count: "",
            slug: "deepfake-forensics",
          },
          {
            icon: FileText,
            title: "Document Understanding",
            desc: "Extracting insights from documents.",
            count: "",
            slug: "document-understanding",
          },
          {
            icon: Layers,
            title: "Embedding Models",
            desc: "Representation learning and embeddings.",
            count: "",
            slug: "embedding-models",
          },
          {
            icon: MessageSquare,
            title: "Language Modeling",
            desc: "Models for understanding and generating text.",
            count: "",
            slug: "language-modeling",
          },
          {
            icon: Scan,
            title: "OCR",
            desc: "Optical character recognition.",
            count: "",
            slug: "ocr",
          },
          {
            icon: Puzzle,
            title: "Omni Models",
            desc: "Unified models for vision, text, and audio.",
            count: "",
            slug: "omni-models",
          },
          {
            icon: Brain,
            title: "Reasoning",
            desc: "Logical reasoning and problem solving.",
            count: "",
            slug: "reasoning",
          },
          {
            icon: BarChart3,
            title: "Reinforcement Learning",
            desc: "Learning through rewards and feedback.",
            count: "",
            slug: "reinforcement-learning",
          },
          {
            icon: Satellite,
            title: "Remote Sensing",
            desc: "Earth observation and satellite imagery.",
            count: "",
            slug: "remote-sensing",
          },
          {
            icon: Bot,
            title: "Robotics",
            desc: "Robotic perception, control, and manipulation.",
            count: "",
            slug: "robotics",
          },
          {
            icon: ScanEye,
            title: "Scene Text Recognition",
            desc: "Reading text in natural scenes.",
            count: "",
            slug: "scene-text-recognition",
          },
        ],
      },
      "Perception & Understanding": {
        icon: Eye,
        color: "#e0f2fe",
        iconColor: "#0284c7",
        data: [
          "3D Generation",
          "3D Instance Segmentation",
          "3D Object Detection",
          "3D Semantic Segmentation",
          "Depth Estimation",
          "Document Layout Analysis",
          "Earth Observation",
          "Face Recognition",
          "Image Classification",
          "Image Editing",
          "Image Generation",
          "Image Segmentation",
          "Image Super-Resolution",
          "Image Restoration",
          "Medical Imaging",
          "Object Counting",
          "Object Detection",
          "Pose Estimation",
          "Semi-Supervised Image Classification",
          "Text-to-Image",
        ],
      },
      "Content Generation": {
        icon: Sparkles,
        color: "#dcfce7",
        iconColor: "#16a34a",
        data: [
          "Audio Generation",
          "Audio Understanding",
          "Motion Generation",
          "Optical Flow",
          "Text-to-SQL",
          "Text Generation",
          "Video Generation",
          "Video Understanding",
          "Video Restoration",
        ],
      },
      "Language & Communication": {
        icon: MessageSquare,
        color: "#fef3c7",
        iconColor: "#d97706",
        data: [
          "Entity Typing",
          "Machine Translation",
          "Named Entity Recognition",
          "Part-of-Speech Tagging",
          "Question Answering",
          "Relation Extraction",
          "Summarization",
          "Table Question Answering",
          "Text Classification",
        ],
      },
      Audio: {
        icon: Music,
        color: "#f3e8ff",
        iconColor: "#9333ea",
        data: [
          "Audio Classification",
          "Audio Generation",
          "Audio Understanding",
          "Audio Restoration",
        ],
      },
    }),
    [],
  );

  const filterButtons = ["All Domains", ...Object.keys(sections)];
  const stats = [
    { label: "Domains", value: "56" },
    { label: "Papers", value: "100K+" },
    { label: "Researchers", value: "12K+" },
  ];

  const getFilteredData = useMemo(() => {
    if (activeFilter === "All Domains") return sections;
    return { [activeFilter]: sections[activeFilter] };
  }, [activeFilter, sections]);

  const handleItemClick = (slug: string) => {
    router.push(`/tasks/${slug}`);
  };

  const formatPaperCount = (slug: string) => {
    const count = paperCounts[slug];
    if (count === undefined) return "0 papers";
    if (count === 0) return "0 papers";
    const value =
      count >= 1000
        ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
        : count.toString();
    return `${value} papers`;
  };

  const renderGridItem = (
    item: CapabilityItem | DomainItem,
    index: number,
    isCapability: boolean,
  ) => {
    const isItem = isCapability && isCapabilityItem(item);
    const Icon = isItem
      ? (item as CapabilityItem).icon
      : getDomainIcon(item as string);
    const color = isItem
      ? iconColors[index % iconColors.length]
      : iconColors[index % iconColors.length];
    const slug = isItem
      ? (item as CapabilityItem).slug
      : (item as string).toLowerCase().replace(/\s+/g, "-");

    return (
      <div
        key={isItem ? (item as CapabilityItem).title : `${item}-${index}`}
        onClick={() => handleItemClick(slug)}
        className="bg-white p-4 rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
            <Icon size={isItem ? 20 : 16} style={{ color }} />
          </div>
        </div>
        {isItem ? (
          <>
            <h3 className="font-semibold text-gray-800 mt-2 text-sm">
              {(item as CapabilityItem).title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-tight line-clamp-2">
              {(item as CapabilityItem).desc}
            </p>
            <div className="mt-3">
              {isLoadingCounts ? (
                <PaperCountSkeleton />
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  {formatPaperCount(slug)}
                </div>
              )}
            </div>
          </>
        ) : (
          <span className="text-xs font-medium text-gray-700 mt-2 block">
            {item as string}
          </span>
        )}
      </div>
    );
  };

  const renderListItem = (
    item: CapabilityItem | DomainItem,
    index: number,
    dataLength: number,
    isCapability: boolean,
  ) => {
    const isItem = isCapability && isCapabilityItem(item);
    const Icon = isItem
      ? (item as CapabilityItem).icon
      : getDomainIcon(item as string);
    const color = isItem
      ? iconColors[index % iconColors.length]
      : iconColors[index % iconColors.length];
    const slug = isItem
      ? (item as CapabilityItem).slug
      : (item as string).toLowerCase().replace(/\s+/g, "-");

    return (
      <div
        key={isItem ? (item as CapabilityItem).title : `${item}-${index}`}
        onClick={() => handleItemClick(slug)}
        className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
          index !== dataLength - 1 ? "border-b border-gray-100" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon size={isItem ? 20 : 16} style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {isItem ? (item as CapabilityItem).title : (item as string)}
            </h3>
            {isItem && (
              <p className="text-xs text-gray-500">
                {(item as CapabilityItem).desc}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isItem && (
            isLoadingCounts ? (
              <PaperCountSkeleton />
            ) : (
              <span className="text-xs text-gray-400">
                {formatPaperCount(slug)}
              </span>
            )
          )}
          <ChevronRight size={16} className="text-gray-300" />
        </div>
      </div>
    );
  };

  const renderSection = (title: string, section: SectionData) => {
    const isCapability = title === "Core Capabilities";
    const data = section.data;
    const Icon = section.icon;

    return (
      <section key={title} className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-full"
              style={{
                backgroundColor: section.color,
                color: section.iconColor,
              }}
            >
              <Icon size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <span className="text-sm ml-2 text-black">
              {data.length} domains
            </span>
          </div>
          <button className="flex items-center gap-1 text-[#0ea5e9] text-sm font-medium hover:underline">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {viewMode === "grid" ? (
          <div
            className={`grid ${
              isCapability
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            } gap-4`}
          >
            {data.map((item, idx) => renderGridItem(item, idx, isCapability))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {data.map((item, idx) =>
              renderListItem(item, idx, data.length, isCapability),
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section with Background Image */}
        <div className="relative overflow-hidden mb-12 hidden md:flex min-h-[500px]">
          {/* Left Content - 65% */}
          <div className="relative z-10 w-[35%] px-6 md:px-10 py-12 md:py-16">
            <div className="inline-block px-3 py-1 rounded-full text-[#0ea5e9] text-xs font-semibold uppercase tracking-wider mb-4">
              Browse Research
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900">
              All Research
              <br />
              <span className="text-[#e11d48]">Domains</span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md leading-relaxed">
              Explore the full spectrum of AI research across tasks, methods,
              and applications.
            </p>

            <div className="flex items-center gap-6 whitespace-nowrap text-sm">
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm">
                      {stat.label}
                    </div>
                  </div>

                  {index < stats.length - 1 && (
                    <div className="w-px h-10 bg-gray-200" />
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 border-2 border-gray-200 rounded-full px-4 py-1.5 bg-white/50 backdrop-blur-sm ml-2 cursor-pointer hover:shadow-sm">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-gray-600 font-medium text-xs md:text-sm">
                  Daily updates
                </span>
              </div>
            </div>
          </div>

          {/* Right Image - 35% */}
          <div className="relative w-[65%]">
            <Image
              src={bgImage}
              alt="AI Research Background"
              fill
              className="object-contain object-right"
              priority
            />
          </div>
        </div>

        {/* Filter & View Toggle */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeFilter === filter
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 transition-colors ${mode === "list" ? "border-l border-gray-200" : ""} ${
                  viewMode === mode
                    ? "bg-gray-50 text-[#e11d48]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {mode === "grid" ? (
                  <LayoutGrid size={16} />
                ) : (
                  <List size={16} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Render Sections - No main loading state */}
        {Object.entries(getFilteredData).map(([title, section]) =>
          renderSection(title, section),
        )}

        {/* Bottom CTA */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#fee2e2] rounded-full text-[#ef4444]">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Can&apos;t find what you&apos;re looking for?
              </h4>
              <p className="text-sm text-gray-500 mt-0.5">
                Suggest a new domain or help us improve our taxonomy to better
                organize AI research.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} /> Suggest a Domain
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrontierAtlas;