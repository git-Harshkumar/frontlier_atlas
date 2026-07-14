import { cache, Suspense } from "react";
import Link from "next/link";
import { AlertCircle, BookOpen, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";
import type { PaperDetail as PaperDetailType } from "@/lib/papers";
import PaperDetail, { RelatedPaperCard } from "@/components/PaperDetail";
import PaperDetailSkeleton from "@/components/PaperDetailSkeleton";
import { getPapers, type Paper } from "@/lib/paperApi";

const getPaper = cache(async (slug: string): Promise<PaperDetailType> => {
  const response = await fetchApi<{ status: string; data: PaperDetailType }>(
    `/api/v1/research-papers/${encodeURIComponent(slug)}`
  );
  const data = response.data as any;
  console.log("[getPaper] AUTHORS SERVER:", JSON.stringify(data?.authors?.slice(0, 3)), "full length:", data?.authors?.length);
  console.log("[getPaper] AUTHORS keys on first item:", data?.authors?.[0] ? Object.keys(data.authors[0]) : "N/A");
  console.log("[getPaper] FULL response data keys:", Object.keys(data));
  return response.data;
});

async function RelatedPapersStream({ paper }: { paper: PaperDetailType }) {
  const taskSlugs = [...new Set(paper.tasks.map((t) => t.slug).filter(Boolean))];
  const methodSlugs = [...new Set(paper.methods.map((m) => m.slug).filter(Boolean))];
  const modelSlugs = [...new Set(paper.models.map((m) => m.slug).filter(Boolean))];

  if (taskSlugs.length === 0 && methodSlugs.length === 0 && modelSlugs.length === 0) {
    return <span className="text-[13px] text-[#999] italic">Not available</span>;
  }

  const allSlugs = [...taskSlugs, ...methodSlugs, ...modelSlugs];
  const allTypes = [
    ...taskSlugs.map(() => "task" as const),
    ...methodSlugs.map(() => "method" as const),
    ...modelSlugs.map(() => "model" as const),
  ];

  const seen = new Set<string>();
  const slugs: string[] = [];
  const types: ("task" | "method" | "model")[] = [];
  for (let i = 0; i < allSlugs.length && slugs.length < 5; i++) {
    if (!seen.has(allSlugs[i])) {
      seen.add(allSlugs[i]);
      slugs.push(allSlugs[i]);
      types.push(allTypes[i]);
    }
  }

  try {
    const results = await Promise.all(
      slugs.map((slug, i) =>
        getPapers({ page: 1, [types[i]]: slug, limit: 5 })
      )
    );

    const score = new Map<string, { paper: Paper; count: number }>();
    const currentId = String(paper.id);

    for (const result of results) {
      for (const p of result.papers) {
        const id = String(p.id);
        if (id === currentId) continue;
        const existing = score.get(id);
        if (existing) {
          existing.count++;
        } else {
          score.set(id, { paper: p, count: 1 });
        }
      }
    }

    const relatedPapers = [...score.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([, v]) => v.paper);

    if (relatedPapers.length === 0) {
      return <span className="text-[13px] text-[#999] italic">Not available</span>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {relatedPapers.map((p) => (
          <RelatedPaperCard key={p.slug || p.id} paper={p} />
        ))}
      </div>
    );
  } catch {
    return <span className="text-[13px] text-[#999] italic">Not available</span>;
  }
}

function RelatedPapersFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col border border-[#EDE8DF] bg-white overflow-hidden animate-pulse">
          <div className="w-full aspect-[3/2] bg-[#EFECE6]" />
          <div className="p-3.5 space-y-2">
            <div className="h-3 bg-[#E8E5DD] rounded w-full" />
            <div className="h-3 bg-[#E8E5DD] rounded w-3/4" />
            <div className="h-2.5 bg-[#E8E5DD] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PaperNotFound({ slug }: { slug: string }) {
  return (
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
}

function PaperError({ slug }: { slug: string }) {
  return (
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
        <p className="text-sm text-gray-500">Failed to load paper. Please try again later.</p>
        <Link
          href={`/papers/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-semibold transition-colors mt-4"
        >
          Retry
        </Link>
      </div>
    </div>
  );
}

async function PaperContent({ slug }: { slug: string }) {
  let paper: PaperDetailType;
  try {
    paper = await getPaper(slug);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("404")) {
      return <PaperNotFound slug={slug} />;
    }
    return <PaperError slug={slug} />;
  }

  return (
    <PaperDetail paper={paper} />
  );
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<PaperDetailSkeleton />}>
      <PaperContent slug={slug} />
    </Suspense>
  );
}
