import { authApiRequest } from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(requst: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được accessToken, refreshToken",
      },
      {
        status: 200,
      }
    );
  }

  try {
    const { payload } = await authApiRequest.sLogout({
      accessToken,
      refreshToken,
    });
    return Response.json(payload);
  } catch (error) {
    return Response.json(
      {
        message: "Lỗi khi gọi API đến Server BE",
      },
      {
        status: 200,
      }
    );
  }
}
