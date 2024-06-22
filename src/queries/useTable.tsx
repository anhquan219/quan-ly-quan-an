import { tableApiRequest } from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTableListQuery = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list,
  });
};

export const useGetTableQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryCliet = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryCliet.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryCliet = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryCliet.invalidateQueries({
        queryKey: ["tables"],
        exact: true,
      });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
