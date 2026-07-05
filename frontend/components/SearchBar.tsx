"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchSuggestions, type SearchResult } from "@/lib/search";
import { motion } from "framer-motion";

interface SearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  variant?: "default" | "compact";
  initialQuery?: string;
  layoutIdPrefix?: string;
}

export default function SearchBar({
  placeholder = "Search papers, authors, methods, tasks, models, datasets...",
  autoFocus = false,
  variant = "default",
  initialQuery = "",
  layoutIdPrefix,
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

  // Debounced search
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

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside
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
          const href = `/${suggestion.type === 'papers' ? 'papers' : suggestion.type}/${suggestion.slug}`;
          router.push(href);
          setShowSuggestions(false);
          setSelectedIndex(-1);
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
    return labels[type] || "Result";
  };

  // Determine if we should show suggestions
  const shouldShowSuggestions = showSuggestions && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <motion.form
        layoutId={layoutIdPrefix ? `${layoutIdPrefix}-container` : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-white border border-[#E5E5E0] focus-within:border-[#F55036] focus-within:ring-2 focus-within:ring-[#F55036]/20 transition-all ${
          variant === "compact" ? "rounded-[20px]" : "rounded-[24px]"
        }`}
      >
        {/* Search Icon */}
        <motion.div 
          layoutId={layoutIdPrefix ? `${layoutIdPrefix}-icon` : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="flex items-center text-[#737373] ml-3 shrink-0"
        >
          <Search size={variant === "compact" ? 16 : 18} />
        </motion.div>

        {/* Input */}
        <motion.input
          layoutId={layoutIdPrefix ? `${layoutIdPrefix}-input` : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`bg-transparent outline-none flex-1 text-[#111111] placeholder:text-[#737373] min-w-0 px-2 ${
            variant === "compact" 
              ? "h-9 text-[12px]" 
              : "h-10 lg:h-11 text-[13px] lg:text-[14px]"
          }`}
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={shouldShowSuggestions}
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
        />

        {/* Loading Spinner */}
        {loading && (
          <Loader2
            size={variant === "compact" ? 16 : 18}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-[#F55036] animate-spin"
          />
        )}

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] hover:text-[#111111] transition-colors p-1 rounded-full hover:bg-[#F5F5F0]"
            aria-label="Clear search"
          >
            <X size={variant === "compact" ? 16 : 18} />
          </button>
        )}
      </motion.form>

      {/* Suggestions Dropdown */}
      {shouldShowSuggestions && (
        <motion.ul
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          id="search-suggestions"
          role="listbox"
          className="
            absolute 
            top-full 
            left-0 
            right-0 
            mt-1 lg:mt-2 
            bg-white 
            border border-[#E5E5E0] 
            rounded-lg 
            shadow-lg 
            z-50 
            max-h-[300px] lg:max-h-[400px] 
            overflow-y-auto
            overflow-x-hidden
            py-1
          "
        >
          {suggestions.map((suggestion, index) => {
            const href = `/${suggestion.type === 'papers' ? 'papers' : suggestion.type}/${suggestion.slug}`;
            const isSelected = index === selectedIndex;
            
            return (
              <li
                key={`${suggestion.type}-${suggestion.id}`}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`border-b border-[#EBEBE6] last:border-b-0 ${
                  isSelected ? "bg-[#F8F7F2]" : "hover:bg-[#F8F7F2]"
                }`}
              >
                <Link
                  href={href}
                  onClick={() => {
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors block w-full h-full"
                >
                  <span className="text-lg shrink-0 mt-0.5">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 lg:gap-2">
                      <span className="text-[13px] lg:text-[14px] font-medium text-[#111111] truncate">
                        {suggestion.title}
                      </span>
                      <span className="text-[9px] lg:text-[10px] font-medium text-[#8B8B8B] uppercase tracking-wide shrink-0 bg-[#F5F5F0] px-1.5 py-0.5 rounded">
                        {getSuggestionTypeLabel(suggestion.type)}
                      </span>
                    </div>
                    {suggestion.subtitle && (
                      <p className="text-[11px] lg:text-[12px] text-[#555555] mt-0.5 truncate">
                        {suggestion.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </motion.ul>
      )}
    </div>
  );
}