"use client";

import {
  getAccessTokenFromLocalStoreage,
  getRefreshTokenFromLocalStoreage,
  setAccessTokenToLocalStoreage,
  setRefreshTokenToLocalStoreage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { authApiRequest } from "@/apiRequests/auth";

// Path không check refresh-token
const UNAUTHENTICATED_PATH = ["/login", "logout", "/refresh-token"];

export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStoreage();
      const refreshToken = getRefreshTokenFromLocalStoreage();
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number; // Time hết hạn
        iat: number; // Time khởi tạo
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };

      const now = Math.round(new Date().getTime() / 1000); // epoch time

      // TH refreshToken hết hạn thì không xử lý  => Logout luôn
      if (decodedRefreshToken.exp <= now) return;
      // Thời gian còn lại: decodedAccessToken.exp - now (3 tiếng)
      // Thời gian hết hạn: decodedAccessToken.exp - decodedAccessToken.iat (12 tiếng)
      // Kiểm tra thời gian còn lại < 1/3 thời gian hết hạn sẽ  refreshToken
      if (
        decodedAccessToken.exp - now <
        (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.refreshToken();
          setAccessTokenToLocalStoreage(res.payload.data.accessToken);
          setRefreshTokenToLocalStoreage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };

    checkAndRefreshToken();
    interval = setInterval(checkAndRefreshToken, 1000);

    // Clear khi chuyển page (Tránh bị gọi lặp)
    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
