import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Driver } from "@/types";

export function useDrivers(all = false) {
  return useQuery({
    queryKey: ["drivers", all],
    queryFn: async () => {
      const { data } = await api.get<Driver[]>("/drivers", { params: all ? { all: "true" } : {} });
      return data;
    },
  });
}
