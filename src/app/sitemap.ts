import { MetadataRoute } from "next";
import { countries } from "@/data/countries";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://issueglobe.com";

  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/country/${country.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...countryPages,
  ];
}
