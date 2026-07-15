"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Clock,
  Star,
  Bot,
  Brain,
  MessageSquare,
  Code2,
  Monitor,
  Globe,
  Cpu,
  Zap,
  Link as LinkIcon,
  RefreshCw,
  Layers,
  FileText,
  ImageIcon,
  Video,
  Volume2,
  BarChart2,
  Target,
  Plug,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onItemClick?: () => void;
  onItemSelect?: (item: string) => void;
  initialActive?: string;
}

// ============ Sub-Components ============
const SectionLabel = ({ title }: { title: string }) => {
  return (
    <div className="px-3 mb-0.5 mt-4 first:mt-1">
      <p className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider">
        {title}
      </p>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  href?: string;
}) => {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1 mx-1 cursor-pointer transition-colors rounded-md text-[12px] font-medium leading-snug",
        isActive
          ? "text-[#F55036]"
          : "text-[#555555] hover:text-[#111111]"
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center shrink-0 w-4 h-4 transition-colors",
          isActive ? "text-[#F55036]" : "text-[#8B8B8B]"
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
};

// ============ Main Component ============
export default function Sidebar({
  onItemClick,
  onItemSelect,
  initialActive = "Trending Papers",
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActive);

  useEffect(() => {
    setActiveItem(initialActive);
  }, [initialActive]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    onItemSelect?.(label);
    onItemClick?.();
  };

  // Navigation Items
  const discover = [
    {
      label: "Trending Papers",
      slug: "trending",
      icon: (
        <Flame
          size={16}
          className={
            activeItem === "Trending Papers"
              ? "text-[#F55036] fill-[#F55036]"
              : ""
          }
        />
      ),
    },
    { label: "Latest Papers", icon: <Clock size={16} />, slug: "latest" },
    { label: "Most GitHub Stars", icon: <Star size={16} />, slug: "github-stars" },
  ];

  const tasks = [
  { label: "Language Models", icon: <MessageSquare size={16} />, slug: "language-models" },
  { label: "Agents", icon: <Bot size={16} />, slug: "agents" },
  { label: "Reasoning", icon: <Brain size={16} />, slug: "reasoning" },
  { label: "Vision-Language Models", icon: <ImageIcon size={16} />, slug: "vision-language-models" },
  { label: "Multimodal Models", icon: <Layers size={16} />, slug: "multimodal-models" },
  { label: "World Models", icon: <Globe size={16} />, slug: "world-models" },
  { label: "Image Generation", icon: <ImageIcon size={16} />, slug: "image-generation" },
  { label: "Speech", icon: <Volume2 size={16} />, slug: "speech" },
  { label: "Robotics", icon: <Cpu size={16} />, slug: "robotics" },
  { label: "All Tasks", icon: <FileText size={16} />, slug: "" },
];

const methods = [
  { label: "Transformers", icon: <Zap size={16} />, slug: "transformer" },
  { label: "Diffusion Models", icon: <ImageIcon size={16} />, slug: "diffusion-models" },
  { label: "Mixture of Experts", icon: <Layers size={16} />, slug: "mixture-of-experts-moe" },
  { label: "Reinforcement Learning", icon: <BarChart2 size={16} />, slug: "policy-learning" },
  { label: "Chain-of-Thought", icon: <LinkIcon size={16} />, slug: "chain-of-thought" },
  { label: "Retrieval-Augmented Generation", icon: <Search size={16} />, slug: "rag" },
  { label: "Model Context Protocol", icon: <Plug size={16} />, slug: "mcp" },
  { label: "LoRA", icon: <Layers size={16} />, slug: "lora" },
  { label: "RLHF", icon: <Target size={16} />, slug: "rlhf" },
  { label: "All Methods", icon: <FileText size={16} />, slug: "" },
];

  return (
    <aside className="flex flex-col w-full bg-transparent h-full">
      <div className="flex-1 px-2 py-2 space-y-0.5 pb-8">
        {/* DISCOVER Section */}
        <div>
          <SectionLabel title="Discover" />
          <div className="flex flex-col gap-0.5">
            {discover.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.label}
                onClick={() => handleItemClick(item.label)}
                href={item.slug === "trending" ? "/" : `/category/${item.slug}`}
              />
            ))}
          </div>
        </div>

        {/* TASKS Section */}
        <div>
          <SectionLabel title="Tasks" />
          <div className="flex flex-col gap-0.5">
            {tasks.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.label}
                onClick={() => handleItemClick(item.label)}
                href={item.slug ? `/tasks/${item.slug}` : `/tasks`}
              />
            ))}
          </div>
        </div>

        {/* METHODS Section */}
        <div>
          <SectionLabel title="Methods" />
          <div className="flex flex-col gap-0.5">
            {methods.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.label}
                onClick={() => handleItemClick(item.label)}
                href={`/methods/${item.slug}`}
              />
            ))}


          </div>
        </div>
      </div>


    </aside>
  );
}