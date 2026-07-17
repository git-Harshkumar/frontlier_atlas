"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { getCategoryColors } from "@/lib/categoryColors";
import MethodCard from "@/components/MethodCard";

export interface MethodCategory {
  id: string;
  name: string;
  iconName?: string;
  methods: { id: string; name: string; slug?: string; paperCount?: number; year?: number }[];
}

export function CategoryRow({ category, index = 0 }: { category: MethodCategory; index?: number }) {
  const totalPapers = category.methods.reduce((sum, method) => sum + (method.paperCount || 0), 0);
  const colors = getCategoryColors(category.id);
  

  return (
    <section id={category.id} className="scroll-mt-[100px] mb-10">
      {/* Section header — matches the SectionLabel / list-header pattern used on the Tasks page */}
      <div className="mb-5">
  <h2 className="text-[26px] font-bold text-[#111111] tracking-tight">
    {category.name}
  </h2>

  <p className="text-[14px] text-[#777777] mt-1">
    {category.methods.length} methods · {totalPapers.toLocaleString()} papers
  </p>
</div>

      {/* Card grid — same proportions, gap, and breakpoints as the Task card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.methods.map((method) => (
          <MethodCard key={method.id} method={method} accentColor={colors.accent} />
        ))}
      </div>
    </section>
  );
}
