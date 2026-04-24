"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ReferralTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1. Capture Ref Code
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("nexoura_ref", ref);
      // Set cookie for 30 days
      document.cookie = `nexoura_ref=${ref}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }

    // 2. Track Visit
    const trackVisit = async () => {
      // Prevent duplicate tracking in same session
      const sessionKey = `tracked_${pathname}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const refCode = localStorage.getItem("nexoura_ref") || undefined;
        await axios.post("/api/visit", {
          path: pathname,
          refCode: refCode,
          userAgent: navigator.userAgent,
        });
        sessionStorage.setItem(sessionKey, "true");
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackVisit();
  }, [pathname, searchParams]);

  return null;
}
