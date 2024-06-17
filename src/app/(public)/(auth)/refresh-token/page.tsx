import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStoreage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function RefreshTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectpathname = searchParams.get("redirect");
  const refreshTokenFromUrl = searchParams.get("refreshToken");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl == getRefreshTokenFromLocalStoreage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          // Redirect đén trang đang truy cập trước đó
          router.push(redirectpathname || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromUrl]);

  return <div>RefreshToken ...</div>;
}
