"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Path không check refresh-token
const UNAUTHENTICATED_PATH = ["/login", "logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    interval = setInterval(checkAndRefreshToken, 1000);

    // Clear khi chuyển page (Tránh bị gọi lặp)
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
