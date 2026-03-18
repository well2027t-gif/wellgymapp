import { useEffect, useState } from "react";
import { useThemeContext } from "@/lib/theme-provider";

/**
 * Web version: reads from ThemeProvider context so that manual
 * dark/light toggle in the app propagates correctly on web.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { colorScheme } = useThemeContext();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return colorScheme;
  }

  return "dark" as const;
}
