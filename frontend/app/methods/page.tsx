export const runtime = "edge";

import * as React from "react";
import Link from "next/link";
import { TaxonomyView } from "./TaxonomyView";
import Navbar from "@/components/Navbar";
import { atlasUiFont } from "@/lib/fonts";

import { staticTaxonomy } from "@/lib/staticTaxonomy";


export default async function MethodsPage() {
  let taxonomy = staticTaxonomy;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://frontieratlas-backend.morningsignal-india.workers.dev';
    const res = await fetch(`${apiUrl}/api/v1/methods/taxonomy`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();

      if (data?.data && Array.isArray(data.data)) {
        taxonomy = staticTaxonomy.map((category) => {
          const liveCategory = data.data.find(
            (c: any) => c.id === category.id
          );

          return {
            ...category,
            methods: category.methods.map((method) => {
              const liveMethod = liveCategory?.methods?.find(
                (m: any) => m.slug === method.slug
              );

              return {
                ...method,
                paperCount: liveMethod?.paperCount ?? method.paperCount,
                description: liveMethod?.description ?? (method as any).description,
              };
            }),
          };
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch methods taxonomy", error);
  }

  return (
    <div className={`${atlasUiFont.className} min-h-screen bg-[#F8F7F2] text-[#111111] tracking-normal`}>
      <Navbar />
      {/* Same container width/padding rhythm as the Tasks page (HomeContent) */}
      <div className="w-full max-w-[1370px] mx-auto px-10 lg:px-16 xl:px-24 pt-6 pb-12">

        <nav className="flex items-center gap-2 text-[13px] text-[#8B8B8B] mb-6">
          <Link href="/" className="hover:text-[#F55036] transition-colors no-underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#555555] font-medium">Methods</span>
        </nav>
        <TaxonomyView initialTaxonomy={taxonomy} />
      </div>
    </div>
  );

}
