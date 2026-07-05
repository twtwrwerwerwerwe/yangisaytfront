import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Route } from "@/types";

export function useRoutes(all = false) {
  return useQuery({
    queryKey: ["routes", all],
    queryFn: async () => {
      const { data } = await api.get<Route[]>("/routes", { params: all ? { all: "true" } : {} });
      return data;
    },
  });
}
