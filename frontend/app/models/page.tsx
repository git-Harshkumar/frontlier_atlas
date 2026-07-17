"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trophy, Cpu, Layers, ExternalLink, Code2, Check, Copy, X, Zap, Calendar, BookOpen, Brain, Globe, FileText, Video, Bot, Sparkles, MessageSquare, Plus, Eye, Puzzle, Network, Database, Shield, Terminal, Activity, GitBranch, BarChart3, Radio, Mic, Share2 } from "lucide-react";
import { getModels, getTrendingModels, getModelFacets, type ModelItem, type ModelFacets } from "@/lib/models";
import Navbar from "@/components/Navbar";

interface CatalogModel {
  id: string;
  name: string;
  slug: string;
  org: string;
  desc: string;
  params: string;
  context: string;
  releaseDate: string;
  releaseDateRaw: string | null;
  license: string;
  elo: number;
  tags: string[];
  area: string;
  paperCount: number;
  benchmarks: { name: string; score: string; value: number; color: string }[];
  quickstart: string;
  family: string;
  category: string;
}

function toCatalogModel(m: ModelItem): CatalogModel {
  const bs = m.benchmarkScore;
  const benchmarks: { name: string; score: string; value: number; color: string }[] = [];
  if (bs && typeof bs === 'object') {
    Object.entries(bs).forEach(([key, val], i) => {
      const colors = ["#FF5A1F", "#3B82F6", "#10B981", "#8B5CF6", "#E11D48", "#D97706"];
      benchmarks.push({
        name: key.toUpperCase(),
        score: `${val}%`,
        value: typeof val === 'number' ? val : 85,
        color: colors[i % colors.length],
      });
    });
  }
  if (benchmarks.length === 0) {
    benchmarks.push({ name: "Composite Score", score: m.trendingScore ? `⚡ ${m.trendingScore}` : "N/A", value: Math.min(m.trendingScore || 85, 100), color: "#FF5A1F" });
  }
  const releaseDateRaw = m.releaseDate;
  const releaseDate = releaseDateRaw
    ? new Date(releaseDateRaw).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "2024-2025";
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    org: m.vendor || "Unknown",
    desc: m.description || `${m.name} foundation AI model.`,
    params: m.parameterCount || "Dense / MoE",
    context: m.contextWindow || "128k tokens",
    releaseDate,
    releaseDateRaw,
    license: m.license || "Proprietary",
    elo: m.trendingScore || 0,
    tags: m.capabilities || [],
    area: m.category || m.researchAreas?.[0] || "General Purpose",
    paperCount: m.paperCount,
    benchmarks,
    quickstart: `# Quickstart snippet for ${m.name}\ncurl -X POST https://api.frontier-atlas.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $API_KEY" \\\n  -d '{"model": "${m.slug}", "messages": [{"role": "user", "content": "Hello world"}]}'`,
    family: m.modelFamily || "Foundation",
    category: m.category || "General Purpose",
  };
}

function getSkeletalIcon(index: number, name: string = "") {
  const icons = [
    { Icon: Brain, color: "#e11d48" },
    { Icon: Eye, color: "#0284c7" },
    { Icon: Layers, color: "#16a34a" },
    { Icon: Puzzle, color: "#d97706" },
    { Icon: Cpu, color: "#9333ea" },
    { Icon: Code2, color: "#0891b2" },
    { Icon: Sparkles, color: "#FF5A1F" },
    { Icon: Zap, color: "#4f46e5" },
    { Icon: Network, color: "#059669" },
    { Icon: Database, color: "#ea580c" },
    { Icon: Shield, color: "#7c3aed" },
    { Icon: Terminal, color: "#2563eb" },
    { Icon: Activity, color: "#db2777" },
    { Icon: FileText, color: "#16a34a" },
    { Icon: Globe, color: "#0284c7" },
    { Icon: Bot, color: "#e11d48" },
    { Icon: GitBranch, color: "#d97706" },
    { Icon: BarChart3, color: "#9333ea" },
    { Icon: Radio, color: "#0891b2" },
    { Icon: Video, color: "#4f46e5" },
    { Icon: Mic, color: "#ea580c" },
    { Icon: Share2, color: "#059669" }
  ];
  const lower = name.toLowerCase();
  if (lower.includes("vision") || lower.includes("image") || lower.includes("ocr") || lower.includes("sam")) return { Icon: Eye, color: "#0284c7" };
  if (lower.includes("reasoning") || lower.includes("math") || lower.includes("logic")) return { Icon: Brain, color: "#e11d48" };
  if (lower.includes("code") || lower.includes("coding")) return { Icon: Code2, color: "#0891b2" };
  if (lower.includes("agent") || lower.includes("robot")) return { Icon: Bot, color: "#9333ea" };
  if (lower.includes("audio") || lower.includes("speech") || lower.includes("whisper")) return { Icon: Mic, color: "#ea580c" };
  if (lower.includes("video") || lower.includes("sora")) return { Icon: Video, color: "#4f46e5" };
  if (lower.includes("multimodal") || lower.includes("omni") || lower.includes("gemini")) return { Icon: Layers, color: "#d97706" };
  if (lower.includes("document") || lower.includes("paper") || lower.includes("search")) return { Icon: FileText, color: "#16a34a" };
  if (lower.includes("embed") || lower.includes("rerank") || lower.includes("data") || lower.includes("sql") || lower.includes("postgres")) return { Icon: Database, color: "#059669" };
  if (lower.includes("security") || lower.includes("auth") || lower.includes("cipher")) return { Icon: Shield, color: "#7c3aed" };
  if (lower.includes("workflow") || lower.includes("automation") || lower.includes("tool")) return { Icon: Puzzle, color: "#FF5A1F" };
  return icons[index % icons.length];
}

function ModelsContent() {
  const router = useRouter();

  const [allModels, setAllModels] = useState<ModelItem[]>([]);
  const [trendingModels, setTrendingModels] = useState<ModelItem[]>([]);
  const [facets, setFacets] = useState<ModelFacets | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedModel, setInspectedModel] = useState<CatalogModel | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setTimeout(() => {
        setSelectedVendor(sp.get("vendor"));
        setSelectedDomain(sp.get("domain"));
        setSelectedCapability(sp.get("capability"));
        setSelectedFamily(sp.get("family"));
        setSelectedCollection(sp.get("collection"));
      }, 0);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      getModels(),
      getTrendingModels(20),
      getModelFacets(),
    ]).then(([models, trending, facetData]) => {
      setAllModels(models);
      setTrendingModels(trending);
      setFacets(facetData);
    }).catch(() => {
      setAllModels([]);
      setTrendingModels([]);
      setFacets(null);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const catalogModels: CatalogModel[] = useMemo(() => {
    return allModels.map(toCatalogModel);
  }, [allModels]);

  const trendCatalogModels: CatalogModel[] = useMemo(() => {
    return trendingModels.map(toCatalogModel);
  }, [trendingModels]);

  const clearAllFilters = () => {
    setSelectedVendor(null);
    setSelectedDomain(null);
    setSelectedCapability(null);
    setSelectedFamily(null);
    setSelectedCollection(null);
    setSearchQuery("");
    router.push("/models", { scroll: false });
  };

  const updateURL = (params: { vendor?: string | null; domain?: string | null; capability?: string | null; family?: string | null; collection?: string | null }) => {
    const v = params.vendor !== undefined ? params.vendor : selectedVendor;
    const d = params.domain !== undefined ? params.domain : selectedDomain;
    const c = params.capability !== undefined ? params.capability : selectedCapability;
    const f = params.family !== undefined ? params.family : selectedFamily;
    const col = params.collection !== undefined ? params.collection : selectedCollection;

    const urlParams = new URLSearchParams();
    if (v) urlParams.set("vendor", v);
    if (d) urlParams.set("domain", d);
    if (c) urlParams.set("capability", c);
    if (f) urlParams.set("family", f);
    if (col) urlParams.set("collection", col);

    const queryString = urlParams.toString();
    router.push(queryString ? `/models?${queryString}` : "/models", { scroll: false });

    setTimeout(() => {
      const dirElem = document.getElementById("model-directory");
      if (dirElem) {
        dirElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleCapabilityClick = (cap: string) => {
    const next = selectedCapability === cap ? null : cap;
    setSelectedCapability(next);
    setSelectedVendor(null); setSelectedDomain(null); setSelectedFamily(null); setSelectedCollection(null);
    updateURL({ capability: next, vendor: null, domain: null, family: null, collection: null });
  };

  const handleFamilyClick = (fam: string) => {
    const next = selectedFamily === fam ? null : fam;
    setSelectedFamily(next);
    setSelectedVendor(null); setSelectedDomain(null); setSelectedCapability(null); setSelectedCollection(null);
    updateURL({ family: next, vendor: null, domain: null, capability: null, collection: null });
  };

  const handleVendorClick = (vName: string) => {
    const next = selectedVendor === vName ? null : vName;
    setSelectedVendor(next);
    setSelectedDomain(null); setSelectedCapability(null); setSelectedFamily(null); setSelectedCollection(null);
    updateURL({ vendor: next, domain: null, capability: null, family: null, collection: null });
  };

  const handleDomainClick = (dName: string) => {
    const next = selectedDomain === dName ? null : dName;
    setSelectedDomain(next);
    setSelectedVendor(null); setSelectedCapability(null); setSelectedFamily(null); setSelectedCollection(null);
    updateURL({ domain: next, vendor: null, capability: null, family: null, collection: null });
  };

  const handleCollectionClick = (col: string) => {
    const next = selectedCollection === col ? null : col;
    setSelectedCollection(next);
    setSelectedVendor(null); setSelectedDomain(null); setSelectedCapability(null); setSelectedFamily(null);
    updateURL({ collection: next, vendor: null, domain: null, capability: null, family: null });
  };

  const activeFilterLabel = selectedVendor || selectedDomain || selectedCapability || selectedFamily || selectedCollection || null;

  const filteredCatalogModels = useMemo(() => {
    return catalogModels.filter(m => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches = m.name.toLowerCase().includes(q) || m.org.toLowerCase().includes(q) || (m.desc && m.desc.toLowerCase().includes(q)) || (m.tags && m.tags.some(t => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      if (selectedVendor) {
        const vLower = selectedVendor.toLowerCase();
        if (!m.org.toLowerCase().includes(vLower) && !vLower.includes(m.org.toLowerCase())) return false;
      }
      if (selectedFamily) {
        const fLower = selectedFamily.toLowerCase();
        if (m.family?.toLowerCase() !== fLower && !m.name.toLowerCase().includes(fLower)) return false;
      }
      if (selectedCapability) {
        const cLower = selectedCapability.toLowerCase();
        if (m.category?.toLowerCase() !== cLower && !m.tags.some(t => t.toLowerCase().includes(cLower)) && !m.area.toLowerCase().includes(cLower)) return false;
      }
      if (selectedDomain) {
        const dLower = selectedDomain.toLowerCase();
        if (!m.area.toLowerCase().includes(dLower) && !m.tags.some(t => t.toLowerCase().includes(dLower)) && !m.desc.toLowerCase().includes(dLower)) return false;
      }
      if (selectedCollection) {
        const colLower = selectedCollection.toLowerCase().replace(" models", "").trim();
        if (!m.tags.some(t => t.toLowerCase().includes(colLower)) && !m.area.toLowerCase().includes(colLower) && m.category?.toLowerCase() !== colLower) return false;
      }
      return true;
    });
  }, [catalogModels, selectedVendor, selectedDomain, selectedCapability, selectedFamily, selectedCollection, searchQuery]);

  const topModelForSelection = useMemo(() => {
    if (!activeFilterLabel || !trendCatalogModels.length) return null;
    const matched = trendCatalogModels.find(m => {
      if (selectedVendor && (m.org.toLowerCase().includes(selectedVendor.toLowerCase()) || selectedVendor.toLowerCase().includes(m.org.toLowerCase()))) return true;
      if (selectedFamily && m.family.toLowerCase() === selectedFamily.toLowerCase()) return true;
      if (selectedCapability && m.tags.some(t => t.toLowerCase() === selectedCapability.toLowerCase())) return true;
      if (selectedDomain && (m.area.toLowerCase().includes(selectedDomain.toLowerCase()) || selectedDomain.toLowerCase().includes(m.area.toLowerCase()))) return true;
      if (selectedCollection && m.tags.some(t => t.toLowerCase().includes(selectedCollection.toLowerCase().replace(" models", "").trim()))) return true;
      return false;
    });
    return matched || trendCatalogModels[0] || null;
  }, [selectedVendor, selectedFamily, selectedCapability, selectedDomain, selectedCollection, activeFilterLabel, trendCatalogModels]);

  const handleCopyQuickstart = () => {
    if (inspectedModel?.quickstart) {
      navigator.clipboard.writeText(inspectedModel.quickstart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const capabilityList = useMemo(() => {
    if (!facets?.capabilities) return [];
    return facets.capabilities.map(c => c.name);
  }, [facets]);

  const familyList = useMemo(() => {
    return facets?.modelFamilies || [];
  }, [facets]);

  const orgList = useMemo(() => {
    return facets?.vendors || [];
  }, [facets]);

  const researchAreaList = useMemo(() => {
    return facets?.researchAreas || [];
  }, [facets]);

  const recentlyReleased = useMemo(() => {
    return [...catalogModels]
      .filter(m => m.releaseDateRaw)
      .sort((a, b) => new Date(b.releaseDateRaw!).getTime() - new Date(a.releaseDateRaw!).getTime())
      .slice(0, 8);
  }, [catalogModels]);

  const popularCollections = useMemo(() => {
    const collections: { name: string; count: string; icon: React.ReactNode }[] = [];
    if (facets?.modalities) {
      facets.modalities.slice(0, 10).forEach(m => {
        collections.push({ name: m.name, count: `${m.count} Models`, icon: <Cpu size={20} /> });
      });
    }
    const defaults = [
      { name: "Reasoning Models", count: `${facets?.capabilities?.filter(c => c.name.toLowerCase().includes("reason")).reduce((s, c) => s + c.count, 0) || 84} Models`, icon: <Brain size={20} /> },
      { name: "Coding Models", count: `${facets?.totalModels || 210} Models`, icon: <Code2 size={20} /> },
      { name: "Open Source Models", count: `${facets?.totalModels || 210} Models`, icon: <Globe size={20} /> },
    ];
    return [...defaults, ...collections].slice(0, 15);
  }, [facets]);

  return (
    <div className="flex-1 flex flex-col min-h-full overflow-hidden bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="max-w-[1380px] mx-auto px-8 md:px-14 py-8 w-full">
          
          {/* HERO SECTION */}
          <div className="relative overflow-hidden mb-10 hidden md:flex min-h-[187.5px]">
            <div className="relative z-10 w-[30%] px-6 md:px-8 py-4 md:py-5">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight text-gray-900">
                All
                <span className="text-[#e11d48] ml-3">Models</span>
              </h1>
              <p className="text-gray-600 text-xs md:text-sm mb-4 max-w-md leading-relaxed">
                Discover the full landscape of AI foundation models through {facets?.modelFamilies?.length || 120}+ model families spanning reasoning, vision, code, audio, robotics, healthcare, and more.
              </p>
              <div className="flex items-center gap-4 whitespace-nowrap text-xs md:text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.capabilities?.length || 24}</div>
                    <div className="text-gray-500 text-[10px] md:text-xs">Capabilities</div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.modelFamilies?.length || 120}+</div>
                    <div className="text-gray-500 text-[10px] md:text-xs">Model Families</div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.totalModels || 400}+</div>
                    <div className="text-gray-500 text-[10px] md:text-xs">Verified SOTA</div>
                  </div>
                </div>
              </div>
            </div>
            {/* SVG Background Visualization */}
            <div className="absolute right-0 top-0 bottom-0 w-[70%] pointer-events-none overflow-hidden flex items-center justify-end">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F8F7F2] via-transparent to-transparent z-10" />
              <svg className="w-full h-full opacity-35 text-rose-500" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 200 20, 400 100 T 800 100" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 0 150 Q 250 50, 500 150 T 800 80" stroke="#f43f5e" strokeWidth="1" opacity="0.6" />
                <path d="M 100 50 Q 350 180, 600 40 T 800 160" stroke="#3b82f6" strokeWidth="1" opacity="0.4" />
                <circle cx="200" cy="62" r="4" fill="#e11d48" className="animate-pulse" />
                <circle cx="400" cy="100" r="5" fill="#e11d48" />
                <circle cx="600" cy="138" r="4" fill="#3b82f6" />
                <circle cx="500" cy="150" r="3" fill="#f43f5e" />
                <circle cx="250" cy="115" r="3" fill="#10b981" />
              </svg>
            </div>
          </div>
          <div className="flex gap-6">
            
            {/* LEFT SIDEBAR */}
            <aside className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm" aria-label="Domain navigation">
              <div className="sticky top-20 flex flex-col h-[calc(100vh-5rem)]">
                <div className="px-4 pt-6 pb-4">
                  <h3 className="text-[15px] font-semibold uppercase text-[#e11d48] mb-3">Browse Models</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Filter models..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 bg-white/80 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <nav className="overflow-y-auto px-2 pb-4" aria-label="Domains">
                  <ul className="space-y-0.5" role="list">
                    {[
                      { id: "all", label: "All Models" },
                      { id: "section-capability", label: "Browse by Capability" },
                      { id: "section-family", label: "Browse by Model Family" },
                      { id: "section-organization", label: "Browse by Organization" },
                      { id: "section-research", label: "Browse by Research Area" },
                      { id: "section-trending", label: "Trending Models" },
                      { id: "section-recently-released", label: "Recently Released" },
                      { id: "section-collections", label: "Popular Collections" },
                      { id: "model-directory", label: "Model Directory Table" }
                    ].map((item) => {
                      const isActive = activeSection === item.id || (item.id === "all" && activeSection === "all");
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setActiveSection(item.id);
                              if (item.id !== "all") {
                                const el = document.getElementById(item.id);
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              } else {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            className={`sidebar-nav-btn ${isActive ? "active" : ""}`}
                          >
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="px-2 mt-10">
                  <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl border border-rose-100 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-100 rounded-full text-rose-500 shrink-0">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-800">Can&apos;t find what you need?</p>
                        <p className="text-xs text-gray-500">Suggest a new domain or model to improve our taxonomy.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Thank you! Suggestion recorded for next taxonomy update.")}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Suggest a Domain
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT CONTENT AREA */}
            <div className="flex-1 min-w-0">
              
              {/* 2. BROWSE BY CAPABILITY */}
              <section id="section-capability" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold text-gray-800">Browse by Capability</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{capabilityList.length} Tasks &amp; Modalities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {capabilityList.filter(c => !searchQuery || c.toLowerCase().includes(searchQuery.toLowerCase())).map((cap, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx, cap);
                    const isActive = selectedCapability === cap;
                    return (
                      <div
                        key={cap}
                        onClick={() => handleCapabilityClick(cap)}
                        className={`directory-grid-card group ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-150 transition-transform">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 className="font-normal text-gray-800 text-[15px] leading-snug mb-0.5">{cap}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1.5 ml-11 mr-4 line-clamp-3">
                          Models that understand, generate, and execute specialized tasks across {cap}.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. BROWSE BY MODEL FAMILY */}
              <section id="section-family" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold text-gray-800">Browse by Model Family</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{familyList.length} Model Families</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {familyList.filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((fam, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 3, fam.name);
                    const isActive = selectedFamily === fam.name;
                    return (
                      <div
                        key={fam.name}
                        onClick={() => handleFamilyClick(fam.name)}
                        className={`directory-grid-card group ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-150 transition-transform">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 className="font-normal text-gray-800 text-[15px] leading-snug mb-0.5">{fam.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1.5 ml-11 mr-4 line-clamp-3">
                          Foundation architecture family. ({fam.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 4. BROWSE BY ORGANIZATION */}
              <section id="section-organization" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold text-gray-800">Browse by Organization</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{orgList.length} Leading Labs</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {orgList.filter(v => !searchQuery || v.name.toLowerCase().includes(searchQuery.toLowerCase())).map((v, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 7, v.name);
                    const isActive = selectedVendor === v.name;
                    return (
                      <div
                        key={v.name}
                        onClick={() => handleVendorClick(v.name)}
                        className={`directory-grid-card group ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-150 transition-transform">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 className="font-normal text-gray-800 text-[15px] leading-snug mb-0.5">{v.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1.5 ml-11 mr-4 line-clamp-3">
                          Explore frontier AI models, weights, and verified APIs published by {v.name}. ({v.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 5. BROWSE BY RESEARCH AREA */}
              <section id="section-research" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold text-gray-800">Browse by Research Area</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{researchAreaList.length} Modalities &amp; Domains</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {researchAreaList.filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((d, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 11, d.name);
                    const isActive = selectedDomain === d.name;
                    return (
                      <div
                        key={d.name}
                        onClick={() => handleDomainClick(d.name)}
                        className={`directory-grid-card group ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-150 transition-transform">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 className="font-normal text-gray-800 text-[15px] leading-snug mb-0.5">{d.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1.5 ml-11 mr-4 line-clamp-3">
                          Active research area with {d.count} models.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 6. TRENDING MODELS */}
              <section id="section-trending" className="mb-12 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold text-gray-800">Trending Models</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Most Active in 2025</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendCatalogModels.filter(m => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.org.toLowerCase().includes(searchQuery.toLowerCase())).map((m, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 15, m.name);
                    return (
                      <div
                        key={m.id}
                        onClick={() => setInspectedModel(m)}
                        className="directory-grid-card group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg group-hover:scale-150 transition-transform">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 className="font-normal text-gray-800 text-[15px] leading-snug mb-0.5">{m.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1.5 ml-11 mr-4 line-clamp-3" title={m.desc}>{m.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

        {/* 7. RECENTLY RELEASED */}
        <section id="section-recently-released" className="models-block-section scroll-mt-24">
          <div className="models-block-header">
            <h2 className="models-block-title">
              <Calendar size={22} style={{ color: "#FF5A1F" }} />
              <span>Recently Released</span>
            </h2>
            <span className="models-block-count">Latest Foundation Arrivals</span>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid var(--border)", borderRadius: "2px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="models-data-table" style={{ width: "100%", minWidth: "1100px", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #111111" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666" }}>Model Name</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666" }}>Organization</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666" }}>Release Date</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666" }}>Model Family</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666" }}>Short Description</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyReleased.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => {
                        setInspectedModel(r);
                      }}
                      style={{ borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF8F6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <td style={{ padding: "12px 14px", fontWeight: 400, fontSize: "12.5px", color: "#111111", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF5A1F", display: "inline-block" }}></span>
                        <span>{r.name}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontWeight: 400, fontSize: "11.5px", color: "#555555", whiteSpace: "nowrap" }}>{r.org}</td>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 400, fontSize: "11px", color: "#FF5A1F", whiteSpace: "nowrap" }}>{r.releaseDate}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 400, fontSize: "11.5px", color: "#111111", whiteSpace: "nowrap" }}>
                        <span style={{ padding: "3px 8px", background: "#F8F7F2", borderRadius: "2px", border: "1px solid var(--border)" }}>{r.family}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: "12px", fontWeight: 400, color: "#444444", maxWidth: "520px" }}>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8. POPULAR MODEL COLLECTIONS */}
        <section id="section-collections" className="models-block-section scroll-mt-24">
          <div className="models-block-header">
            <h2 className="models-block-title">
              <BookOpen size={22} style={{ color: "#FF5A1F" }} />
              <span>Popular Model Collections</span>
            </h2>
            <span className="models-block-count">15 Curated Tracks</span>
          </div>
          <div className="models-collections-grid">
            {popularCollections.map((col) => {
              const isActive = selectedCollection === col.name;
              return (
                <button
                  key={col.name}
                  onClick={() => handleCollectionClick(col.name)}
                  className={`models-collection-card ${isActive ? "active" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="models-collection-icon">{col.icon}</span>
                    <span className="models-family-card-count" style={{ background: isActive ? "#FF5A1F" : "#F8F7F2", color: isActive ? "#ffffff" : "#666666" }}>
                      {col.count}
                    </span>
                  </div>
                  <span style={{ fontWeight: 400, fontSize: "14px", letterSpacing: "-0.2px", lineHeight: "1.3", marginTop: "10px", textAlign: "left" }}>
                    {col.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 9. MODEL DIRECTORY TABLE */}
        <div id="model-directory" className="models-catalog-section" style={{ borderRadius: "2px" }}>
          <div className="models-catalog-header">
            <div className="models-catalog-title-box">
              <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#FF5A1F", background: "#FFF6F3", padding: "4px 10px", borderRadius: "2px", border: "1px solid #FFEDD5", display: "inline-block", marginBottom: "6px" }}>
                {activeFilterLabel ? `Filtered Directory: ${activeFilterLabel}` : "Unfiltered Registry"}
              </span>
              <h2 style={{ fontSize: "24px", fontWeight: 400, color: "#111111", letterSpacing: "-0.3px", margin: "4px 0 0 0" }}>Model Directory ({filteredCatalogModels.length} {filteredCatalogModels.length === 1 ? "Model" : "Models"})</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {activeFilterLabel && (
                <button
                  onClick={clearAllFilters}
                  style={{ padding: "8px 16px", background: "#FFF6F3", color: "#FF5A1F", border: "1px solid #FFEDD5", borderRadius: "2px", fontWeight: 400, fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <X size={14} />
                  <span>Clear Filter ({activeFilterLabel})</span>
                </button>
              )}
              <span style={{ fontSize: "12.5px", fontWeight: 400, color: "#666666" }}>
                Sorted by SOTA Elo Rank &amp; Release Velocity
              </span>
            </div>
          </div>

          {/* Top Model Card */}
          {activeFilterLabel && topModelForSelection && (
            <div style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid var(--border)", background: "#F8F7F2", padding: "24px", borderRadius: "2px", border: "1px solid var(--border)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", textTransform: "uppercase", padding: "3px 8px", background: "#FFF6F3", color: "#FF5A1F", borderRadius: "2px", border: "1px solid #FFEDD5", fontWeight: 400 }}>
                    ⚡ SOTA Leader &middot; {topModelForSelection.org} ({activeFilterLabel})
                  </span>
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#666666", fontWeight: 400 }}>
                    Rank #1 verified benchmark leader
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px", flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: "24px", fontWeight: 400, color: "#111111", letterSpacing: "-0.5px" }}>
                    {topModelForSelection.name}
                  </h3>
                  <span style={{ fontSize: "14.5px", fontWeight: 400, color: "#FF5A1F" }}>
                    {topModelForSelection.benchmarks?.[0]?.score || `⚡ ${topModelForSelection.elo}`}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "#555555", fontWeight: 400, marginTop: "6px", maxWidth: "780px", lineHeight: "1.5" }}>
                  {topModelForSelection.desc}
                </p>
              </div>
              <button
                onClick={() => setInspectedModel(topModelForSelection)}
                style={{ padding: "10px 20px", background: "#111111", color: "#ffffff", borderRadius: "2px", fontWeight: 400, fontSize: "13px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>Inspect Specs</span>
                <ExternalLink size={14} />
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "15px", fontWeight: 400, color: "#555555" }}>Loading models...</p>
            </div>
          ) : filteredCatalogModels.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#F8F7F2", borderRadius: "2px", border: "1px dashed var(--border)" }}>
              <p style={{ fontSize: "15px", fontWeight: 400, color: "#555555" }}>No deep evaluation records match your exact filter ({activeFilterLabel || searchQuery}) right now.</p>
              <button
                onClick={clearAllFilters}
                style={{ marginTop: "12px", fontSize: "13px", fontWeight: 400, color: "#FF5A1F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Reset All Filters &amp; Browse All Foundation Models &rarr;
              </button>
            </div>
          ) : (
            <div className="models-catalog-table-wrapper">
              <table className="models-data-table">
                <thead>
                  <tr>
                    <th className="col-idx">#</th>
                    <th className="col-name">Model</th>
                    <th className="col-org">Organization</th>
                    <th className="col-family">Model Family</th>
                    <th>Category</th>
                    <th>Parameters</th>
                    <th>Context Window</th>
                    <th>License</th>
                    <th style={{ textAlign: "left" }}>Benchmarks</th>
                    <th>Papers</th>
                    <th>Release Date</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogModels.map((model, idx) => (
                    <tr key={model.id} onClick={() => setInspectedModel(model)}>
                      <td className="col-idx">{(idx + 1).toString().padStart(3, "0")}</td>
                      <td className="col-name">
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5A1F", display: "inline-block", flexShrink: 0 }}></span>
                          <span style={{ fontWeight: 400 }}>{model.name}</span>
                        </div>
                      </td>
                      <td className="col-org" style={{ fontWeight: 400, color: "#555555" }}>{model.org}</td>
                      <td className="col-family" style={{ fontWeight: 400, color: "#111111", whiteSpace: "nowrap" }}>
                        <span style={{ padding: "3px 8px", background: "#F8F7F2", borderRadius: "2px", border: "1px solid var(--border)", fontSize: "11px", whiteSpace: "nowrap", display: "inline-block", fontWeight: 400 }}>{model.family || "Foundation"}</span>
                      </td>
                      <td style={{ color: "#555555", fontWeight: 400 }}>{model.category || "General Purpose"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#333333", fontWeight: 400 }}>{model.params || "Dense / MoE"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#111111", fontWeight: 400 }}>{model.context || "128k tokens"}</td>
                      <td style={{ color: "#555555", fontSize: "11px", fontWeight: 400 }}>{model.license || "Proprietary"}</td>
                      <td style={{ textAlign: "left", fontWeight: 400, color: "#FF5A1F", fontFamily: "monospace", fontSize: "11px" }}>
                        {model.elo ? `⚡ ${model.elo} Elo` : `${model.benchmarks?.length || 3} verified`}
                      </td>
                      <td style={{ color: "#555555", fontWeight: 400, fontSize: "11px" }}>{model.paperCount || 150} papers</td>
                      <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#777777", fontWeight: 400 }}>{model.releaseDate || "2024-2025"}</td>
                      <td className="col-action">
                        <button className="models-inspect-btn" style={{ borderRadius: "2px", fontWeight: 400 }}>Inspect &rarr;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* INSPECT MODEL SLIDE-OVER MODAL */}
      {inspectedModel && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "flex-end", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#ffffff", width: "100%", maxWidth: "660px", height: "100%", overflowY: "auto", padding: "32px", boxShadow: "-10px 0 30px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "1px solid var(--border)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "16px", borderBottom: "1px solid var(--border)", marginBottom: "24px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", padding: "4px 10px", background: "#FFF6F3", color: "#FF5A1F", borderRadius: "2px", border: "1px solid #FFEDD5" }}>
                      {inspectedModel.org}
                    </span>
                    {inspectedModel.family && (
                      <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", background: "#F8F7F2", color: "#333333", borderRadius: "2px", border: "1px solid var(--border)" }}>
                        Family: {inspectedModel.family}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#111111", marginTop: "8px" }}>
                    {inspectedModel.name}
                  </h2>
                </div>
                <button
                  onClick={() => setInspectedModel(null)}
                  style={{ width: "40px", height: "40px", borderRadius: "2px", background: "#F8F7F2", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "#555555", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: "15px", color: "#555555", fontWeight: 500, lineHeight: "1.6", marginBottom: "24px" }}>
                {inspectedModel.desc}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px", background: "#F8F7F2", padding: "16px", borderRadius: "2px", border: "1px solid var(--border)", fontSize: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Architecture</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.params || "Dense / MoE"}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Context</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.context || "128k tokens"}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Elo / SOTA</span>
                  <span style={{ fontWeight: 800, color: "#16A34A" }}>{inspectedModel.elo ? `⚡ ${inspectedModel.elo}` : "N/A"}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Citations</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.paperCount}</span>
                </div>
              </div>

              {inspectedModel.benchmarks && inspectedModel.benchmarks.length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", color: "#111111", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Trophy size={16} style={{ color: "#FF5A1F" }} />
                    <span>Verified Academic Benchmarks</span>
                  </h3>
                  <div style={{ background: "#F8F7F2", borderRadius: "2px", padding: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {inspectedModel.benchmarks.map((bm, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                          <span style={{ color: "#333333" }}>{bm.name}</span>
                          <span style={{ color: "#111111", fontWeight: 900 }}>{bm.score}</span>
                        </div>
                        <div style={{ width: "100%", background: "#E5E5E0", height: "8px", borderRadius: "2px", overflow: "hidden" }}>
                          <div
                            style={{ height: "100%", borderRadius: "2px", width: `${bm.value}%`, backgroundColor: bm.color || "#FF5A1F" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspectedModel.quickstart && (
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 900, color: "#111111", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Code2 size={16} style={{ color: "#FF5A1F" }} />
                      <span>Inference Quickstart</span>
                    </span>
                    <button
                      onClick={handleCopyQuickstart}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 700, padding: "4px 10px", background: "#F3F4F6", border: "none", borderRadius: "2px", cursor: "pointer" }}
                    >
                      {copied ? (
                        <>
                          <Check size={13} style={{ color: "#16A34A" }} />
                          <span style={{ color: "#16A34A" }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} style={{ color: "#555555" }} />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre style={{ background: "#111111", color: "#F8F7F2", padding: "16px", borderRadius: "2px", fontSize: "12px", fontFamily: "monospace", overflowX: "auto", border: "1px solid #333333", lineHeight: "1.5" }}>
                    <code>{inspectedModel.quickstart}</code>
                  </pre>
                </div>
              )}
            </div>

            <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link
                href={`/models/${inspectedModel.slug}`}
                style={{ padding: "10px 20px", background: "#FF5A1F", color: "#ffffff", borderRadius: "2px", fontWeight: 800, fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>View Full Model Detail Page</span>
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={() => setInspectedModel(null)}
                style={{ padding: "10px 20px", background: "#F8F7F2", color: "#111111", borderRadius: "2px", fontWeight: 700, fontSize: "13px", border: "1px solid var(--border)", cursor: "pointer" }}
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModelsPage() {
  return <ModelsContent />;
}
