import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();

  const ipCountry = headersList.get("x-vercel-ip-country") ||
                    headersList.get("cf-ipcountry");
  const ipAddress = headersList.get("x-forwarded-for") ||
                    headersList.get("x-real-ip") ||
                    headersList.get("cf-connecting-ip") ||
                    "Unknown";
  const userAgent = headersList.get("user-agent") || "Unknown";

  const countryMap: Record<string, string> = {
    KR: "South Korea 🇰🇷",
    JP: "Japan 🇯🇵",
    US: "United States 🇺🇸",
    GB: "United Kingdom 🇬🇧",
    DE: "Germany 🇩🇪",
    FR: "France 🇫🇷",
    IN: "India 🇮🇳",
    BR: "Brazil 🇧🇷",
    CA: "Canada 🇨🇦",
    AU: "Australia 🇦🇺",
    CN: "China 🇨🇳",
  };

  const countryName = ipCountry ? countryMap[ipCountry] || `${ipCountry}` : "Unknown";

  return Response.json({
    ip: ipAddress,
    country_code: ipCountry || "Unknown",
    country_name: countryName,
    x_vercel_ip_country: headersList.get("x-vercel-ip-country"),
    cf_ipcountry: headersList.get("cf-ipcountry"),
    x_forwarded_for: headersList.get("x-forwarded-for"),
    user_agent: userAgent,
  });
}
