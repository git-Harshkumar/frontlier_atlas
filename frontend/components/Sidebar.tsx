"use client";

import { useEffect, useState, memo } from "react";
import {
  Flame, Clock, Star, Bot, Brain, MessageSquare, Code2,
  Monitor, Globe, Cpu, Zap, Link, RefreshCw, Layers,
  BarChart2, Target, Plug, FileText, ImageIcon, Video, Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Module-level constants ────────────────────────────────────────────────
// Defined here (outside the component) so they are created once per module
// load, not on every render. Previously these were allocated inside the
// component body, creating new JSX elements and arrays on every state change
// (e.g. every click that updated `activeItem`).

const DISCOVER_ITEMS = [
  { label: "Trending Papers" },
  { label: "Latest Papers" },
  { label: "Most GitHub Stars" },
] as const;

const TASKS_ITEMS = [
  { label: "Agents" },
  { label: "Reasoning" },
  { label: "Language Modeling" },
  { label: "Coding Agents" },
  { label: "Computer Use" },
  { label: "World Models" },
  { label: "Robotics" },
] as const;

const METHODS_ITEMS = [
  { label: "Transformer" },
  { label: "Chain of Thought" },
  { label: "ReAct" },
  { label: "LoRA" },
  { label: "RLHF" },
  { label: "DPO" },
  { label: "MCP" },
] as const;

const GENERATION_ITEMS = [
  { label: "Text Generation" },
  { label: "Image Generation" },
  { label: "Video Generation" },
  { label: "Audio Generation" },
] as const;

// Icon map — avoids re-creating icon JSX inside the render loop.
// Icons are pure presentational components so we can reference them directly.
const ICON_MAP: Record<string, React.ReactElement> = {
  "Trending Papers": <Flame size={14} />,
  "Latest Papers": <Clock size={14} />,
  "Most GitHub Stars": <Star size={14} />,
  "Agents": <Bot size={14} />,
  "Reasoning": <Brain size={14} />,
  "Language Modeling": <MessageSquare size={14} />,
  "Coding Agents": <Code2 size={14} />,
  "Computer Use": <Monitor size={14} />,
  "World Models": <Globe size={14} />,
  "Robotics": <Cpu size={14} />,
  "Transformer": <Zap size={14} />,
  "Chain of Thought": <Link size={14} />,
  "ReAct": <RefreshCw size={14} />,
  "LoRA": <Layers size={14} />,
  "RLHF": <BarChart2 size={14} />,
  "DPO": <Target size={14} />,
  "MCP": <Plug size={14} />,
  "Text Generation": <FileText size={14} />,
  "Image Generation": <ImageIcon size={14} />,
  "Video Generation": <Video size={14} />,
  "Audio Generation": <Volume2 size={14} />,
};

// ─── Sub-components (memoized) ─────────────────────────────────────────────

const SectionLabel = memo(function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em] px-3 mb-[2px] mt-[4px] first:mt-0">
      {children}
    </p>
  );
});
SectionLabel.displayName = "SectionLabel";

const NavItem = memo(function NavItem({
  icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-[3.5px] mx-2 cursor-pointer transition-colors text-[14px] font-medium leading-tight",
        isActive
          ? "text-[#F55036]"
          : "text-[#555555] hover:text-[#F55036]"
      )}
    >
      <span className="w-4 h-4 flex items-center justify-center text-[16px] shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
});
NavItem.displayName = "NavItem";

// ─── Sidebar ───────────────────────────────────────────────────────────────

interface SidebarProps {
  onItemClick?: () => void;
  onItemSelect?: (item: string) => void;
  initialActive?: string;
}

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

  const renderSection = (
    label: string,
    items: ReadonlyArray<{ label: string }>
  ) => (
    <div className="flex flex-col">
      <SectionLabel>{label}</SectionLabel>
      {items.map((item) => (
        <NavItem
          key={item.label}
          icon={
            // The Trending Papers icon needs active-state fill styling.
            // All other icons are static from the module-level map.
            item.label === "Trending Papers" ? (
              <Flame
                size={14}
                className={activeItem === "Trending Papers" ? "text-[#F55036] fill-[#F55036]" : ""}
              />
            ) : (
              ICON_MAP[item.label]
            )
          }
          label={item.label}
          isActive={activeItem === item.label}
          onClick={() => handleItemClick(item.label)}
        />
      ))}
    </div>
  );

  return (
    <aside className="flex flex-col w-full bg-transparent overflow-hidden">
      <div className="flex flex-col gap-2">
        {renderSection("DISCOVER", DISCOVER_ITEMS)}
        {renderSection("TASKS", TASKS_ITEMS)}
        {renderSection("METHODS", METHODS_ITEMS)}
        {renderSection("GENERATION", GENERATION_ITEMS)}
      </div>
    </aside>
  );
}
