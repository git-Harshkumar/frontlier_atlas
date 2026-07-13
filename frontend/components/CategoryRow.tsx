"use client";

import * as React from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { getCategoryColors } from "@/lib/categoryColors";

export interface MethodCategory {
  id: string;
  name: string;
  iconName?: string;
  methods: { id: string; name: string; slug?: string; paperCount?: number; year?: number }[];
}

function GenerativeBlueprint({ seed, color }: { seed: string, color: string }) {
  // Hash function to make the SVG unique per method but consistent
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const n1 = Math.abs(hash % 100);
  const n2 = Math.abs((hash >> 2) % 100);
  const n3 = Math.abs((hash >> 4) % 100);
  const n4 = Math.abs((hash >> 6) % 100);
  
  // Generate coordinates for organic, tech-like flow lines
  const y1 = 15 + (n1 % 50);
  const y2 = 15 + (n2 % 50);
  const x1 = 40 + (n3 % 40);
  const x2 = 120 + (n4 % 40);

  return (
    <svg width="100%" height="100%" viewBox="0 0 200 80" className="opacity-[0.15] group-hover:opacity-[0.4] transition-all duration-700 group-hover:scale-105 pointer-events-none" fill="none" stroke={color}>
      {/* Blueprint Grid Lines */}
      <path d={`M${x1},0 L${x1},80`} strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      <path d={`M${x2},0 L${x2},80`} strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      
      {/* Primary Neural Flow */}
      <path d={`M-20,${y1} C${x1},${y1} ${x1},${y2} 100,${y2} C${x2},${y2} ${x2},${y1} 220,${y1}`} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Secondary Processing Line */}
      <path d={`M-20,${y2} C${x1},${y2} ${x1},${y1} 100,${y1} C${x2},${y1} ${x2},${y2} 220,${y2}`} strokeWidth="1.5" strokeDasharray="4 6" strokeLinecap="round" />
      
      {/* Data Nodes */}
      <circle cx="100" cy={y2} r="4" fill={color} />
      <circle cx={x1} cy={y1} r="3" fill="#fff" strokeWidth="1.5" />
      <circle cx={x2} cy={y2} r="3" fill="#fff" strokeWidth="1.5" />
    </svg>
  );
}

const UNIQUE_TECH_ICONS = [
  LucideIcons.Activity, LucideIcons.Aperture, LucideIcons.Asterisk, LucideIcons.Atom, LucideIcons.Binary, 
  LucideIcons.Box, LucideIcons.Boxes, LucideIcons.Braces, LucideIcons.Brackets, 
  LucideIcons.Cable, LucideIcons.Calculator, LucideIcons.Cast, LucideIcons.CircleDashed, 
  LucideIcons.CircleDot, LucideIcons.CircuitBoard, LucideIcons.Code, LucideIcons.Code2, LucideIcons.Codepen, 
  LucideIcons.Command, LucideIcons.Compass, LucideIcons.Component, LucideIcons.Cpu, LucideIcons.Crosshair, 
  LucideIcons.Database, LucideIcons.Disc, LucideIcons.Focus, LucideIcons.Gauge, LucideIcons.GitBranch, 
  LucideIcons.GitCommit, LucideIcons.GitMerge, LucideIcons.GitPullRequest, 
  LucideIcons.Globe, LucideIcons.Grid, LucideIcons.Hash, LucideIcons.Hexagon, LucideIcons.Infinity, 
  LucideIcons.Layers, LucideIcons.Layout, LucideIcons.LayoutGrid, 
  LucideIcons.Library, LucideIcons.Lightbulb, LucideIcons.Link, LucideIcons.Link2, LucideIcons.Microscope, 
  LucideIcons.Network, LucideIcons.Orbit, LucideIcons.Package, 
  LucideIcons.Pi, LucideIcons.Plug, LucideIcons.Power, LucideIcons.Puzzle, LucideIcons.QrCode, 
  LucideIcons.Radar, LucideIcons.Radio, LucideIcons.Regex, LucideIcons.Repeat, 
  LucideIcons.Route, LucideIcons.Router, LucideIcons.Scale, LucideIcons.Scan, 
  LucideIcons.ScanLine, LucideIcons.Server, LucideIcons.Settings, 
  LucideIcons.Settings2, LucideIcons.Shapes, LucideIcons.Share, LucideIcons.Share2, LucideIcons.Shield, 
  LucideIcons.Sigma, LucideIcons.Signal, LucideIcons.Sliders, 
  LucideIcons.Square, LucideIcons.Target, 
  LucideIcons.Telescope, LucideIcons.Terminal, LucideIcons.Thermometer, LucideIcons.Timer,
  LucideIcons.Triangle, LucideIcons.Usb, 
  LucideIcons.Variable, LucideIcons.Vault, LucideIcons.Wand, 
  LucideIcons.Wand2, LucideIcons.Waves, LucideIcons.Wifi, LucideIcons.Wind, LucideIcons.Zap
];

const getMethodIcon = (methodName: string) => {
  const name = methodName.toLowerCase();
  if (name.includes('transformer') || name.includes('attention')) return LucideIcons.Zap;
  if (name.includes('graph') || name.includes('gnn')) return LucideIcons.Share2;
  if (name.includes('vision') || name.includes('image') || name.includes('cnn')) return LucideIcons.Image;
  if (name.includes('language') || name.includes('text') || name.includes('nlp')) return LucideIcons.MessageSquare;
  if (name.includes('generative') || name.includes('diffusion') || name.includes('gan')) return LucideIcons.Wand2;
  if (name.includes('reinforcement') || name.includes('rl')) return LucideIcons.Target;
  if (name.includes('audio') || name.includes('speech')) return LucideIcons.AudioLines || LucideIcons.Mic;
  if (name.includes('search') || name.includes('retrieval') || name.includes('rag')) return LucideIcons.Search;
  if (name.includes('quantum')) return LucideIcons.Atom;
  if (name.includes('autoencoder')) return LucideIcons.Minimize2;
  if (name.includes('time') || name.includes('series')) return LucideIcons.Clock;
  if (name.includes('optimization') || name.includes('gradient')) return LucideIcons.TrendingDown;

  // Hash to a massive pool of 80+ abstract tech icons to ensure high uniqueness
  const charSum = methodName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hash = (methodName.length * 17 + charSum);
  const IconComponent = UNIQUE_TECH_ICONS[hash % UNIQUE_TECH_ICONS.length];
  
  // Fallback just in case a component was undefined
  return IconComponent || LucideIcons.Box;
};

function PrismaticHoverCard({ method, colors }: { method: any, colors: any }) {
  const cardRef = React.useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const MethodIcon = getMethodIcon(method.name);

  const displayPaperCount = method.paperCount || 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only track mouse position on desktop to save mobile CPU
    if (window.innerWidth < 768) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Link
      ref={cardRef}
      href={`/methods/${method.slug ?? method.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between h-[120px] p-4 rounded-[12px] overflow-hidden transition-all duration-300 md:duration-500 hover:-translate-y-1 active:scale-95 bg-white md:bg-transparent border border-[#E8E8E3] md:border-transparent"
      style={{
        boxShadow: isHovered 
          ? "0 16px 32px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,1)"
          : "0 6px 16px -8px rgba(0,0,0,0.05)", 
      }}
    >
      {/* 1. Base Aurora Gradient Mesh (DESKTOP ONLY - Too heavy for mobile blur) */}
      <div className="absolute inset-0 z-0 bg-[#F4F4F4] hidden md:block">
        <div 
          className="absolute top-[20%] left-[20%] w-[150%] h-[150%] opacity-40 mix-blend-multiply group-hover:animate-slow-spin-mesh transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `conic-gradient(from 0deg, ${colors.accent}10, transparent, ${colors.accent}30, transparent, ${colors.accent}10)`,
            transformOrigin: "center center"
          }}
        />
        <div 
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[32px] opacity-30 transition-all duration-700 group-hover:opacity-80 group-hover:scale-150 group-hover:-translate-x-4"
          style={{ background: colors.accent }}
        />
        <div 
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-[24px] opacity-20 transition-all duration-700 group-hover:opacity-60 group-hover:scale-125"
          style={{ background: "#4A90E2" }}
        />
      </div>

      {/* 2. Heavy Frosted Glass Layer (DESKTOP ONLY) */}
      <div className="absolute inset-0 z-10 hidden md:block backdrop-blur-2xl bg-white/70 transition-colors duration-500 group-hover:bg-white/50" />

      {/* 3. Mouse Spotlight Glare (DESKTOP ONLY) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-300 hidden md:block"
        style={{
          opacity: isHovered ? 0.8 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,1), transparent 40%)`
        }}
      />
      
      {/* 4. Internal Glass Border Highlight (DESKTOP ONLY) */}
      <div className="absolute inset-0 z-30 pointer-events-none rounded-[12px] shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_0_0_1px_rgba(255,255,255,0.3)] hidden md:block" />

      {/* GENERATIVE BLUEPRINT SVG (ALL DEVICES - Very cheap and looks animated) */}
      <div className="absolute inset-x-0 top-9 bottom-7 z-30 flex items-center justify-center pointer-events-none overflow-hidden opacity-30 md:opacity-100 mix-blend-multiply">
        <GenerativeBlueprint seed={method.name} color={colors.accent} />
      </div>

      {/* 5. The Content */}
      <div className="relative z-40 flex justify-between items-start mb-3">
        <div className="flex items-start gap-2.5 pr-4">
          <div className="mt-0.5 w-6 h-6 rounded-md bg-[#F4F4F4] md:bg-white/60 shadow-sm md:shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0 border border-[#E8E8E3] md:border-white md:group-hover:bg-white transition-colors duration-300">
            <MethodIcon className="w-3.5 h-3.5 text-[#111]" strokeWidth={2.5} />
          </div>
          <h3 className="text-[16px] font-extrabold tracking-tight text-[#111111] leading-tight drop-shadow-none md:drop-shadow-sm">
            {method.name}
          </h3>
        </div>
        
        {/* Glossy Button */}
        <div className="w-8 h-8 rounded-[8px] bg-[#F4F4F4] md:bg-white/60 md:backdrop-blur-md flex items-center justify-center shrink-0 border border-[#E8E8E3] md:border-white shadow-sm md:shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] transition-all duration-500 md:group-hover:bg-[#111] md:group-hover:border-[#111] md:group-hover:scale-110 md:group-hover:-translate-y-1 md:group-hover:translate-x-1 md:group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
          <ArrowUpRight className="w-4 h-4 text-[#888] md:group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-40 flex items-center justify-between mt-auto">
        {(displayPaperCount > 0) ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[#F4F4F4] md:bg-white/60 md:backdrop-blur-md border border-[#E8E8E3] md:border-white shadow-sm md:shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] text-[10px] font-extrabold tracking-widest uppercase text-[#555] transition-all duration-300 md:group-hover:bg-white">
            <span className="font-mono text-[11px] text-[#111] leading-none pt-px">{displayPaperCount.toLocaleString()}</span>
            <span className="leading-none pt-px">PAPERS</span>
          </div>
        ) : (
          <div />
        )}
        
        {method.year && (
          <span className="font-mono text-[12px] font-bold text-[#888] drop-shadow-none md:drop-shadow-sm md:group-hover:text-[#555] transition-colors">{method.year}</span>
        )}
      </div>
    </Link>
  );
}

export function CategoryRow({ category, index = 0 }: { category: MethodCategory, index?: number }) {
  const totalPapers = category.methods.reduce((sum, method) => sum + (method.paperCount || 0), 0);

  const colors = getCategoryColors(category.id);
  const CategoryIcon = category.iconName ? (LucideIcons as any)[category.iconName] : LucideIcons.Hash;

  return (
    <section id={category.id} className="scroll-mt-[100px] mb-24 relative">
      <style>{`
        @keyframes slow-spin-mesh {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-slow-spin-mesh {
          animation: slow-spin-mesh 8s linear infinite;
        }
      `}</style>

      {/* Gorgeous Prismatic Header */}
      <div className="flex items-end justify-between mb-8 pb-4">
        <div className="flex items-center gap-5">
          <div 
            className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center relative overflow-hidden" 
            style={{ boxShadow: `0 8px 24px ${colors.accent}30, inset 0 2px 4px rgba(255,255,255,0.8), 0 0 0 1px rgba(255,255,255,0.5)` }}
          >
             <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.bg}, #ffffff)` }} />
             <div className="absolute top-[-20%] right-[-20%] w-12 h-12 rounded-full blur-[12px]" style={{ background: colors.accent, opacity: 0.5 }} />
             <div className="absolute bottom-[-10%] left-[-10%] w-10 h-10 rounded-full blur-[10px]" style={{ background: "#4A90E2", opacity: 0.3 }} />
             <CategoryIcon className="w-7 h-7 relative z-10" style={{ color: colors.accent }} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            <h2 className="text-[32px] font-extrabold tracking-tight text-[#111111] leading-none drop-shadow-sm">
              {category.name}
            </h2>
            <div className="flex items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-widest text-[#888888]">
              <span className="font-mono text-[#FF5A1F]">{category.methods.length}</span>
              <span>ITEMS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D0D0D0]" />
              <span className="font-mono text-[#FF5A1F]">{totalPapers.toLocaleString()}</span>
              <span>PAPERS</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Prismatic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {category.methods.map((method) => (
          <PrismaticHoverCard key={method.id} method={method} colors={colors} />
        ))}
      </div>
    </section>
  );
}
