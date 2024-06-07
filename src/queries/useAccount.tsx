import { accountApiRequest } from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = (
  onSuccess?: (data: AccountResType) => void
) => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: () =>
      accountApiRequest.me().then((res) => {
        if (onSuccess) {
          onSuccess(res.payload);
        }
        return res; // Luôn phải trả về nếu không sẽ không có dữ liệu khi gọi { data } = useAccountProfile()
      }),
  });
};
