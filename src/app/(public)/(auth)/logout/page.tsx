import { useAppContext } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStoreage,
  getRefreshTokenFromLocalStoreage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function LogoutPage() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsAuth } = useAppContext();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const ref = useRef<any>(null); // Tránh gọi liên tục 2 lần

  useEffect(() => {
    if (
      !ref.current &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStoreage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStoreage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setIsAuth(false);
        setTimeout(() => {
          ref.current = null;
        }, 1000);
      });
    } else {
      router.push("/");
    }
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl]);

  return <div>Logout</div>;
}
