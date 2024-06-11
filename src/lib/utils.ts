import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "@/lib/http";
import { toast } from "@/components/ui/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrower = typeof window !== "undefined";

export const getAccessTokenFromLocalStoreage = () => {
  return isBrower ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStoreage = () => {
  return isBrower ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStoreage = (value: string) => {
  return isBrower && localStorage.setItem("accessToken", value);
};

export const setRefreshTokenToLocalStoreage = (value: string) => {
  return isBrower && localStorage.setItem("refreshToken", value);
};
