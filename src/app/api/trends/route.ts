import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getCountryByCode } from "@/data/countries";

export const revalidate = 300; // 5분 캐시

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

  try {
    // 오늘 날짜로 Firebase에서 트렌드 조회
    const today = new Date().toISOString().split("T")[0];
    console.log(`Querying trends for ${country} on ${today}`);
    const trendsRef = collection(db, "trends", country, today);
    const q = query(trendsRef, orderBy("createdAt", "desc"), limit(20));
    const snapshot = await getDocs(q);

    console.log(`Found ${snapshot.docs.length} trends for ${country}`);
    const trends = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ country: countryData, trends });
  } catch (error) {
    console.error("Firebase error:", error);
    return NextResponse.json(
      { error: `Failed to fetch trends from database: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
