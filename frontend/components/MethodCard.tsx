"use client";

import { FileText } from "lucide-react";
import type { MethodItem } from "@/lib/methods";
import Link from "next/link";

export default function MethodCard({ method }: { method: MethodItem }) {
  return (
    <Link
      href={`/methods/${method.slug}`}
      className="ds-card p-5 flex flex-col gap-3 hover:shadow-soft transition-shadow duration-200 group no-underline"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-semibold text-[#111111] group-hover:text-[#F55036] transition-colors leading-snug">
          {method.name}
        </h3>
        <span className="ds-text-muted text-[11px] shrink-0 mt-0.5">
          {method.slug}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-[#555555]">
        <FileText size={14} className="text-[#8B8B8B]" />
        <span>
          <strong className="font-semibold text-[#111111]">{method.paperCount}</strong>{" "}
          {method.paperCount === 1 ? "paper" : "papers"}
        </span>
      </div>
    </Link>
  );
}
