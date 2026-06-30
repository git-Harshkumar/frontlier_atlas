"use client";

import { useState, useEffect } from "react";
import {
  Flame, Clock, Star, Bot, Zap,
  FileText, ImageIcon, Video, Volume2,
  Beaker, ListChecks, Cpu, Database, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMethods, type MethodItem } from "@/lib/methods";
import { getTasks, type TaskItem } from "@/lib/tasks";
import { getModels, type ModelItem } from "@/lib/models";
import { getDatasets, type DatasetItem } from "@/lib/datasets";
import { getAuthors, type AuthorItem } from "@/lib/authors";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  disabled = false,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  href?: string;
}) {
  const content = (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 xl:py-[4px] mx-2 transition-colors text-[11px] font-medium",
        disabled
          ? "text-[#BFBFBA] cursor-default"
          : "cursor-pointer",
        !disabled && (isActive
          ? "text-[#F55036] font-bold"
          : "text-[#555555] hover:text-[#F55036]")
      )}
    >
      <span className="w-3.5 h-3.5 flex items-center justify-center text-[13px] shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const [methodItems, setMethodItems] = useState<MethodItem[]>([]);
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [modelItems, setModelItems] = useState<ModelItem[]>([]);
  const [datasetItems, setDatasetItems] = useState<DatasetItem[]>([]);
  const [authorItems, setAuthorItems] = useState<AuthorItem[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [authorsLoading, setAuthorsLoading] = useState(true);

  useEffect(() => {
    async function loadSidebar() {
      try {
        setSidebarLoading(true);
        setTasksLoading(true);
        setModelsLoading(true);
        setDatasetsLoading(true);
        setAuthorsLoading(true);
        const [methodsData, tasksData, modelsData, datasetsData, authorsData] = await Promise.all([
          getMethods({ sort: "name", limit: 50 }),
          getTasks(),
          getModels(),
          getDatasets(),
          getAuthors(),
        ]);
        setMethodItems(methodsData.methods);
        setTaskItems(tasksData);
        setModelItems(modelsData);
        setDatasetItems(datasetsData);
        setAuthorItems(authorsData);
      } catch {
        // silently fail — sidebar items are non-critical
      } finally {
        setSidebarLoading(false);
        setTasksLoading(false);
        setModelsLoading(false);
        setDatasetsLoading(false);
        setAuthorsLoading(false);
      }
    }
    loadSidebar();
  }, []);

  const discover = [
    { label: "Trending Papers", icon: <Flame size={14} /> },
    { label: "Latest Papers", icon: <Clock size={14} /> },
    { label: "Most GitHub Stars", icon: <Star size={14} /> },
  ];

  const generation = [
    { label: "Text Generation", icon: <FileText size={14} /> },
    { label: "Image Generation", icon: <ImageIcon size={14} /> },
    { label: "Video Generation", icon: <Video size={14} /> },
    { label: "Audio Generation", icon: <Volume2 size={14} /> },
  ];

  const handleNavClick = () => {
    onItemClick?.();
  };

  return (
    <aside className="flex flex-col w-full bg-transparent overflow-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <SectionLabel>DISCOVER</SectionLabel>
          {discover.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={handleNavClick}
              disabled
            />
          ))}
        </div>
        <div className="flex flex-col">
          <SectionLabel>TASKS</SectionLabel>
          <NavItem
            icon={<ListChecks size={14} />}
            label="All Tasks"
            isActive={pathname === "/tasks"}
            onClick={handleNavClick}
            href="/tasks"
          />
          {tasksLoading ? (
            <div className="px-3 py-2 mx-2">
              <div className="h-3 bg-[#E5E5E0] rounded animate-pulse w-3/4" />
            </div>
          ) : (
            taskItems.map((t) => (
              <NavItem
                key={t.id}
                icon={<Bot size={14} />}
                label={t.name}
                isActive={pathname === `/tasks/${t.slug}`}
                onClick={handleNavClick}
                href={`/tasks/${t.slug}`}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>METHODS</SectionLabel>
          <NavItem
            icon={<Beaker size={14} />}
            label="All Methods"
            isActive={pathname === "/methods"}
            onClick={handleNavClick}
            href="/methods"
          />
          {sidebarLoading ? (
            <div className="px-3 py-2 mx-2">
              <div className="h-3 bg-[#E5E5E0] rounded animate-pulse w-3/4" />
            </div>
          ) : (
            methodItems.map((m) => (
              <NavItem
                key={m.id}
                icon={<Zap size={14} />}
                label={m.name}
                isActive={pathname === `/methods/${m.slug}`}
                onClick={handleNavClick}
                href={`/methods/${m.slug}`}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>MODELS</SectionLabel>
          <NavItem
            icon={<Cpu size={14} />}
            label="All Models"
            isActive={pathname === "/models"}
            onClick={handleNavClick}
            href="/models"
          />
          {modelsLoading ? (
            <div className="px-3 py-2 mx-2">
              <div className="h-3 bg-[#E5E5E0] rounded animate-pulse w-3/4" />
            </div>
          ) : (
            modelItems.map((m) => (
              <NavItem
                key={m.id}
                icon={<Cpu size={14} />}
                label={m.name}
                isActive={pathname === `/models/${m.slug}`}
                onClick={handleNavClick}
                href={`/models/${m.slug}`}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>DATASETS</SectionLabel>
          <NavItem
            icon={<Database size={14} />}
            label="All Datasets"
            isActive={pathname === "/datasets"}
            onClick={handleNavClick}
            href="/datasets"
          />
          {datasetsLoading ? (
            <div className="px-3 py-2 mx-2">
              <div className="h-3 bg-[#E5E5E0] rounded animate-pulse w-3/4" />
            </div>
          ) : (
            datasetItems.map((d) => (
              <NavItem
                key={d.id}
                icon={<Database size={14} />}
                label={d.name}
                isActive={pathname === `/datasets/${d.slug}`}
                onClick={handleNavClick}
                href={`/datasets/${d.slug}`}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>AUTHORS</SectionLabel>
          <NavItem
            icon={<Users size={14} />}
            label="All Authors"
            isActive={pathname === "/authors"}
            onClick={handleNavClick}
            href="/authors"
          />
          {authorsLoading ? (
            <div className="px-3 py-2 mx-2">
              <div className="h-3 bg-[#E5E5E0] rounded animate-pulse w-3/4" />
            </div>
          ) : (
            authorItems.map((a) => (
              <NavItem
                key={a.id}
                icon={<Users size={14} />}
                label={a.name}
                isActive={pathname === `/authors/${a.slug}`}
                onClick={handleNavClick}
                href={`/authors/${a.slug}`}
              />
            ))
          )}
        </div>

        <div className="flex flex-col">
          <SectionLabel>GENERATION</SectionLabel>
          {generation.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={handleNavClick}
              disabled
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
