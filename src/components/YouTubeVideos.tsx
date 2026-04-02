"use client";

import { useEffect, useState, useRef } from "react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface YouTubeVideosProps {
  query: string;
}

export default function YouTubeVideos({ query }: YouTubeVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      try {
        // YouTube oEmbed/search via invidious or direct embed approach
        // Using YouTube search URL to generate embed links
        const searchQuery = encodeURIComponent(query);
        const res = await fetch(
          `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAI%253D`,
          { mode: "no-cors" }
        );

        // Fallback: generate search-based video links
        // Since we can't directly call YouTube API without a key,
        // we'll create clickable search results that open YouTube
        const searchVideos: Video[] = [
          {
            id: `search_1`,
            title: `${query} - Latest News`,
            thumbnail: `https://img.youtube.com/vi/default/0.jpg`,
            channelTitle: "YouTube",
          },
        ];

        setVideos(searchVideos);
      } catch {
        // Use search link fallback
      }
      setLoading(false);
    }

    fetchVideos();
  }, [query]);

  // YouTube search iframe approach - shows real results
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-64 shrink-0 rounded-xl bg-gray-200 h-40" />
        ))}
      </div>
    );
  }

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
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* 5 YouTube search embed iframes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <a
            key={i}
            href={`${searchUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-72 rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all"
          >
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}&index=${i}`}
                className="w-full h-full pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
                title={`${query} video ${i + 1}`}
              />
            </div>
          </a>
        ))}

        {/* View more on YouTube */}
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-48 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white" />
          </svg>
          <span className="text-sm font-medium text-gray-600">More on YouTube</span>
        </a>
      </div>
    </div>
  );
}
