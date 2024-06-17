"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStoreage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function RefreshToken() {
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
          // Redirect đến trang đang truy cập trước đó
          router.push(redirectpathname || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromUrl]);

  return <div>RefreshToken ...</div>;
}

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
