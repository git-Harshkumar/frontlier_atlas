"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Heart, MessageCircle, Loader2 } from "lucide-react";
import { getModels, type ModelData } from "@/lib/modelApi";

// X (Twitter) icon
function XIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Reddit icon
function RedditIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 0C4.478 0 0 4.478 0 10c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-5.522-4.477-10-10-10zm4.908 3.958a1.042 1.042 0 110 2.084 1.042 1.042 0 010-2.084zm-9.1 2.506c.282 0 .557.044.817.127l1.547-2.327a.625.625 0 011.042.692l-1.44 2.166a3.335 3.335 0 011.559 2.828A3.335 3.335 0 0110 13.286a3.335 3.335 0 01-3.333-3.337c0-.47.098-.918.273-1.325l-1.47-2.21a.625.625 0 111.041-.693l1.396 2.1a3.316 3.316 0 01.901-.357zM10 8.333c-1.84 0-3.333 1.494-3.333 3.334S8.16 15 10 15c1.84 0 3.333-1.493 3.333-3.333S11.84 8.333 10 8.333zm-1.667 2.084a.833.833 0 110 1.666.833.833 0 010-1.666zm3.334 0a.833.833 0 110 1.666.833.833 0 010-1.666zm-3.75 2.5a.208.208 0 01.148.357c.559.558 1.65.601 1.934.601.284 0 1.375-.043 1.933-.601a.208.208 0 01.295.295C11.384 14.04 10.284 14.167 10 14.167c-.284 0-1.384-.127-1.731-.598a.208.208 0 01.148-.152z" />
    </svg>
  );
}

// GitHub icon
function GithubIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState("all");
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        setLoading(true);
        const data = await getModels();
        setModels(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load models. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadModels();
  }, []);

  const filteredTopics = activeTab === "all" 
    ? models 
    : models.filter(topic => topic.platform === activeTab);

  return (
    <aside className="flex flex-col w-full shrink-0 justify-start pb-12">
      <div className="p-0 xl:p-2 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-[#F55036] fill-transparent" />
          <span className="text-[15px] font-bold text-[#111111]">
            What&apos;s happening
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-5">
          <button 
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              activeTab === "all" ? "bg-[#EBEBE6] text-[#F55036]" : "text-[#8B8B8B] hover:bg-[#EBEBE6] hover:text-[#111111]"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setActiveTab("x")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              activeTab === "x" ? "bg-[#EBEBE6] text-[#F55036]" : "text-[#8B8B8B] hover:bg-[#EBEBE6] hover:text-[#111111]"
            }`}
          >
            X/Twitter
          </button>
          <button 
            onClick={() => setActiveTab("reddit")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              activeTab === "reddit" ? "bg-[#EBEBE6] text-[#F55036]" : "text-[#8B8B8B] hover:bg-[#EBEBE6] hover:text-[#111111]"
            }`}
          >
            Reddit
          </button>
          <button 
            onClick={() => setActiveTab("github")}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              activeTab === "github" ? "bg-[#EBEBE6] text-[#F55036]" : "text-[#8B8B8B] hover:bg-[#EBEBE6] hover:text-[#111111]"
            }`}
          >
            GitHub
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-[13px] text-[#8B8B8B] gap-2">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10 text-[13px] font-semibold text-[#F55036]">
              {error}
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[13px] font-semibold text-[#8B8B8B]">
              No topics found.
            </div>
          ) : (
            filteredTopics.map((topic, idx) => (
            <div key={idx} className="flex gap-4 py-4 border-b border-[#E5E5E0] last:border-b-0 group cursor-pointer">
              
              {/* Raw Icon */}
              <div className="shrink-0 pt-0.5">
                {topic.platform === "x" && <XIcon size={22} className="text-[#111111]" />}
                {topic.platform === "reddit" && <RedditIcon size={24} className="text-[#111111]" />}
                {topic.platform === "github" && <GithubIcon size={22} className="text-[#111111]" />}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Meta */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1">
                  <span className="text-[#555555]">{topic.source}</span>
                  <span className="text-[#DCDCD7]">•</span>
                  <span className="text-[#8B8B8B]">{topic.time}</span>
                </div>
                
                {/* Title */}
                <h4 className="text-[13px] font-bold text-[#111111] leading-[1.5] mb-3 group-hover:text-[#F55036] transition-colors">
                  {topic.title}
                </h4>

                {/* Stats */}
                <div className="flex items-center gap-4 text-[11px] font-semibold text-[#8B8B8B]">
                  <div className="flex items-center gap-1.5">
                    <Heart size={14} className="text-[#8B8B8B]" />
                    <span>{topic.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle size={14} className="text-[#8B8B8B]" />
                    <span>{topic.comments}</span>
                  </div>
                </div>
              </div>

            </div>
            ))
          )}
        </div>

        {/* Footer Button */}
        <button className="w-full border border-[#E5E5E0] text-[#F55036] bg-white hover:border-[#F55036] hover:bg-[#F8F7F2] hover:text-[#E0462D] rounded-[8px] py-[10px] flex items-center justify-center gap-1.5 font-semibold text-[12px] mt-2 transition-colors cursor-pointer">
          View all discussions <ArrowRight size={14} strokeWidth={2.5} />
        </button>

      </div>
    </aside>
  );
}
