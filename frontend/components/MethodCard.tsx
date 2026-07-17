"use client";

import Link from "next/link";
import {
  Brain,
  Languages,
  Eye,
  Volume2,
  Video,
  Boxes,
  Bot,
  Cuboid,
  Network,
  Activity,
  Sparkles,
  Cpu,
  Search,
  Shield,
  Zap,
  Database,
} from "lucide-react";

export interface MethodCardData {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  paperCount?: number;
  year?: number;
}


const iconMap: Record<string, any> = {
  general: Brain,
  language: Languages,
  "computer vision": Eye,
  "audio & speech": Volume2,
  video: Video,
  multimodal: Boxes,
  robotics: Bot,
  "embodied ai": Cuboid,
  "3d & spatial": Cuboid,
  "graph learning": Network,
  "time series": Activity,
  "scientific ai": Sparkles,
  "neural architecture": Cpu,
  "neural architectures": Cpu,
  retrieval: Search,
  alignment: Shield,
  optimization: Zap,
  training: Zap,
  diffusion: Sparkles,
  agents: Bot,
};

export default function MethodCard({
  method,
  accentColor,
}: {
  method: MethodCardData;
  accentColor?: string;
}) {
  const paperCount = method.paperCount || 0;
const Icon =
  iconMap[method.name.toLowerCase()] ||
  iconMap[method.slug?.replace(/-/g, " ").toLowerCase() || ""] ||
    Brain;
  return (
  <Link
    href={`/methods/${method.slug ?? method.id}`}
    className="bg-white rounded-md border border-[#ECECEC] p-5 min-h-[150px] flex flex-col hover:shadow-md transition-shadow duration-200 group no-underline"
  >
    <div className="flex items-start gap-4">
      <div
  className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-125"
  style={{ backgroundColor: `${accentColor}15` }}
>
  <Icon
    size={18}
    strokeWidth={2.2}
    style={{ color: accentColor }}
  />
</div>

      <h3 className=" text-[#111111] text-[16px] leading-tight">
        {method.name}
      </h3>
    </div>

    <p className="text-[14px] text-[#666] mt-3 line-clamp-2">
  {method.description}
</p>

    <div className="mt-auto pt-5 text-[13px] text-[#777] font-medium">
      {paperCount.toLocaleString()} papers
    </div>
  </Link>
  
);
}
