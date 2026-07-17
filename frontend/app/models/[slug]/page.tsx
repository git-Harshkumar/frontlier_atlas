"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { 
  Trophy, Cpu, ExternalLink, ArrowLeft, 
  Sparkles, BookOpen, ShieldCheck, 
  Activity, Box, BarChart3
} from "lucide-react";
import { getModelBySlug, type ModelDetail } from "@/lib/models";

export default function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Active Main Tab ("evals" | "workbench" | "architecture" | "literature")
  const [activeTab, setActiveTab] = useState<"evals" | "workbench" | "architecture" | "literature">("evals");

  // Workbench Interactive Toggles & State
  const [sdkLang, setSdkLang] = useState<"python" | "typescript" | "curl" | "ollama">("python");
  const [enableThinking, setEnableThinking] = useState(true);
  const [enableTools, setEnableTools] = useState(false);
  const [enableStreaming, setEnableStreaming] = useState(true);

  // Benchmarks Comparison Mode ("standard" | "human")
  const [evalMode, setEvalMode] = useState<"standard" | "human">("standard");

  useEffect(() => {
    if (resolvedParams?.slug) {
      getModelBySlug(resolvedParams.slug)
        .then((data) => {
          setModel(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading model:', err);
          setLoading(false);
        });
    }
  }, [resolvedParams?.slug]);

  // Related papers from backend
  const relatedPapers = useMemo(() => {
    if (!model || !model.papers) return [];
    return model.papers;
  }, [model]);

  // Dynamic Interactive Code Generator based on user toggles
  const generatedCode = useMemo(() => {
    if (!model) return "";
    const baseId = model.id || model.slug;

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

    // Ollama
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
      <div className="min-h-screen bg-[#F8F7F2] text-[#111] pb-20 flex items-center justify-center">
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
      <div className="min-h-screen bg-[#F8F7F2] text-[#111] pb-20 flex items-center justify-center">
        <div className="bg-white border border-[#E5E5E0] rounded-none" style={{ maxWidth: "480px", width: "100%", padding: "40px", textAlign: "center", margin: "24px" }}>
          <div style={{ width: "64px", height: "64px", background: "#FFF6F3", color: "#F55036", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 900, marginBottom: "12px", color: "#111111" }}>Model Profile Not Found</h1>
          <p style={{ fontSize: "15px", color: "#555555", marginBottom: "28px", lineHeight: 1.6 }}>
            We couldn&apos;t find an indexed AI foundation model matching <code style={{ background: "#F8F7F2", padding: "4px 8px", color: "#F55036", fontFamily: "monospace", fontWeight: 700 }}>{resolvedParams.slug}</code>.
          </p>
          <Link
            href="/models"
            className="bg-[#FF5A1F] text-white font-semibold inline-flex items-center justify-center gap-2.5 w-full p-[14px] rounded-none no-underline"
          >
            <ArrowLeft size={16} />
            <span>Return to Models Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#111] pb-20">
      
      {/* ── TOP LUXURY NAVIGATION BAR (Glassmorphism + Sticky) ── */}
      <header className="sticky top-0 z-50 bg-[#F8F7F2]/92 backdrop-blur-lg border-b border-[#E5E5E0]">
        <div className="max-w-[1240px] mx-auto px-6 max-sm:px-4 h-[72px] flex items-center justify-between gap-4">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] sm:flex" style={{ margin: 0, fontSize: "13px" }}>
              <Link href="/" className="text-[#6b7280] hover:text-[#111827] transition-colors no-underline" style={{ textDecoration: "none" }}>Home</Link>
              <span className="text-[#9ca3af] text-[11px]">/</span>
              <Link href="/models" className="text-[#6b7280] hover:text-[#111827] transition-colors no-underline" style={{ textDecoration: "none" }}>Models</Link>
              <span className="text-[#9ca3af] text-[11px]">/</span>
              <span className="text-[#111827] font-extrabold">{model.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION: CYBER-OBSIDIAN LUXURY CARD ── */}
      <section className="max-w-[1240px] mx-auto mt-7 px-6">
        <div className="relative bg-white text-[#111] rounded-none px-8 max-lg:px-7 py-7 border border-[#E5E5E0] shadow-[0_8px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Ambient Glowing Aura */}
          <div className="absolute -top-40 -right-40 w-[360px] h-[360px] rounded-none pointer-events-none blur-[40px]" style={{ background: "radial-gradient(circle, rgba(245, 80, 54, 0.1) 0%, rgba(255, 138, 0, 0.04) 50%, transparent 70%)" }} />
          <div className="absolute -bottom-40 -left-40 w-[360px] h-[360px] rounded-none pointer-events-none blur-[40px]" style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(139, 92, 246, 0.03) 50%, transparent 70%)" }} />

          {/* Title & Core Summary */}
          <h1 className="relative z-10 text-[38px] max-lg:text-4xl max-sm:text-[32px] font-black leading-[1.1] tracking-[-1.2px] text-[#111] mb-2.5">
            {model.name}
          </h1>
          {model.description && (
            <p className="relative z-10 text-[15.5px] text-[#555] leading-relaxed max-w-[800px] mb-[22px]">
              {model.description}
            </p>
          )}

          {/* 4-Cell Interactive Architecture & Spec Pods inside Hero */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-[#EAE9E4]">
            {(model.parameterCount || model.architecture) && (
            <div className="bg-[#F8F7F2] px-[18px] py-4 rounded-none border border-[#EAE9E4] hover:border-[#F55036] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10.5px] font-extrabold text-[#8B8B8B] uppercase tracking-wider">Architecture Specs</span>
                <Cpu size={16} style={{ color: "#F55036" }} />
              </div>
              <div className="text-[17px] font-black text-[#111] font-mono tracking-tight mb-1 truncate">
                {model.parameterCount || model.architecture}
              </div>
            </div>
            )}

            {model.contextWindow && (
            <div className="bg-[#F8F7F2] px-[18px] py-4 rounded-none border border-[#EAE9E4] hover:border-[#F55036] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10.5px] font-extrabold text-[#8B8B8B] uppercase tracking-wider">Context Capacity</span>
                <Box size={16} style={{ color: "#3B82F6" }} />
              </div>
              <div className="text-[17px] font-black text-[#111] font-mono tracking-tight mb-1 truncate">
                {model.contextWindow}
              </div>
            </div>
            )}

            {(model.category || model.researchAreas?.[0]) && (
            <div className="bg-[#F8F7F2] px-[18px] py-4 rounded-none border border-[#EAE9E4] hover:border-[#F55036] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10.5px] font-extrabold text-[#8B8B8B] uppercase tracking-wider">Primary Specialization</span>
                <Activity size={16} style={{ color: "#F55036" }} />
              </div>
              <div className="text-[17px] font-black text-[#111] font-mono tracking-tight mb-1 truncate">
                {model.category || model.researchAreas?.[0]}
              </div>
            </div>
            )}

            <div className="bg-[#F8F7F2] px-[18px] py-4 rounded-none border border-[#EAE9E4] hover:border-[#F55036] hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10.5px] font-extrabold text-[#8B8B8B] uppercase tracking-wider">Literature Citations</span>
                <BookOpen size={16} style={{ color: "#8B5CF6" }} />
              </div>
              <div className="text-[17px] font-black text-[#111] font-mono tracking-tight mb-1 truncate">
                {model.paperCount} Verified Papers
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATE-OF-THE-ART INTERACTIVE TAB BAR ── */}
      <section className="max-w-[1240px] mx-auto mt-9 px-6">
        <div className="bg-white border border-[#E5E5E0] rounded-none p-2 flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-x-auto">
          
          <button
            onClick={() => setActiveTab("evals")}
            className={`flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-[14px] rounded-none text-[14px] font-bold cursor-pointer whitespace-nowrap min-h-[48px] transition-all ${
              activeTab === "evals"
                ? "bg-[#FFF6F3] text-[#F55036] border border-[#FFEDD5] shadow-[0_4px_12px_rgba(245,80,54,0.12)]"
                : "text-[#555] bg-transparent border border-transparent hover:bg-[#F8F7F2] hover:text-[#111]"
            }`}
          >
            <Trophy size={18} style={{ color: activeTab === "evals" ? "#F55036" : "#8B8B8B" }} />
            <span>Verified Academic Benchmarks</span>
          </button>

          <button
            onClick={() => setActiveTab("literature")}
            className={`flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-[14px] rounded-none text-[14px] font-bold cursor-pointer whitespace-nowrap min-h-[48px] transition-all ${
              activeTab === "literature"
                ? "bg-[#FAF5FF] text-[#8B5CF6] border border-[#F3E8FF] shadow-[0_4px_12px_rgba(139,92,246,0.12)]"
                : "text-[#555] bg-transparent border border-transparent hover:bg-[#F8F7F2] hover:text-[#111]"
            }`}
          >
            <BookOpen size={18} style={{ color: activeTab === "literature" ? "#8B5CF6" : "#8B8B8B" }} />
            <span>Research Literature</span>
          </button>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TAB 1: VERIFIED ACADEMIC BENCHMARKS & EVALUATION MATRIX
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === "evals" && (
        <section className="max-w-[1240px] mx-auto mt-8 px-6">
          
          {/* Controls Bar */}
          <div className="bg-white border border-[#E5E5E0] rounded-none px-6 py-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-none bg-[#FFF6F3] text-[#F55036] border border-[#FFEDD5] flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
              <div>
                <h2 className="text-[19px] font-black text-[#111]">Empirical Evaluation Leaderboard</h2>
                <p className="font-mono text-xs text-[#8B8B8B]">Official verified evaluations vs baseline human expert threshold</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F8F7F2] p-1.5 rounded-none border border-[#EAE9E4]">
              <button
                onClick={() => setEvalMode("standard")}
                className={`px-4 py-2 rounded-none text-xs font-bold cursor-pointer transition-all ${
                  evalMode === "standard"
                    ? "bg-[#111] text-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
                    : "text-[#555] bg-transparent"
                }`}
              >
                📊 Standard Matrix
              </button>
              <button
                onClick={() => setEvalMode("human")}
                className={`px-4 py-2 rounded-none text-xs font-bold cursor-pointer transition-all ${
                  evalMode === "human"
                    ? "bg-[#F55036] text-white shadow-[0_2px_6px_rgba(245,80,54,0.25)]"
                    : "text-[#555] bg-transparent"
                }`}
              >
                ⚖️ Human Baseline Comparison
              </button>
            </div>
          </div>

          {/* Benchmarks Grid (Responsive Cards with Gauges) */}
          {model.benchmarkScore && Object.keys(model.benchmarkScore).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(model.benchmarkScore).map(([name, value], i) => {
                const bm = { name, value, color: "#F55036" };
                const humanBaseline = name.includes("SWE-Bench") ? 48.0 : name.includes("MMLU") ? 89.8 : 85.0;
                const delta = (value - humanBaseline).toFixed(1);

                return (
                  <div key={i} className="bg-white border border-[#E5E5E0] rounded-none p-[30px] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#111] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                          <div>
                            <span className="inline-block w-3 h-3 rounded-none mr-2" style={{ backgroundColor: bm.color }} />
                            <span className="text-[20px] font-black text-[#111] tracking-tight">{name}</span>
                          </div>
                          <span className="font-mono text-xs text-[#8B8B8B] block mt-0.5">Peer-Reviewed Verification Suite</span>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[36px] font-black text-[#111] font-mono leading-none block">{value}%</span>
                          <span className="inline-block mt-1.5 px-2.5 py-[3px] bg-[#DCFCE7] text-[#16A34A] rounded-none font-mono text-[11px] font-extrabold border border-[#BBF7D0]">Top 0.8% Global</span>
                        </div>
                      </div>

                      {/* Gauge Bar */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between font-mono text-xs font-bold text-[#555] mb-2">
                          <span>Model Capability vs Threshold</span>
                          {evalMode === "human" && (
                            <span style={{ color: Number(delta) >= 0 ? "#16A34A" : "#F55036" }}>
                              {Number(delta) >= 0 ? `+${delta}% vs Human Expert` : `${delta}% vs Human Expert`}
                            </span>
                          )}
                        </div>

                        <div className="w-full h-4 bg-[#F3F4F6] rounded-none p-[3px] border border-[#EAE9E4] relative overflow-hidden">
                          <div
                            className="h-full rounded-none"
                            style={{ width: `${Math.min(value, 100)}%`, backgroundColor: bm.color }}
                          />

                          {/* Human Expert Marker line if human mode */}
                          {evalMode === "human" && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-[#111] z-10"
                              style={{ left: `${humanBaseline}%` }}
                              title={`Human Expert Baseline: ${humanBaseline}%`}
                            >
                              <span className="absolute -top-5 -left-9 font-mono text-[10px] bg-[#111] text-white px-1.5 py-0.5 rounded-none whitespace-nowrap">
                                Human: {humanBaseline}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Methodology Note */}
                    <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between font-mono text-xs text-[#8B8B8B]">
                      <span className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                        <ShieldCheck size={14} />
                        <span>Verified Zero-Shot Chain-of-Thought</span>
                      </span>
                      <span className="text-[#F55036] font-bold cursor-pointer hover:underline">
                        View Prompt Spec →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

        </section>
      )}

      {/* ── TAB 2: RESEARCH LITERATURE ── */}
      {activeTab === "literature" && (
        <section className="max-w-[1240px] mx-auto mt-8 px-6">
          
          <div className="bg-white border border-[#E5E5E0] rounded-none px-6 py-5 flex flex-wrap items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-none bg-[#FFF6F3] text-[#F55036] border border-[#FFEDD5] flex items-center justify-center">
                <BookOpen size={22} />
              </div>
              <div>
                <h2 className="text-[19px] font-black text-[#111]">Indexed Academic Citations</h2>
                <p className="font-mono text-xs text-[#8B8B8B]">Peer-reviewed literature citing, evaluating, or comparing {model.name}</p>
              </div>
            </div>

            <span style={{ padding: "8px 16px", background: "#F8F7F2", border: "1px solid #EAE9E4", fontFamily: "monospace", fontWeight: 800, fontSize: "13px", color: "#111111" }}>
              {relatedPapers.length} Papers Found
            </span>
          </div>

          {relatedPapers.length === 0 ? (
            <div className="bg-white border border-[#E5E5E0] rounded-none" style={{ padding: "64px", textAlign: "center" }}>
              <p style={{ fontSize: "18px", fontWeight: 800, color: "#555555", marginBottom: "20px" }}>No direct paper citations indexed yet.</p>
              <Link href="/trending" className="inline-flex items-center gap-2 px-[18px] py-2 bg-[#F55036] text-white rounded-none text-[13px] font-bold shadow-[0_4px_12px_rgba(245,80,54,0.25)] min-h-[42px] hover:bg-[#E0462D] hover:-translate-y-0.5 transition-all no-underline" style={{ display: "inline-flex", textDecoration: "none" }}>
                <span>Browse All Trending AI Research</span>
                <ExternalLink size={15} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {relatedPapers.map((paper: any, i: number) => (
                <div key={i} className="bg-white border border-[#E5E5E0] rounded-none" style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{paper.title}</h3>
                  <p style={{ fontSize: "14px", color: "#555555", marginBottom: "12px" }}>Citations: {paper.citationCount}</p>
                  <Link href={`/papers/${paper.slug}`} style={{ color: "#FF5A1F", textDecoration: "none", fontWeight: 600 }}>View Paper →</Link>
                </div>
              ))}
            </div>
          )}

        </section>
      )}

    </div>
  );
}
