"use client";
import { ArrowLeft, AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getPaperBySlug } from "@/lib/papers";
import type { PaperDetail as PaperDetailType } from "@/lib/papers";
import PaperDetail from "@/components/PaperDetail";
import Navbar from "@/components/Navbar";

function Skeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 lg:px-6 py-6 lg:py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 bg-gray-200 rounded w-10" />
        <span className="text-gray-300">›</span>
        <div className="h-3 bg-gray-200 rounded w-48" />
      </div>

      {/* Hero skeleton: content + inline preview */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8 mb-8 items-start">
        <div>
          <div className="h-12 bg-gray-200 rounded w-40 mb-4" />
          <div className="h-10 bg-gray-200 rounded w-[88%] mb-3" />
          <div className="h-10 bg-gray-200 rounded w-[72%] mb-6" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-4" />
          <div className="flex gap-3 mb-6">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-28" />
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="h-10 bg-gray-200 rounded-full w-20" />
            <div className="h-10 bg-gray-200 rounded-full w-24" />
            <div className="h-10 bg-gray-200 rounded-full w-20" />
            <div className="h-10 bg-gray-200 rounded-full w-24" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6 border-t border-gray-100">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl border border-gray-200" />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-14" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaperPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [paper, setPaper] = useState<PaperDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadPaper() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await getPaperBySlug(slug);
        setPaper(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("404")) {
          setNotFound(true);
        } else {
          setError("Failed to load paper. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPaper();
  }, [slug]);

  let content = null;

  if (loading) {
    content = <Skeleton />;
  } else if (notFound) {
    content = (
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-6 py-6 lg:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-800 transition-colors no-underline">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{slug}</span>
        </nav>

        <div className="max-w-md mx-auto flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Paper not found</h2>
          <p className="text-sm text-gray-500">
            The paper you are looking for does not exist or may have been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-sm font-semibold transition-colors mt-4"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="w-full max-w-7xl mx-auto px-5 lg:px-6 py-6 lg:py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-800 transition-colors no-underline">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{slug}</span>
        </nav>

        <div className="max-w-md mx-auto flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-2">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-semibold transition-colors mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  } else if (paper) {
    content = <PaperDetail paper={paper} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F7F2] text-[#111111]">
      <style>{`body { overflow: hidden !important; }`}</style>
      <Navbar />
      <div id="scroll-container" className="flex-1 overflow-y-auto overflow-x-hidden hide-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {content}
      </div>
    </div>
  );
}


