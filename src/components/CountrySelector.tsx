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
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/60 transition-colors border border-white/60 shadow-lg"
      >
        <span className="text-lg">{current?.flag}</span>
        <span>{current?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-50 w-72 max-h-96 overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200">
            <div className="p-2">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => selectCountry(c.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                    c.code === currentCode
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{c.flag}</span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.nameLocal}</p>
                  </div>
                  {c.code === currentCode && (
                    <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
