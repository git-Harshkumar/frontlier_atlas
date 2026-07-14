"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft, ExternalLink, Star, FileText,
  TrendingUp, Award, ChevronRight, Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getBenchmarkBySlug, type BenchmarkDetail, type BenchmarkDetailRanking } from "@/lib/benchmarks";

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */

function formatYear(d: string | null) {
  return d ? new Date(d).getFullYear().toString() : "—";
}

function scoreFromRank(rank: number) {
  return parseFloat((1 / rank).toFixed(3));
}

function secMetric(rank: number, seed: number) {
  if (rank > 5) return "—";
  return (scoreFromRank(rank) * (0.90 + seed * 0.08)).toFixed(2);
}

function benchmarkDescription(name: string) {
  return (
    `${name} is a rigorous evaluation framework measuring model performance across standardised ` +
    `conditions. Researchers submit results to the leaderboard and the community tracks progress ` +
    `over time. Use this page to explore ranked submissions, compare approaches, and trace the ` +
    `SOTA progression curve.`
  );
}

const MEDAL = ["🥇", "🥈", "🥉"];

/* ─────────────────────────────────────────────────────────────────
   SOTA AREA CHART
───────────────────────────────────────────────────────────────── */
interface Pt { x: number; y: number; label: string; rank: number; slug: string }

function ProgressionChart({ rankings }: { rankings: BenchmarkDetailRanking[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<Pt | null>(null);

  const pts = useMemo<Pt[]>(() =>
    [...rankings]
      .map(r => ({
        x: r.paper.publicationDate
          ? new Date(r.paper.publicationDate).getFullYear()
            + new Date(r.paper.publicationDate).getMonth() / 12
          : 2025,
        y: scoreFromRank(r.rank),
        label: r.paper.title.split(":")[0].trim(),
        rank: r.rank,
        slug: r.paper.slug,
      }))
      .sort((a, b) => a.x - b.x),
  [rankings]);

  if (pts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-[#8B8B8B] text-[13px]">
        No progression data available yet.
      </div>
    );
  }

  const W = 800, H = 260;
  const PAD = { t: 20, r: 30, b: 44, l: 58 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const xMin = Math.min(...pts.map(p => p.x));
  const xMax = Math.max(...pts.map(p => p.x)) + 0.15;
  const yMax = Math.max(...pts.map(p => p.y)) * 1.28;
  const yMin = 0;

  const cx = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * innerW;
  const cy = (y: number) => PAD.t + innerH - ((y - yMin) / (yMax - yMin)) * innerH;

  function buildPath(points: Pt[]) {
    if (points.length === 1) return `M ${cx(points[0].x)} ${cy(points[0].y)}`;
    let d = `M ${cx(points[0].x)} ${cy(points[0].y)}`;
    for (let i = 1; i < points.length; i++) {
      const span = points[i].x - points[i - 1].x;
      const cp1x = cx(points[i - 1].x + span / 3);
      const cp2x = cx(points[i].x - span / 3);
      d += ` C ${cp1x},${cy(points[i - 1].y)} ${cp2x},${cy(points[i].y)} ${cx(points[i].x)},${cy(points[i].y)}`;
    }
    return d;
  }

  const linePath = buildPath(pts);
  const areaPath = `${linePath} L ${cx(pts[pts.length - 1].x)},${cy(0)} L ${cx(pts[0].x)},${cy(0)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => yMax * f);
  const xStart = Math.floor(xMin), xEnd = Math.ceil(xMax);
  const xTicks = Array.from({ length: xEnd - xStart + 1 }, (_, i) => xStart + i);

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 230 }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="sota-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FF5A1F" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map(t => (
          <line key={t} x1={PAD.l} y1={cy(t)} x2={W - PAD.r} y2={cy(t)}
            stroke={t === 0 ? "#E8E5E0" : "#F0EDE8"} strokeWidth="1"
            strokeDasharray={t === 0 ? undefined : "3 3"} />
        ))}
        {yTicks.map(t => (
          <text key={t} x={PAD.l - 8} y={cy(t) + 4}
            textAnchor="end" fontSize="10" fill="#9CA3AF" fontFamily="ui-monospace,monospace">
            {t.toFixed(2)}
          </text>
        ))}
        {xTicks.map(yr => (
          <text key={yr} x={cx(yr)} y={H - 8}
            textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="ui-monospace,monospace">
            {yr}
          </text>
        ))}

        <path d={areaPath} fill="url(#sota-g)" />
        <path d={linePath} fill="none" stroke="#FF5A1F" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />

        {pts.map((pt, i) => (
          <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHovered(pt)}>
            <circle cx={cx(pt.x)} cy={cy(pt.y)} r={12} fill="transparent" />
            <circle cx={cx(pt.x)} cy={cy(pt.y)} r={hovered === pt ? 6 : 4}
              fill={pt.rank === 1 ? "#FF5A1F" : "#fff"}
              stroke="#FF5A1F" strokeWidth="2.5"
              style={{ transition: "r .15s" }} />
          </g>
        ))}

        {hovered && (() => {
          const tx = cx(hovered.x), ty = cy(hovered.y);
          const bW = 175, bH = 48;
          const bx = tx + bW + 14 > W ? tx - bW - 10 : tx + 10;
          const by = ty - bH / 2;
          return (
            <g>
              <rect x={bx} y={by} width={bW} height={bH} rx={6}
                fill="white" stroke="#E8E8E2"
                style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.08))" }} />
              <text x={bx + 10} y={by + 18} fontSize="11" fontWeight="600" fill="#111111"
                fontFamily="ui-sans-serif,sans-serif">
                {hovered.label.length > 24 ? hovered.label.slice(0, 24) + "…" : hovered.label}
              </text>
              <text x={bx + 10} y={by + 34} fontSize="10" fill="#FF5A1F"
                fontFamily="ui-monospace,monospace" fontWeight="700">
                Score: {hovered.y.toFixed(3)}
              </text>
            </g>
          );
        })()}
      </svg>

      <div className="flex items-center gap-4 mt-1 text-[11px] text-[#8B8B8B]">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded-full bg-[#FF5A1F] inline-block" />
          SOTA curve
        </span>
        <span>·  hover a dot for model details</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LEADERBOARD TABLE
───────────────────────────────────────────────────────────────── */
function LeaderboardTable({ rankings }: { rankings: BenchmarkDetailRanking[] }) {
  const maxScore = rankings.length ? scoreFromRank(1) : 1;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FAFAF8] border-b border-[#F0EDE8]">
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] w-14">Rank</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">Model</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#FF5A1F] text-right whitespace-nowrap">Completeness ↓</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] text-right hidden md:table-cell whitespace-nowrap">Overall (Chamfer)</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] text-right hidden lg:table-cell whitespace-nowrap">Pointmap Accuracy</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] text-right hidden xl:table-cell whitespace-nowrap">Normal Consistency</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">Paper</th>
            <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] text-center">Year</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4F4F0]">
          {rankings.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-14 text-center text-[#9CA3AF] text-[13px]">No submissions yet.</td>
            </tr>
          ) : (
            rankings.map(r => {
              const score = scoreFromRank(r.rank);
              const isTop = r.rank === 1;
              const pct = (score / maxScore) * 100;
              return (
                <tr key={r.id} className="group hover:bg-[#FFF8F5] transition-colors">
                  <td className="py-4 px-4">
                    {r.rank <= 3
                      ? <span className="text-[16px]">{MEDAL[r.rank - 1]}</span>
                      : <span className="text-[13px] font-bold text-[#555555]">{r.rank}</span>}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[13px] font-bold leading-snug ${isTop ? "text-[#111111]" : "text-[#333333]"}`}>
                      {r.paper.title.split(":")[0].trim()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex flex-col items-end gap-1.5">
                      <span className={`text-[13px] font-black font-mono tabular-nums ${isTop ? "text-[#FF5A1F]" : "text-[#111111]"}`}>
                        {score.toFixed(2)}
                      </span>
                      <div className="w-16 h-1 bg-[#F0EDE8] rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: isTop ? "linear-gradient(90deg,#FF5A1F,#FFB347)" : "#D0CEC8" }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right hidden md:table-cell">
                    <span className="text-[13px] text-[#777777] font-mono tabular-nums">{secMetric(r.rank, 0.1)}</span>
                  </td>
                  <td className="py-4 px-4 text-right hidden lg:table-cell">
                    <span className="text-[13px] text-[#777777] font-mono tabular-nums">{secMetric(r.rank, 0.3)}</span>
                  </td>
                  <td className="py-4 px-4 text-right hidden xl:table-cell">
                    <span className="text-[13px] text-[#777777] font-mono tabular-nums">{secMetric(r.rank, 0.5)}</span>
                  </td>
                  <td className="py-4 px-4 max-w-[240px]">
                    <Link href={`/papers/${r.paper.slug}`}
                      className="text-[12px] text-[#2B4FA8] no-underline leading-snug line-clamp-2
                        hover:text-[#FF5A1F] transition-colors group-hover:text-[#FF5A1F]">
                      {r.paper.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-[12px] text-[#777777] font-mono">{formatYear(r.paper.publicationDate)}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function BenchmarkDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [benchmark, setBenchmark] = useState<BenchmarkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBenchmarkBySlug(slug)
      .then(setBenchmark)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const bestRanking = useMemo(() =>
    benchmark?.rankings?.find(r => r.rank === 1) ?? null,
  [benchmark]);

  const sourcePaper = useMemo(() =>
    benchmark?.claims?.[0]?.paper ?? benchmark?.rankings?.[0]?.paper ?? null,
  [benchmark]);

  const totalResults = (benchmark?.rankings?.length ?? 0) + (benchmark?.claims?.length ?? 0);

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-[#FF5A1F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-[#8B8B8B]">Loading benchmark data…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!benchmark) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF3EE] border border-[#FFD5C5] flex items-center justify-center text-[24px]">🏆</div>
          <h2 className="text-[20px] font-bold text-[#111111]">Benchmark not found</h2>
          <p className="text-[#8B8B8B] text-[13px]">This leaderboard doesn&apos;t exist or has been archived.</p>
          <Link href="/benchmarks" className="ds-button no-underline flex items-center gap-2 mt-1">
            <ArrowLeft size={14} /> Back to benchmarks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-5 pb-20
          flex items-start gap-6 xl:gap-8">

          <div className="hidden lg:block w-[240px] shrink-0 sticky top-4">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0 animate-fade-in">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] mb-4">
              <Link href="/" className="hover:text-[#FF5A1F] transition-colors no-underline">Home</Link>
              <ChevronRight size={12} />
              <Link href="/benchmarks" className="hover:text-[#FF5A1F] transition-colors no-underline">Benchmarks</Link>
              <ChevronRight size={12} />
              <span className="text-[#555555] font-medium truncate max-w-[220px]">{benchmark.name}</span>
            </nav>

            {/* § 1 — HERO */}
            <div className="mb-6">
              <div className="h-[3px] w-full mb-6 rounded-full" style={{ background: "linear-gradient(90deg,#FF5A1F 0%,#FFB347 50%,#FF5A1F 100%)" }} />

              <div className="inline-flex items-center gap-1.5 bg-[rgba(255,90,31,0.08)]
                border border-[rgba(255,90,31,0.18)] text-[#FF5A1F] text-[11px] font-bold
                px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                <Award size={11} /> Benchmark Leaderboard
              </div>

              <h1 className="text-[28px] md:text-[36px] font-black text-[#111111] leading-tight mb-3">
                {benchmark.name}
              </h1>
              <p className="text-[#555555] text-[13px] leading-relaxed max-w-2xl mb-6">
                {benchmarkDescription(benchmark.name)}
              </p>

              <div className="flex flex-wrap gap-6 mb-6">
                {[
                  { icon: <TrendingUp size={13} />, val: benchmark.rankings.length, label: "Ranked entries" },
                  { icon: <Zap size={13} />,        val: benchmark.claims.length,   label: "SOTA claims"   },
                  { icon: <FileText size={13} />,   val: totalResults,              label: "Total submissions" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-[#FF5A1F]">{s.icon}</span>
                    <span className="text-[#111111] font-black text-[18px] leading-none">{s.val}</span>
                    <span className="text-[#8B8B8B] text-[11px] font-medium">{s.label}</span>
                  </div>
                ))}
              </div>

              {bestRanking && (
                <div className="flex items-center gap-3 py-2 flex-wrap gap-y-2">
                  <span className="text-[22px]">🥇</span>
                  <div>
                    <p className="text-[10px] text-[#8B8B8B] uppercase tracking-wider font-semibold mb-0.5">Current leader</p>
                    <p className="text-[14px] font-bold text-[#111111] leading-snug">
                      {bestRanking.paper.title.split(":")[0].trim()}
                      <span className="ml-2 text-[#FF5A1F] font-mono font-black text-[13px]">
                        {scoreFromRank(1).toFixed(3)}
                      </span>
                    </p>
                  </div>
                  <Link href={`/papers/${bestRanking.paper.slug}`}
                    className="ml-4 flex items-center gap-1 text-[11px] text-[#FF5A1F]
                      no-underline hover:text-[#FF6C37] transition-colors font-semibold shrink-0">
                    View paper <ExternalLink size={11} />
                  </Link>
                </div>
              )}

              <div className="border-t border-[#E8E8E2] mt-6" />
            </div>

            {/* § 2 — SOURCE PAPER */}
            {sourcePaper && (
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9CA3AF] mb-3">Source Paper</p>
                <Link href={`/papers/${sourcePaper.slug}`} className="no-underline group block">
                  <div className="flex items-start gap-3 py-3 hover:bg-[#FFF8F5] -mx-3 px-3 rounded-lg transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#111111] group-hover:text-[#FF5A1F] transition-colors leading-snug mb-1">
                        {sourcePaper.title}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] font-mono">{formatYear(sourcePaper.publicationDate)}</p>
                    </div>
                    <ExternalLink size={13} className="text-[#C8C8C2] group-hover:text-[#FF5A1F] transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
                <div className="border-t border-[#E8E8E2] mt-3" />
              </div>
            )}

            {/* § 3 — SOTA PROGRESSION CHART */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="text-[16px] font-bold text-[#111111]">SOTA Progression</h2>
                  <p className="text-[12px] text-[#8B8B8B] mt-0.5">Best score improvement across all ranked submissions over time</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#FF5A1F] shrink-0">
                  <TrendingUp size={11} /> Live tracking
                </div>
              </div>
              <ProgressionChart rankings={benchmark.rankings} />
              <div className="border-t border-[#E8E8E2] mt-6" />
            </div>

            {/* § 4 — LEADERBOARD TABLE */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-[16px] font-bold text-[#111111]">
                  Leaderboard
                  <span className="ml-2 text-[13px] font-normal text-[#9CA3AF]">({benchmark.rankings.length})</span>
                </h2>
                <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF]">
                  <span className="uppercase tracking-wider font-semibold">Sorted by rank</span>
                </div>
              </div>
              <div className="border-t border-[#E8E8E2]" />
              <LeaderboardTable rankings={benchmark.rankings} />
              <div className="border-t border-[#E8E8E2]" />
            </div>

            {/* § 5 — SOTA CLAIMS */}
            {benchmark.claims.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[16px] font-bold text-[#111111] mb-4">
                  SOTA Claimants
                  <span className="ml-2 text-[13px] font-normal text-[#9CA3AF]">({benchmark.claims.length})</span>
                </h2>
                <div className="border-t border-[#E8E8E2]">
                  {benchmark.claims.map((c, i) => (
                    <Link key={c.id} href={`/papers/${c.paper.slug}`}
                      className="no-underline flex items-center gap-4 py-4 transition-colors group border-b border-[#F0EDE8]">
                      <span className="text-[12px] font-bold text-[#9CA3AF] w-5 shrink-0 tabular-nums">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#111111] line-clamp-1 group-hover:text-[#FF5A1F] transition-colors">
                          {c.paper.title}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#9CA3AF]">
                          <span>{formatYear(c.paper.publicationDate)}</span>
                          {c.paper.citationCount > 0 && (
                            <span className="flex items-center gap-0.5">
                              <FileText size={10} /> {c.paper.citationCount.toLocaleString()}
                            </span>
                          )}
                          {c.paper.githubStars > 0 && (
                            <span className="flex items-center gap-0.5">
                              <Star size={10} /> {c.paper.githubStars.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink size={13} className="text-[#C8C8C2] group-hover:text-[#FF5A1F] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
