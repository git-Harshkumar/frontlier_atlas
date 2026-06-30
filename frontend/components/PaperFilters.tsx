"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { getTasks, type TaskItem } from "@/lib/tasks";
import { getMethods, type MethodItem } from "@/lib/methods";
import type { PaperFilters as Filters } from "@/lib/paperApi";

type FilterKey = keyof Filters;

const PERIOD_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
] as const;

const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest" },
  { value: "stars", label: "Most Stars" },
] as const;

function Chip({
  label,
  onRemove,
  isClientSide,
}: {
  label: string;
  onRemove: () => void;
  isClientSide?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F7F2] border border-[#E5E5E0] rounded-full text-[11px] font-medium text-[#555555] group" title={isClientSide ? "Applied client-side (backend API not available)" : undefined}>
      {label}
      <button onClick={onRemove} className="text-[#8B8B8B] hover:text-[#F55036] transition-colors cursor-pointer" aria-label={`Remove ${label} filter`}>
        <X size={12} />
      </button>
      {isClientSide && <span className="text-[9px] text-[#BFBFBA] font-normal ml-0.5">⚠</span>}
    </span>
  );
}

export default function PaperFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [methods, setMethods] = useState<MethodItem[]>([]);
  const [localAuthor, setLocalAuthor] = useState(filters.author || "");
  const [localYear, setLocalYear] = useState(filters.year ? String(filters.year) : "");
  const [localMinCitations, setLocalMinCitations] = useState(
    filters.minCitations ? String(filters.minCitations) : ""
  );
  const [localMinStars, setLocalMinStars] = useState(
    filters.minStars ? String(filters.minStars) : ""
  );

  useEffect(() => {
    getTasks().then(setTasks).catch(() => {});
    getMethods({ sort: "name", limit: 100 })
      .then((data) => setMethods(data.methods))
      .catch(() => {});
  }, []);

  const update = (key: FilterKey, value: string | number | undefined) => {
    const next = { ...filters };
    if (value === undefined || value === "" || value === "all") {
      delete next[key];
    } else {
      (next as Record<string, unknown>)[key] = value;
    }
    onChange(next);
  };

  const activeChips: { key: FilterKey; label: string; value: string | number; isClientSide: boolean }[] = [];

  if (filters.task) activeChips.push({ key: "task", label: `Task: ${filters.task}`, value: filters.task, isClientSide: false });
  if (filters.method) activeChips.push({ key: "method", label: `Method: ${filters.method}`, value: filters.method, isClientSide: false });
  if (filters.period && filters.period !== "all") {
    const p = PERIOD_OPTIONS.find((o) => o.value === filters.period);
    if (p) activeChips.push({ key: "period", label: p.label, value: filters.period, isClientSide: false });
  }
  if (filters.sort && filters.sort !== "trending") {
    const s = SORT_OPTIONS.find((o) => o.value === filters.sort);
    if (s) activeChips.push({ key: "sort", label: s.label, value: filters.sort, isClientSide: false });
  }
  if (filters.author) activeChips.push({ key: "author", label: `Author: ${filters.author}`, value: filters.author, isClientSide: true });
  if (filters.year) activeChips.push({ key: "year", label: `Year: ${filters.year}`, value: filters.year, isClientSide: true });
  if (filters.minCitations) activeChips.push({ key: "minCitations", label: `≥${filters.minCitations} citations`, value: filters.minCitations, isClientSide: true });
  if (filters.minStars) activeChips.push({ key: "minStars", label: `≥${filters.minStars} stars`, value: filters.minStars, isClientSide: true });

  const clearAll = () => onChange({});

  return (
    <div className="mb-4">
      {/* Period + Sort + Advanced toggle */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Period buttons */}
        <div className="flex items-center gap-0.5 bg-[#F8F7F2] border border-[#E5E5E0] rounded-lg p-0.5">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("period", opt.value === "all" ? undefined : opt.value)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                (filters.period || "all") === opt.value
                  ? "bg-white text-[#111111] shadow-sm"
                  : "text-[#8B8B8B] hover:text-[#111111]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={filters.sort || "trending"}
            onChange={(e) => update("sort", e.target.value === "trending" ? undefined : e.target.value)}
            className="appearance-none bg-white border border-[#E5E5E0] rounded-lg px-2.5 py-1 pr-7 text-[11px] font-medium text-[#555555] cursor-pointer hover:border-[#DCDCD7] focus:outline-none focus:border-[#F55036]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B8B8B] pointer-events-none" />
        </div>

        {/* Task dropdown */}
        <div className="relative">
          <select
            value={filters.task || "all"}
            onChange={(e) => update("task", e.target.value === "all" ? undefined : e.target.value)}
            className="appearance-none bg-white border border-[#E5E5E0] rounded-lg px-2.5 py-1 pr-7 text-[11px] font-medium text-[#555555] cursor-pointer hover:border-[#DCDCD7] focus:outline-none focus:border-[#F55036] max-w-[140px] truncate"
          >
            <option value="all">All Tasks</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.slug}>{t.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B8B8B] pointer-events-none" />
        </div>

        {/* Method dropdown */}
        <div className="relative">
          <select
            value={filters.method || "all"}
            onChange={(e) => update("method", e.target.value === "all" ? undefined : e.target.value)}
            className="appearance-none bg-white border border-[#E5E5E0] rounded-lg px-2.5 py-1 pr-7 text-[11px] font-medium text-[#555555] cursor-pointer hover:border-[#DCDCD7] focus:outline-none focus:border-[#F55036] max-w-[140px] truncate"
          >
            <option value="all">All Methods</option>
            {methods.map((m) => (
              <option key={m.id} value={m.slug}>{m.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B8B8B] pointer-events-none" />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer px-2.5 py-1 rounded-lg ${
            showAdvanced ? "bg-[#EBEBE6] text-[#111111]" : "text-[#8B8B8B] hover:text-[#111111]"
          }`}
        >
          <SlidersHorizontal size={12} />
          Filters
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="bg-white border border-[#E5E5E0] rounded-lg p-3 mb-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-[#8B8B8B] uppercase mb-1">Author</label>
            <input
              type="text"
              value={localAuthor}
              onChange={(e) => {
                setLocalAuthor(e.target.value);
                update("author", e.target.value || undefined);
              }}
              placeholder="Filter by author"
              className="w-full border border-[#E5E5E0] rounded-lg px-2.5 py-1.5 text-[12px] text-[#555555] placeholder:text-[#BFBFBA] focus:outline-none focus:border-[#F55036]"
            />
            <p className="text-[9px] text-[#BFBFBA] mt-0.5">Client-side filter</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#8B8B8B] uppercase mb-1">Year</label>
            <input
              type="number"
              value={localYear}
              onChange={(e) => {
                setLocalYear(e.target.value);
                update("year", e.target.value ? Number(e.target.value) : undefined);
              }}
              placeholder="e.g. 2024"
              min={1900}
              max={2030}
              className="w-full border border-[#E5E5E0] rounded-lg px-2.5 py-1.5 text-[12px] text-[#555555] placeholder:text-[#BFBFBA] focus:outline-none focus:border-[#F55036]"
            />
            <p className="text-[9px] text-[#BFBFBA] mt-0.5">Client-side filter</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#8B8B8B] uppercase mb-1">Min Citations</label>
            <input
              type="number"
              value={localMinCitations}
              onChange={(e) => {
                setLocalMinCitations(e.target.value);
                update("minCitations", e.target.value ? Number(e.target.value) : undefined);
              }}
              placeholder="e.g. 10"
              min={0}
              className="w-full border border-[#E5E5E0] rounded-lg px-2.5 py-1.5 text-[12px] text-[#555555] placeholder:text-[#BFBFBA] focus:outline-none focus:border-[#F55036]"
            />
            <p className="text-[9px] text-[#BFBFBA] mt-0.5">Client-side filter</p>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#8B8B8B] uppercase mb-1">Min GitHub Stars</label>
            <input
              type="number"
              value={localMinStars}
              onChange={(e) => {
                setLocalMinStars(e.target.value);
                update("minStars", e.target.value ? Number(e.target.value) : undefined);
              }}
              placeholder="e.g. 50"
              min={0}
              className="w-full border border-[#E5E5E0] rounded-lg px-2.5 py-1.5 text-[12px] text-[#555555] placeholder:text-[#BFBFBA] focus:outline-none focus:border-[#F55036]"
            />
            <p className="text-[9px] text-[#BFBFBA] mt-0.5">Client-side filter</p>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {activeChips.map((chip) => (
            <Chip
              key={chip.key}
              label={chip.label}
              isClientSide={chip.isClientSide}
              onRemove={() => update(chip.key, undefined)}
            />
          ))}
          <button
            onClick={clearAll}
            className="text-[11px] text-[#8B8B8B] hover:text-[#F55036] transition-colors font-medium cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
