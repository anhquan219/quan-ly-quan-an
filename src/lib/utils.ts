import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormSetError } from "react-hook-form";
import { EntityError } from "@/lib/http";
import { toast } from "@/components/ui/use-toast";
import jwt from "jsonwebtoken";
import { authApiRequest } from "@/apiRequests/auth";
import { DishStatus, TableStatus } from "@/constants/type";
import envConfig from "@/config";

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

export const removeTokensFromLocalStorage = () => {
  isBrower && localStorage.removeItem("accessToken");
  isBrower && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
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
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }
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
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

