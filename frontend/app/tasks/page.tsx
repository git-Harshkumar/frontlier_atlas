"use client";

import React, { useState, useRef } from "react";
import {
  Search,
  Activity,
  BarChart3,
  Binary,
  BookOpen,
  Bot,
  Box,
  Brain,
  Car,
  Code,
  Database,
  Eye,
  FileSearch,
  FileText,
  Film,
  Fingerprint,
  FlaskConical,
  Headphones,
  ImageIcon,
  Languages,
  Layers,
  MessageSquare,
  Mic,
  Monitor,
  Move,
  Music,
  Network,
  Palette,
  Plus,
  Puzzle,
  Radar,
  Satellite,
  Scan,
  ScanEye,
  Scissors,
  Shield,
  Sparkles,
  Speaker,
  Stethoscope,
  Tablet,
  Target,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/public/bg-image.png";

// ----------------------------------------------------------------------
//  Types
// ----------------------------------------------------------------------
interface CapabilityItem {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  desc: string;
  slug: string;
}

interface SectionData {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  iconColor: string;
  data: CapabilityItem[];
}

type SectionsType = Record<string, SectionData>;

// ----------------------------------------------------------------------
//  Data & Constants
// ----------------------------------------------------------------------
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

// All domain data (kept inside a stable object to avoid re‑renders)
const sections: SectionsType = {
  "Foundation Models": {
    icon: Brain,
    color: "#fce8ec",
    iconColor: "#e11d48",
    data: [
      {
        icon: Brain,
        title: "Large Language Models",
        desc: "Large-scale models for understanding and generating text.",
        slug: "large-language-models",
      },
      {
        icon: Brain,
        title: "Small Language Models",
        desc: "Efficient, compact language models for constrained environments.",
        slug: "small-language-models",
      },
      {
        icon: Eye,
        title: "Vision-Language Models",
        desc: "Models that understand and generate across vision and language.",
        slug: "vision-language-models",
      },
      {
        icon: Layers,
        title: "Multimodal Models",
        desc: "Models processing multiple data modalities simultaneously.",
        slug: "multimodal-models",
      },
      {
        icon: Puzzle,
        title: "Omni Models",
        desc: "Unified models for vision, text, audio, and more.",
        slug: "omni-models",
      },
      {
        icon: Layers,
        title: "Embedding Models",
        desc: "Representation learning and vector embeddings.",
        slug: "embedding-models",
      },
      {
        icon: Brain,
        title: "Reasoning Models",
        desc: "Models specialized in logical reasoning and problem solving.",
        slug: "reasoning-models",
      },
      {
        icon: Target,
        title: "World Models",
        desc: "Models that simulate and predict real-world dynamics.",
        slug: "world-models",
      },
      {
        icon: FileText,
        title: "Long Context Models",
        desc: "Models optimized for very long sequences and documents.",
        slug: "long-context-models",
      },
      {
        icon: BarChart3,
        title: "Reinforcement Learning",
        desc: "Learning through rewards, feedback, and environment interaction.",
        slug: "reinforcement-learning",
      },
      {
        icon: Target,
        title: "Model Alignment",
        desc: "Aligning AI behavior with human values and preferences.",
        slug: "model-alignment",
      },
      {
        icon: Zap,
        title: "Efficient Training",
        desc: "Methods for faster, cheaper, and more efficient model training.",
        slug: "efficient-training",
      },
    ],
  },
  "AI Agents": {
    icon: Bot,
    color: "#e0f2fe",
    iconColor: "#0284c7",
    data: [
      {
        icon: Bot,
        title: "Agents",
        desc: "Autonomous systems that perceive, reason, and act independently.",
        slug: "agents",
      },
      {
        icon: Code,
        title: "Coding Agents",
        desc: "AI agents specialized in code generation and software development.",
        slug: "coding-agents",
      },
      {
        icon: Monitor,
        title: "Computer Use Agents",
        desc: "Agents that interact with graphical user interfaces.",
        slug: "computer-use-agents",
      },
      {
        icon: Monitor,
        title: "Browser Agents",
        desc: "Agents that navigate and interact with web browsers.",
        slug: "browser-agents",
      },
      {
        icon: BookOpen,
        title: "Research Agents",
        desc: "Agents for literature review, analysis, and research automation.",
        slug: "research-agents",
      },
      {
        icon: Users,
        title: "Multi-Agent Systems",
        desc: "Systems where multiple AI agents collaborate and coordinate.",
        slug: "multi-agent-systems",
      },
      {
        icon: Puzzle,
        title: "Tool Calling",
        desc: "AI agents that can invoke external tools and APIs.",
        slug: "tool-calling",
      },
      {
        icon: Database,
        title: "Agent Memory",
        desc: "Memory systems for persistent agent knowledge and context.",
        slug: "agent-memory",
      },
      {
        icon: Target,
        title: "Agent Planning",
        desc: "Strategic planning and decision making for AI agents.",
        slug: "agent-planning",
      },
      {
        icon: Zap,
        title: "Workflow Automation",
        desc: "Automating complex multi-step workflows and processes.",
        slug: "workflow-automation",
      },
    ],
  },
  Vision: {
    icon: Eye,
    color: "#dcfce7",
    iconColor: "#16a34a",
    data: [
      {
        icon: ImageIcon,
        title: "Image Classification",
        desc: "Categorizing images into predefined classes.",
        slug: "image-classification",
      },
      {
        icon: Eye,
        title: "Image Understanding",
        desc: "Comprehensive visual scene understanding and interpretation.",
        slug: "image-understanding",
      },
      {
        icon: Radar,
        title: "Object Detection",
        desc: "Locating and identifying objects within images.",
        slug: "object-detection",
      },
      {
        icon: Scissors,
        title: "Image Segmentation",
        desc: "Partitioning images into meaningful regions.",
        slug: "image-segmentation",
      },
      {
        icon: Scan,
        title: "Instance Segmentation",
        desc: "Detecting and delineating individual object instances.",
        slug: "instance-segmentation",
      },
      {
        icon: Sparkles,
        title: "Image Generation",
        desc: "Creating new images from text descriptions or other inputs.",
        slug: "image-generation",
      },
      {
        icon: Palette,
        title: "Image Editing",
        desc: "Modifying and manipulating existing images.",
        slug: "image-editing",
      },
      {
        icon: Palette,
        title: "Image Inpainting",
        desc: "Reconstructing missing or damaged parts of images.",
        slug: "image-inpainting",
      },
      {
        icon: Sparkles,
        title: "Image Restoration",
        desc: "Recovering degraded images to their original quality.",
        slug: "image-restoration",
      },
      {
        icon: Scan,
        title: "Super Resolution",
        desc: "Enhancing image resolution and detail.",
        slug: "super-resolution",
      },
      {
        icon: Scan,
        title: "OCR",
        desc: "Optical character recognition for text in images.",
        slug: "ocr",
      },
      {
        icon: ScanEye,
        title: "Scene Text Recognition",
        desc: "Reading text in natural scenes and environments.",
        slug: "scene-text-recognition",
      },
      {
        icon: Fingerprint,
        title: "Face Recognition",
        desc: "Identifying and verifying individuals from facial features.",
        slug: "face-recognition",
      },
      {
        icon: Move,
        title: "Pose Estimation",
        desc: "Estimating body pose and keypoint locations.",
        slug: "pose-estimation",
      },
      {
        icon: Eye,
        title: "Depth Estimation",
        desc: "Predicting depth information from 2D images.",
        slug: "depth-estimation",
      },
      {
        icon: Stethoscope,
        title: "Medical Imaging",
        desc: "Analysis and interpretation of medical images.",
        slug: "medical-imaging",
      },
      {
        icon: Satellite,
        title: "Remote Sensing",
        desc: "Earth observation and analysis from satellite or aerial imagery.",
        slug: "remote-sensing",
      },
      {
        icon: Satellite,
        title: "Satellite Imaging",
        desc: "Processing and analyzing satellite imagery.",
        slug: "satellite-imaging",
      },
      {
        icon: FileSearch,
        title: "Document Layout Analysis",
        desc: "Understanding document structure and layout.",
        slug: "document-layout-analysis",
      },
      {
        icon: Shield,
        title: "Deepfake Detection",
        desc: "Identifying synthetic and manipulated media.",
        slug: "deepfake-detection",
      },
    ],
  },
  Video: {
    icon: Video,
    color: "#fef3c7",
    iconColor: "#d97706",
    data: [
      {
        icon: Video,
        title: "Video Understanding",
        desc: "Comprehensive analysis and interpretation of video content.",
        slug: "video-understanding",
      },
      {
        icon: Video,
        title: "Video Classification",
        desc: "Categorizing videos into predefined classes.",
        slug: "video-classification",
      },
      {
        icon: Video,
        title: "Video Generation",
        desc: "Creating new video content from text or other inputs.",
        slug: "video-generation",
      },
      {
        icon: Scissors,
        title: "Video Editing",
        desc: "Automated or AI-assisted video editing and manipulation.",
        slug: "video-editing",
      },
      {
        icon: Scissors,
        title: "Video Segmentation",
        desc: "Segmenting video into meaningful temporal or spatial regions.",
        slug: "video-segmentation",
      },
      {
        icon: Film,
        title: "Video Restoration",
        desc: "Recovering and enhancing degraded video content.",
        slug: "video-restoration",
      },
      {
        icon: Target,
        title: "Object Tracking",
        desc: "Following objects across video frames.",
        slug: "object-tracking",
      },
      {
        icon: Activity,
        title: "Action Recognition",
        desc: "Identifying human actions and activities in videos.",
        slug: "action-recognition",
      },
      {
        icon: Move,
        title: "Motion Generation",
        desc: "Generating realistic motion patterns and animations.",
        slug: "motion-generation",
      },
      {
        icon: FileSearch,
        title: "Video Retrieval",
        desc: "Searching and finding specific content within videos.",
        slug: "video-retrieval",
      },
    ],
  },
  "Language & NLP": {
    icon: MessageSquare,
    color: "#f3e8ff",
    iconColor: "#9333ea",
    data: [
      {
        icon: Languages,
        title: "Machine Translation",
        desc: "Automated translation between languages.",
        slug: "machine-translation",
      },
      {
        icon: MessageSquare,
        title: "Question Answering",
        desc: "Answering questions based on provided context or knowledge.",
        slug: "question-answering",
      },
      {
        icon: FileText,
        title: "Summarization",
        desc: "Condensing long texts into concise summaries.",
        slug: "summarization",
      },
      {
        icon: MessageSquare,
        title: "Conversational AI",
        desc: "AI systems for natural dialogue and conversation.",
        slug: "conversational-ai",
      },
      {
        icon: FileText,
        title: "Named Entity Recognition",
        desc: "Identifying named entities like persons, organizations, locations in text.",
        slug: "named-entity-recognition",
      },
      {
        icon: Network,
        title: "Relation Extraction",
        desc: "Extracting relationships between entities in text.",
        slug: "relation-extraction",
      },
      {
        icon: Binary,
        title: "Text Classification",
        desc: "Categorizing text documents into predefined classes.",
        slug: "text-classification",
      },
      {
        icon: FileSearch,
        title: "Text Retrieval",
        desc: "Searching and retrieving relevant text documents.",
        slug: "text-retrieval",
      },
      {
        icon: FileSearch,
        title: "Information Extraction",
        desc: "Extracting structured information from unstructured text.",
        slug: "information-extraction",
      },
      {
        icon: Database,
        title: "Text-to-SQL",
        desc: "Converting natural language to SQL queries.",
        slug: "text-to-sql",
      },
      {
        icon: FileText,
        title: "Document Understanding",
        desc: "Comprehensive understanding of document content and structure.",
        slug: "document-understanding",
      },
      {
        icon: Code,
        title: "Semantic Parsing",
        desc: "Converting natural language to formal meaning representations.",
        slug: "semantic-parsing",
      },
    ],
  },
  "Audio & Speech": {
    icon: Music,
    color: "#fce4ec",
    iconColor: "#db2777",
    data: [
      {
        icon: Mic,
        title: "Automatic Speech Recognition",
        desc: "Converting speech to text.",
        slug: "automatic-speech-recognition",
      },
      {
        icon: Speaker,
        title: "Text-to-Speech",
        desc: "Generating natural speech from text.",
        slug: "text-to-speech",
      },
      {
        icon: Mic,
        title: "Voice Cloning",
        desc: "Replicating and synthesizing specific voices.",
        slug: "voice-cloning",
      },
      {
        icon: Music,
        title: "Audio Generation",
        desc: "Creating new audio content and sounds.",
        slug: "audio-generation",
      },
      {
        icon: Headphones,
        title: "Audio Understanding",
        desc: "Comprehensive analysis and interpretation of audio.",
        slug: "audio-understanding",
      },
      {
        icon: Headphones,
        title: "Audio Classification",
        desc: "Categorizing audio into predefined classes.",
        slug: "audio-classification",
      },
      {
        icon: Speaker,
        title: "Speech Enhancement",
        desc: "Improving speech quality and clarity.",
        slug: "speech-enhancement",
      },
      {
        icon: Music,
        title: "Music Generation",
        desc: "AI-powered music composition and generation.",
        slug: "music-generation",
      },
    ],
  },
  "Robotics & Embodied AI": {
    icon: Bot,
    color: "#e8f5e9",
    iconColor: "#0d9488",
    data: [
      {
        icon: Bot,
        title: "Robotics",
        desc: "Robotic perception, control, and manipulation.",
        slug: "robotics",
      },
      {
        icon: Car,
        title: "Autonomous Driving",
        desc: "AI for self-driving and intelligent vehicles.",
        slug: "autonomous-driving",
      },
      {
        icon: Target,
        title: "Navigation",
        desc: "Path planning and navigation for robots and autonomous systems.",
        slug: "navigation",
      },
      {
        icon: Move,
        title: "Robot Manipulation",
        desc: "Object grasping, manipulation, and fine motor control.",
        slug: "robot-manipulation",
      },
      {
        icon: Eye,
        title: "Robot Perception",
        desc: "Visual and sensory perception for robots.",
        slug: "robot-perception",
      },
      {
        icon: Users,
        title: "Human-Robot Interaction",
        desc: "Natural and intuitive interaction between humans and robots.",
        slug: "human-robot-interaction",
      },
      {
        icon: Brain,
        title: "Embodied AI",
        desc: "AI systems that learn through physical interaction with the world.",
        slug: "embodied-ai",
      },
      {
        icon: Monitor,
        title: "Simulation",
        desc: "Virtual environments for training and testing AI systems.",
        slug: "simulation",
      },
    ],
  },
  "Scientific AI": {
    icon: FlaskConical,
    color: "#e0f2fe",
    iconColor: "#0891b2",
    data: [
      {
        icon: Activity,
        title: "Biology",
        desc: "AI applications in biological research and analysis.",
        slug: "biology",
      },
      {
        icon: Target,
        title: "Drug Discovery",
        desc: "AI-accelerated drug development and molecular design.",
        slug: "drug-discovery",
      },
      {
        icon: Box,
        title: "Protein Modeling",
        desc: "Predicting protein structures and interactions.",
        slug: "protein-modeling",
      },
      {
        icon: Box,
        title: "Chemistry",
        desc: "AI for chemical analysis, prediction, and synthesis.",
        slug: "chemistry",
      },
      {
        icon: Stethoscope,
        title: "Healthcare AI",
        desc: "AI applications in clinical healthcare and medicine.",
        slug: "healthcare-ai",
      },
      {
        icon: Box,
        title: "Materials Science",
        desc: "AI-driven materials discovery and characterization.",
        slug: "materials-science",
      },
      {
        icon: Activity,
        title: "Climate AI",
        desc: "AI for climate modeling, prediction, and sustainability.",
        slug: "climate-ai",
      },
      {
        icon: Brain,
        title: "Scientific Discovery",
        desc: "AI systems that accelerate scientific research and discovery.",
        slug: "scientific-discovery",
      },
    ],
  },
  "Structured Data & Decision AI": {
    icon: Database,
    color: "#fef3c7",
    iconColor: "#ca8a04",
    data: [
      {
        icon: Network,
        title: "Graph Machine Learning",
        desc: "Machine learning on graph-structured data.",
        slug: "graph-machine-learning",
      },
      {
        icon: Database,
        title: "Knowledge Graphs",
        desc: "Building and reasoning with structured knowledge bases.",
        slug: "knowledge-graphs",
      },
      {
        icon: TrendingUp,
        title: "Recommendation Systems",
        desc: "Personalized content and product recommendations.",
        slug: "recommendation-systems",
      },
      {
        icon: Tablet,
        title: "Tabular Learning",
        desc: "Machine learning on structured tabular data.",
        slug: "tabular-learning",
      },
      {
        icon: TrendingUp,
        title: "Time Series Forecasting",
        desc: "Predicting future values in time series data.",
        slug: "time-series-forecasting",
      },
      {
        icon: Activity,
        title: "Time Series Classification",
        desc: "Classifying patterns in time series data.",
        slug: "time-series-classification",
      },
      {
        icon: FileSearch,
        title: "Search & Ranking",
        desc: "Information retrieval and relevance ranking systems.",
        slug: "search-ranking",
      },
      {
        icon: Shield,
        title: "Fraud Detection",
        desc: "Detecting fraudulent activities and anomalies.",
        slug: "fraud-detection",
      },
    ],
  },
  "AI Systems, Safety & Evaluation": {
    icon: Shield,
    color: "#e8eaf6",
    iconColor: "#4f46e5",
    data: [
      {
        icon: Shield,
        title: "AI Safety",
        desc: "Ensuring AI systems are safe, reliable, and beneficial.",
        slug: "ai-safety",
      },
      {
        icon: Shield,
        title: "AI Security",
        desc: "Protecting AI systems from attacks and vulnerabilities.",
        slug: "ai-security",
      },
      {
        icon: Eye,
        title: "Explainable AI",
        desc: "Making AI decisions interpretable and transparent.",
        slug: "explainable-ai",
      },
      {
        icon: BarChart3,
        title: "Model Evaluation",
        desc: "Assessing model performance, capabilities, and limitations.",
        slug: "model-evaluation",
      },
      {
        icon: Target,
        title: "Benchmarking",
        desc: "Standardized evaluation of AI systems and models.",
        slug: "benchmarking",
      },
      {
        icon: Box,
        title: "Model Compression",
        desc: "Reducing model size while maintaining performance.",
        slug: "model-compression",
      },
      {
        icon: Zap,
        title: "Quantization",
        desc: "Reducing numerical precision for efficient model deployment.",
        slug: "quantization",
      },
      {
        icon: Network,
        title: "Federated Learning",
        desc: "Distributed learning across decentralized data.",
        slug: "federated-learning",
      },
    ],
  },
};

const domainList = Object.keys(sections);
const stats = [
  { label: "Domains", value: "10" },
  { label: "Tasks", value: "105" },
  { label: "Papers", value: "100K+" },
];

// ----------------------------------------------------------------------
//  Component
// ----------------------------------------------------------------------
const FrontierAtlas: React.FC = () => {
  const router = useRouter();
  const [activeDomain, setActiveDomain] = useState<string>("");
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleDomainClick = (domain: string) => {
    setActiveDomain(domain);
    const el = document.getElementById(`section-${domain}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleItemClick = (slug: string) => {
    router.push(`/tasks/${slug}`);
  };

  // Reusable grid item
  const GridItem = ({
    item,
    index,
  }: {
    item: CapabilityItem;
    index: number;
  }) => {
    const Icon = item.icon;
    const color = iconColors[index % iconColors.length];
    return (
      <div
        onClick={() => handleItemClick(item.slug)}
        className="bg-white p-5 rounded-sm shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full min-h-[130px]"
      >
        <div className="flex items-start gap-2.5 mb-2">
          <div className="flex-shrink-0 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Icon size={20} style={{ color }} />
          </div>
          <h3 className="font-semibold text-gray-800 text-[15px] leading-snug pt-0.5">
            {item.title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 ml-[2.375rem] line-clamp-2 flex-1">
          {item.desc}
        </p>
      </div>
    );
  };

  // Reusable section block
  const Section = ({
    title,
    section,
  }: {
    title: string;
    section: SectionData;
  }) => (
    <section id={`section-${title}`} className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[30px] font-bold text-gray-800">{title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
        {section.data.map((item, idx) => (
          <GridItem key={item.title} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Main scrollable area */}
        <main
          ref={mainContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll"
        >
          <div className="max-w-7xl mx-auto px-6 py-8 w-full">
            {/* Hero section - reduced by 25% */}
            <div className="relative overflow-hidden mb-10 hidden md:flex min-h-[187.5px]">
              <div className="relative z-10 w-[30%] px-6 md:px-8 py-4 md:py-5">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight text-gray-900">
                  All
                  <span className="text-[#e11d48] ml-3">Tasks</span>
                </h1>
                <p className="text-gray-600 text-xs md:text-sm mb-4 max-w-md leading-relaxed">
                  Discover the full landscape of AI research through 105 tasks spanning language, vision, video, audio, robotics, healthcare, and more.
                </p>
                <div className="flex items-center gap-4 whitespace-nowrap text-xs md:text-sm">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="flex items-center gap-4">
                      <div>
                        <div className="text-lg md:text-xl font-bold text-gray-800">
                          {stat.value}
                        </div>
                        <div className="text-gray-500 text-[10px] md:text-xs">
                          {stat.label}
                        </div>
                      </div>
                      {index < stats.length - 1 && (
                        <div className="w-px h-6 bg-gray-200" />
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 border-2 border-gray-200 rounded-full px-2.5 py-1 bg-white/50 backdrop-blur-sm ml-1 cursor-pointer hover:shadow-sm">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <span className="text-gray-600 font-medium text-[10px] md:text-xs">
                      Daily updates
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative w-[70%] h-[250px] flex justify-center">
                {/*<Image
                  src={bgImage}
                  alt="AI Research Background"
                  fill
                  className="object-contain object-right"
                  priority
                />*/}
              </div>
            </div>

            {/* Main layout: sidebar + content */}
            <div className="flex gap-6">
              {/* Sidebar with domain filters */}
              <aside
                className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm"
                aria-label="Domain navigation"
              >
                <div className="sticky top-20 flex flex-col h-[calc(100vh-5rem)]">
                  {/* Domain navigation */}
                  <div className="px-4 pt-6 pb-4">
                    <h3 className="text-[15px] font-semibold uppercase text-[#e11d48] mb-3">
                      Browse Research
                    </h3>

                    {/* Search input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Filter domains..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-sm border border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white/80 transition-colors"
                      />
                    </div>
                  </div>

                  <nav
                    className="overflow-y-auto px-2 pb-4"
                    aria-label="Domains"
                  >
                    <ul className="space-y-0.5" role="list">
                      {domainList
                        .filter((domain) =>
                          domain
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        )
                        .map((domain) => (
                          <li key={domain}>
                            <button
                              onClick={() => handleDomainClick(domain)}
                              aria-current={
                                activeDomain === domain ? "true" : undefined
                              }
                              className={`
                  w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-200
                  ${
                    activeDomain === domain
                      ? "bg-gray-900 text-white font-medium shadow-sm"
                      : "text-gray-600 hover:scale-105"
                  }
                `}
                            >
                              {domain}
                            </button>
                          </li>
                        ))}
                    </ul>

                    {/* Show a message if no domains match */}
                    {domainList.filter((d) =>
                      d.toLowerCase().includes(searchQuery.toLowerCase()),
                    ).length === 0 && (
                      <p className="text-xs text-gray-500 px-3 py-2">
                        No domains found
                      </p>
                    )}
                  </nav>

                  {/* CTA placed directly below the list */}
                  <div className="px-2 mt-10">
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
                            Suggest a new domain to improve our taxonomy.
                          </p>
                        </div>
                      </div>
                      <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm">
                        <Plus size={14} /> Suggest a Domain
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Sections list */}
              <div className="flex-1 min-w-0">
                {domainList.map((domain) => (
                  <Section
                    key={domain}
                    title={domain}
                    section={sections[domain]}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FrontierAtlas;
