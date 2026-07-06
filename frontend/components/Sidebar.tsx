"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  onItemClick?: () => void;
  onItemSelect?: (item: string) => void;
  initialActive?: string;
}

// ============ Sub-Components ============
const SectionLabel = ({
  title,
  isOpen,
  onToggle,
  icon,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between cursor-pointer group px-3 py-2 hover:bg-[#F8F7F2] rounded-md transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-[#8B8B8B] group-hover:text-[#555555] transition-colors">
            {icon}
          </span>
        )}
        <p className="text-[11px] font-semibold text-[#8B8B8B] group-hover:text-[#555555] transition-colors uppercase tracking-[0.08em]">
          {title}
        </p>
      </div>
      <div className="text-[#8B8B8B] group-hover:text-[#555555] transition-colors">
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  isActive = false,
  onClick,
  href,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  href?: string;
  badge?: string;
}) => {
  const content = (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2.5 px-3 py-2 mx-1 cursor-pointer transition-all duration-200 rounded-lg text-[13px] font-medium leading-tight",
        isActive
          ? "bg-gradient-to-r from-[#F8EFEB] to-[#F8EFEB]/50 text-[#F55036] shadow-sm"
          : "text-[#555555] hover:bg-[#F8F7F2] hover:text-[#111111] hover:translate-x-0.5",
      )}
    >
      {/* Left accent bar for active state */}
      {isActive && (
        <motion.span
          layoutId="activeAccent"
          className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#F55036] rounded-r-full"
        />
      )}

      <span
        className={cn(
          "w-4 h-4 flex items-center justify-center text-[16px] shrink-0 transition-colors",
          isActive
            ? "text-[#F55036]"
            : "text-[#777777] group-hover:text-[#555555]",
        )}
      >
        {icon}
      </span>

      <span className="truncate flex-1">{label}</span>

      {badge && (
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#F55036]/10 text-[#F55036] rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    discover: true,
    tasks: true,
    methods: true,
    generation: false,
  });
  const router = useRouter();

  useEffect(() => {
    setActiveItem(initialActive);
  }, [initialActive]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    onItemSelect?.(label);
    onItemClick?.();
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Navigation Items with enhanced icons
  const discover = [
    {
      label: "Trending Papers",
      icon: (
        <Flame
          size={14}
          className={
            activeItem === "Trending Papers"
              ? "text-[#F55036] fill-[#F55036]"
              : ""
          }
        />
      ),
      badge: "Hot",
    },
    { label: "Latest Papers", icon: <Clock size={14} /> },
    { label: "Most GitHub Stars", icon: <Star size={14} />, badge: "Popular" },
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
    {
      label: "Chain of Thought",
      icon: <LinkIcon size={14} />,
      slug: "chain-of-thought",
    },
    { label: "ReAct", icon: <RefreshCw size={14} />, slug: "react" },
    { label: "LoRA", icon: <Layers size={14} />, slug: "lora" },
  ];

  const [topMethods, setTopMethods] = useState(initialMethods);
  const [totalMethods, setTotalMethods] = useState(142);

  // Load dynamic methods
  useEffect(() => {
    async function loadMethods() {
      try {
        const { getMethods } = await import("@/lib/methods");
        const res = await getMethods({ sort: "papers", limit: 4 });
        if (res?.methods) {
          const icons = [
            <Zap key="1" size={14} />,
            <LinkIcon key="2" size={14} />,
            <RefreshCw key="3" size={14} />,
            <Layers key="4" size={14} />,
          ];
          const dynamicMethods = res.methods.map(
            (m: { name: string; slug: string }, index: number) => ({
              label: m.name,
              slug: m.slug,
              icon: icons[index % icons.length],
            }),
          );
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
    <aside className="flex flex-col w-full bg-transparent h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex-1 px-2 py-4 space-y-1">
        {/* DISCOVER Section - Collapsible */}
        <div className="mb-2">
          <SectionLabel
            title="Discover"
            isOpen={openSections.discover}
            onToggle={() => toggleSection("discover")}
            icon={<Sparkles size={14} />}
          />
          <AnimatePresence initial={false}>
            {openSections.discover && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-0.5 mt-1">
                  {discover.map((item) => (
                    <NavItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      isActive={activeItem === item.label}
                      onClick={() => handleItemClick(item.label)}
                      badge={item.badge}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TASKS Section - Collapsible */}
        <div className="mb-2">
          <SectionLabel
            title="Tasks"
            isOpen={openSections.tasks}
            onToggle={() => toggleSection("tasks")}
            icon={<TrendingUp size={14} />}
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
                <div className="flex flex-col gap-0.5 mt-1">
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

        {/* METHODS Section - Collapsible with dynamic loading */}
        <div className="mb-2">
          <SectionLabel
            title="Methods"
            isOpen={openSections.methods}
            onToggle={() => toggleSection("methods")}
            icon={<Award size={14} />}
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
                <div className="flex flex-col gap-0.5 mt-1">
                  {topMethods.map((item) => (
                    <NavItem
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      isActive={activeItem === item.label}
                      onClick={() => handleItemClick(item.label)}
                      href={`/methods/${item.slug}`}
                    />
                  ))}

                  {/* View All Methods Link */}
                  <Link
                    href="/methods"
                    className="flex items-center gap-2.5 px-3 py-2 mx-1 mt-1 rounded-lg cursor-pointer transition-all duration-200 text-[13px] font-medium leading-tight text-[#8B8B8B] hover:text-[#555555] hover:bg-[#F8F7F2] hover:translate-x-0.5 group"
                  >
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 text-[#8B8B8B] group-hover:text-[#555555] transition-colors">
                      <Layers size={14} />
                    </span>
                    <span>View all {totalMethods} methods</span>
                    <span className="ml-auto text-[10px] text-[#8B8B8B] group-hover:text-[#555555]">
                      →
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* GENERATION Section - Collapsible */}
        <div className="mb-2">
          <SectionLabel
            title="Generation"
            isOpen={openSections.generation}
            onToggle={() => toggleSection("generation")}
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
                <div className="flex flex-col gap-0.5 mt-1">
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

      {/* All Domains - Special Item with Arrow */}
      <div className="pt-4 mt-2 border-t border-[#E5E5E0]">
        <div className="group relative">
          <NavItem
            icon={""}
            label="All Domains"
            isActive={activeItem === "All Domains"}
            onClick={() => {
              handleItemClick("All Domains");
              router.push("/tasks");
            }}
          />
          {/* Arrow that scales and moves right on hover */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] transition-all duration-300 group-hover:scale-125 group-hover:translate-x-1 group-hover:text-[#F55036]">
            →
          </span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="pt-6 mt-4 border-t border-[#E5E5E0]">
        <div className="px-3 py-2">
          <p className="text-[10px] text-[#8B8B8B] font-medium uppercase tracking-[0.08em]">
            {totalMethods}+ Methods
          </p>
        </div>
      </div>
    </aside>
  );
}