export const runtime = "edge";
import * as React from "react";
import Link from "next/link";
import { getMethodBySlug } from "@/lib/methods";
import { FileText, ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Navbar from "@/components/Navbar";
import MethodFilteredPapers from "@/components/domain/methods/MethodFilteredPapers";

const ICON_MAP: Record<string, string> = {
  "General": "Settings",
  "Language": "MessageSquare",
  "Vision": "Eye",
  "Audio & Speech": "Mic",
  "Agents": "Bot",
  "Reasoning": "Brain",
  "Training": "Dumbbell",
  "Optimization": "LineChart",
  "Inference": "Zap",
  "Retrieval": "Search",
  "Reinforcement Learning": "Gamepad2",
  "Diffusion & Generation": "Wand2",
  "Multimodal": "Layers",
  "Architectures": "Cpu",
  "Evaluation": "CheckSquare",
  "Embeddings": "Binary"
};

// ─── Category-specific SVG illustrations ───────────────────────────────────
function CategorySVG({ category }: { category: string }) {
  const cat = (category ?? "").toLowerCase();

  // ── LANGUAGE ─────────────────────────────────────────────────────────────
  if (cat.includes("language")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff4d20" /><stop offset="1" stopColor="#ff9070" /></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* Speech bubble 1 */}
        <rect x="20" y="30" width="160" height="70" rx="14" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <polygon points="40,100 60,100 40,120" fill="white" stroke="#FF4D20" strokeWidth="2" strokeLinejoin="round"/>
        {/* Text lines inside bubble 1 */}
        <rect x="34" y="50" width="100" height="7" rx="3.5" fill="#FF4D20" fillOpacity="0.7"/>
        <rect x="34" y="64" width="80" height="7" rx="3.5" fill="#FF4D20" fillOpacity="0.4"/>
        <rect x="34" y="78" width="60" height="7" rx="3.5" fill="#FF4D20" fillOpacity="0.25"/>
        {/* Speech bubble 2 (AI reply, right-aligned) */}
        <rect x="140" y="130" width="160" height="70" rx="14" fill="url(#lg1)"/>
        <polygon points="280,200 260,200 280,220" fill="#FF4D20"/>
        {/* Text lines inside bubble 2 */}
        <rect x="155" y="150" width="100" height="7" rx="3.5" fill="white" fillOpacity="0.9"/>
        <rect x="155" y="164" width="75" height="7" rx="3.5" fill="white" fillOpacity="0.6"/>
        <rect x="155" y="178" width="50" height="7" rx="3.5" fill="white" fillOpacity="0.4"/>
        {/* Token pills floating in the middle */}
        <rect x="55" y="118" width="46" height="20" rx="10" fill="#FF4D20" fillOpacity="0.12" stroke="#FF4D20" strokeWidth="1.2"/>
        <text x="78" y="132" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">TOKEN</text>
        <rect x="110" y="118" width="46" height="20" rx="10" fill="#FF4D20" fillOpacity="0.12" stroke="#FF4D20" strokeWidth="1.2"/>
        <text x="133" y="132" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">EMBED</text>
        {/* Dotted connection line */}
        <path d="M88 118 Q160 95 200 130" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity="0.5"/>
        {/* Small glow dots */}
        <circle cx="88" cy="118" r="4" fill="#FF4D20" filter="url(#glow)"/>
        <circle cx="200" cy="130" r="4" fill="#FF4D20" filter="url(#glow)"/>
      </svg>
    );
  }

  // ── VISION ───────────────────────────────────────────────────────────────
  if (cat.includes("vision")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <radialGradient id="iris" cx="50%" cy="50%" r="50%"><stop stopColor="#FF4D20" stopOpacity="0.3"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0"/></radialGradient>
          <filter id="glow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* Eye shape */}
        <path d="M40 120 Q160 30 280 120 Q160 210 40 120 Z" fill="white" stroke="#FF4D20" strokeWidth="2.5"/>
        {/* Iris */}
        <circle cx="160" cy="120" r="46" fill="url(#iris)" stroke="#FF4D20" strokeWidth="2"/>
        {/* Pupil */}
        <circle cx="160" cy="120" r="24" fill="#FF4D20"/>
        {/* Pupil highlight */}
        <circle cx="152" cy="112" r="8" fill="white" fillOpacity="0.5"/>
        {/* Scan lines emanating outward */}
        <line x1="160" y1="64" x2="160" y2="44" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <line x1="202" y1="78" x2="218" y2="62" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <line x1="118" y1="78" x2="102" y2="62" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        <line x1="160" y1="176" x2="160" y2="196" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
        {/* Corner detection brackets */}
        <path d="M60 50 L40 50 L40 70" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        <path d="M260 50 L280 50 L280 70" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        <path d="M60 190 L40 190 L40 170" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        <path d="M260 190 L280 190 L280 170" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        {/* Grid overlay on image */}
        <path d="M107 87 L213 87 M107 120 L213 120 M107 153 L213 153 M107 87 L107 153 M160 87 L160 153 M213 87 L213 153" stroke="#FF4D20" strokeWidth="0.8" opacity="0.25"/>
      </svg>
    );
  }

  // ── AUDIO & SPEECH ───────────────────────────────────────────────────────
  if (cat.includes("audio") || cat.includes("speech")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="wavGrad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FF4D20" stopOpacity="0.8"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0.1"/></linearGradient>
        </defs>
        {/* Microphone body */}
        <rect x="135" y="30" width="50" height="80" rx="25" fill="white" stroke="#FF4D20" strokeWidth="2.5"/>
        {/* Mic grille lines */}
        <line x1="148" y1="50" x2="172" y2="50" stroke="#FF4D20" strokeWidth="1.5" opacity="0.5"/>
        <line x1="145" y1="62" x2="175" y2="62" stroke="#FF4D20" strokeWidth="1.5" opacity="0.5"/>
        <line x1="145" y1="74" x2="175" y2="74" stroke="#FF4D20" strokeWidth="1.5" opacity="0.5"/>
        <line x1="148" y1="86" x2="172" y2="86" stroke="#FF4D20" strokeWidth="1.5" opacity="0.5"/>
        {/* Mic stand arc */}
        <path d="M105 120 Q105 160 160 160 Q215 160 215 120" stroke="#FF4D20" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Mic stand pole */}
        <line x1="160" y1="160" x2="160" y2="190" stroke="#FF4D20" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="135" y1="190" x2="185" y2="190" stroke="#FF4D20" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Radiating sound waves */}
        <path d="M220 90 Q238 110 220 130" stroke="#FF4D20" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M234 75 Q264 110 234 145" stroke="#FF4D20" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M248 60 Q290 110 248 160" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
        <path d="M100 90 Q82 110 100 130" stroke="#FF4D20" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M86 75 Q56 110 86 145" stroke="#FF4D20" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
        <path d="M72 60 Q30 110 72 160" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
        {/* Waveform bars at bottom */}
        {[30,46,62,78,94,110,126,142,158,174,190,206,222,238,254].map((x, i) => {
          const h = [10,22,36,28,44,18,50,24,42,32,20,38,16,26,12][i];
          return <rect key={i} x={x} y={210 - h / 2} width="10" height={h} rx="5" fill="#FF4D20" fillOpacity={0.3 + (i % 3) * 0.2}/>;
        })}
      </svg>
    );
  }

  // ── AGENTS ───────────────────────────────────────────────────────────────
  if (cat.includes("agent")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="agentGrad" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FF4D20"/><stop offset="1" stopColor="#ff8c66"/></linearGradient>
        </defs>
        {/* Central Agent circle */}
        <circle cx="160" cy="120" r="42" fill="url(#agentGrad)"/>
        {/* Robot face */}
        <rect x="143" y="104" width="14" height="12" rx="4" fill="white" fillOpacity="0.9"/>
        <rect x="163" y="104" width="14" height="12" rx="4" fill="white" fillOpacity="0.9"/>
        <path d="M148 128 Q160 138 172 128" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <rect x="145" y="96" width="30" height="4" rx="2" fill="white" fillOpacity="0.5"/>
        {/* Tool nodes orbiting */}
        {/* Tool 1: Search */}
        <circle cx="64" cy="60" r="24" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="59" cy="55" r="8" stroke="#FF4D20" strokeWidth="2" fill="none"/>
        <line x1="65" y1="61" x2="74" y2="70" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        <line x1="64" y1="60" x2="118" y2="98" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
        {/* Tool 2: Code */}
        <circle cx="256" cy="60" r="24" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <text x="256" y="66" fontSize="16" fill="#FF4D20" fontWeight="800" textAnchor="middle" fontFamily="monospace">{`{}`}</text>
        <line x1="256" y1="60" x2="202" y2="98" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
        {/* Tool 3: Memory */}
        <circle cx="64" cy="180" r="24" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <rect x="52" y="168" width="24" height="24" rx="4" fill="none" stroke="#FF4D20" strokeWidth="1.5"/>
        <line x1="57" y1="176" x2="69" y2="176" stroke="#FF4D20" strokeWidth="1.5"/>
        <line x1="57" y1="183" x2="69" y2="183" stroke="#FF4D20" strokeWidth="1.5"/>
        <line x1="64" y1="180" x2="118" y2="142" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
        {/* Tool 4: API */}
        <circle cx="256" cy="180" r="24" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <text x="256" y="186" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">API</text>
        <line x1="256" y1="180" x2="202" y2="142" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"/>
        {/* Orbit ring */}
        <circle cx="160" cy="120" r="80" stroke="#FF4D20" strokeWidth="1" strokeDasharray="6 4" opacity="0.2"/>
      </svg>
    );
  }

  // ── REASONING ────────────────────────────────────────────────────────────
  if (cat.includes("reason")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="thoughtGrad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FF4D20" stopOpacity="0.15"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0.02"/></linearGradient>
        </defs>
        {/* Tree of thought nodes */}
        {/* Root */}
        <rect x="125" y="20" width="70" height="34" rx="8" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <text x="160" y="42" fontSize="10" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Thought 1</text>
        {/* Level 2 left */}
        <rect x="55" y="90" width="70" height="34" rx="8" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <text x="90" y="112" fontSize="10" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Thought 2a</text>
        {/* Level 2 right */}
        <rect x="195" y="90" width="70" height="34" rx="8" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <text x="230" y="112" fontSize="10" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Thought 2b</text>
        {/* Level 3 */}
        <rect x="20" y="162" width="60" height="30" rx="8" fill="#FF4D20" fillOpacity="0.1" stroke="#FF4D20" strokeWidth="1.5"/>
        <text x="50" y="181" fontSize="9" fill="#FF4D20" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">3a</text>
        <rect x="95" y="162" width="60" height="30" rx="8" fill="#FF4D20" fillOpacity="0.1" stroke="#FF4D20" strokeWidth="1.5"/>
        <text x="125" y="181" fontSize="9" fill="#FF4D20" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">3b</text>
        <rect x="165" y="162" width="60" height="30" rx="8" fill="#FF4D20" fillOpacity="0.1" stroke="#FF4D20" strokeWidth="1.5"/>
        <text x="195" y="181" fontSize="9" fill="#FF4D20" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">3c</text>
        <rect x="240" y="162" width="60" height="30" rx="8" fill="#FF4D20" fillOpacity="0.3" stroke="#FF4D20" strokeWidth="2"/>
        <text x="270" y="181" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">✓ Best</text>
        {/* Connections */}
        <line x1="160" y1="54" x2="90" y2="90" stroke="#FF4D20" strokeWidth="1.5" opacity="0.7"/>
        <line x1="160" y1="54" x2="230" y2="90" stroke="#FF4D20" strokeWidth="1.5" opacity="0.7"/>
        <line x1="90" y1="124" x2="50" y2="162" stroke="#FF4D20" strokeWidth="1.2" opacity="0.5"/>
        <line x1="90" y1="124" x2="125" y2="162" stroke="#FF4D20" strokeWidth="1.2" opacity="0.5"/>
        <line x1="230" y1="124" x2="195" y2="162" stroke="#FF4D20" strokeWidth="1.2" opacity="0.5"/>
        <line x1="230" y1="124" x2="270" y2="162" stroke="#FF4D20" strokeWidth="2" opacity="0.8"/>
        {/* Highlight best path */}
        <path d="M160 54 L230 90 L270 162" stroke="#FF4D20" strokeWidth="2.5" strokeDasharray="0" opacity="0.4" fill="none"/>
        {/* Score badge */}
        <circle cx="270" cy="210" r="16" fill="#FF4D20"/>
        <text x="270" y="215" fontSize="10" fill="white" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">★ 1</text>
      </svg>
    );
  }

  // ── TRAINING ─────────────────────────────────────────────────────────────
  if (cat.includes("training")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FF4D20" stopOpacity="0.5"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0"/></linearGradient>
        </defs>
        {/* Axes */}
        <line x1="50" y1="30" x2="50" y2="200" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <line x1="50" y1="200" x2="290" y2="200" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        {/* Axis labels */}
        <text x="30" y="120" fontSize="9" fill="#FF4D20" opacity="0.7" fontFamily="sans-serif" transform="rotate(-90,30,120)">Loss</text>
        <text x="170" y="220" fontSize="9" fill="#FF4D20" opacity="0.7" fontFamily="sans-serif" textAnchor="middle">Epoch</text>
        {/* Loss curve - training */}
        <path d="M55 170 C80 170 100 140 130 100 C160 62 200 52 280 40" stroke="#FF4D20" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Area under curve */}
        <path d="M55 170 C80 170 100 140 130 100 C160 62 200 52 280 40 L280 200 L55 200 Z" fill="url(#lossGrad)"/>
        {/* Validation curve (dashed) */}
        <path d="M55 175 C80 165 110 130 140 110 C170 90 210 85 280 80" stroke="#FF4D20" strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.5" strokeLinecap="round"/>
        {/* Epoch markers */}
        {[90,140,190,240].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="196" x2={x} y2="204" stroke="#FF4D20" strokeWidth="1.5" opacity="0.5"/>
            <text x={x} y="215" fontSize="8" fill="#FF4D20" opacity="0.6" textAnchor="middle" fontFamily="sans-serif">{(i + 1) * 5}</text>
          </g>
        ))}
        {/* Checkpoints */}
        <circle cx="130" cy="100" r="6" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="200" cy="54" r="6" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="280" cy="40" r="8" fill="#FF4D20"/>
        {/* Legend */}
        <line x1="60" y1="30" x2="80" y2="30" stroke="#FF4D20" strokeWidth="2"/>
        <text x="85" y="34" fontSize="8" fill="#FF4D20" fontFamily="sans-serif">Train</text>
        <line x1="120" y1="30" x2="140" y2="30" stroke="#FF4D20" strokeWidth="2" strokeDasharray="4 3"/>
        <text x="145" y="34" fontSize="8" fill="#FF4D20" fontFamily="sans-serif" opacity="0.7">Valid</text>
        {/* Best model star */}
        <text x="280" y="28" fontSize="12" fill="#FF4D20" textAnchor="middle">★</text>
      </svg>
    );
  }

  // ── OPTIMIZATION ─────────────────────────────────────────────────────────
  if (cat.includes("optimization") || cat.includes("optimis")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <radialGradient id="landscapeGrad" cx="60%" cy="40%" r="60%"><stop stopColor="#FF4D20" stopOpacity="0.2"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0"/></radialGradient>
        </defs>
        {/* Loss landscape contour lines */}
        <ellipse cx="160" cy="130" rx="130" ry="90" fill="url(#landscapeGrad)" stroke="#FF4D20" strokeWidth="1" opacity="0.3"/>
        <ellipse cx="160" cy="130" rx="95" ry="65" stroke="#FF4D20" strokeWidth="1" fill="none" opacity="0.35"/>
        <ellipse cx="160" cy="130" rx="62" ry="42" stroke="#FF4D20" strokeWidth="1" fill="none" opacity="0.45"/>
        <ellipse cx="160" cy="130" rx="34" ry="24" stroke="#FF4D20" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <ellipse cx="160" cy="130" rx="14" ry="10" stroke="#FF4D20" strokeWidth="2" fill="#FF4D20" fillOpacity="0.2" opacity="0.9"/>
        {/* Gradient descent path */}
        <path d="M70 60 C90 75 110 85 120 100 C132 118 140 120 152 125" stroke="#FF4D20" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Steps arrows */}
        <circle cx="70" cy="60" r="6" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="105" cy="83" r="5" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="130" cy="104" r="5" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="148" cy="118" r="5" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        {/* Global minimum */}
        <circle cx="160" cy="130" r="9" fill="#FF4D20"/>
        <text x="160" y="134" fontSize="10" fill="white" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">★</text>
        {/* Labels */}
        <text x="72" y="52" fontSize="9" fill="#FF4D20" fontWeight="600" fontFamily="sans-serif">Start</text>
        <text x="168" y="148" fontSize="9" fill="#FF4D20" fontWeight="700" fontFamily="sans-serif">Min</text>
        {/* Gradient arrows along path */}
        <text x="88" y="78" fontSize="12" fill="#FF4D20" opacity="0.7">→</text>
        <text x="118" y="97" fontSize="12" fill="#FF4D20" opacity="0.7">→</text>
        <text x="138" y="114" fontSize="12" fill="#FF4D20" opacity="0.7">→</text>
        {/* lr badge */}
        <rect x="224" y="40" width="70" height="28" rx="8" fill="white" stroke="#FF4D20" strokeWidth="1.5"/>
        <text x="259" y="59" fontSize="10" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">lr = 0.001</text>
      </svg>
    );
  }

  // ── INFERENCE ────────────────────────────────────────────────────────────
  if (cat.includes("inference")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <linearGradient id="kvGrad" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#FF4D20" stopOpacity="0.1"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0.4"/></linearGradient>
        </defs>
        {/* KV Cache grid */}
        <text x="80" y="28" fontSize="11" fill="#FF4D20" fontWeight="700" fontFamily="sans-serif" opacity="0.8">KV Cache</text>
        {[0,1,2,3,4,5].map(row =>
          [0,1,2,3,4,5,6,7].map(col => (
            <rect key={`${row}-${col}`} x={40 + col * 32} y={38 + row * 22} width="28" height="18" rx="4"
              fill={row < 4 && col < 6 ? "#FF4D20" : "white"}
              fillOpacity={row < 4 && col < 6 ? 0.12 + (col * 0.04) : 1}
              stroke="#FF4D20" strokeWidth="1" opacity={row < 4 && col < 6 ? 1 : 0.3}/>
          ))
        )}
        {/* Speed bolt */}
        <path d="M230 140 L255 100 L245 100 L265 60 L238 105 L250 105 Z" fill="#FF4D20" opacity="0.85"/>
        {/* Latency bar */}
        <rect x="40" y="180" width="240" height="14" rx="7" fill="#FF4D20" fillOpacity="0.1" stroke="#FF4D20" strokeWidth="1"/>
        <rect x="40" y="180" width="80" height="14" rx="7" fill="#FF4D20"/>
        <text x="160" y="192" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">TTFT: 12ms ⚡</text>
        {/* Tokens per second */}
        <text x="160" y="218" fontSize="10" fill="#FF4D20" fontWeight="600" textAnchor="middle" fontFamily="sans-serif" opacity="0.7">8,000 tokens/s</text>
      </svg>
    );
  }

  // ── RETRIEVAL ────────────────────────────────────────────────────────────
  if (cat.includes("retrieval")) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
        <defs>
          <radialGradient id="vecGrad" cx="50%" cy="50%" r="50%"><stop stopColor="#FF4D20" stopOpacity="0.2"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0"/></radialGradient>
        </defs>
        {/* Search bar */}
        <rect x="40" y="20" width="240" height="36" rx="18" fill="white" stroke="#FF4D20" strokeWidth="2"/>
        <circle cx="64" cy="38" r="9" stroke="#FF4D20" strokeWidth="2" fill="none"/>
        <line x1="70" y1="44" x2="78" y2="52" stroke="#FF4D20" strokeWidth="2" strokeLinecap="round"/>
        <text x="90" y="43" fontSize="11" fill="#FF4D20" fontWeight="600" fontFamily="sans-serif">What is attention?</text>
        {/* Vector space dots */}
        {[
          [100,110,10],[180,90,7],[220,130,9],[140,150,8],[80,155,6],
          [240,90,5],[160,115,12],[110,80,6],[200,160,7],[130,175,5]
        ].map(([cx,cy,r],i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill={i===6?"#FF4D20":"white"} stroke="#FF4D20"
            strokeWidth={i===6?0:1.5} fillOpacity={i===6?1:0.8} opacity={0.5+i*0.05}/>
        ))}
        {/* Query vector (highlighted) */}
        <circle cx="160" cy="115" r="13" fill="#FF4D20"/>
        <text x="160" y="119" fontSize="9" fill="white" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Q</text>
        {/* Similarity lines to nearest neighbors */}
        <line x1="160" y1="115" x2="180" y2="90" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7"/>
        <line x1="160" y1="115" x2="140" y2="150" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>
        <line x1="160" y1="115" x2="100" y2="110" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5"/>
        {/* Retrieved docs */}
        <rect x="42" y="195" width="70" height="35" rx="6" fill="white" stroke="#FF4D20" strokeWidth="1.5"/>
        <rect x="46" y="202" width="50" height="5" rx="2" fill="#FF4D20" fillOpacity="0.5"/>
        <rect x="46" y="211" width="40" height="5" rx="2" fill="#FF4D20" fillOpacity="0.3"/>
        <rect x="46" y="220" width="30" height="5" rx="2" fill="#FF4D20" fillOpacity="0.2"/>
        <rect x="126" y="195" width="70" height="35" rx="6" fill="white" stroke="#FF4D20" strokeWidth="1.5"/>
        <rect x="130" y="202" width="50" height="5" rx="2" fill="#FF4D20" fillOpacity="0.5"/>
        <rect x="130" y="211" width="40" height="5" rx="2" fill="#FF4D20" fillOpacity="0.3"/>
        <rect x="130" y="220" width="30" height="5" rx="2" fill="#FF4D20" fillOpacity="0.2"/>
        <rect x="210" y="195" width="70" height="35" rx="6" fill="white" stroke="#FF4D20" strokeWidth="1.5"/>
        <rect x="214" y="202" width="50" height="5" rx="2" fill="#FF4D20" fillOpacity="0.5"/>
        <rect x="214" y="211" width="40" height="5" rx="2" fill="#FF4D20" fillOpacity="0.3"/>
        <rect x="214" y="220" width="30" height="5" rx="2" fill="#FF4D20" fillOpacity="0.2"/>
        {/* Cosine similarity badge */}
        <circle cx="180" cy="90" r="14" fill="#FF4D20" fillOpacity="0.15" stroke="#FF4D20" strokeWidth="1"/>
        <text x="180" y="94" fontSize="8" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">0.94</text>
      </svg>
    );
  }

  // ── GENERAL / LLM / DEFAULT ───────────────────────────────────────────────
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[300px]">
      <defs>
        <radialGradient id="brainGrad" cx="50%" cy="50%" r="50%"><stop stopColor="#FF4D20" stopOpacity="0.18"/><stop offset="1" stopColor="#FF4D20" stopOpacity="0"/></radialGradient>
        <filter id="glow3"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Outer brain silhouette */}
      <path d="M160 30 C100 30 62 68 58 110 C54 145 68 168 88 178 C92 200 108 218 130 218 C142 218 152 212 160 204 C168 212 178 218 190 218 C212 218 228 200 232 178 C252 168 266 145 262 110 C258 68 220 30 160 30 Z"
        fill="url(#brainGrad)" stroke="#FF4D20" strokeWidth="2"/>
      {/* Brain folds */}
      <path d="M100 80 Q120 68 140 80 Q155 90 145 108" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M175 78 Q195 65 212 82 Q222 96 210 112" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M78 128 Q92 118 108 128 Q120 136 114 150" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M210 130 Q224 120 238 132 Q245 145 232 156" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M130 155 Q148 142 168 155 Q178 165 165 178" stroke="#FF4D20" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Central divider */}
      <path d="M160 42 Q164 88 160 130 Q156 172 160 205" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="5 4" fill="none" opacity="0.35"/>
      {/* Neural spark dots */}
      {[[110,95],[205,92],[88,148],[232,146],[148,170],[172,170],[160,120]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i===6?6:4} fill="#FF4D20" filter="url(#glow3)" opacity={i===6?1:0.7}/>
      ))}
      {/* Connection lines between sparks */}
      <line x1="110" y1="95" x2="160" y2="120" stroke="#FF4D20" strokeWidth="1.2" opacity="0.4"/>
      <line x1="205" y1="92" x2="160" y2="120" stroke="#FF4D20" strokeWidth="1.2" opacity="0.4"/>
      <line x1="88" y1="148" x2="148" y2="170" stroke="#FF4D20" strokeWidth="1.2" opacity="0.3"/>
      <line x1="232" y1="146" x2="172" y2="170" stroke="#FF4D20" strokeWidth="1.2" opacity="0.3"/>
      <line x1="148" y1="170" x2="160" y2="120" stroke="#FF4D20" strokeWidth="1.2" opacity="0.35"/>
      <line x1="172" y1="170" x2="160" y2="120" stroke="#FF4D20" strokeWidth="1.2" opacity="0.35"/>
      {/* Floating token boxes */}
      <rect x="24" y="60" width="50" height="22" rx="6" fill="white" stroke="#FF4D20" strokeWidth="1.5"/>
      <text x="49" y="75" fontSize="9" fill="#FF4D20" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">INPUT</text>
      <line x1="74" y1="71" x2="100" y2="90" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
      <rect x="246" y="60" width="50" height="22" rx="6" fill="#FF4D20"/>
      <text x="271" y="75" fontSize="9" fill="white" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">OUTPUT</text>
      <line x1="246" y1="71" x2="215" y2="90" stroke="#FF4D20" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6"/>
    </svg>
  );
}

export default async function MethodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  
  let methodDetail;
  try {
    methodDetail = await getMethodBySlug(resolvedParams.slug);
  } catch (error: any) {
    if (error.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error("Error fetching method:", error);
  }

  if (!methodDetail) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] text-slate-900 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`body { overflow: hidden !important; }`}</style>
        <Navbar />
        <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-12 text-center text-slate-900 mt-20">Method not found. Please try another one.</div>
        </div>
      </div>
    );
  }

  const categoryName = methodDetail.category || methodDetail.categoryName || "Methods";
  const actualPaperCount = methodDetail.paperCount ?? methodDetail.papers?.length ?? 0;
  
  const iconName = ICON_MAP[categoryName] || "FileText";
  const DynamicIcon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ElementType || FileText;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa] text-slate-900 antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`body { overflow: hidden !important; }`}</style>
      <Navbar />

      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <main className="max-w-7xl mx-auto px-5 lg:px-6 py-6 lg:py-8 w-full">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mb-6 lg:mb-8">
          <Link href="/" className="hover:text-gray-800">Home</Link>
          <span>›</span>
          <Link href="/methods" className="hover:text-gray-800">{categoryName}</Link>
          <span>›</span>
          <span className="text-orange-600 font-medium">{methodDetail.name}</span>
        </nav>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 lg:mb-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 mb-3 lg:mb-4 tracking-widest uppercase">
              <div className="p-1 lg:p-1.5 bg-orange-50 lg:bg-transparent lg:border lg:border-orange-200 rounded lg:rounded-md">
                <DynamicIcon className="w-4 h-4 lg:w-3 lg:h-3" strokeWidth={2.5} />
              </div>
              Method
            </div>
            
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-slate-800 leading-tight">
              {methodDetail.name}
            </h1>
            
            <p className="text-sm lg:text-lg text-gray-500 leading-relaxed max-w-2xl mb-8 lg:mb-10">
              {methodDetail.description || `${methodDetail.name} is an advanced artificial intelligence system that learns to process human language by being trained on vast amounts of text data.`}
            </p>
            
            {/* Metrics Widget */}
            <div className="inline-flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="bg-orange-50 p-3 rounded-lg mr-2 lg:mr-0">
                <DynamicIcon className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Papers Using</div>
                <div className="text-2xl lg:text-3xl font-bold text-orange-600">{actualPaperCount.toLocaleString()}</div>
              </div>
            </div>
          </div>
          

          {/* Hero Illustration — desktop only, hidden on mobile to save space */}
          <div className="hidden lg:block lg:col-span-5 w-full mt-2 lg:mt-0">
            <div className="bg-orange-50/30 border border-orange-100 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden aspect-[1.4/1]">
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <CategorySVG category={categoryName} />
              </div>
              <a
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-orange-600 text-sm font-medium hover:underline z-10"
                href={methodDetail.sourceUrl || "https://arxiv.org"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
                {methodDetail.sourceUrl ? methodDetail.sourceUrl.replace(/^https?:\/\//, '') : `arxiv.org/search/?query=${encodeURIComponent(methodDetail.name)}`}
              </a>
            </div>
          </div>
        </section>


        {/* Interactive Filter Bar + Paper List — handled by client component */}
        <MethodFilteredPapers
          papers={methodDetail.papers ?? []}
          methodName={methodDetail.name}
        />
      </main>
      </div>
    </div>
  );
}

