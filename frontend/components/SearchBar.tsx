"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { searchSuggestions, type SearchResult } from "@/lib/search";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  variant?: "default" | "compact";
  initialQuery?: string;
}

export default function SearchBar({
  placeholder = "Search papers, authors, methods, tasks, models, datasets...",
  autoFocus = false,
  variant = "default",
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchSuggestions(q, 5);
      setSuggestions(results);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          router.push(`/${suggestion.type === 'papers' ? 'papers' : suggestion.type}/${suggestion.slug}`);
          setShowSuggestions(false);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getSuggestionIcon = (type: SearchResult["type"]) => {
    const icons: Record<SearchResult["type"], string> = {
      papers: "📄",
      authors: "👤",
      methods: "⚗️",
      tasks: "✓",
      models: "🤖",
      datasets: "📊",
    };
    return icons[type] || "📄";
  };

  const getSuggestionTypeLabel = (type: SearchResult["type"]) => {
    const labels: Record<SearchResult["type"], string> = {
      papers: "Paper",
      authors: "Author",
      methods: "Method",
      tasks: "Task",
      models: "Model",
      datasets: "Dataset",
    };
    return labels[type];
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          size={variant === "compact" ? 16 : 18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`ds-input w-full pl-10 pr-10 ${
            variant === "compact" ? "h-9 text-[12px]" : "h-10 text-[13px]"
          }`}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#111111] transition-colors"
            aria-label="Clear search"
          >
            <X size={variant === "compact" ? 16 : 18} />
          </button>
        )}
        {loading && (
          <Loader2
            size={variant === "compact" ? 16 : 18}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-[#8B8B8B] animate-spin"
          />
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E5E5E0] rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.id}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => {
                router.push(`/${suggestion.type === 'papers' ? 'papers' : suggestion.type}/${suggestion.slug}`);
                setShowSuggestions(false);
              }}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-[#EBEBE6] last:border-b-0 ${
                index === selectedIndex
                  ? "bg-[#F8F7F2]"
                  : "hover:bg-[#F8F7F2]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{getSuggestionIcon(suggestion.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-[#111111] truncate">
                      {suggestion.title}
                    </span>
                    <span className="text-[10px] font-medium text-[#8B8B8B] uppercase tracking-wide shrink-0">
                      {getSuggestionTypeLabel(suggestion.type)}
                    </span>
                  </div>
                  {suggestion.subtitle && (
                    <p className="text-[12px] text-[#555555] mt-0.5">{suggestion.subtitle}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
