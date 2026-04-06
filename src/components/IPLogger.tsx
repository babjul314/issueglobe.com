"use client";

import { useEffect } from "react";

export default function IPLogger() {
  useEffect(() => {
    async function logIP() {
      try {
        const response = await fetch("/api/ip-info");
        const data = await response.json();

        console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #3B82F6; font-weight: bold; font-size: 14px");
        console.log("%c🌍 IssueGlobe - IP Information", "color: #3B82F6; font-weight: bold; font-size: 14px");
        console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #3B82F6; font-weight: bold; font-size: 14px");
        console.log(
          `%c📍 Country: %c${data.country_name}`,
          "font-weight: bold; color: #666;",
          "color: #10B981; font-weight: bold; font-size: 14px"
        );
        console.log(
          `%c🌐 Country Code: %c${data.country_code}`,
          "font-weight: bold; color: #666;",
          "color: #8B5CF6; font-weight: bold; font-size: 14px"
        );
        console.log(
          `%c🔍 Your IP Address: %c${data.ip}`,
          "font-weight: bold; color: #666;",
          "color: #EF4444; font-weight: bold; font-size: 14px"
        );
        console.log(
          `%c📡 Vercel IP Header: %c${data.x_vercel_ip_country || "Not detected"}`,
          "font-weight: bold; color: #666;",
          "color: #F59E0B; font-size: 12px"
        );
        console.log(
          `%c🔗 CloudFlare IP: %c${data.cf_ipcountry || "Not detected"}`,
          "font-weight: bold; color: #666;",
          "color: #F59E0B; font-size: 12px"
        );
        console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #3B82F6; font-weight: bold; font-size: 14px");
      } catch (error) {
        console.error("Failed to fetch IP info:", error);
      }
    }

    logIP();
  }, []);

  return null;
}
