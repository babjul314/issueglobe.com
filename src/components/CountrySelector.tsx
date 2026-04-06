"use client";

import { useState } from "react";
import { countries, Country } from "@/data/countries";

interface CountrySelectorProps {
  currentCode: string;
}

export default function CountrySelector({ currentCode }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  const current = countries.find((c) => c.code === currentCode);

  function selectCountry(code: string) {
    document.cookie = `preferred-country=${code};path=/;max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/90 transition-colors border border-white/80 shadow-lg"
      >
        <span className="text-lg">{current?.flag}</span>
        <span className="hidden sm:inline">{current?.name}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/80" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-300 p-4 flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Select Region</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Countries Grid */}
              <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => selectCountry(c.code)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-200"
                  >
                    <span className="text-3xl sm:text-4xl flex-shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400">{c.nameLocal}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
