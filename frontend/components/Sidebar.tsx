"use client";

import { useState, useEffect } from "react";
import {
  Flame, Clock, Star, Bot, Brain, MessageSquare, Code2,
  Monitor, Globe, Cpu, Zap, Link, RefreshCw, Layers,
  BarChart2, Target, Plug, FileText, ImageIcon, Video, Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTasks } from "@/lib/taskApi";

function getTaskIcon(iconName: string) {
  switch (iconName) {
    case "bot": return <Bot size={14} />;
    case "brain": return <Brain size={14} />;
    case "message-square": return <MessageSquare size={14} />;
    case "code": return <Code2 size={14} />;
    case "monitor": return <Monitor size={14} />;
    case "globe": return <Globe size={14} />;
    case "cpu": return <Cpu size={14} />;
    default: return <Bot size={14} />;
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em] px-3 mb-0.5 mt-2 first:mt-1">
      {children}
    </p>
  );
}

function NavItem({
  icon,
  label,
  isActive = false,
  onClick
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
        "flex items-center gap-2 px-3 py-2 xl:py-[4px] mx-2 cursor-pointer transition-colors text-[11px] font-medium",
        isActive
          ? "text-[#F55036] font-bold"
          : "text-[#555555] hover:text-[#F55036]"
      )}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center text-[13px] shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const [activeItem, setActiveItem] = useState("Trending Papers");

  const [fetchedTasks, setFetchedTasks] = useState<{ label: string; icon: React.ReactNode }[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setTasksLoading(true);
        const data = await getTasks();
        const mappedTasks = data.map((t) => ({
          label: t.label,
          icon: getTaskIcon(t.icon),
        }));
        setFetchedTasks(mappedTasks);
        setTasksError(null);
      } catch (err) {
        setTasksError("Failed to load tasks. Please try again later.");
      } finally {
        setTasksLoading(false);
      }
    }
    loadTasks();
  }, []);

  const discover = [
    { label: "Trending Papers", icon: <Flame size={14} className={activeItem === "Trending Papers" ? "text-[#F55036] fill-[#F55036]" : ""} /> },
    { label: "Latest Papers", icon: <Clock size={14} /> },
    { label: "Most GitHub Stars", icon: <Star size={14} /> },
  ];

  const methods = [
    { label: "Transformer", icon: <Zap size={14} /> },
    { label: "Chain of Thought", icon: <Link size={14} /> },
    { label: "ReAct", icon: <RefreshCw size={14} /> },
    { label: "LoRA", icon: <Layers size={14} /> },
    { label: "RLHF", icon: <BarChart2 size={14} /> },
    { label: "DPO", icon: <Target size={14} /> },
    { label: "MCP", icon: <Plug size={14} /> },
  ];

  const generation = [
    { label: "Text Generation", icon: <FileText size={14} /> },
    { label: "Image Generation", icon: <ImageIcon size={14} /> },
    { label: "Video Generation", icon: <Video size={14} /> },
    { label: "Audio Generation", icon: <Volume2 size={14} /> },
  ];

  return (
    <aside className="flex flex-col w-full bg-transparent overflow-hidden">
      
      {/* Non-scrollable Nav Area */}
      <div className="flex flex-col gap-2">
        
        <div className="flex flex-col">
          <SectionLabel>DISCOVER</SectionLabel>
          {discover.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.label}
              onClick={() => {
                setActiveItem(item.label);
                onItemClick?.();
              }}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <SectionLabel>TASKS</SectionLabel>
          {tasksLoading ? (
            <div className="px-3 py-2 text-[11px] text-[#8B8B8B] flex items-center gap-2">
              <span className="w-3.5 h-3.5 flex items-center justify-center animate-spin">
                <RefreshCw size={12} />
              </span>
              Loading...
            </div>
          ) : tasksError ? (
            <div className="px-3 py-2 text-[11px] text-[#F55036]">
              {tasksError}
            </div>
          ) : (
            fetchedTasks.map((item) => (
              <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.label}
                onClick={() => {
                  setActiveItem(item.label);
                  onItemClick?.();
                }}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>METHODS</SectionLabel>
          {methods.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.label}
              onClick={() => {
                setActiveItem(item.label);
                onItemClick?.();
              }}
            />
          ))}
        </div>

        <div className="flex flex-col">
          <SectionLabel>GENERATION</SectionLabel>
          {generation.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.label}
              onClick={() => {
                setActiveItem(item.label);
                onItemClick?.();
              }}
            />
          ))}
        </div>

      </div>
    </aside>
  );
}
