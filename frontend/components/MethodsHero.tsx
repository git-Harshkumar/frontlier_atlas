"use client";

import * as React from "react";

export function MethodsHero({ taxonomy = [] }: { taxonomy?: any[] }) {
  const totalMethods = taxonomy.reduce((sum, category) => sum + category.methods.length, 0);

  return (
    <header className="py-6 md:py-8 px-6 md:px-10 relative flex flex-col rounded-2xl mb-8 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      {/* Static soft ambient warmth - NO ANIMATION */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden rounded-2xl">
        <div className="absolute -right-[10%] -top-[20%] w-[500px] h-[500px] bg-[#FF5A1F]/5 rounded-full mix-blend-multiply filter blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-[2px] w-6 bg-[#FF5A1F] rounded-full" />
          <p className="text-[11px] font-bold text-[#FF5A1F] uppercase tracking-[0.2em]">
            Methods Library
          </p>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#111111] leading-tight font-sans">
          <span className="font-mono mr-2">{totalMethods}</span>methods, indexed and diagrammed
        </h1>
        <p className="text-[#555555] text-[15px] leading-relaxed font-medium mt-3">
          Browse the architectures behind FrontierAtlas papers, grouped by what they do.
        </p>
      </div>
    </header>
  );
}
