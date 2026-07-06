import * as React from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
export interface MethodCategory {
  id: string;
  name: string;
  iconName: string;
  methods: { id: string; name: string; slug?: string }[];
}

export function CategoryRow({ category }: { category: MethodCategory }) {
  const Icon = LucideIcons[category.iconName as keyof typeof LucideIcons] as React.ElementType | undefined;

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 border-b border-[#E5E5E0] last:border-0 hover:bg-[#F8F7F2] transition-colors duration-200 -mx-4 px-4 rounded-xl group">
      {/* Left Column: Icon badge and Title */}
      <div className="flex items-center gap-3 md:w-44 shrink-0 md:pt-1.5">
        {Icon ? (
          <span className="w-8 h-8 rounded-lg bg-[#FFF7F3] flex items-center justify-center shrink-0 group-hover:bg-[#FFEDE6] transition-colors duration-200">
            <Icon className="w-[16px] h-[16px] text-[#FF5A1F]" strokeWidth={1.75} aria-hidden="true" />
          </span>
        ) : null}
        <h3 className="text-[14px] font-bold text-[#111111] tracking-tight leading-tight">{category.name}</h3>
      </div>
      
      {/* Right Column: Methods Pills */}
      <ul role="list" className="flex flex-wrap gap-2 flex-1 m-0 p-0 list-none pb-0">
        {category.methods.map((method) => {
          return (
            <li key={method.id} className="shrink-0">
              <Link 
                href={`/methods/${method.slug ?? method.id}`}
                className="inline-flex items-center justify-center rounded-full border border-[#E5E5E0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#555555] transition-all duration-300 ease-out hover:border-[#FF5A1F]/40 hover:bg-[#FFF7F3] hover:text-[#FF5A1F] hover:-translate-y-[2px] shadow-sm hover:shadow-md active:scale-95"
                aria-label={`View details for ${method.name}`}
              >
                {method.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
