"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { getDiscussions, type Discussion } from "@/lib/discussionApi";
import {
  Star,
  GitFork,
  ArrowUpRight,
  Github,
} from "lucide-react";

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await getDiscussions();
        setDiscussions(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredDiscussions = useMemo(() => {
    if (activeTab === "all") return discussions;
    return discussions.filter(
      (discussion) => discussion.platform === activeTab
    );
  }, [activeTab, discussions]);

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#111111]">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-6 py-6">

        {/* Header */}

        <div className="border-b border-[#E5E5E0] pb-5">

          <h1 className="text-[38px] font-bold tracking-tight">
            Discussions
          </h1>

          <p className="mt-2 max-w-xl text-[15px] leading-7 text-[#666666]">
            Discover trending discussions from GitHub and Hacker News covering
            artificial intelligence, open-source software, developer tools and
            research. Updated automatically so you never miss what the community
            is talking about.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {[
              { id: "all", label: "All" },
              { id: "github", label: "GitHub" },
              { id: "hackernews", label: "Hacker News" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#F55036] text-white shadow"
                    : "border border-[#E5E5E0] bg-white hover:border-[#F55036] hover:text-[#F55036]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-[#777777] text-lg">
            Loading discussions...
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="py-24 text-center text-[#777777] text-lg">
            No discussions found.
          </div>
        ) : (

          <div className="mt-7 space-y-4">

            {filteredDiscussions.map((discussion, index) => (

              <a
                key={index}
                href={discussion.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border border-[#E7E4DE] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F55036] hover:shadow-lg"
              >

                <div
                  className={`h-1 w-full ${
                    discussion.platform === "github"
                      ? "bg-black"
                      : "bg-orange-500"
                  }`}
                />

                <div className="px-5 py-4">

                  {/* Meta */}

                  <div className="flex flex-wrap items-center gap-3">

                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        discussion.platform === "github"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {discussion.platform === "github" ? (
                        <>
                          <Github size={12} />
                          GitHub
                        </>
                      ) : (
                        <>🔥 Hacker News</>
                      )}
                    </span>

                    <span className="text-xs font-medium text-[#666666]">
                      {discussion.source}
                    </span>

                    <span className="text-[#CCCCCC]">•</span>

                    <span className="text-xs text-[#999999]">
                      {discussion.time}
                    </span>

                  </div>

                  {/* Title */}

                  <h2 className="mt-3 text-[18px] font-bold leading-7 text-[#111111] transition-colors group-hover:text-[#F55036]">
                    {discussion.title}
                  </h2>

                  {/* Description */}

                  <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#6B6B6B]">
                    {discussion.description}
                  </p>
                                    {/* Footer */}

                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F1EE] pt-3">

                    <div className="flex items-center gap-6 text-[13px] text-[#666666]">

                      <div className="flex items-center gap-2">
                        <Star
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span>{discussion.likes}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <GitFork size={14} />
                        <span>{discussion.comments}</span>
                      </div>

                    </div>

                    <div className="flex items-center gap-1 text-[13px] font-medium text-[#999999] transition-all duration-200 group-hover:text-[#F55036]">
                      Open discussion
                      <ArrowUpRight size={15} />
                    </div>

                  </div>

                </div>

              </a>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}