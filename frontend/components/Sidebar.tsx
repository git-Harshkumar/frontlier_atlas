"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame, Clock, Star, Bot, Brain, MessageSquare, Code2,
  Monitor, Globe, Cpu, Zap, Link as LinkIcon, RefreshCw, Layers,
  FileText, ImageIcon, Video, Volume2,
  ChevronDown, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";



function SectionLabel({ title, isOpen, onToggle }: { title: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between cursor-pointer group px-3 mb-[2px] mt-[4px] first:mt-0 py-1"
    >
      <p className="text-[11px] font-semibold text-[#8B8B8B] group-hover:text-[#555555] transition-colors uppercase tracking-[0.08em]">
        {title}
      </p>
      <div className="text-[#8B8B8B] group-hover:text-[#555555] transition-colors">
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
    </div>
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
        "group flex items-center gap-2 px-3 py-[6px] cursor-pointer transition-all duration-200 text-[13px] font-medium leading-tight",
        isActive
          ? "text-[#F55036]"
          : "text-[#8B8B8B] hover:text-[#111111]"
      )}
    >
      <span className={cn("w-4 h-4 flex items-center justify-center text-[16px] shrink-0 transition-transform duration-200 group-hover:scale-110", isActive && "text-[#F55036]")}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    tasks: true,
    methods: true,
    generation: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    setActiveItem(initialActive);
  }, [initialActive]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    onItemSelect?.(label);
    onItemClick?.();
  };

  // Static Navigation Sections
  const discover = [
    { label: "Trending Papers", icon: <Flame size={14} className={activeItem === "Trending Papers" ? "text-[#F55036] fill-[#F55036]" : ""} /> },
    { label: "Latest Papers", icon: <Clock size={14} /> },
    { label: "Most GitHub Stars", icon: <Star size={14} /> },
  ];

  const tasks = [
    { label: "Agents", icon: <Bot size={14} /> },
    { label: "Reasoning", icon: <Brain size={14} /> },
    { label: "Language Modeling", icon: <MessageSquare size={14} /> },
    { label: "Coding Agents", icon: <Code2 size={14} /> },
    { label: "Computer Use", icon: <Monitor size={14} /> },
    { label: "World Models", icon: <Globe size={14} /> },
    { label: "Robotics", icon: <Cpu size={14} /> },
  ];

  const initialMethods = [
    { label: "Transformer", icon: <Zap size={14} />, slug: "transformer" },
    { label: "Chain of Thought", icon: <LinkIcon size={14} />, slug: "chain-of-thought" },
    { label: "ReAct", icon: <RefreshCw size={14} />, slug: "react" },
    { label: "LoRA", icon: <Layers size={14} />, slug: "lora" }
  ];

  const [topMethods, setTopMethods] = useState(initialMethods);
  const [totalMethods, setTotalMethods] = useState(142);

  useEffect(() => {
    async function loadMethods() {
      try {
        const { getMethods } = await import('@/lib/methods');
        const res = await getMethods({ sort: 'papers', limit: 4 });
        if (res?.methods) {
          const dynamicMethods = res.methods.map((m: {name: string, slug: string}, index: number) => {
            const icons = [<Zap key="1" size={14} />, <LinkIcon key="2" size={14} />, <RefreshCw key="3" size={14} />, <Layers key="4" size={14} />];
            return {
              label: m.name,
              slug: m.slug,
              icon: icons[index % icons.length]
            };
          });
          setTopMethods(dynamicMethods);
          if (res.total) {
            setTotalMethods(res.total);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to load methods", err);
        }
      }
    }
    loadMethods();
  }, []);

  const generation = [
    { label: "Text Generation", icon: <FileText size={14} /> },
    { label: "Image Generation", icon: <ImageIcon size={14} /> },
    { label: "Video Generation", icon: <Video size={14} /> },
    { label: "Audio Generation", icon: <Volume2 size={14} /> },
  ];

  return (
    <aside className="flex flex-col w-full bg-transparent pb-12">

      {/* Non-scrollable Nav Area */}
      <div className="flex flex-col gap-2">

      {/* DISCOVER */}
      <div className="mb-4">
        <div className="px-3 mb-[2px] mt-[4px] py-1">
          <p className="text-[11px] font-semibold text-[#8B8B8B] uppercase tracking-[0.08em]">DISCOVER</p>
        </div>
        <div className="flex flex-col gap-[2px]">
          {discover.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.label}
              onClick={() => handleItemClick(item.label)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <SectionLabel 
          title="Tasks" 
          isOpen={openSections.tasks} 
          onToggle={() => toggleSection('tasks')} 
        />
        <AnimatePresence initial={false}>
          {openSections.tasks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-[2px]">
                {tasks.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeItem === item.label}
                    onClick={() => handleItemClick(item.label)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* METHODS */}
      <div className="mb-6">
        <SectionLabel 
          title="Methods" 
          isOpen={openSections.methods} 
          onToggle={() => toggleSection('methods')} 
        />
        <AnimatePresence initial={false}>
          {openSections.methods && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-[2px]">
                {topMethods.map((item) => (
                  <Link href={`/methods/${item.slug}`} key={item.label}>
                    <NavItem
                      icon={item.icon}
                      label={item.label}
                      isActive={activeItem === item.label}
                      onClick={() => handleItemClick(item.label)}
                    />
                  </Link>
                ))}
                
                {/* Embedded Show More Button */}
                <Link href="/methods" className="flex items-center gap-2 px-3 py-[3.5px] mx-2 mt-1 rounded-md cursor-pointer transition-colors text-[13px] font-medium leading-tight text-[#8B8B8B] hover:text-[#555555] hover:bg-[#F8F7F2]">
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Layers size={14} />
                  </span>
                  <span>View all {totalMethods} methods</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GENERATION */}
      <div className="mb-6">
        <SectionLabel 
          title="Generation" 
          isOpen={openSections.generation} 
          onToggle={() => toggleSection('generation')} 
        />
        <AnimatePresence initial={false}>
          {openSections.generation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-[2px]">
                {generation.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeItem === item.label}
                    onClick={() => handleItemClick(item.label)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </aside>
  );
}
