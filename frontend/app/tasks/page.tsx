"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  List,
  Users,
  FileText,
  Layers,
  Box,
  Cpu,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  Music,
  Puzzle,
  Globe,
  Brain,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Plus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import bgImage from "@/public/bg-image.png";

// Type definitions
interface CapabilityItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  count: string;
}

type DomainItem = string;

interface SectionData {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  iconColor: string;
  data: CapabilityItem[] | DomainItem[];
}

interface StatItem {
  label: string;
  value: string;
}

type SectionsType = Record<string, SectionData>;

// Type guard to check if item is CapabilityItem
const isCapabilityItem = (item: CapabilityItem | DomainItem): item is CapabilityItem => {
  return typeof item === "object" && item !== null && "icon" in item && "title" in item;
};

const FrontierAtlas: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<string>("All Domains");

  // Data sections with icons and colors
  const sections: SectionsType = useMemo(
    () => ({
      "Core Capabilities": {
        icon: Users,
        color: "#fce8ec",
        iconColor: "#e11d48",
        data: [
          {
            icon: Users,
            title: "Agents",
            desc: "Autonomous systems that perceive, reason, and act.",
            count: "1.5k papers",
          },
          {
            icon: Zap,
            title: "Anomaly Detection",
            desc: "Identifying unusual patterns in data.",
            count: "3.6k papers",
          },
          {
            icon: Box,
            title: "Autonomous Driving",
            desc: "AI for self-driving and intelligent vehicles.",
            count: "5.6k papers",
          },
          {
            icon: Cpu,
            title: "Coding Agents",
            desc: "AI agents for code generation and assistance.",
            count: "3.8k papers",
          },
          {
            icon: Globe,
            title: "Computer Use Agents",
            desc: "Agents that interact with computers.",
            count: "2.2k papers",
          },
          {
            icon: Shield,
            title: "Deepfake & Forensics",
            desc: "Synthesizing detection and media forensics.",
            count: "2.1k papers",
          },
          {
            icon: FileText,
            title: "Document Understanding",
            desc: "Extracting insights from documents.",
            count: "8.6k papers",
          },
          {
            icon: Layers,
            title: "Embedding Models",
            desc: "Representation learning and embeddings.",
            count: "3.6k papers",
          },
          {
            icon: MessageSquare,
            title: "Language Modeling",
            desc: "Models for understanding and generating text.",
            count: "62.4k papers",
          },
          {
            icon: Eye,
            title: "OCR",
            desc: "Optical character recognition.",
            count: "4.8k papers",
          },
          {
            icon: Puzzle,
            title: "Omni Models",
            desc: "Unified models for vision, text, and audio.",
            count: "2.6k papers",
          },
          {
            icon: Brain,
            title: "Reasoning",
            desc: "Logical reasoning and problem solving.",
            count: "5.7k papers",
          },
          {
            icon: BarChart3,
            title: "Reinforcement Learning",
            desc: "Learning through rewards and feedback.",
            count: "17.9k papers",
          },
          {
            icon: Box,
            title: "Remote Sensing",
            desc: "Earth observation and satellite imagery.",
            count: "4.6k papers",
          },
          {
            icon: Zap,
            title: "Robotics",
            desc: "Robotic perception, control, and manipulation.",
            count: "7.7k papers",
          },
          {
            icon: Layers,
            title: "Scene Text Recognition",
            desc: "Reading text in natural scenes.",
            count: "3.6k papers",
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
          "Text-to-SQL",
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
    []
  );

  const filterButtons = useMemo(() => ["All Domains", ...Object.keys(sections)], [sections]);
  const stats: StatItem[] = useMemo(
    () => [
      { label: "Domains", value: "56" },
      { label: "Papers", value: "100K+" },
      { label: "Researchers", value: "12K+" },
    ],
    []
  );

  const getFilteredData = useMemo(() => {
    if (activeFilter === "All Domains") return sections;
    return { [activeFilter]: sections[activeFilter] };
  }, [activeFilter, sections]);

  const renderGridItem = (item: CapabilityItem | DomainItem, index: number, isCapability: boolean) => {
    const isItem = isCapability && isCapabilityItem(item);
    const Icon = isItem ? (item as CapabilityItem).icon : ImageIcon;

    return (
      <div
        key={isItem ? (item as CapabilityItem).title : `${item}-${index}`}
        className="bg-white p-4 rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
            <Icon size={isItem ? 20 : 14} className={isItem ? "text-[#3b82f6]" : "text-gray-500"} />
          </div>
        </div>
        {isItem ? (
          <>
            <h3 className="font-semibold text-gray-800 mt-2 text-sm">{(item as CapabilityItem).title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-tight line-clamp-2">{(item as CapabilityItem).desc}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300" aria-hidden="true"></div>
              {(item as CapabilityItem).count}
            </div>
          </>
        ) : (
          <span className="text-xs font-medium text-gray-700 mt-2 block">{item as string}</span>
        )}
      </div>
    );
  };

  const renderListItem = (
    item: CapabilityItem | DomainItem,
    index: number,
    dataLength: number,
    isCapability: boolean
  ) => {
    const isItem = isCapability && isCapabilityItem(item);
    const Icon = isItem ? (item as CapabilityItem).icon : ImageIcon;

    return (
      <div
        key={isItem ? (item as CapabilityItem).title : `${item}-${index}`}
        className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
          index !== dataLength - 1 ? "border-b border-gray-100" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Icon size={isItem ? 20 : 14} className={isItem ? "text-[#3b82f6]" : "text-gray-500"} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">
              {isItem ? (item as CapabilityItem).title : (item as string)}
            </h3>
            {isItem && <p className="text-xs text-gray-500">{(item as CapabilityItem).desc}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isItem && <span className="text-xs text-gray-400">{(item as CapabilityItem).count}</span>}
          <ChevronRight size={16} className="text-gray-300" aria-hidden="true" />
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
              style={{ backgroundColor: section.color, color: section.iconColor }}
              aria-hidden="true"
            >
              <Icon size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <span className="text-sm text-gray-400 ml-2">{data.length} domains</span>
          </div>
          <button
            className="flex items-center gap-1 text-[#0ea5e9] text-sm font-medium hover:underline"
            aria-label={`View all ${title}`}
          >
            View all <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>

        {viewMode === "grid" ? (
          <div
            className={`grid ${
              isCapability ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            } gap-4`}
          >
            {data.map((item: CapabilityItem | DomainItem, idx: number) => renderGridItem(item, idx, isCapability))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {data.map((item: CapabilityItem | DomainItem, idx: number) =>
              renderListItem(item, idx, data.length, isCapability)
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
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative overflow-hidden min-h-[400px]">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Image
              src={bgImage}
              alt="Abstract 3D shapes representing AI research domains"
              fill
              className="object-contain object-right-top md:object-right-center opacity-80 mix-blend-multiply"
              priority
              style={{ transform: "scale(1.05)" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="md:w-1/2 z-10 pt-4">
            <div className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider mb-2">Browse Research</div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight text-gray-900">
              All Research
              <br />
              <span className="text-[#e11d48]">Domains</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
              Explore the full spectrum of AI research across tasks, methods, and applications.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {stats.map((stat: StatItem, index: number) => (
                <div key={stat.label}>
                  <div className="font-bold text-2xl text-gray-800 mt-1">{stat.value}</div>
                  <div className={index < stats.length - 1 ? "border-r-2 pr-4" : ""}>{stat.label}</div>
                </div>
              ))}
              <div className="flex items-center gap-2 border-2 rounded-xl h-[30px] px-3 mt-3">
                <TrendingUp size={14} className="text-gray-600" aria-hidden="true" />
                <span className="text-gray-600 font-medium text-sm">Daily updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & View Toggle */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-3" role="tablist">
            {filterButtons.map((filter: string) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                  activeFilter === filter ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                role="tab"
                aria-selected={activeFilter === filter}
                aria-label={`Filter by ${filter}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm" role="group" aria-label="View mode">
            {(["grid", "list"] as const).map((mode: "grid" | "list") => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 transition-colors ${mode === "list" ? "border-l border-gray-200" : ""} ${
                  viewMode === mode ? "bg-gray-50 text-[#e11d48]" : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label={`Switch to ${mode} view`}
                aria-pressed={viewMode === mode}
              >
                {mode === "grid" ? <LayoutGrid size={16} /> : <List size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Render Sections */}
        {Object.entries(getFilteredData).map(([title, section]) => renderSection(title, section))}

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#f8fafc] rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-[#fee2e2] rounded-full text-[#ef4444]" aria-hidden="true">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Can&apos;t find what you&apos;re looking for?</h4>
              <p className="text-sm text-gray-500 mt-0.5">
                Suggest a new domain or help us improve our taxonomy to better organize AI research.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} aria-hidden="true" /> Suggest a Domain
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrontierAtlas;