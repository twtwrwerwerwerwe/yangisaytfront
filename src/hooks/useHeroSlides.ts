import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { HeroSlide } from "@/types";

export function useHeroSlides(all = false) {
  return useQuery({
    queryKey: ["hero-slides", all],
    queryFn: async () => {
      const { data } = await api.get<HeroSlide[]>("/hero-slides", {
        params: all ? { all: "true" } : {},
      });
      return data;
    },
  });
}
