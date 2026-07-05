import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Promotion } from "@/types";

export function usePromotions(all = false) {
  return useQuery({
    queryKey: ["promotions", all],
    queryFn: async () => {
      const { data } = await api.get<Promotion[]>("/promotions", { params: all ? { all: "true" } : {} });
      return data;
    },
  });
}
