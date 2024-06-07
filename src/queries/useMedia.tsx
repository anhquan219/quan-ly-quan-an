import mediaApiRequest from "@/apiRequests/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMediaMuation = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};
