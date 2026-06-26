"use client";

import React, { useState } from "react";
import { PAPERS, Paper } from "./PapersData";
import Link from "next/link";

const TABS = ["Today", "This Week", "This Month", "All time"];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  blue:   { bg: "#dbeafe", text: "#1d4ed8" },
  purple: { bg: "#ede9fe", text: "#7c3aed" },
  green:  { bg: "#d1fae5", text: "#065f46" },
  orange: { bg: "#ffedd5", text: "#9a3412" },
  gray:   { bg: "#f3f4f6", text: "#374151" },
  yellow: { bg: "#fef9c3", text: "#92400e" },
  red:    { bg: "#fee2e2", text: "#991b1b" },
};

function IsometricIllustration() {
  const IsoOutlineCube = ({ cx, cy, w, fh, stroke = "#F0B0A8", sw = 1, opacity = 1 }: {
    cx: number; cy: number; w: number; fh: number; stroke?: string; sw?: number; opacity?: number
  }) => {
    const th = w * 0.5;
    const top = `${cx},${cy}`, right = `${cx+w},${cy+th}`, bottom = `${cx},${cy+th*2}`, left = `${cx-w},${cy+th}`;
    const leftBot = `${cx-w},${cy+th+fh}`, rightBot = `${cx+w},${cy+th+fh}`, centBot = `${cx},${cy+th*2+fh}`;
    return (
      <g fill="none" stroke={stroke} strokeWidth={sw} opacity={opacity}>
        <polygon points={`${top} ${right} ${bottom} ${left}`} />
        <polygon points={`${left} ${bottom} ${centBot} ${leftBot}`} />
        <polygon points={`${right} ${bottom} ${centBot} ${rightBot}`} />
      </g>
    );
  };
  const SolidSlab = ({ cx, cy, w, th, sh, topColor, sideColorL, sideColorR }: {
    cx: number; cy: number; w: number; th: number; sh: number; topColor: string; sideColorL: string; sideColorR: string
  }) => {
    const t=`${cx},${cy}`, r=`${cx+w},${cy+th}`, b=`${cx},${cy+th*2}`, l=`${cx-w},${cy+th}`;
    const lb=`${cx-w},${cy+th+sh}`, rb=`${cx+w},${cy+th+sh}`, cb=`${cx},${cy+th*2+sh}`;
    return (
      <g>
        <polygon points={`${l} ${b} ${cb} ${lb}`} fill={sideColorL} />
        <polygon points={`${r} ${b} ${cb} ${rb}`} fill={sideColorR} />
        <polygon points={`${t} ${r} ${b} ${l}`} fill={topColor} />
      </g>
    );
  };
  const GW=36, GH=28, GTH=GW*0.5, gOX=290, gOY=88;
  const stepRight={x:GW,y:GTH}, stepDown={x:-GW,y:GTH};
  const ghosts=[
    {col:-1,row:-1,op:0.25},{col:0,row:-1,op:0.28},{col:1,row:-1,op:0.25},
    {col:-1,row:0,op:0.38},{col:0,row:0,op:0.44},{col:1,row:0,op:0.40},
    {col:-1,row:1,op:0.50},{col:0,row:1,op:0.58},{col:1,row:1,op:0.52},
  ];
  const stackCX=gOX, stackBottomY=gOY-6, SW=32, STH=10, SSH=5, SGAP=4;
  const slabStep=STH*2+SSH+SGAP;
  const slabs=[{topColor:"#E04030",sideL:"#B82A22",sideR:"#9A221A"}];
  const capColor={topColor:"#8B1A0A",sideL:"#5C0800",sideR:"#4A0600"};
  const isoX=gOX+3.2*stepRight.x+0.4*stepDown.x, isoY=gOY+3.2*stepRight.y+0.4*stepDown.y;
  return (
    <svg viewBox="0 0 480 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full max-w-[540px] h-auto">
      <defs>
        <pattern id="dg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.9" fill="#E09090" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="480" height="210" fill="url(#dg)" />
      {ghosts.map((g,i) => {
        const cx=gOX+g.col*stepRight.x+g.row*stepDown.x, cy=gOY+g.col*stepRight.y+g.row*stepDown.y;
        return <IsoOutlineCube key={i} cx={cx} cy={cy} w={GW} fh={GH} stroke="#E8A098" sw={0.9} opacity={g.op} />;
      })}
      <IsoOutlineCube cx={isoX} cy={isoY} w={GW*0.88} fh={GH*0.88} stroke="#E8A098" sw={0.9} opacity={0.45} />
      {slabs.map((s,i) => (
        <SolidSlab key={i} cx={stackCX} cy={stackBottomY-i*slabStep} w={SW} th={STH} sh={SSH}
          topColor={s.topColor} sideColorL={s.sideL} sideColorR={s.sideR} />
      ))}
      <SolidSlab cx={stackCX} cy={stackBottomY-slabs.length*slabStep} w={SW} th={STH} sh={4}
        topColor={capColor.topColor} sideColorL={capColor.sideL} sideColorR={capColor.sideR} />
      <SolidSlab cx={stackCX} cy={stackBottomY+slabStep+10} w={14} th={6} sh={10}
        topColor="#E8442A" sideColorL="#A02018" sideColorR="#801810" />
    </svg>
  );
}

function HeroSection({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className="bg-gradient-to-r from-white via-[#fff5f4] to-[#ffeeec] pt-5 pb-0 pl-0 lg:pl-6 mb-5 overflow-hidden">
      <div className="flex items-center justify-between h-auto min-h-[120px] lg:h-[148px] flex-col lg:flex-row gap-2 lg:gap-0">
        <div className="flex-none text-center lg:text-left w-full lg:w-auto px-4 lg:px-0">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
            Discover <span className="text-[#E8442A]">AI Research</span>
          </h1>
          <p className="text-sm lg:text-base text-gray-500 leading-relaxed m-0">
            Explore the latest papers, methods, and breakthroughs<br className="hidden lg:inline" />
            from the world&apos;s AI research community.
          </p>
        </div>
        <div className="flex-1 h-full overflow-hidden pointer-events-none select-none hidden lg:flex items-center justify-end">
          <IsometricIllustration />
        </div>
      </div>
      <div className="inline-flex border border-gray-200 rounded-[10px] bg-white overflow-hidden w-full lg:w-auto mt-3 lg:mt-0 px-4 lg:px-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`py-[7px] flex-1 lg:flex-none text-center lg:text-left text-xs lg:text-[13.5px] cursor-pointer transition-colors duration-150 border-b-2 bg-transparent ${
              active === tab
                ? "font-semibold text-[#E8442A] border-[#E8442A]"
                : "font-normal text-gray-500 border-transparent"
            } ${i < TABS.length - 1 ? "border-r border-gray-200" : ""} lg:px-[22px] px-3`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaperThumbnail({ thumbUrl, href }: { thumbUrl: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open paper"
      className="w-full md:w-[180px] md:min-w-[200px] self-stretch rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 bg-gray-50 order-1 md:order-none group"
    >
      <img
        src={thumbUrl}
        alt="Paper thumbnail"
        className="w-full h-full object-cover min-h-[180px] md:min-h-0 transition-transform duration-300 ease-out group-hover:scale-[1.05]"
        loading="lazy"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.style.display = "none";
          const p = t.parentElement;
          if (p) p.innerHTML = `<div style="width:100%;height:100%;min-height:200px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:11px;">Preview</div>`;
        }}
      />
    </Link>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  const c = TAG_COLORS[color] ?? TAG_COLORS.gray;
  return (
    <a
      href="#"
      className="inline-flex items-center h-[25px] text-[12px] font-medium px-2.5 rounded whitespace-nowrap transition-opacity hover:opacity-80"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {label}
    </a>
  );
}

function MethodChip({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="inline-flex items-center h-[25px] text-[12px] text-gray-600 bg-gray-50 border border-gray-200 px-2.5 rounded whitespace-nowrap transition-opacity hover:opacity-80"
    >
      {label}
    </a>
  );
}

function SotaRow({ benchmarks, rank, rankLabel, extra }: { benchmarks: string[]; rank: string; rankLabel: string; extra: string }) {
  if (benchmarks.length === 0 && !rank) return null;
  return (
    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1">
      {benchmarks.length > 0 && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium py-[2px] px-2 rounded bg-amber-50 text-amber-800 whitespace-nowrap">
          🏆 SOTA on
        </span>
      )}
      {benchmarks.map((b, i) => (
        <a key={b} href="#" className="text-blue-600 text-[11px] font-medium no-underline whitespace-nowrap hover:underline">
          {b}{i < benchmarks.length - 1 ? "," : ""}
        </a>
      ))}
      {rank && (
        <>
          {benchmarks.length > 0 && <span className="text-gray-300 text-xs mx-px">·</span>}
          <span className="inline-flex items-center gap-[3px] text-[11px] font-medium py-[2px] px-2 rounded bg-emerald-50 text-emerald-800 whitespace-nowrap">
            <svg viewBox="0 0 16 16" fill="#10b981" className="w-2.5 h-2.5">
              <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
            #{rank} on
          </span>
          <a href="#" className="text-blue-600 text-[11px] font-medium no-underline whitespace-nowrap hover:underline">{rankLabel}</a>
        </>
      )}
      {extra && <a href="#" className="text-gray-400 text-[11px] no-underline whitespace-nowrap hover:underline">{extra}</a>}
    </div>
  );
}

function StatItem({ icon, value, label, accent }: { icon: React.ReactNode; value: string | number; label: string; accent?: boolean }) {
  return (
    <a href="#" className="flex flex-col items-end gap-0.5 w-full py-3 border-b border-gray-100 last:border-b-0 transition-opacity hover:opacity-80">
      <div className={`flex items-center gap-1.5 ${accent ? "text-[#E8442A]" : "text-gray-700"}`}>
        {icon}
        <span className="font-semibold text-[15px] leading-none">{value}</span>
      </div>
      <span className="text-[11px] text-gray-400 leading-none">{label}</span>
    </a>
  );
}

function PaperCard(p: Paper) {
  const paperUrl = (p as any).arxivUrl ?? "#";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-7 flex flex-col md:flex-row gap-6 items-stretch transition-shadow duration-150 hover:shadow-md hover:shadow-gray-100 min-h-[300px]">

      <PaperThumbnail thumbUrl={p.thumbUrl} href={paperUrl} />

      <div className="flex-1 min-w-0 order-2 md:order-1 flex flex-col">

        <div>
          <Link
            href={paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-block"
          >
            <h3
              className="font-semibold text-[21px] text-gray-900 leading-snug mb-1.5 transition-colors group-hover:text-[#E8442A]"
            >
              {p.title}
            </h3>
          </Link>
          <p className="text-[13.5px] text-gray-400 mb-2.5">
            {p.showAuthors ? `${p.authors} · ${p.date}` : p.date}
          </p>
          <p
            className="text-[14.5px] text-gray-600 leading-relaxed"
            style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {p.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <SotaRow
            benchmarks={p.sotaBenchmarks}
            rank={p.sotaRank}
            rankLabel={p.sotaRankLabel}
            extra={p.sotaExtra}
          />
          {p.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {p.tags.map(t => <Tag key={t.label} label={t.label} color={t.color} />)}
            </div>
          )}
          {p.methods.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {p.methods.map(m => <MethodChip key={m} label={m} />)}
            </div>
          )}
        </div>

      </div>

      <div className="hidden md:flex flex-shrink-0 items-center order-3" style={{ width: "200px" }}>
        <div className="flex flex-col items-stretch w-[80px] border-l border-gray-200 pl-5">
          <StatItem
            icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>}
            value={p.upvotes} label="Upvotes" accent
          />
          <StatItem
            icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-500"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>}
            value={p.repos} label="Repo"
          />
          <StatItem
            icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-500"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12z"/></svg>}
            value={p.citations} label="Citations"
          />
        </div>
      </div>

      <div className="flex md:hidden flex-row items-stretch justify-start gap-6 order-3 pt-2 border-t border-gray-100">
        <StatItem
          icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/></svg>}
          value={p.upvotes} label="Upvotes" accent
        />
        <StatItem
          icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-500"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>}
          value={p.repos} label="Repo"
        />
        <StatItem
          icon={<svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-500"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12z"/></svg>}
          value={p.citations} label="Citations"
        />
      </div>
    </div>
  );
}

export default function ResearchHomePage() {
  const [activeTab, setActiveTab] = useState("Today");
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[1200px] mx-auto md:px-14 pb-8 lg:pb-12 px-4">
        <HeroSection active={activeTab} setActive={setActiveTab} />
        <div className="flex flex-col gap-3">
          {PAPERS.map(p => <PaperCard key={p.title} {...p} />)}
        </div>
      </div>
    </div>
  );
}