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
        const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setVideos(data.videos || []);
        }
      } catch {
        // fallback
      }
      setLoading(false);
    }
    fetchVideos();
  }, [query]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-64 shrink-0 rounded-xl bg-gray-100 animate-pulse aspect-video" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) return null;

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
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-64 rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="relative aspect-video bg-gray-100">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                {video.title}
              </p>
              <p className="text-xs text-gray-400 mt-1 truncate">{video.channelTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
