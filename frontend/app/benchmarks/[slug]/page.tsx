"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Trophy, ArrowLeft, ArrowUp, ArrowDown, Minus, Star, ExternalLink, Calendar, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getBenchmarkBySlug, type BenchmarkDetail } from "@/lib/benchmarks";

export default function BenchmarkDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [benchmark, setBenchmark] = useState<BenchmarkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "claims">("leaderboard");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const data = await getBenchmarkBySlug(slug);
        setBenchmark(data);
      } catch (err) {
        console.error("Failed to load benchmark detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
            <p className="text-[14px] text-[#555555]">Loading benchmark evaluation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!benchmark) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <h2 className="text-[20px] font-bold">Benchmark Not Found</h2>
          <p className="text-[#8B8B8B]">The requested benchmark leaderboard does not exist or has been archived.</p>
          <Link href="/benchmarks" className="ds-button no-underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to registry
          </Link>
        </div>
      </div>
    );
  }

  // Helper to render the rank change indicator
  const renderRankChange = (rank: number, prevRank: number | null) => {
    if (prevRank === null) {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          NEW
        </span>
      );
    }
    const diff = prevRank - rank;
    if (diff > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-emerald-600 text-[12px] font-semibold">
          <ArrowUp size={12} /> {diff}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-rose-600 text-[12px] font-semibold">
          <ArrowDown size={12} /> {Math.abs(diff)}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[#8B8B8B] text-[12px]">
        <Minus size={12} />
      </span>
    );
  };

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return "bg-[#FFD700]/20 text-[#A67C00] border-[#FFD700]/30 font-bold";
    if (rank === 2) return "bg-[#C0C0C0]/20 text-[#696969] border-[#C0C0C0]/30 font-bold";
    if (rank === 3) return "bg-[#CD7F32]/20 text-[#8B4513] border-[#CD7F32]/30 font-bold";
    return "bg-[#F8F7F2] text-[#555555] border-[#E5E5E0]";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll flex flex-col">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-8 pb-16 flex items-start gap-6 xl:gap-8">
          {/* Left Sidebar */}
          <div className="hidden xl:block w-[240px] shrink-0">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 max-w-full">
            {/* Navigation Breadcrumb */}
            <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
              <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/benchmarks" className="hover:text-[#F55036] transition-colors no-underline">
                Benchmarks
              </Link>
              <span>/</span>
              <span className="text-[#555555] font-medium">{benchmark.name}</span>
            </nav>

            {/* Back Button Link */}
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 text-[13px] text-[#FF5A1F] hover:text-[#FF6C37] font-semibold no-underline mb-6 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Benchmarks registry
            </Link>

            {/* Benchmark Detail Header Card */}
            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF5A1F]/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/20 mb-3">
                    Evaluation Leaderboard
                  </span>
                  <h1 className="text-[28px] md:text-[36px] font-black text-[#111111] leading-tight mb-2">
                    {benchmark.name}
                  </h1>
                  <p className="text-[13px] font-mono text-[#8B8B8B] uppercase tracking-wider mb-4">
                    Registry Identifier: {benchmark.slug}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#F8F7F2] rounded-xl flex items-center justify-center text-[#FF5A1F] border border-[#E5E5E0] shrink-0">
                  <Trophy size={24} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-4 pt-6 border-t border-[#F1F1EB]">
                <div className="text-[13px]">
                  <span className="text-[#8B8B8B]">Ranked Papers:</span>{" "}
                  <strong className="text-[#111111]">{benchmark.rankings?.length ?? 0}</strong>
                </div>
                <div className="text-[13px]">
                  <span className="text-[#8B8B8B]">Official SOTA Claims:</span>{" "}
                  <strong className="text-[#111111]">{benchmark.claims?.length ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Segment/Tab Selection */}
            <div className="flex border-b border-[#E5E5E0] mb-6">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`py-3 px-6 text-[14px] font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "leaderboard"
                    ? "border-[#FF5A1F] text-[#FF5A1F]"
                    : "border-transparent text-[#555555] hover:text-[#111111]"
                }`}
              >
                Model Leaderboard ({benchmark.rankings?.length ?? 0})
              </button>
              <button
                onClick={() => setActiveTab("claims")}
                className={`py-3 px-6 text-[14px] font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "claims"
                    ? "border-[#FF5A1F] text-[#FF5A1F]"
                    : "border-transparent text-[#555555] hover:text-[#111111]"
                }`}
              >
                SOTA Claimants ({benchmark.claims?.length ?? 0})
              </button>
            </div>

            {/* Tab: Leaderboard */}
            {activeTab === "leaderboard" && (
              <div className="bg-white border border-[#E5E5E0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F7F2] border-b border-[#E5E5E0] text-[11px] font-mono uppercase tracking-wider text-[#8B8B8B]">
                        <th className="py-3.5 px-6 font-semibold text-center w-20">Rank</th>
                        <th className="py-3.5 px-6 font-semibold w-24 text-center">Change</th>
                        <th className="py-3.5 px-6 font-semibold">Evaluation Contender / Paper</th>
                        <th className="py-3.5 px-6 font-semibold text-center">Citations</th>
                        <th className="py-3.5 px-6 font-semibold text-center">GitHub Stars</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Paper Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E0]">
                      {benchmark.rankings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 px-6 text-center text-[#8B8B8B] text-[14px]">
                            No research papers have submitted evaluations to this leaderboard yet.
                          </td>
                        </tr>
                      ) : (
                        benchmark.rankings.map((r) => (
                          <tr key={r.id} className="hover:bg-[#FDFDFB] transition-colors group">
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-[13px] ${getRankBadgeStyle(r.rank)}`}>
                                {r.rank}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {renderRankChange(r.rank, r.previous_rank)}
                            </td>
                            <td className="py-4 px-6">
                              <Link href={`/papers/${r.paper.slug}`} className="no-underline group-hover:text-[#FF5A1F]">
                                <div className="font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors text-[14px] line-clamp-2">
                                  {r.paper.title}
                                </div>
                              </Link>
                              <div className="flex items-center gap-3 text-[11px] text-[#8B8B8B] mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {r.paper.publicationDate ? new Date(r.paper.publicationDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-[13px] font-medium text-[#555555]">
                                {r.paper.citationCount ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 text-[13px] text-[#555555]">
                                <Star size={14} className="text-[#FF5A1F]" />
                                {r.paper.githubStars ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Link
                                href={`/papers/${r.paper.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8F7F2] hover:bg-[#FF5A1F] text-[#555555] hover:text-white border border-[#E5E5E0] hover:border-[#FF5A1F] rounded-md text-[12px] font-medium transition-all no-underline"
                              >
                                View Paper <ExternalLink size={12} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Claims */}
            {activeTab === "claims" && (
              <div className="bg-white border border-[#E5E5E0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F7F2] border-b border-[#E5E5E0] text-[11px] font-mono uppercase tracking-wider text-[#8B8B8B]">
                        <th className="py-3.5 px-6 font-semibold">Claimant Paper</th>
                        <th className="py-3.5 px-6 font-semibold text-center">Citations</th>
                        <th className="py-3.5 px-6 font-semibold text-center">GitHub Stars</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Paper Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E0]">
                      {benchmark.claims.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 px-6 text-center text-[#8B8B8B] text-[14px]">
                            No papers have claimed official SOTA records on this benchmark yet.
                          </td>
                        </tr>
                      ) : (
                        benchmark.claims.map((c) => (
                          <tr key={c.id} className="hover:bg-[#FDFDFB] transition-colors group">
                            <td className="py-4 px-6">
                              <Link href={`/papers/${c.paper.slug}`} className="no-underline">
                                <div className="font-bold text-[#111111] group-hover:text-[#FF5A1F] transition-colors text-[14px]">
                                  {c.paper.title}
                                </div>
                              </Link>
                              <div className="flex items-center gap-3 text-[11px] text-[#8B8B8B] mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {c.paper.publicationDate ? new Date(c.paper.publicationDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-[13px] font-medium text-[#555555]">
                                {c.paper.citationCount ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className="inline-flex items-center gap-1 text-[13px] text-[#555555]">
                                <Star size={14} className="text-[#FF5A1F]" />
                                {c.paper.githubStars ?? 0}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <Link
                                href={`/papers/${c.paper.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8F7F2] hover:bg-[#FF5A1F] text-[#555555] hover:text-white border border-[#E5E5E0] hover:border-[#FF5A1F] rounded-md text-[12px] font-medium transition-all no-underline"
                              >
                                View Paper <ExternalLink size={12} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
