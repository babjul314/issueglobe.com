export interface Country {
  code: string;
  name: string;
  nameLocal: string;
  flag: string;
  locale: string;
  currency: string;
  region: string;
  color: string;
}

// 수익성 기준 상위 30개국 (GDP, 인터넷 보급률, 광고 시장 규모 기반)
export const countries: Country[] = [
  { code: "US", name: "United States", nameLocal: "United States", flag: "🇺🇸", locale: "en-US", currency: "USD", region: "North America", color: "#3B82F6" },
  { code: "GB", name: "United Kingdom", nameLocal: "United Kingdom", flag: "🇬🇧", locale: "en-GB", currency: "GBP", region: "Europe", color: "#1E40AF" },
  { code: "DE", name: "Germany", nameLocal: "Deutschland", flag: "🇩🇪", locale: "de-DE", currency: "EUR", region: "Europe", color: "#FBBF24" },
  { code: "JP", name: "Japan", nameLocal: "日本", flag: "🇯🇵", locale: "ja-JP", currency: "JPY", region: "Asia", color: "#EF4444" },
  { code: "CA", name: "Canada", nameLocal: "Canada", flag: "🇨🇦", locale: "en-CA", currency: "CAD", region: "North America", color: "#DC2626" },
  { code: "AU", name: "Australia", nameLocal: "Australia", flag: "🇦🇺", locale: "en-AU", currency: "AUD", region: "Oceania", color: "#F59E0B" },
  { code: "FR", name: "France", nameLocal: "France", flag: "🇫🇷", locale: "fr-FR", currency: "EUR", region: "Europe", color: "#2563EB" },
  { code: "KR", name: "South Korea", nameLocal: "대한민국", flag: "🇰🇷", locale: "ko-KR", currency: "KRW", region: "Asia", color: "#1D4ED8" },
  { code: "IT", name: "Italy", nameLocal: "Italia", flag: "🇮🇹", locale: "it-IT", currency: "EUR", region: "Europe", color: "#16A34A" },
  { code: "BR", name: "Brazil", nameLocal: "Brasil", flag: "🇧🇷", locale: "pt-BR", currency: "BRL", region: "South America", color: "#22C55E" },
  { code: "IN", name: "India", nameLocal: "भारत", flag: "🇮🇳", locale: "hi-IN", currency: "INR", region: "Asia", color: "#F97316" },
  { code: "ES", name: "Spain", nameLocal: "España", flag: "🇪🇸", locale: "es-ES", currency: "EUR", region: "Europe", color: "#DC2626" },
  { code: "NL", name: "Netherlands", nameLocal: "Nederland", flag: "🇳🇱", locale: "nl-NL", currency: "EUR", region: "Europe", color: "#F97316" },
  { code: "CH", name: "Switzerland", nameLocal: "Schweiz", flag: "🇨🇭", locale: "de-CH", currency: "CHF", region: "Europe", color: "#EF4444" },
  { code: "SE", name: "Sweden", nameLocal: "Sverige", flag: "🇸🇪", locale: "sv-SE", currency: "SEK", region: "Europe", color: "#2563EB" },
  { code: "MX", name: "Mexico", nameLocal: "México", flag: "🇲🇽", locale: "es-MX", currency: "MXN", region: "North America", color: "#16A34A" },
  { code: "NO", name: "Norway", nameLocal: "Norge", flag: "🇳🇴", locale: "nb-NO", currency: "NOK", region: "Europe", color: "#DC2626" },
  { code: "DK", name: "Denmark", nameLocal: "Danmark", flag: "🇩🇰", locale: "da-DK", currency: "DKK", region: "Europe", color: "#EF4444" },
  { code: "BE", name: "Belgium", nameLocal: "België", flag: "🇧🇪", locale: "nl-BE", currency: "EUR", region: "Europe", color: "#FBBF24" },
  { code: "AT", name: "Austria", nameLocal: "Österreich", flag: "🇦🇹", locale: "de-AT", currency: "EUR", region: "Europe", color: "#DC2626" },
  { code: "IE", name: "Ireland", nameLocal: "Ireland", flag: "🇮🇪", locale: "en-IE", currency: "EUR", region: "Europe", color: "#16A34A" },
  { code: "SG", name: "Singapore", nameLocal: "Singapore", flag: "🇸🇬", locale: "en-SG", currency: "SGD", region: "Asia", color: "#DC2626" },
  { code: "IL", name: "Israel", nameLocal: "ישראל", flag: "🇮🇱", locale: "he-IL", currency: "ILS", region: "Middle East", color: "#2563EB" },
  { code: "AE", name: "UAE", nameLocal: "الإمارات", flag: "🇦🇪", locale: "ar-AE", currency: "AED", region: "Middle East", color: "#16A34A" },
  { code: "NZ", name: "New Zealand", nameLocal: "New Zealand", flag: "🇳🇿", locale: "en-NZ", currency: "NZD", region: "Oceania", color: "#1D4ED8" },
  { code: "FI", name: "Finland", nameLocal: "Suomi", flag: "🇫🇮", locale: "fi-FI", currency: "EUR", region: "Europe", color: "#2563EB" },
  { code: "PL", name: "Poland", nameLocal: "Polska", flag: "🇵🇱", locale: "pl-PL", currency: "PLN", region: "Europe", color: "#DC2626" },
  { code: "TW", name: "Taiwan", nameLocal: "台灣", flag: "🇹🇼", locale: "zh-TW", currency: "TWD", region: "Asia", color: "#2563EB" },
  { code: "SA", name: "Saudi Arabia", nameLocal: "السعودية", flag: "🇸🇦", locale: "ar-SA", currency: "SAR", region: "Middle East", color: "#16A34A" },
  { code: "HK", name: "Hong Kong", nameLocal: "香港", flag: "🇭🇰", locale: "zh-HK", currency: "HKD", region: "Asia", color: "#DC2626" },
];

export const getCountryByCode = (code: string): Country | undefined =>
  countries.find((c) => c.code === code.toUpperCase());

export const getCountriesByRegion = (): Record<string, Country[]> =>
  countries.reduce((acc, country) => {
    if (!acc[country.region]) acc[country.region] = [];
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);
