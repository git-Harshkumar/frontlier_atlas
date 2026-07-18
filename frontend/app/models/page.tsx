"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trophy, Cpu, Layers, ExternalLink, Code2, Check, Copy, X, ArrowRight, Zap, Calendar, BookOpen, Building2, Brain, Monitor, Globe, FileText, Link as LinkIcon, Volume2, ImageIcon, Video, Bot, Sparkles, TrendingUp, MessageSquare, Plus, Eye, Puzzle, Network, Database, Shield, Terminal, Activity, GitBranch, BarChart3, Radio, Mic, Share2, ChevronRight } from "lucide-react";
import { getModels, getTrendingModels, getModelFacets, type ModelItem, type ModelFacets } from "@/lib/models";
import Navbar from "@/components/Navbar";

// Top models will be loaded from backend

// Capabilities will be loaded from backend facets

// Model families will be loaded from backend facets

// Organizations will be loaded from backend facets

// Research areas will be loaded from backend facets

// Trending models will be loaded from backend

// Recently released will be loaded from backend

// Popular collections will be derived from backend data

function getOrgLogo(orgOrLeader: string): string {
  const lower = (orgOrLeader || "").toLowerCase();
  if (lower.includes("ibm")) {
    return "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg";
  }
  if (lower.includes("anthropic") || lower.includes("claude opus") || lower.includes("claude sonnet")) {
    return "https://avatars.githubusercontent.com/u/76263028?v=4";
  }
  if (lower.includes("claude")) {
    return "https://www.google.com/s2/favicons?domain=claude.ai&sz=128";
  }
  if (lower.includes("qwen") || lower.includes("ocr")) {
    return "https://avatars.githubusercontent.com/u/141221163?v=4";
  }
  if (lower.includes("alibaba")) {
    return "https://avatars.githubusercontent.com/u/19519599?v=4";
  }
  if (lower.includes("openai") || lower.includes("gpt") || lower.includes("whisper") || lower.includes("sora") || lower.includes("clip")) {
    return "https://avatars.githubusercontent.com/u/14957082?v=4";
  }
  if (lower.includes("gemini") || lower.includes("gemma")) {
    return "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png";
  }
  if (lower.includes("google") || lower.includes("deepmind") || lower.includes("alphafold") || lower.includes("rt-2")) {
    return "https://www.google.com/s2/favicons?domain=google.com&sz=128";
  }
  if (lower.includes("meta") || lower.includes("llama") || lower.includes("sam") || lower.includes("audiocraft") || lower.includes("dlrm")) {
    return "https://avatars.githubusercontent.com/u/153379578?v=4";
  }
  if (lower.includes("deepseek") || lower.includes("janus")) {
    return "https://avatars.githubusercontent.com/u/148330874?v=4";
  }
  if (lower.includes("mistral") || lower.includes("pixtral")) {
    return "https://avatars.githubusercontent.com/u/132372032?v=4";
  }
  if (lower.includes("xai") || lower.includes("grok")) {
    return "https://avatars.githubusercontent.com/u/130314967?v=4";
  }
  if (lower.includes("microsoft") || lower.includes("phi") || lower.includes("med-palm")) {
    return "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128";
  }
  if (lower.includes("moonshot") || lower.includes("kimi")) {
    return "https://www.google.com/s2/favicons?domain=moonshot.cn&sz=128";
  }
  if (lower.includes("zhipu") || lower.includes("glm")) {
    return "https://www.google.com/s2/favicons?domain=zhipuai.cn&sz=128";
  }
  if (lower.includes("allen") || lower.includes("molmo")) {
    return "https://www.google.com/s2/favicons?domain=allenai.org&sz=128";
  }
  if (lower.includes("time series") || lower.includes("timeseries") || lower.includes("chronos") || lower.includes("amazon") || lower.includes("nixtla")) {
    return "https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128";
  }
  if (lower.includes("nvidia")) {
    return "https://www.google.com/s2/favicons?domain=nvidia.com&sz=128";
  }
  if (lower.includes("hugging") || lower.includes("face")) {
    return "https://www.google.com/s2/favicons?domain=huggingface.co&sz=128";
  }
  if (lower.includes("cohere")) {
    return "https://www.google.com/s2/favicons?domain=cohere.com&sz=128";
  }
  if (lower.includes("apple")) {
    return "https://www.google.com/s2/favicons?domain=apple.com&sz=128";
  }
  if (lower.includes("bytedance") || lower.includes("douyin") || lower.includes("tiktok")) {
    return "https://www.google.com/s2/favicons?domain=bytedance.com&sz=128";
  }
  if (lower.includes("minimax")) {
    return "https://www.google.com/s2/favicons?domain=minimaxi.com&sz=128";
  }
  if (lower.includes("tii") || lower.includes("falcon")) {
    return "https://www.google.com/s2/favicons?domain=tii.ae&sz=128";
  }
  if (lower.includes("shanghai") || lower.includes("internlm")) {
    return "https://www.google.com/s2/favicons?domain=internlm.intern-ai.org.cn&sz=128";
  }
  if (lower.includes("black forest") || lower.includes("flux")) {
    return "https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128";
  }
  if (lower.includes("stability") || lower.includes("stable diffusion")) {
    return "https://www.google.com/s2/favicons?domain=stability.ai&sz=128";
  }
  return "https://www.google.com/s2/favicons?domain=ai.com&sz=128";
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
  const [inspectedModel, setInspectedModel] = useState<ModelItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
      getTrendingModels(15),
      getModelFacets()
    ]).then(([modelsData, trendingData, facetsData]) => {
      setAllModels(modelsData);
      setTrendingModels(trendingData);
      setFacets(facetsData);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading models data:', err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const sectionIds = [
      "section-capability",
      "section-family",
      "section-organization",
      "section-research",
      "section-trending",
      "section-recently-released",
      "model-directory"
    ];

    let ticking = false;

    const updateActiveSection = () => {
      let closestId: string | null = null;
      let closestDistance = Infinity;

      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestId = id;
          }
        }
      });

      if (closestId) {
        setActiveSection(closestId);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    // Initial check
    updateActiveSection();

    // Check on scroll
    window.addEventListener("scroll", handleScroll);

    // Also use IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      () => {
        updateActiveSection();
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
      }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

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
    return allModels.filter(m => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matches = m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)) || (m.capabilities && m.capabilities.some(t => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      if (selectedVendor) {
        const vLower = selectedVendor.toLowerCase();
        if (!m.vendor.toLowerCase().includes(vLower) && !vLower.includes(m.vendor.toLowerCase())) return false;
      }
      if (selectedFamily) {
        const fLower = selectedFamily.toLowerCase();
        if (m.modelFamily?.toLowerCase() !== fLower && !m.name.toLowerCase().includes(fLower)) return false;
      }
      if (selectedCapability) {
        const cLower = selectedCapability.toLowerCase();
        if (m.category?.toLowerCase() !== cLower && !(m.capabilities && m.capabilities.some(t => t.toLowerCase().includes(cLower))) && !(m.researchAreas && m.researchAreas.some(t => t.toLowerCase().includes(cLower)))) return false;
      }
      if (selectedDomain) {
        const dLower = selectedDomain.toLowerCase();
        if (!(m.researchAreas && m.researchAreas.some(t => t.toLowerCase().includes(dLower))) && !(m.capabilities && m.capabilities.some(t => t.toLowerCase().includes(dLower))) && !(m.description && m.description.toLowerCase().includes(dLower))) return false;
      }
      if (selectedCollection) {
        const colLower = selectedCollection.toLowerCase().replace(" models", "").trim();
        if (!(m.capabilities && m.capabilities.some(t => t.toLowerCase().includes(colLower))) && !(m.researchAreas && m.researchAreas.some(t => t.toLowerCase().includes(colLower))) && m.category?.toLowerCase() !== colLower) return false;
      }
      return true;
    });
  }, [allModels, selectedVendor, selectedDomain, selectedCapability, selectedFamily, selectedCollection, searchQuery]);

  const topModelForSelection = useMemo(() => {
    if (!activeFilterLabel || !filteredCatalogModels.length) return null;
    return filteredCatalogModels[0];
  }, [activeFilterLabel, filteredCatalogModels]);

  const filteredCapabilities = useMemo(() => {
    if (!facets?.capabilities) return [];
    const q = searchQuery.toLowerCase();
    return facets.capabilities.filter(c => !searchQuery || c.name.toLowerCase().includes(q));
  }, [facets?.capabilities, searchQuery]);

  const filteredModelFamilies = useMemo(() => {
    if (!facets?.modelFamilies) return [];
    const q = searchQuery.toLowerCase();
    return facets.modelFamilies.filter(f => !searchQuery || f.name.toLowerCase().includes(q));
  }, [facets?.modelFamilies, searchQuery]);

  const filteredVendors = useMemo(() => {
    if (!facets?.vendors) return [];
    const q = searchQuery.toLowerCase();
    return facets.vendors.filter(v => !searchQuery || v.name.toLowerCase().includes(q));
  }, [facets?.vendors, searchQuery]);

  const filteredResearchAreas = useMemo(() => {
    if (!facets?.researchAreas) return [];
    const q = searchQuery.toLowerCase();
    return facets.researchAreas.filter(r => !searchQuery || r.name.toLowerCase().includes(q));
  }, [facets?.researchAreas, searchQuery]);

  const filteredTrending = useMemo(() => {
    if (!trendingModels) return [];
    const q = searchQuery.toLowerCase();
    return trendingModels.filter(m => !searchQuery || m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q));
  }, [trendingModels, searchQuery]);

  const filteredRecentlyReleasedTable = useMemo(() => {
    if (!allModels || !allModels.length) return [];
    const recent = allModels.slice(0, 8).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!searchQuery) return recent;
    const q = searchQuery.toLowerCase();
    return recent.filter(m => m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)));
  }, [allModels, searchQuery]);

  const hasSearchResults = useMemo(() => {
    if (!searchQuery) return true;
    return filteredCapabilities.length > 0 ||
      filteredModelFamilies.length > 0 ||
      filteredVendors.length > 0 ||
      filteredResearchAreas.length > 0 ||
      filteredTrending.length > 0 ||
      filteredRecentlyReleasedTable.length > 0 ||
      filteredCatalogModels.length > 0;
  }, [searchQuery, filteredCapabilities, filteredModelFamilies, filteredVendors, filteredResearchAreas, filteredTrending, filteredRecentlyReleasedTable, filteredCatalogModels]);

  const handleCopyQuickstart = () => {
    if (inspectedModel?.description) {
      navigator.clipboard.writeText(inspectedModel.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-full bg-[#F8F7F2] font-sans text-slate-800">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading models...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-full bg-[#F8F7F2] font-sans text-slate-800">
      <Navbar />
      <div className="flex-1 flex">
        <main className="flex-1">
        <div className="max-w-[1380px] mx-auto px-8 md:px-14 py-8 w-full">
          
          {/* HERO SECTION — Exact Tasks page layout */}
          <div className="relative overflow-hidden mb-10 hidden md:flex min-h-[187.5px]">
            <div className="relative z-10 w-[30%] px-6 md:px-8 py-4 md:py-5">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight text-gray-900">
                All
                <span style={{ color: "#E11D48" }} className="ml-3">Models</span>
              </h1>
              <p className="text-gray-600 text-xs md:text-sm mb-4 max-w-md leading-relaxed">
                Discover the full landscape of AI foundation models through {facets?.modelFamilies?.length || 0} model families spanning reasoning, vision, code, audio, robotics, healthcare, and more.
              </p>
              <div className="flex items-center gap-4 whitespace-nowrap text-xs md:text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.capabilities?.length}</div>
                    <div className="text-gray-500 text-[10px] md:text-xs">Capabilities</div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.modelFamilies?.length}</div>
                    <div className="text-gray-500 text-[10px] md:text-xs">Model Families</div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-lg md:text-xl font-bold text-gray-800">{facets?.totalModels}</div>
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
            
            {/* LEFT SIDEBAR WITH SEARCH & NAVIGATION OPTIONS EXACT TO reference */}
            <aside className="w-64 flex-shrink-0 hidden lg:block backdrop-blur-sm" aria-label="Domain navigation">
              <div className="sticky top-20 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
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
                      { id: "section-capability", label: "Browse by Capability" },
                      { id: "section-family", label: "Browse by Model Family" },
                      { id: "section-organization", label: "Browse by Organization" },
                      { id: "section-research", label: "Browse by Research Area" },
                      { id: "section-trending", label: "Trending Models" },
                      { id: "section-recently-released", label: "Recently Released" },
                      { id: "model-directory", label: "Model Directory Table" }
                    ].map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              const el = document.getElementById(item.id);
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '6px 12px',
                              fontFamily: "'Plus Jakarta Sans', 'Outfit', 'Inter', system-ui, sans-serif",
                              fontSize: '12px',
                              lineHeight: '1.375',
                              borderRadius: '6px',
                              fontWeight: isActive ? '600' : '500',
                              color: isActive ? '#ffffff' : '#555555',
                              border: '1px solid transparent',
                              transition: 'all 0.2s ease',
                              textAlign: 'left',
                              cursor: 'pointer',
                              backgroundColor: isActive ? '#111111' : 'transparent'
                            }}
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
                        <p className="text-sm font-medium text-gray-800">Can’t find what you need?</p>
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

            {/* RIGHT CONTENT AREA CONTAINING ALL SECTIONS & EXACT CARDS */}
            <div className="flex-1 min-w-0">
              
              {/* 2. BROWSE BY CAPABILITY (Exact tasks UI reference cards) */}
              {filteredCapabilities.length > 0 && (
              <section id="section-capability" className="mb-12 scroll-mt-24">
                <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
                  <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
                    <h2>Browse by Capability</h2>
                  </div>
                  <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">{facets?.capabilities?.length} Tasks &amp; Modalities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredCapabilities.map((cap, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx, cap.name);
                    const isActive = selectedCapability === cap.name;
                    return (
                      <div
                        key={cap.name}
                        onClick={() => handleCapabilityClick(cap.name)}
                        style={{
                          background: '#ffffff',
                          padding: '0.95rem 0.75rem',
                          borderRadius: '0.125rem',
                          boxShadow: isActive ? '0 0 0 1px #fb7185' : '0 2px 8px -4px rgba(0, 0, 0, 0.05)',
                          border: `1px solid ${isActive ? '#fb7185' : '#f3f4f6'}`,
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer',
                          display: 'block',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'rgba(255, 241, 242, 0.5)' : '#ffffff'
                        }}
                        className="group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-150">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 style={{
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: isActive ? '700' : '500',
                            color: '#1f2937',
                            lineHeight: '1.375',
                            marginBottom: '2px'
                          }}>{cap.name}</h3>
                        </div>
                        <p style={{
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          fontWeight: '400',
                          color: '#6b7280',
                          lineHeight: '1.25rem',
                          marginTop: '0.375rem',
                          marginLeft: '2.0rem',
                          marginRight: '0.5rem'
                        }}>
                          Models that understand, generate, and execute specialized tasks across {cap.name}. ({cap.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
              )}

              {/* 3. BROWSE BY MODEL FAMILY */}
              {filteredModelFamilies.length > 0 && (
              <section id="section-family" className="mb-12 scroll-mt-24">
                <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
                  <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
                    <h2>Browse by Model Family</h2>
                  </div>
                  <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">{facets?.modelFamilies?.length} Model Families</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredModelFamilies.map((fam, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 3, fam.name);
                    const isActive = selectedFamily === fam.name;
                    return (
                      <div
                        key={fam.name}
                        onClick={() => handleFamilyClick(fam.name)}
                        style={{
                          background: '#ffffff',
                          padding: '0.95rem 0.75rem',
                          borderRadius: '0.125rem',
                          boxShadow: isActive ? '0 0 0 1px #fb7185' : '0 2px 8px -4px rgba(0, 0, 0, 0.05)',
                          border: `1px solid ${isActive ? '#fb7185' : '#f3f4f6'}`,
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer',
                          display: 'block',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'rgba(255, 241, 242, 0.5)' : '#ffffff'
                        }}
                        className="group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-150">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 style={{
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: isActive ? '700' : '500',
                            color: '#1f2937',
                            lineHeight: '1.375',
                            marginBottom: '2px'
                          }}>{fam.name}</h3>
                        </div>
                        <p style={{
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          fontWeight: '400',
                          color: '#6b7280',
                          lineHeight: '1.25rem',
                          marginTop: '0.375rem',
                          marginLeft: '2.0rem',
                          marginRight: '0.5rem'
                        }}>
                          ({fam.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
              )}

              {/* 4. BROWSE BY ORGANIZATION */}
              {filteredVendors.length > 0 && (
              <section id="section-organization" className="mb-12 scroll-mt-24">
                <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
                  <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
                    <h2>Browse by Organization</h2>
                  </div>
                  <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">{facets?.vendors?.length} Leading Labs</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredVendors.map((v, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 7, v.name);
                    const isActive = selectedVendor === v.name;
                    const vendorModel = allModels.find(
  (model) => model.vendor.toLowerCase() === v.name.toLowerCase()
);

const vendorLogo = vendorModel?.vendorLogoUrl;
                    
                    return (
                      <div
                        key={v.name}
                        onClick={() => handleVendorClick(v.name)}
                        style={{
                          background: '#ffffff',
                          padding: '0.95rem 0.75rem',
                          borderRadius: '0.125rem',
                          boxShadow: isActive ? '0 0 0 1px #fb7185' : '0 2px 8px -4px rgba(0, 0, 0, 0.05)',
                          border: `1px solid ${isActive ? '#fb7185' : '#f3f4f6'}`,
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer',
                          display: 'block',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'rgba(255, 241, 242, 0.5)' : '#ffffff'
                        }}
                        className="group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-110">
  {vendorLogo ? (
    <img
      src={vendorLogo}
      alt={v.name}
      className="w-5 h-5 object-contain"
    />
  ) : (
    <SkeletalIcon size={20} style={{ color: strokeColor }} />
  )}
</div>
                          <h3 style={{
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: isActive ? '700' : '500',
                            color: '#1f2937',
                            lineHeight: '1.375',
                            marginBottom: '2px'
                          }}>{v.name}</h3>
                        </div>
                        <p style={{
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          fontWeight: '400',
                          color: '#6b7280',
                          lineHeight: '1.25rem',
                          marginTop: '0.375rem',
                          marginLeft: '2.0rem',
                          marginRight: '0.5rem'
                        }}>
                          Explore frontier AI models, weights, and verified APIs published by {v.name}. ({v.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
              )}

              {/* 5. BROWSE BY RESEARCH AREA */}
              {filteredResearchAreas.length > 0 && (
              <section id="section-research" className="mb-12 scroll-mt-24">
                <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
                  <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
                    <h2>Browse by Research Area</h2>
                  </div>
                  <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">{facets?.researchAreas?.length} Modalities &amp; Domains</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredResearchAreas.map((d, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 11, d.name);
                    const isActive = selectedDomain === d.name;
                    return (
                      <div
                        key={d.name}
                        onClick={() => handleDomainClick(d.name)}
                        style={{
                          background: '#ffffff',
                          padding: '0.95rem 0.75rem',
                          borderRadius: '0.125rem',
                          boxShadow: isActive ? '0 0 0 1px #fb7185' : '0 2px 8px -4px rgba(0, 0, 0, 0.05)',
                          border: `1px solid ${isActive ? '#fb7185' : '#f3f4f6'}`,
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer',
                          display: 'block',
                          textDecoration: 'none',
                          backgroundColor: isActive ? 'rgba(255, 241, 242, 0.5)' : '#ffffff'
                        }}
                        className="group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-150">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 style={{
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: isActive ? '700' : '500',
                            color: '#1f2937',
                            lineHeight: '1.375',
                            marginBottom: '2px'
                          }}>{d.name}</h3>
                        </div>
                        <p style={{
                          fontFamily: 'inherit',
                          fontSize: '0.875rem',
                          fontWeight: '400',
                          color: '#6b7280',
                          lineHeight: '1.25rem',
                          marginTop: '0.375rem',
                          marginLeft: '2.0rem',
                          marginRight: '0.5rem'
                        }}>
                          Leading architectural benchmarks and evaluations. ({d.count} Models)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
              )}

              {/* 6. TRENDING MODELS */}
              {filteredTrending.length > 0 && (
              <section id="section-trending" className="mb-12 scroll-mt-24">
                <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
                  <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
                    <h2>Trending Models</h2>
                  </div>
                  <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">Most Active in 2025</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredTrending.map((m, idx) => {
                    const { Icon: SkeletalIcon, color: strokeColor } = getSkeletalIcon(idx + 15, m.name);
                    return (
                      <div
                        key={m.id}
                        onClick={() => setInspectedModel(m)}
                        style={{
                          background: '#ffffff',
                          padding: '0.95rem 0.75rem',
                          borderRadius: '0.125rem',
                          boxShadow: '0 2px 8px -4px rgba(0, 0, 0, 0.05)',
                          border: '1px solid #f3f4f6',
                          transition: 'box-shadow 0.2s ease',
                          cursor: 'pointer',
                          display: 'block',
                          textDecoration: 'none'
                        }}
                        className="group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 p-2 rounded-lg transition-transform group-hover:scale-150">
                            <SkeletalIcon size={20} style={{ color: strokeColor }} />
                          </div>
                          <h3 style={{
                            fontFamily: 'inherit',
                            fontSize: '15px',
                            fontWeight: '500',
                            color: '#1f2937',
                            lineHeight: '1.375',
                            marginBottom: '2px'
                          }}>{m.name}</h3>
                        </div>
                        {m.description && (
                          <p style={{
                            fontFamily: 'inherit',
                            fontSize: '0.875rem',
                            fontWeight: '400',
                            color: '#6b7280',
                            lineHeight: '1.25rem',
                            marginTop: '0.375rem',
                            marginLeft: '2.0rem',
                            marginRight: '0.5rem'
                          }} title={m.description}>{m.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
              )}

        {/* 7. RECENTLY RELEASED (Page 4) */}
        {filteredRecentlyReleasedTable.length > 0 && (
        <section id="section-recently-released" className="mb-12 scroll-mt-24">
          <div className="models-block-header flex justify-between items-center mb-6 border-b-0 pb-0">
            <div className="models-block-title flex items-center gap-3 text-[30px] font-bold text-gray-800">
              <Calendar size={22} style={{ color: "#FF5A1F" }} />
              <span>Recently Released</span>
            </div>
            <span className="models-block-count text-[11px] font-normal uppercase tracking-wider text-gray-400">Latest Foundation Arrivals</span>
          </div>
          <div style={{ background: "#ffffff", border: "1px solid #E5E5E0", borderRadius: "2px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)", padding: "20px 14px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "1280px", borderCollapse: "collapse", textAlign: "left", fontFamily: "'Inter', system-ui, sans-serif", tableLayout: "auto" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #111111" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Model Name</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Organization</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Release Date</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Model Family</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Short Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecentlyReleasedTable.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setInspectedModel(r)}
                      style={{ borderBottom: "1px solid #EAE9E4", cursor: "pointer", transition: "background 0.15s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF8F6"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <td style={{ padding: "12px 12px", fontWeight: 400, fontSize: "12.5px", color: "#111111", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#FF5A1F", display: "inline-block" }}></span>
                        <span>{r.name}</span>
                      </td>
                      <td style={{ padding: "12px 12px", fontWeight: 400, fontSize: "11.5px", color: "#555555", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3" }}>{r.vendor}</td>
                      <td style={{ padding: "12px 12px", fontFamily: "monospace", fontWeight: 400, fontSize: "11px", color: "#FF5A1F", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3" }}>{r.releaseDate}</td>
                      <td style={{ padding: "12px 12px", fontWeight: 400, fontSize: "11.5px", color: "#111111", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3" }}>
                        {r.modelFamily && (
                          <span style={{ padding: "3px 8px", background: "#F8F7F2", borderRadius: "2px", border: "1px solid #E5E5E0", fontSize: "11px" }}>{r.modelFamily}</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 12px", fontSize: "12px", fontWeight: 400, color: "#444444", maxWidth: "520px", verticalAlign: "middle", lineHeight: "1.3" }}>{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        )}



        {/* Search empty state — shown when no section has matching results */}
        {searchQuery && !hasSearchResults && (
          <div style={{ padding: "80px 20px", textAlign: "center", background: "#F8F7F2", borderRadius: "2px", border: "1px dashed #E5E5E0", marginTop: "20px" }}>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#333333" }}>No models found</p>
            <p style={{ fontSize: "14px", fontWeight: 400, color: "#777777", marginTop: "8px" }}>Try a different search term.</p>
            <button
              onClick={clearAllFilters}
              style={{ marginTop: "16px", fontSize: "13px", fontWeight: 400, color: "#FF5A1F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
            >
              Reset All Filters &amp; Browse All Foundation Models &rarr;
            </button>
          </div>
        )}

        {/* 9. MODEL DIRECTORY (Page 5 & 6 Table Section) */}
        {(filteredCatalogModels.length > 0 || !searchQuery) && (
        <div id="model-directory" style={{ marginTop: "36px", marginBottom: "64px", background: "#ffffff", border: "1px solid #E5E5E0", borderRadius: "2px", padding: "20px 14px", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "24px", borderBottom: "2px solid #EAE9E4", marginBottom: "24px" }}>
            <div>
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

          {/* Top model highlighted normally at start of directory when filter is active (styled cleanly without bulky box) */}
          {activeFilterLabel && topModelForSelection && (
            <div style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid #E5E5E0", background: "#F8F7F2", padding: "24px", borderRadius: "2px", border: "1px solid #E5E5E0", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", textTransform: "uppercase", padding: "3px 8px", background: "#FFF6F3", color: "#FF5A1F", borderRadius: "2px", border: "1px solid #FFEDD5", fontWeight: 400 }}>
                    ⚡ SOTA Leader &middot; {topModelForSelection.vendor} ({activeFilterLabel})
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
                    {topModelForSelection.trendingScore ? `Elo: ${topModelForSelection.trendingScore}` : 'Top Rated'}
                  </span>
                </div>
                {topModelForSelection.description && (
                  <p style={{ fontSize: "14px", color: "#555555", fontWeight: 400, marginTop: "6px", maxWidth: "780px", lineHeight: "1.5" }}>
                    {topModelForSelection.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  const match = allModels.find(x => x.name.toLowerCase() === topModelForSelection.name.toLowerCase() || x.name.toLowerCase().includes(topModelForSelection.name.toLowerCase()));
                  if (match) setInspectedModel(match);
                }}
                style={{ padding: "10px 20px", background: "#111111", color: "#ffffff", borderRadius: "2px", fontWeight: 400, fontSize: "13px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>Inspect Specs</span>
                <ExternalLink size={14} />
              </button>
            </div>
          )}

          {filteredCatalogModels.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", background: "#F8F7F2", borderRadius: "2px", border: "1px dashed #E5E5E0" }}>
              <p style={{ fontSize: "15px", fontWeight: 400, color: "#555555" }}>No deep evaluation records match your exact filter ({activeFilterLabel || searchQuery}) right now.</p>
              <button
                onClick={clearAllFilters}
                style={{ marginTop: "12px", fontSize: "13px", fontWeight: 400, color: "#FF5A1F", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Reset All Filters &amp; Browse All Foundation Models &rarr;
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: "1280px", borderCollapse: "collapse", textAlign: "left", fontFamily: "'Inter', system-ui, sans-serif", tableLayout: "auto" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #111111" }}>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25", fontFamily: "monospace" }}>#</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Model</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Organization</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Model Family</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Category</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Parameters</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Context Window</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>License</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Benchmarks</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Papers</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Release Date</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontSize: "11px", fontWeight: 400, color: "#666666", textTransform: "none", letterSpacing: "normal", whiteSpace: "nowrap", lineHeight: "1.25" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalogModels.map((model, idx) => (
                    <tr key={model.id} onClick={() => setInspectedModel(model)} style={{ borderBottom: "1px solid #EAE9E4", cursor: "pointer", transition: "background 0.15s ease" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF8F6"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                      <td style={{ padding: "12px 12px", fontFamily: "monospace", fontSize: "11px", fontWeight: 400, color: "#8B8B8B", width: "1%", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3", paddingRight: "12px" }}>{(idx + 1).toString().padStart(3, "0")}</td>
                      <td style={{ padding: "12px 12px", fontWeight: 400, fontSize: "12.5px", color: "#111111", minWidth: "160px", whiteSpace: "nowrap", wordBreak: "normal", verticalAlign: "middle", lineHeight: "1.3", paddingLeft: "12px", paddingRight: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FF5A1F", display: "inline-block", flexShrink: 0 }}></span>
                          <span>{model.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", fontWeight: 400, color: "#555555", minWidth: "120px", whiteSpace: "nowrap", wordBreak: "normal", verticalAlign: "middle", lineHeight: "1.3", paddingLeft: "4px", paddingRight: "8px" }}>{model.vendor}</td>
                      <td style={{ padding: "12px 12px", fontWeight: 400, color: "#111111", whiteSpace: "nowrap", width: "1%", verticalAlign: "middle", lineHeight: "1.3", paddingLeft: "4px", paddingRight: "8px" }}>
                        {model.modelFamily && (
                          <span style={{ padding: "3px 8px", background: "#F8F7F2", borderRadius: "2px", border: "1px solid #E5E5E0", fontSize: "11px", whiteSpace: "nowrap", display: "inline-block", fontWeight: 400 }}>{model.modelFamily}</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 12px", color: "#555555", fontWeight: 400, verticalAlign: "middle", lineHeight: "1.3" }}>{model.category}</td>
                      <td style={{ padding: "12px 12px", fontFamily: "monospace", fontSize: "11px", color: "#333333", fontWeight: 400, verticalAlign: "middle", lineHeight: "1.3" }}>{model.parameterCount}</td>
                      <td style={{ padding: "12px 12px", fontFamily: "monospace", fontSize: "11px", color: "#111111", fontWeight: 400, verticalAlign: "middle", lineHeight: "1.3" }}>{model.contextWindow}</td>
                      <td style={{ padding: "12px 12px", color: "#555555", fontSize: "11px", fontWeight: 400, verticalAlign: "middle", lineHeight: "1.3" }}>{model.license}</td>
                      <td style={{ padding: "12px 12px", textAlign: "left", fontWeight: 400, color: "#FF5A1F", fontFamily: "monospace", fontSize: "11px", verticalAlign: "middle", lineHeight: "1.3" }}>
                        {model.trendingScore ? `⚡ ${model.trendingScore} Elo` : (model.benchmarkScore && Object.keys(model.benchmarkScore).length > 0 ? `${Object.keys(model.benchmarkScore).length} verified` : '')}
                      </td>
                      <td style={{ padding: "12px 12px", color: "#555555", fontWeight: 400, fontSize: "11px", verticalAlign: "middle", lineHeight: "1.3" }}>{model.paperCount} papers</td>
                      <td style={{ padding: "12px 12px", fontFamily: "monospace", fontSize: "11px", color: "#777777", fontWeight: 400, verticalAlign: "middle", lineHeight: "1.3" }}>{model.releaseDate}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", whiteSpace: "nowrap", verticalAlign: "middle", lineHeight: "1.3" }}>
                        <button style={{ fontSize: "11px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.4px", padding: "5px 10px", borderRadius: "2px", background: "#F8F7F2", color: "#111111", border: "1px solid #E5E5E0", transition: "all 0.2s ease", whiteSpace: "nowrap" }}>Inspect &rarr;</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>)}
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
                      {inspectedModel.vendor}
                    </span>
                    {inspectedModel.modelFamily && (
                      <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", background: "#F8F7F2", color: "#333333", borderRadius: "2px", border: "1px solid var(--border)" }}>
                        Family: {inspectedModel.modelFamily}
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

              {inspectedModel.description && (
                <p style={{ fontSize: "15px", color: "#555555", fontWeight: 500, lineHeight: "1.6", marginBottom: "24px" }}>
                  {inspectedModel.description}
                </p>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px", background: "#F8F7F2", padding: "16px", borderRadius: "2px", border: "1px solid var(--border)", fontSize: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Architecture</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.parameterCount || inspectedModel.architecture}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Context</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.contextWindow}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Elo / SOTA</span>
                  <span style={{ fontWeight: 800, color: "#16A34A" }}>{inspectedModel.trendingScore ? `⚡ ${inspectedModel.trendingScore}` : ''}</span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#8B8B8B", display: "block", marginBottom: "4px" }}>Citations</span>
                  <span style={{ fontWeight: 800, color: "#111111" }}>{inspectedModel.paperCount}</span>
                </div>
              </div>

              {inspectedModel.benchmarkScore && Object.keys(inspectedModel.benchmarkScore).length > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5px", color: "#111111", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Trophy size={16} style={{ color: "#FF5A1F" }} />
                    <span>Verified Academic Benchmarks</span>
                  </h3>
                  <div style={{ background: "#F8F7F2", borderRadius: "2px", padding: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {Object.entries(inspectedModel.benchmarkScore).map(([name, value], i) => (
                      <div key={i}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>
                          <span style={{ color: "#333333" }}>{name}</span>
                          <span style={{ color: "#111111", fontWeight: 900 }}>{value}%</span>
                        </div>
                        <div style={{ width: "100%", background: "#E5E5E0", height: "8px", borderRadius: "2px", overflow: "hidden" }}>
                          <div
                            style={{ height: "100%", borderRadius: "2px", width: `${Math.min(value, 100)}%`, backgroundColor: "#FF5A1F" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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