"use client";

import { ArrowLeft, AlertCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getPaperBySlug } from "@/lib/papers";
import type { PaperDetail as PaperDetailType } from "@/lib/papers";
import PaperDetail from "@/components/PaperDetail";

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8 animate-pulse">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 bg-[#E5E5E0] rounded w-10" />
          <span className="text-[#E5E5E0]">/</span>
          <div className="h-3 bg-[#E5E5E0] rounded w-48" />
        </div>

        {/* Title */}
        <div className="h-10 bg-[#E5E5E0] rounded w-3/4 mb-3" />
        <div className="h-10 bg-[#E5E5E0] rounded w-1/2 mb-4" />

        {/* Author lines */}
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-[#E5E5E0] rounded w-32" />
          <div className="h-4 bg-[#E5E5E0] rounded w-28" />
          <div className="h-4 bg-[#E5E5E0] rounded w-24" />
        </div>

        {/* Metadata row */}
        <div className="flex gap-4 mb-8">
          <div className="h-4 bg-[#E5E5E0] rounded w-28" />
          <div className="h-4 bg-[#E5E5E0] rounded w-24" />
          <div className="h-4 bg-[#E5E5E0] rounded w-20" />
        </div>

        {/* Abstract skeleton */}
        <div className="mb-8">
          <div className="h-5 bg-[#E5E5E0] rounded w-24 mb-3" />
          <div className="bg-white border border-[#E5E5E0] rounded-lg p-5 space-y-2">
            <div className="h-3 bg-[#E5E5E0] rounded w-full" />
            <div className="h-3 bg-[#E5E5E0] rounded w-full" />
            <div className="h-3 bg-[#E5E5E0] rounded w-full" />
            <div className="h-3 bg-[#E5E5E0] rounded w-3/4" />
            <div className="h-3 bg-[#E5E5E0] rounded w-5/6" />
            <div className="h-3 bg-[#E5E5E0] rounded w-2/3" />
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-7 bg-[#E5E5E0] rounded-full w-20" />
          <div className="h-7 bg-[#E5E5E0] rounded-full w-24" />
          <div className="h-7 bg-[#E5E5E0] rounded-full w-16" />
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

  if (loading) {
    return <Skeleton />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
            <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">Home</Link>
            <span>/</span>
            <span className="text-[#555555] font-medium">{slug}</span>
          </nav>

          <div className="max-w-[500px] mx-auto flex flex-col items-center justify-center py-20 gap-4">
            <BookOpen size={40} className="text-[#DCDCD7]" />
            <h2 className="text-[18px] font-bold text-[#555555]">Paper not found</h2>
            <p className="text-[13px] text-[#8B8B8B] text-center">
              The paper you are looking for does not exist or may have been removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 ds-button text-[12px] px-4 py-2 no-underline mt-2"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
            <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">Home</Link>
            <span>/</span>
            <span className="text-[#555555] font-medium">{slug}</span>
          </nav>

          <div className="max-w-[500px] mx-auto flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle size={40} className="text-[#FF5A1F]" />
            <h2 className="text-[18px] font-bold text-[#FF5A1F]">Something went wrong</h2>
            <p className="text-[13px] text-[#8B8B8B] text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="ds-button text-[12px] px-4 py-2 mt-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    return null;
  }

  return <PaperDetail paper={paper} />;
}
