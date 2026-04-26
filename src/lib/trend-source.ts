import { collection, getDocs, limit as firestoreLimit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchTrendsForCountry, TrendItem } from "@/lib/google-trends";

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

async function getFirestoreTrends(
  countryCode: string,
  maxItems: number,
  dateStr: string
): Promise<TrendItem[]> {
  try {
    const trendsRef = collection(db, "trends", countryCode, dateStr);
    const q = query(trendsRef, orderBy("createdAt", "desc"), firestoreLimit(maxItems));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as TrendItem);
  } catch (error) {
    console.error(`Firebase trends fetch failed for ${countryCode}/${dateStr}:`, error);
    return [];
  }
}

export async function getTrendsFromSources(
  countryCode: string,
  maxItems = 20,
  dateStr = getTodayDate()
): Promise<TrendItem[]> {
  const firestoreTrends = await getFirestoreTrends(countryCode, maxItems, dateStr);
  if (firestoreTrends.length > 0) return firestoreTrends;

  if (dateStr !== getTodayDate()) return [];

  const liveTrends = await fetchTrendsForCountry(countryCode);
  return liveTrends.slice(0, maxItems);
}

export async function findLiveTrendBySlug(
  countryCode: string,
  slug: string
): Promise<TrendItem | null> {
  const decoded = decodeURIComponent(slug);
  const trends = await fetchTrendsForCountry(countryCode);
  return trends.find((trend) => trend.slug === decoded || trend.slug === slug) || null;
}
