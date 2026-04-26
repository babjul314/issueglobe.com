import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  const from = request.nextUrl.searchParams.get("from") ?? "auto";
  const to = request.nextUrl.searchParams.get("to") ?? "ko";

  if (!text) return NextResponse.json({ result: "" });
  if (from === "ko") return NextResponse.json({ result: text });

  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const result = data[0]?.map((d: string[]) => d[0]).join("") ?? text;
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ result: text });
  }
}
