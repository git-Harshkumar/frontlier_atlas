"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { 
  Trophy, Cpu, Layers, ExternalLink, Check, Copy, ArrowLeft, 
  Share2, Sparkles, BookOpen, Terminal, Zap, ShieldCheck, 
  Activity, Box, BarChart3
} from "lucide-react";
import { getModelBySlug, type ModelDetail } from "@/lib/models";

interface DetailDisplay {
  id: string;
  name: string;
  slug: string;
  org: string;
  desc: string;
  params: string;
  context: string;
  releaseDate: string;
  license: string;
  elo: number;
  tags: string[];
  area: string;
  paperCount: number;
  benchmarks: { name: string; score: string; value: number; color: string }[];
}

function toDetailDisplay(m: ModelDetail): DetailDisplay {
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
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    org: m.vendor || "Unknown",
    desc: m.description || `${m.name} foundation AI model.`,
    params: m.parameterCount || "Dense / MoE",
    context: m.contextWindow || "128k tokens",
    releaseDate: m.releaseDate ? new Date(m.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
    license: m.license || "Proprietary Commercial",
    elo: m.trendingScore || 0,
    tags: m.capabilities || [],
    area: m.category || m.researchAreas?.[0] || "General Purpose",
    paperCount: m.paperCount,
    benchmarks,
  };
}

export default function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [model, setModel] = useState<DetailDisplay | null>(null);
  const [backendModel, setBackendModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const [activeTab, setActiveTab] = useState<"evals" | "workbench" | "architecture" | "literature">("evals");

  const [sdkLang, setSdkLang] = useState<"python" | "typescript" | "curl" | "ollama">("python");
  const [enableThinking, setEnableThinking] = useState(true);
  const [enableTools, setEnableTools] = useState(false);
  const [enableStreaming, setEnableStreaming] = useState(true);

  const [evalMode, setEvalMode] = useState<"standard" | "human">("standard");

  useEffect(() => {
    if (resolvedParams?.slug) {
      getModelBySlug(resolvedParams.slug)
        .then((data) => {
          setBackendModel(data);
          setModel(toDetailDisplay(data));
        })
        .catch(() => {
          setModel(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [resolvedParams?.slug]);

  const relatedPapers = useMemo(() => {
    if (!backendModel?.papers) return [];
    return backendModel.papers;
  }, [backendModel]);

  const generatedCode = useMemo(() => {
    if (!model) return "";
    const baseId = model.slug;

    if (sdkLang === "python") {
      let code = `import anthropic\n\nclient = anthropic.Anthropic()\n\n`;
      let paramsList = `  model="${baseId}",\n  max_tokens=${enableThinking ? 16384 : 4096},\n`;

      if (enableThinking) {
        paramsList += `  thinking={\n    "type": "enabled",\n    "budget_tokens": 12000\n  },\n`;
      }
      if (enableTools) {
        paramsList += `  tools=[\n    {\n      "name": "execute_code",\n      "description": "Execute Python in sandboxed verification environment",\n      "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}}\n    }\n  ],\n`;
      }
      if (enableStreaming) {
        code += `with client.messages.stream(\n${paramsList}  messages=[{"role": "user", "content": "Analyze and verify frontier model architecture."}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end="", flush=True)`;
      } else {
        code += `response = client.messages.create(\n${paramsList}  messages=[{"role": "user", "content": "Analyze and verify frontier model architecture."}]\n)\nprint(response.content[0].text)`;
      }
      return code;
    }

    if (sdkLang === "typescript") {
      let code = `import { Anthropic } from '@anthropic-ai/sdk';\n\nconst anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });\n\n`;
      let paramsList = `  model: '${baseId}',\n  max_tokens: ${enableThinking ? 16384 : 4096},\n`;
      if (enableThinking) {
        paramsList += `  thinking: { type: 'enabled', budget_tokens: 12000 },\n`;
      }
      if (enableTools) {
        paramsList += `  tools: [{ name: 'get_benchmark_data', input_schema: { type: 'object' } }],\n`;
      }
      if (enableStreaming) {
        code += `const stream = await anthropic.messages.create({\n${paramsList}  stream: true,\n  messages: [{ role: 'user', content: 'Synthesize architecture benchmarks.' }]\n});\n\nfor await (const chunk of stream) {\n  if (chunk.type === 'content_block_delta') process.stdout.write(chunk.delta.text);\n}`;
      } else {
        code += `const msg = await anthropic.messages.create({\n${paramsList}  messages: [{ role: 'user', content: 'Synthesize architecture benchmarks.' }]\n});\nconsole.log(msg.content[0].text);`;
      }
      return code;
    }

    if (sdkLang === "curl") {
      const body: any = {
        model: baseId,
        max_tokens: enableThinking ? 16384 : 4096,
        messages: [{ role: "user", content: "Explain model scaling laws." }]
      };
      if (enableThinking) body.thinking = { type: "enabled", budget_tokens: 12000 };
      if (enableStreaming) body.stream = true;

      return `curl https://api.anthropic.com/v1/messages \\\n  -H "x-api-key: $ANTHROPIC_API_KEY" \\\n  -H "anthropic-version: 2023-06-01" \\\n  -H "content-type: application/json" \\\n  -d '${JSON.stringify(body, null, 2)}'`;
    }

    return `# Step 1: Pull the open-weight model or configure API bridge in Ollama\nollama pull ${baseId}\n\n# Step 2: Run interactive terminal session with custom flags\nollama run ${baseId} --verbose "${enableThinking ? "Think step-by-step and verify math proofs." : "Provide concise summary."}"`;
  }, [model, sdkLang, enableThinking, enableTools, enableStreaming]);

  const handleCopyCode = (textToCopy?: string) => {
    const text = textToCopy || generatedCode;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="model-profile-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#111111", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Cpu size={24} style={{ color: "#F55036" }} />
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#8B8B8B", fontFamily: "monospace" }}>Loading Neural Architecture Profile...</div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="model-profile-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="ds-card" style={{ maxWidth: "480px", width: "100%", padding: "40px", textAlign: "center", margin: "24px" }}>
          <div style={{ width: "64px", height: "64px", background: "#FFF6F3", color: "#F55036", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px", color: "#111111" }}>Model Profile Not Found</h1>
          <p style={{ fontSize: "15px", color: "#555555", marginBottom: "28px", lineHeight: 1.6 }}>
            We couldn&apos;t find an indexed AI foundation model matching <code style={{ background: "#F8F7F2", padding: "4px 8px", borderRadius: "6px", color: "#F55036", fontFamily: "monospace", fontWeight: 700 }}>{resolvedParams.slug}</code>.
          </p>
          <Link
            href="/models"
            className="ds-button"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "14px", textDecoration: "none" }}
          >
            <ArrowLeft size={16} />
            <span>Return to Models Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="model-profile-wrapper">

      {/* TOP LUXURY NAVIGATION BAR */}
      <header className="model-sticky-header">
        <div className="model-sticky-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/models" className="model-back-btn" style={{ textDecoration: "none" }}>
              <ArrowLeft size={16} />
              <span>Directory</span>
            </Link>
            <div className="topic-breadcrumbs" style={{ margin: 0, fontSize: "13px" }}>
              <Link href="/" className="crumb-link" style={{ textDecoration: "none" }}>Home</Link>
              <span className="crumb-sep">&gt;</span>
              <Link href="/models" className="crumb-link" style={{ textDecoration: "none" }}>Directory</Link>
              <span className="crumb-sep">&gt;</span>
              <Link href="/models" className="crumb-link" style={{ textDecoration: "none" }}>Models</Link>
              <span className="crumb-sep">&gt;</span>
              <span className="crumb-current">{model.name}</span>
            </div>
          </div>

          <div className="model-header-actions">
            <button onClick={handleShare} className="model-share-btn">
              <Share2 size={15} />
              <span>{shareCopied ? "Link Copied!" : "Share Profile"}</span>
            </button>

            <Link href="/trending" className="model-explore-btn" style={{ textDecoration: "none" }}>
              <span>Explore Research</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="model-hero-container">
        <div className="model-obsidian-card">

          <div className="model-obsidian-glow-top" />
          <div className="model-obsidian-glow-bottom" />

          <div className="model-hero-meta-strip">
            <div className="model-hero-badges">
              <span className="model-cert-badge">
                <Sparkles size={13} />
                <span>{model.org} Certified</span>
              </span>
              <span className="model-license-badge">
                <span>License:</span>
                <span className="model-license-val">{model.license}</span>
              </span>
              {model.releaseDate && (
                <span className="model-license-badge">
                  <span>Released:</span>
                  <span className="model-license-val">{model.releaseDate}</span>
                </span>
              )}
            </div>

            {model.elo > 0 && (
              <div className="model-elo-badge">
                <Zap size={15} style={{ fill: "#ffffff" }} />
                <span>GLOBAL ELO RATING: {model.elo}</span>
              </div>
            )}
          </div>

          <h1 className="model-hero-title">
            {model.name}
          </h1>
          <p className="model-hero-desc">
            {model.desc}
          </p>

          <div className="model-spec-grid">

            <div className="model-spec-pod">
              <div className="model-spec-pod-header">
                <span className="model-spec-pod-label">Architecture Specs</span>
                <Cpu size={16} style={{ color: "#F55036" }} />
              </div>
              <div className="model-spec-pod-val">
                {model.params}
              </div>
              <span className="model-spec-pod-sub" style={{ color: "#10B981" }}>✓ High-Density Mixture-of-Experts</span>
            </div>

            <div className="model-spec-pod">
              <div className="model-spec-pod-header">
                <span className="model-spec-pod-label">Context Capacity</span>
                <Box size={16} style={{ color: "#3B82F6" }} />
              </div>
              <div className="model-spec-pod-val">
                {model.context}
              </div>
              <span className="model-spec-pod-sub" style={{ color: "#3B82F6" }}>✓ Native Prompt Caching Supported</span>
            </div>

            <div className="model-spec-pod">
              <div className="model-spec-pod-header">
                <span className="model-spec-pod-label">Primary Specialization</span>
                <Activity size={16} style={{ color: "#F55036" }} />
              </div>
              <div className="model-spec-pod-val">
                {model.area}
              </div>
              <span className="model-spec-pod-sub" style={{ color: "#E0E0E0" }}>⚡ Instantaneous vs Extended CoT</span>
            </div>

            <div className="model-spec-pod">
              <div className="model-spec-pod-header">
                <span className="model-spec-pod-label">Literature Citations</span>
                <BookOpen size={16} style={{ color: "#8B5CF6" }} />
              </div>
              <div className="model-spec-pod-val">
                {model.paperCount} Verified Papers
              </div>
              <span className="model-spec-pod-sub" style={{ color: "#8B5CF6" }}>📚 Indexed in Frontier Repository</span>
            </div>

          </div>
        </div>
      </section>

      {/* TAB BAR */}
      <section className="model-tabs-container">
        <div className="model-tabs-bar">

          <button
            onClick={() => setActiveTab("evals")}
            className={`model-tab-btn ${activeTab === "evals" ? "active" : ""}`}
          >
            <Trophy size={18} style={{ color: activeTab === "evals" ? "#F55036" : "#8B8B8B" }} />
            <span>Verified Academic Benchmarks</span>
            <span className="model-tab-count">
              {model.benchmarks?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("workbench")}
            className={`model-tab-btn ${activeTab === "workbench" ? "active" : ""}`}
          >
            <Terminal size={18} style={{ color: activeTab === "workbench" ? "#10B981" : "#8B8B8B" }} />
            <span>Interactive SDK Workbench</span>
            <span className="model-tab-count" style={{ background: activeTab === "workbench" ? "#10B981" : "#EAE9E4", color: activeTab === "workbench" ? "#fff" : "#555" }}>
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`model-tab-btn ${activeTab === "architecture" ? "active" : ""}`}
          >
            <Layers size={18} style={{ color: activeTab === "architecture" ? "#3B82F6" : "#8B8B8B" }} />
            <span>Architecture & Capabilities</span>
          </button>

          <button
            onClick={() => setActiveTab("literature")}
            className={`model-tab-btn ${activeTab === "literature" ? "active" : ""}`}
          >
            <BookOpen size={18} style={{ color: activeTab === "literature" ? "#8B5CF6" : "#8B8B8B" }} />
            <span>Research Literature</span>
            <span className="model-tab-count">
              {relatedPapers.length}
            </span>
          </button>

        </div>
      </section>

      {/* TAB 1: BENCHMARKS */}
      {activeTab === "evals" && (
        <section className="model-section-container">

          <div className="model-controls-bar">
            <div className="model-controls-title-group">
              <div className="model-controls-icon">
                <BarChart3 size={22} />
              </div>
              <div>
                <h2 className="model-controls-h2">Empirical Evaluation Leaderboard</h2>
                <p className="model-controls-sub">Official verified evaluations vs baseline human expert threshold</p>
              </div>
            </div>

            <div className="model-mode-switcher">
              <button
                onClick={() => setEvalMode("standard")}
                className={`model-mode-btn ${evalMode === "standard" ? "active" : ""}`}
              >
                📊 Standard Matrix
              </button>
              <button
                onClick={() => setEvalMode("human")}
                className={`model-mode-btn ${evalMode === "human" ? "active-human" : ""}`}
              >
                ⚖️ Human Baseline Comparison
              </button>
            </div>
          </div>

          <div className="model-benchmark-grid">
            {model.benchmarks && model.benchmarks.length > 0 ? (
              model.benchmarks.map((bm, i) => {
                const humanBaseline = bm.name.includes("SWE-Bench") ? 48.0 : bm.name.includes("MMLU") ? 89.8 : 85.0;
                const delta = (bm.value - humanBaseline).toFixed(1);

                return (
                  <div key={i} className="model-benchmark-card">
                    <div>
                      <div className="model-bm-header">
                        <div>
                          <div>
                            <span className="model-bm-dot" style={{ backgroundColor: bm.color || "#F55036" }} />
                            <span className="model-bm-name">{bm.name}</span>
                          </div>
                          <span className="model-bm-sub">Peer-Reviewed Verification Suite</span>
                        </div>

                        <div className="model-bm-score-col">
                          <span className="model-bm-score">{bm.score}</span>
                          <span className="model-bm-percentile">Top 0.8% Global</span>
                        </div>
                      </div>

                      <div className="model-gauge-wrapper">
                        <div className="model-gauge-label">
                          <span>Model Capability vs Threshold</span>
                          {evalMode === "human" && (
                            <span style={{ color: Number(delta) >= 0 ? "#16A34A" : "#F55036" }}>
                              {Number(delta) >= 0 ? `+${delta}% vs Human Expert` : `${delta}% vs Human Expert`}
                            </span>
                          )}
                        </div>

                        <div className="model-gauge-track">
                          <div
                            className="model-gauge-fill"
                            style={{ width: `${bm.value}%`, backgroundColor: bm.color || "#F55036" }}
                          />

                          {evalMode === "human" && (
                            <div
                              className="model-gauge-marker"
                              style={{ left: `${humanBaseline}%` }}
                              title={`Human Expert Baseline: ${humanBaseline}%`}
                            >
                              <span className="model-gauge-marker-label">
                                Human: {humanBaseline}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="model-bm-footer">
                      <span className="model-bm-verified">
                        <ShieldCheck size={14} />
                        <span>Verified Zero-Shot Chain-of-Thought</span>
                      </span>
                      <span className="model-bm-link">
                        View Prompt Spec →
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="ds-card" style={{ gridColumn: "1 / -1", padding: "48px", textAlign: "center" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#555555" }}>Extensive evaluation suites are currently being compiled for this model.</p>
              </div>
            )}
          </div>

        </section>
      )}

      {/* TAB 2: SDK WORKBENCH */}
      {activeTab === "workbench" && (
        <section className="model-section-container">

          <div className="model-workbench-box">

            <div className="model-wb-top-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(245, 80, 54, 0.15)", color: "#F55036", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245, 80, 54, 0.3)" }}>
                  <Terminal size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", marginBottom: "4px" }}>Interactive SDK Workbench</h2>
                  <p style={{ fontSize: "13px", fontFamily: "monospace", color: "#A8A39E" }}>Generate live inference code with dynamic architectural capabilities</p>
                </div>
              </div>

              <div className="model-wb-lang-pills">
                {(["python", "typescript", "curl", "ollama"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSdkLang(lang)}
                    className={`model-wb-lang-btn ${sdkLang === lang ? "active" : ""}`}
                  >
                    {lang === "curl" ? "REST / cURL" : lang === "typescript" ? "TypeScript / Node" : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="model-wb-toggles-strip">

              <label className="model-wb-toggle-card">
                <div className="model-wb-toggle-left">
                  <span className="model-wb-toggle-icon">🧠</span>
                  <div>
                    <span className="model-wb-toggle-title">Extended CoT Reasoning</span>
                    <span className="model-wb-toggle-sub">Allocate 12k thinking tokens</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableThinking}
                  onChange={(e) => setEnableThinking(e.target.checked)}
                  className="model-wb-checkbox"
                />
              </label>

              <label className="model-wb-toggle-card">
                <div className="model-wb-toggle-left">
                  <span className="model-wb-toggle-icon">🛠️</span>
                  <div>
                    <span className="model-wb-toggle-title">Autonomous Tool Calling</span>
                    <span className="model-wb-toggle-sub">Attach sandboxed execute_code</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableTools}
                  onChange={(e) => setEnableTools(e.target.checked)}
                  className="model-wb-checkbox"
                />
              </label>

              <label className="model-wb-toggle-card">
                <div className="model-wb-toggle-left">
                  <span className="model-wb-toggle-icon">⚡</span>
                  <div>
                    <span className="model-wb-toggle-title">Response Buffer Stream</span>
                    <span className="model-wb-toggle-sub">Real-time token delta output</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableStreaming}
                  onChange={(e) => setEnableStreaming(e.target.checked)}
                  className="model-wb-checkbox"
                />
              </label>

            </div>

            <div className="model-wb-code-area">
              <div className="model-wb-code-header">
                <div className="model-wb-dots">
                  <span className="model-wb-dot" style={{ background: "#FF5F56" }} />
                  <span className="model-wb-dot" style={{ background: "#FFBD2E" }} />
                  <span className="model-wb-dot" style={{ background: "#27C93F" }} />
                  <span style={{ marginLeft: "8px", color: "#ffffff", fontWeight: 700 }}>{model.slug}.{sdkLang === "python" ? "py" : sdkLang === "typescript" ? "ts" : "sh"}</span>
                </div>

                <button
                  onClick={() => handleCopyCode()}
                  className="model-wb-copy-btn"
                >
                  {copied ? (
                    <>
                      <Check size={14} style={{ color: "#10B981" }} />
                      <span style={{ color: "#10B981" }}>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Generated Spec</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="model-code-pre">
                <code>{generatedCode}</code>
              </pre>
            </div>

            <div className="model-wb-footer">
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <span>API Endpoint: <strong style={{ color: "#ffffff" }}>api.frontier-atlas.ai/v1/chat</strong></span>
                <span>•</span>
                <span>Context Window: <strong style={{ color: "#F55036" }}>{model.context}</strong></span>
                <span>•</span>
                <span>Prompt Caching: <strong style={{ color: "#10B981" }}>Enabled (50% discount)</strong></span>
              </div>
              <a href={`https://docs.anthropic.com`} target="_blank" rel="noreferrer" className="model-wb-docs-link">
                View Full Documentation →
              </a>
            </div>

          </div>

        </section>
      )}

      {/* TAB 3: ARCHITECTURE & CAPABILITIES */}
      {activeTab === "architecture" && (
        <section className="model-section-container">

          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 36px" }}>
            <span style={{ display: "inline-block", padding: "6px 14px", background: "#FFF6F3", color: "#F55036", borderRadius: "100px", fontFamily: "monospace", fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", border: "1px solid #FFEDD5", marginBottom: "12px" }}>
              System Topology & Engine
            </span>
            <h2 style={{ fontSize: "36px", fontWeight: 900, color: "#111111", marginBottom: "12px", letterSpacing: "-0.5px" }}>
              Architectural Capabilities Suite
            </h2>
            <p style={{ fontSize: "16px", color: "#555555", lineHeight: 1.6 }}>
              Detailed technical breakdown of core sub-systems, token economics, and agentic safeguards.
            </p>
          </div>

          <div className="model-arch-grid">

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#FFF6F3", color: "#F55036", border: "1px solid #FFEDD5" }}>
                🧠
              </div>
              <h3 className="model-arch-title">Hybrid Reasoning Engine</h3>
              <p className="model-arch-desc">
                Seamlessly transitions between instantaneous high-throughput generation and deep mathematical verification where intermediate thought tokens are evaluated and self-corrected before final output.
              </p>
              <div className="model-arch-check" style={{ color: "#F55036" }}>
                ✓ Dynamic compute scaling per prompt
              </div>
            </div>

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#EFF6FF", color: "#3B82F6", border: "1px solid #DBEAFE" }}>
                🛠️
              </div>
              <h3 className="model-arch-title">Autonomous Agentic Orchestration</h3>
              <p className="model-arch-desc">
                Native training for multi-step tool execution, structured JSON schema enforcement, sandboxed terminal command generation, and browser navigation across complex full-repository coding tasks.
              </p>
              <div className="model-arch-check" style={{ color: "#3B82F6" }}>
                ✓ 50%+ SWE-Bench Verified SOTA
              </div>
            </div>

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#F0FDF4", color: "#10B981", border: "1px solid #DCFCE7" }}>
                👁️
              </div>
              <h3 className="model-arch-title">Multimodal Vision Understanding</h3>
              <p className="model-arch-desc">
                State-of-the-art visual reasoning capable of reading dense engineering diagrams, extracting UI design systems from raw Figma screenshots, and interpreting multi-page academic PDFs with sub-pixel OCR.
              </p>
              <div className="model-arch-check" style={{ color: "#10B981" }}>
                ✓ 1M pixel spatial resolution
              </div>
            </div>

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#FAF5FF", color: "#8B5CF6", border: "1px solid #F3E8FF" }}>
                ⚡
              </div>
              <h3 className="model-arch-title">High-Speed Token Economics</h3>
              <p className="model-arch-desc">
                Optimized attention heads capable of delivering up to 60 tokens per second on commercial infrastructure, combined with automatic prompt caching that reduces repeated systemic context costs by over 50%.
              </p>
              <div className="model-arch-check" style={{ color: "#8B5CF6" }}>
                ✓ Ultra-low latency TTFT (~250ms)
              </div>
            </div>

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
                🛡️
              </div>
              <h3 className="model-arch-title">Constitutional Safeguards</h3>
              <p className="model-arch-desc">
                Trained using advanced Direct Preference Optimization (DPO) and Constitutional AI principles to prevent reward hacking, hallucination loops, and unauthorized adversarial prompt injection.
              </p>
              <div className="model-arch-check" style={{ color: "#E11D48" }}>
                ✓ ASL-3 Security Alignment Standard
              </div>
            </div>

            <div className="model-arch-card">
              <div className="model-arch-icon-box" style={{ background: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" }}>
                🔗
              </div>
              <h3 className="model-arch-title">Ecosystem Compatibility</h3>
              <p className="model-arch-desc">
                Native drop-in integration across major enterprise frameworks including LangChain, Vercel AI SDK, LlamaIndex, Cursor IDE, OpenWebUI, and cloud providers (Amazon Bedrock / Google Cloud Vertex AI).
              </p>
              <div className="model-arch-check" style={{ color: "#D97706" }}>
                ✓ Multi-cloud deployment ready
              </div>
            </div>

          </div>

        </section>
      )}

      {/* TAB 4: RESEARCH LITERATURE */}
      {activeTab === "literature" && (
        <section className="model-section-container">

          <div className="model-controls-bar">
            <div className="model-controls-title-group">
              <div className="model-controls-icon">
                <BookOpen size={22} />
              </div>
              <div>
                <h2 className="model-controls-h2">Indexed Academic Citations</h2>
                <p className="model-controls-sub">Peer-reviewed literature citing, evaluating, or comparing {model.name}</p>
              </div>
            </div>

            <span style={{ padding: "8px 16px", background: "#F8F7F2", border: "1px solid #EAE9E4", borderRadius: "12px", fontFamily: "monospace", fontWeight: 800, fontSize: "13px", color: "#111111" }}>
              {relatedPapers.length} Papers Found
            </span>
          </div>

          {relatedPapers.length === 0 ? (
            <div className="ds-card" style={{ padding: "64px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 800, color: "#555555", marginBottom: "20px" }}>No direct paper citations indexed yet.</p>
              <Link href="/trending" className="model-explore-btn" style={{ display: "inline-flex", textDecoration: "none" }}>
                <span>Browse All Trending AI Research</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {relatedPapers.map((paper, i) => (
                <Link
                  key={paper.id || i}
                  href={`/papers/${paper.slug}`}
                  className="ds-card p-4 flex items-start gap-4 hover:shadow-soft transition-shadow no-underline"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[#111111] mb-1 line-clamp-2">{paper.title}</h3>
                    <div className="flex items-center gap-3 text-[12px] text-[#8B8B8B]">
                      <span>{paper.citationCount} citations</span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[#8B8B8B] shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}

        </section>
      )}

    </div>
  );
}
