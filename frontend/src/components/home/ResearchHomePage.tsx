"use client";

import React, { useState, useEffect } from "react";
import { PAPERS, Paper } from "./PapersData";
import Link from "next/link";

const TABS = ["Today", "This Week", "This Month", "All time"];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  orange: { bg: "bg-[#FFF0E8]", text: "text-[#D94F1E]" },
};

// ─── Hero Cards ──────────────────────────────────────────────

function BreakthroughCard() {
  return (
    <div
      className="rounded-xl p-4 sm:p-5 text-white flex flex-col relative overflow-hidden h-full border border-[#333333]"
      style={{
        background:
          "radial-gradient(ellipse at 80% 40%, rgba(234,88,12,0.5) 0%, transparent 60%), linear-gradient(135deg, #1a1a1a 0%, #111111 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
        <span className="text-sm flex-shrink-0">🔥</span>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#D94F1E] whitespace-nowrap">
          BREAKTHROUGH TODAY
        </span>
        <span
          className="text-[10px] sm:text-[11px] text-white font-semibold ml-auto flex-shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"
          style={{ background: "linear-gradient(135deg, #D94F1E, #C0451A)" }}
        >
          Official Release
        </span>
      </div>

      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
        <h2 className="text-[13px] sm:text-[15px] font-bold leading-snug">
          <span className="whitespace-nowrap">OpenAI releases</span>{" "}
          <span className="whitespace-nowrap">GPT-4.5 Turbo</span>
        </h2>
        <div
          className="flex-shrink-0 w-8 h-8 sm:w-[40px] sm:h-[40px] rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #D94F1E, #C0451A)" }}
        >
          <svg viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5">
            <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.505-3.438 10.079 10.079 0 0 0-10.47 4.985 9.964 9.964 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.504 3.438 10.079 10.079 0 0 0 10.472-4.985 9.966 9.966 0 0 0 6.664-4.834 10.079 10.079 0 0 0-1.241-11.817zm-15.115 21.168a7.474 7.474 0 0 1-4.797-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.649zm-16.116-6.867a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zm-2.09-17.41a7.47 7.47 0 0 1 3.897-3.286C7.11 10.76 7.099 10.87 7.099 10.99v9.199a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L5.945 23.93a7.504 7.504 0 0 1-1.734-10.168zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18.14z" fill="white"/>
          </svg>
        </div>
      </div>

      <p className="text-[11px] sm:text-[12px] text-[#888888] mb-2 sm:mb-2.5 leading-relaxed">
        First-party model in the GPT-4.5 series, now available in OpenAI Studio.
      </p>

      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
        {[
          "Beats Gemini 1.5 Pro on 7 benc...",
          "256K context length",
          "Lower latency, higher accuracy",
        ].map((point) => (
          <div key={point} className="flex items-center gap-2 text-[11px] sm:text-[12px] text-[#888888]">
            <svg viewBox="0 0 16 16" className="w-3 h-3 flex-shrink-0 text-[#D94F1E]" fill="currentColor">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <span className="truncate">{point}</span>
          </div>
        ))}
      </div>

      <a href="#" className="text-[11px] sm:text-[12px] font-semibold flex items-center gap-1 hover:underline mt-auto text-[#D94F1E]">
        View paper →
      </a>
    </div>
  );
}

function RisingFastCard() {
  const items = [
    { rank: 1, name: "VoxCPM-1.5", stars: "+540" },
    { rank: 2, name: "DeepSeek-R1.1", stars: "+412" },
    { rank: 3, name: "LongRPE 2.0", stars: "+398" },
  ];
  return (
    <div className="rounded-xl p-4 sm:p-5 flex flex-col h-full bg-[#EDEAE3] border border-gray-300">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <svg viewBox="0 0 16 16" className="w-4 h-4 sm:w-5 sm:h-5 text-[#D94F1E] flex-shrink-0" fill="currentColor">
          <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
        </svg>
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-gray-500">RISING FAST</span>
      </div>

      <div className="mb-3 sm:mb-4">
        <span className="text-3xl sm:text-5xl font-bold text-[#D94F1E]">+540</span>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
          GitHub stars<br />in the last 8 hours
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 flex-1">
        {items.map((item) => (
          <div key={item.rank} className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FFF0E8] text-[#D94F1E] text-[10px] sm:text-xs font-bold flex-shrink-0">
              {item.rank}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-1 min-w-0 truncate">{item.name}</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">{item.stars}</span>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D94F1E] flex-shrink-0" fill="currentColor">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
        ))}
      </div>

      <a href="#" className="text-xs sm:text-sm font-medium mt-auto pt-2 sm:pt-3 flex items-center gap-1 hover:underline text-[#D94F1E]">
        View all rising →
      </a>
    </div>
  );
}

function NewSotaCard() {
  const items = [
    { label: "s1: Simple Test-Time Scaling", badges: "#1 on 8 benchmarks" },
    { label: "LongRPE 2.0", badges: "#1 on 6 benchmarks" },
    { label: "V-JEPA 2", badges: "#1 on 4 benchmarks" },
    { label: "MuJoCo World Model Suite", badges: "#1 on 3 benchmarks" },
  ];
  return (
    <div className="rounded-xl p-4 sm:p-5 flex flex-col h-full bg-[#EDEAE3] border border-[#e0ddd6]">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base">🏆</span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#555555]">NEW SOTA TODAY</span>
        </div>
        <a href="#" className="text-[11px] sm:text-[12px] font-medium flex items-center gap-1 hover:underline flex-shrink-0 text-[#D94F1E]">
          View all →
        </a>
      </div>
      <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3">
            <span className="inline-flex items-center text-[10px] sm:text-[11px] bg-[#FFF0E8] text-[#D94F1E] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold shrink-0 mt-0.5">
              SOTA
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[11px] sm:text-[13px] font-semibold text-[#111111] truncate" title={item.label}>
                {item.label}
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#888888]">
                {item.badges}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingGithubCard() {
  const items = [
    { name: "microsoft/BitNet", stars: "+2.1k" },
    { name: "huggingface/transformers", stars: "+1.8k" },
    { name: "databricks/dolly", stars: "+1.6k" },
    { name: "vim-project/vim", stars: "+1.4k" },
    { name: "unslohai/unsloh", stars: "+1.2k" },
  ];
  return (
    <div className="rounded-xl p-4 sm:p-5 flex flex-col h-full bg-[#EDEAE3] border border-[#e0ddd6]">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <svg viewBox="0 0 16 16" className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] flex-shrink-0" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#111111]">TRENDING ON GITHUB</span>
      </div>
      <div className="space-y-2 sm:space-y-3 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#111111] flex-shrink-0" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="text-[11px] sm:text-[13px] text-[#555555] flex-1 min-w-0 truncate" title={item.name}>{item.name}</span>
            <span className="text-[11px] sm:text-[13px] text-[#888888] font-medium flex-shrink-0">{item.stars}</span>
            <svg viewBox="0 0 16 16" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#111111] flex-shrink-0" fill="currentColor">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
        ))}
      </div>
      <a href="#" className="text-[11px] sm:text-[13px] text-[#888888] font-medium mt-auto pt-2 flex items-center gap-1.5 hover:text-[#D94F1E] transition-colors">
        View all trending repos →
      </a>
    </div>
  );
}

function TrendingXCard() {
  const items = [
    { name: "x.com/levelio", stars: "+2.1k" },
    { name: "x.com/EMostaque", stars: "+1.8k" },
    { name: "x.com/ai_for_success", stars: "+1.6k" },
    { name: "x.com/deedydxias", stars: "+1.4k" },
    { name: "x.com/rowancheung", stars: "+1.2k" },
  ];

  const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  return (
    <div className="bg-[#111827] rounded-xl p-3 sm:p-4 text-white flex flex-col border border-[#1a2234]">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white">TRENDING ON X</span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#888888] flex-shrink-0" />
            <span className="text-[11px] sm:text-[13px] text-[#d1d5db] flex-1 min-w-0 truncate" title={item.name}>{item.name}</span>
            <span className="text-[11px] sm:text-[13px] text-[#9ca3af] font-medium flex-shrink-0">{item.stars}</span>
            <svg viewBox="0 0 16 16" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4b5563] flex-shrink-0" fill="currentColor">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
        ))}
      </div>
      <a href="#" className="text-[11px] sm:text-[13px] text-[#9ca3af] font-medium mt-3 sm:mt-4 pt-2 flex items-center gap-1.5 hover:text-[#D94F1E] transition-colors">
        View all trending posts →
      </a>
    </div>
  );
}

function TrendingRedditCard() {
  const items = [
    { name: "r/MachineLearning", stars: "+2.1k" },
    { name: "r/LocalLLaMA", stars: "+1.8k" },
    { name: "r/ArtificialIntelligence", stars: "+1.6k" },
    { name: "r/DeepLearning", stars: "+1.4k" },
    { name: "r/LLMDevs", stars: "+1.2k" },
  ];

  const RedditIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );

  return (
    <div
      className="rounded-xl p-3 sm:p-4 text-white flex flex-col relative overflow-hidden border border-[#3a2a20]"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(234,88,12,0.55) 0%, transparent 60%), linear-gradient(145deg, #1e1208 0%, #111111 100%)",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D94F1E] flex items-center justify-center flex-shrink-0">
          <RedditIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white">TRENDING ON REDDIT</span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <RedditIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 flex-shrink-0" />
            <span className="text-[11px] sm:text-[13px] text-white/90 flex-1 min-w-0 truncate" title={item.name}>{item.name}</span>
            <span className="text-[11px] sm:text-[13px] text-white/70 font-medium flex-shrink-0">{item.stars}</span>
            <svg viewBox="0 0 16 16" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50 flex-shrink-0" fill="currentColor">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
          </div>
        ))}
      </div>
      <a href="#" className="text-[11px] sm:text-[13px] text-white/70 font-medium mt-3 sm:mt-4 pt-2 flex items-center gap-1.5 hover:text-[#D94F1E] transition-colors">
        View all trending discussions →
      </a>
    </div>
  );
}

// ─── Paper Components ─────────────────────────────────────────

function PaperThumbnail({ thumbUrl, href }: { thumbUrl: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open paper"
      className="w-full md:w-[180px] lg:w-[200px] md:min-w-[150px] lg:min-w-[180px] rounded-lg overflow-hidden flex-shrink-0 shadow-sm order-1 md:order-none group bg-[#EDEAE3] border border-[#e0ddd6] transition-colors hover:border-[#D94F1E]"
    >
      <div className="relative w-full h-[160px] sm:h-[180px] md:h-auto md:aspect-[3/4]">
        <img
          src={thumbUrl}
          alt="Paper thumbnail"
          className="absolute inset-0 w-full h-full object-contain md:object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
          loading="lazy"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = "none";
            const p = t.parentElement;
            if (p)
              p.innerHTML = `<div class="absolute inset-0 bg-[#EDEAE3] flex items-center justify-center text-[#888888] text-[11px]">Preview</div>`;
          }}
        />
      </div>
    </Link>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  const c = TAG_COLORS[color] ?? TAG_COLORS.gray;
  return (
    <a
      href="#"
      className={`inline-flex items-center h-[22px] sm:h-[25px] text-[10px] sm:text-[11px] lg:text-[12px] font-medium px-1.5 sm:px-2 lg:px-2.5 rounded whitespace-nowrap transition-opacity hover:opacity-80 ${c.bg} ${c.text}`}
    >
      {label}
    </a>
  );
}

function MethodChip({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="inline-flex items-center h-[22px] sm:h-[25px] text-[10px] sm:text-[11px] lg:text-[12px] text-[#555555] bg-[#F5F5F5] border border-[#e5e5e5] px-1.5 sm:px-2 lg:px-2.5 rounded whitespace-nowrap transition-all hover:opacity-80 hover:border-[#D94F1E] hover:text-[#D94F1E]"
    >
      {label}
    </a>
  );
}

// ─── SOTA Row (merged from first file) ───────────────────────

function SotaRow({
  benchmarks,
  rank,
  rankLabel,
  extra,
}: {
  benchmarks: string[];
  rank: string;
  rankLabel: string;
  extra: string;
}) {
  if (benchmarks.length === 0 && !rank) return null;
  return (
    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
      {benchmarks.length > 0 && (
        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium py-[2px] px-1.5 sm:px-2 rounded bg-[#FFF0E8] text-[#92400e] whitespace-nowrap">
          🏆 SOTA on
        </span>
      )}
      {benchmarks.map((b, i) => (
        <a key={b} href="#" className="text-[10px] sm:text-[11px] font-medium text-[#D94F1E] no-underline whitespace-nowrap hover:underline">
          {b}{i < benchmarks.length - 1 ? "," : ""}
        </a>
      ))}
      {rank && (
        <>
          {benchmarks.length > 0 && <span className="text-[#f0f0f0] text-xs mx-px">·</span>}
          <span className="inline-flex items-center gap-[3px] text-[10px] sm:text-[11px] font-medium py-[2px] px-1.5 sm:px-2 rounded bg-[#FFF0E8] text-[#D94F1E] whitespace-nowrap">
            <svg viewBox="0 0 16 16" fill="#D94F1E" className="w-2.5 h-2.5">
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
            #{rank} on
          </span>
          <a href="#" className="text-[10px] sm:text-[11px] font-medium text-[#D94F1E] no-underline whitespace-nowrap hover:underline">
            {rankLabel}
          </a>
        </>
      )}
      {extra && (
        <a href="#" className="text-[10px] sm:text-[11px] text-[#888888] no-underline whitespace-nowrap hover:underline hover:text-[#D94F1E]">
          {extra}
        </a>
      )}
    </div>
  );
}

// ── Bookmark icon ─────────────────────────────────────────────

function BookmarkButton() {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => setSaved((s) => !s)}
      aria-label={saved ? "Remove bookmark" : "Bookmark paper"}
      className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md transition-colors hover:bg-[#fff1ee] text-[#c0c0c0] hover:text-[#D94F1E]"
    >
      <svg
        viewBox="0 0 16 16"
        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
        fill={saved ? "#D94F1E" : "none"}
        stroke={saved ? "#D94F1E" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v12l-5-3-5 3V2.5z" />
      </svg>
    </button>
  );
}

// ── Stat item ─────────────────────────────────────────────────

function StatItem({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <a
      href="#"
      className="flex flex-col items-end gap-0.5 w-full py-2 sm:py-4 border-b border-[#f0f0f0] last:border-b-0 transition-all hover:opacity-80 hover:text-[#D94F1E]"
    >
      <div className={`flex items-center gap-1 sm:gap-1.5 ${accent ? "text-[#D94F1E]" : "text-[#111111]"}`}>
        {icon}
        <span className="font-semibold text-[13px] sm:text-[14px] lg:text-[15px] leading-none">{value}</span>
      </div>
      <span className="text-[10px] sm:text-[11px] text-[#888888] leading-none">{label}</span>
    </a>
  );
}

function PaperCard(p: Paper) {
  const paperUrl = (p as any).arxivUrl ?? "#";

  return (
    <div className="bg-[#EDEAE3] border border-[#e0ddd6] rounded-xl p-3 sm:p-4 md:p-5 lg:p-7 flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch transition-shadow duration-150 hover:shadow-md hover:shadow-gray-100/50">
      <PaperThumbnail thumbUrl={p.thumbUrl} href={paperUrl} />

      <div className="flex-1 min-w-0 order-2 md:order-1 flex flex-col">
        <div>
          <Link href={paperUrl} target="_blank" rel="noopener noreferrer" className="group inline-block">
            <h3 
              className="font-semibold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-[#111111] leading-snug mb-1 sm:mb-1.5 transition-colors group-hover:text-[#D94F1E] line-clamp-2"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {p.title}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-[#888888] mb-2 sm:mb-2.5">
            {p.showAuthors ? `${p.authors} · ${p.date}` : p.date}
          </p>
          <p
            className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#555555] leading-relaxed line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {p.description}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          <SotaRow
            benchmarks={p.sotaBenchmarks}
            rank={p.sotaRank}
            rankLabel={p.sotaRankLabel}
            extra={p.sotaExtra}
          />
          {p.tags.length > 0 && (
            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {p.tags.map((t) => <Tag key={t.label} label={t.label} color={t.color} />)}
            </div>
          )}
          {p.methods.length > 0 && (
            <div className="flex gap-1 sm:gap-1.5 flex-wrap">
              {p.methods.map((m) => <MethodChip key={m} label={m} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Desktop stat column ── */}
      <div className="hidden md:flex flex-shrink-0 items-start order-3 w-[80px] sm:w-[90px]">
        <div className="flex flex-col items-stretch w-full border-l border-gray-300 pl-3 sm:pl-4 lg:pl-5">
          <div className="flex justify-end mb-1">
            <BookmarkButton />
          </div>

          <StatItem
            icon={
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
              </svg>
            }
            value={p.upvotes}
            label="Upvotes"
            accent
          />
          <StatItem
            icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#888888]"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>}
            value={p.repos} label="Repo"
          />
          <StatItem
            icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#888888]"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12z" /></svg>}
            value={p.citations} label="Citations"
          />
        </div>
      </div>

      {/* ── Mobile stat row ── */}
      <div className="flex md:hidden flex-row items-center justify-between order-3 pt-3 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Upvotes */}
          <a href="#" className="flex items-center gap-1.5 text-[#D94F1E]">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
            </svg>
            <span className="font-semibold text-sm">{p.upvotes}</span>
            <span className="text-xs text-[#888888]">Upvotes</span>
          </a>
          {/* Repo */}
          <a href="#" className="flex items-center gap-1.5 text-[#111111]">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#888888]"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
            <span className="font-semibold text-sm">{p.repos}</span>
            <span className="text-xs text-[#888888]">Repo</span>
          </a>
          {/* Citations */}
          <a href="#" className="flex items-center gap-1.5 text-[#111111]">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#888888]"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12z" /></svg>
            <span className="font-semibold text-sm">{p.citations}</span>
            <span className="text-xs text-[#888888]">Citations</span>
          </a>
        </div>
        <BookmarkButton />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function ResearchHomePage() {
  const [activeTab, setActiveTab] = useState("Today");
  const [papers, setPapers] = useState<Paper[]>(PAPERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
    fetch(`${apiUrl}/api/v1/research-papers`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const apiPapers = data.data.map((p: any) => ({
            title: p.title,
            authors: "Research Team",
            date: new Date(p.createdAt).toLocaleDateString(),
            showAuthors: true,
            description: "View this paper on arXiv.",
            upvotes: "1.2K",
            repos: "300",
            citations: p.citationCount?.toString() || "0",
            tags: [{ label: "AI", color: "orange" }],
            methods: [],
            sotaBenchmarks: [],
            sotaRank: "",
            sotaRankLabel: "",
            sotaExtra: "",
            thumbUrl: "/img1.png",
            arxivUrl: p.paperUrl || (p.arxivId ? `https://arxiv.org/abs/${p.arxivId}` : "#"),
          }));
          setPapers(apiPapers);
        }
      })
      .catch((err) => console.error("Error fetching papers:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen font-[Inter]">
      <div className="max-w-[1320px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pb-6 sm:pb-8 lg:pb-12">

        {/* Hero cards - hidden on mobile, visible on md+ */}
        <div className="hidden md:block pt-4 sm:pt-6">
          <div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 sm:mb-6"
          >
            <BreakthroughCard />
            <RisingFastCard />
            <NewSotaCard />
            <TrendingGithubCard />
          </div>
        </div>

        {/* Time filter tabs - mobile: pills, desktop: underline */}
        <div className="pt-4 sm:pt-6">
          {/* Mobile: pill buttons */}
          <div className="flex md:hidden items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab
                      ? "bg-[#D94F1E] text-white"
                      : "text-[#888888] hover:text-[#111111]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: underline tabs */}
          <div className="hidden md:flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-0 border-b border-[#e5e5e5]">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 px-4 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab ? "text-[#D94F1E] font-semibold" : "text-[#888888] hover:text-[#D94F1E]"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D94F1E] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-sm text-[#888888]">30 papers</span>
          </div>
        </div>

        {/* Content + Sidebar row */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">

          {/* Main content - paper list */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-2 sm:gap-3">
              {loading ? (
                <div className="text-center py-10 text-[#888888]">Loading papers from API...</div>
              ) : (
                papers.map((p) => (
                  <PaperCard key={p.title} {...p} />
                ))
              )}
            </div>
          </div>

          {/* Right sidebar - starts BELOW the hero row, aligned with paper list */}
          <div className="hidden lg:block w-[260px] xl:w-[280px] flex-shrink-0">
            <div className="top-6 flex flex-col gap-3 sm:gap-4">
              <TrendingXCard />
              <TrendingRedditCard />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}