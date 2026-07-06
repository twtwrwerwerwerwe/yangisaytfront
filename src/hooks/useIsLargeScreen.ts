import { useEffect, useState } from "react";

export function useIsLargeScreen(breakpoint = 1024) {
  const [isLarge, setIsLarge] = useState(
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsLarge(e.matches);
    setIsLarge(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isLarge;
}
