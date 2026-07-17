"use client";

import * as React from "react";

export function MethodsHero({ taxonomy = [] }: { taxonomy?: any[] }) {
  const totalMethods = taxonomy.reduce(
    (sum, category) => sum + category.methods.length,
    0
  );

  const totalCategories = taxonomy.length;

  const totalPapers = taxonomy.reduce(
    (sum, category) =>
      sum +
      category.methods.reduce(
        (methodSum: number, method: any) =>
          methodSum + (method.paperCount || 0),
        0
      ),
    0
  );

  return (
    <section className="mb-16">
      <div className="max-w-xl">
        <h1 className="text-[34px] font-extrabold tracking-tight text-[#111827] leading-none">
          All <span className="text-[#F55036]">Methods</span>
        </h1>

        <p className="mt-5 text-[15px] text-gray-600 leading-2">
          Discover the complete landscape of AI methods powering modern
          research, grouped into categories and linked to research papers.
        </p>

        <div className="flex items-center gap-10 mt-4">
          <div>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <div className="text-[15px] text-gray-500 mt-1">Categories</div>
          </div>

          <div>
            <div className="text-2xl font-bold">{totalMethods}</div>
            <div className="text-[15px] text-gray-500 mt-1">Methods</div>
          </div>

          <div>
            <div className="text-2xl font-bold">
              {totalPapers.toLocaleString()}
            </div>
            <div className="text-[15px] text-gray-500 mt-1">Papers</div>
          </div>
        </div>
      </div>
    </section>
  );
}