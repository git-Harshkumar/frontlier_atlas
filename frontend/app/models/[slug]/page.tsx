"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getModelBySlug, type ModelDetail } from "@/lib/models";
import ModelDetailComponent from "@/components/ModelDetail";

function HeroSkeleton() {
  return (
    <div className="ds-card-hero p-6 md:p-8 mb-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-[#E5E5E0] rounded w-1/2" />
          <div className="h-5 bg-[#E5E5E0] rounded w-20" />
          <div className="h-4 bg-[#E5E5E0] rounded w-32" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-[#E5E5E0] rounded-full w-20" />
          <div className="h-9 bg-[#E5E5E0] rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

function PapersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-[#E5E5E0] rounded w-32 mb-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="ds-card p-5 flex flex-col gap-3 animate-pulse">
          <div className="h-5 bg-[#E5E5E0] rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-4 bg-[#E5E5E0] rounded w-20" />
          </div>
          <div className="h-8 bg-[#E5E5E0] rounded w-28" />
        </div>
      ))}
    </div>
  );
}

function BreadcrumbSkeleton() {
  return (
    <div className="flex items-center gap-2 text-[13px] mb-6 animate-pulse">
      <div className="h-4 bg-[#E5E5E0] rounded w-10" />
      <span>/</span>
      <div className="h-4 bg-[#E5E5E0] rounded w-12" />
      <span>/</span>
      <div className="h-4 bg-[#E5E5E0] rounded w-24" />
    </div>
  );
}

export default function ModelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModel = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getModelBySlug(slug);
      setModel(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("404")) {
        setError("Model not found");
      } else {
        setError("Failed to load model. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8">
          <BreadcrumbSkeleton />
          <HeroSkeleton />
          <PapersSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 xl:px-12 py-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
            <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/models" className="hover:text-[#F55036] transition-colors no-underline">
              Models
            </Link>
            <span>/</span>
            <span className="text-[#555555] font-medium">{slug}</span>
          </nav>

          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle size={32} className="text-[#FF5A1F]" />
            <p className="text-[14px] text-[#FF5A1F]">{error}</p>
            <button onClick={fetchModel} className="ds-button text-[12px]">
              Retry
            </button>
            <Link
              href="/models"
              className="inline-flex items-center gap-1.5 ds-button-ghost text-[12px] px-4 py-2 no-underline mt-2"
            >
              <ArrowLeft size={14} />
              Back to Models
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!model) return null;

  return <ModelDetailComponent model={model} />;
}
