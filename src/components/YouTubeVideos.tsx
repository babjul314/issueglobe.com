"use client";

import { useRef } from "react";

interface YouTubeVideosProps {
  query: string;
}

export default function YouTubeVideos({ query }: YouTubeVideosProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  // 검색어 변형으로 다양한 영상 키워드 생성
  const keywords = [
    query,
    `${query} news`,
    `${query} explained`,
    `${query} latest`,
    `${query} reaction`,
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
          </svg>
          Related Videos
        </h3>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll("right")} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {keywords.map((kw, i) => {
          const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(kw)}`;
          return (
            <a
              key={i}
              href={ytSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 w-64 rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="relative bg-gradient-to-br from-red-500 to-red-700 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative text-center px-4">
                  <svg className="w-12 h-12 mx-auto mb-2 text-white opacity-90 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <p className="text-white text-xs font-medium line-clamp-2 opacity-90">
                    {kw}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                  {kw}
                </p>
                <p className="text-xs text-gray-400 mt-1">YouTube Search</p>
              </div>
            </a>
          );
        })}

        {/* View all */}
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-40 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
          </svg>
          <span className="text-sm font-medium text-gray-600">More</span>
        </a>
      </div>
    </div>
  );
}
