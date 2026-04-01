import { NextRequest, NextResponse } from "next/server";
import { fetchTrendsForCountry } from "@/lib/google-trends";
import { getCountryByCode } from "@/data/countries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  if (!country) {
    return NextResponse.json(
      { error: "country parameter is required" },
      { status: 400 }
    );
  }

  const countryData = getCountryByCode(country);
  if (!countryData) {
    return NextResponse.json({ error: "Invalid country code" }, { status: 400 });
  }

  const trends = await fetchTrendsForCountry(country.toUpperCase());
  return NextResponse.json({ country: countryData, trends });
}
