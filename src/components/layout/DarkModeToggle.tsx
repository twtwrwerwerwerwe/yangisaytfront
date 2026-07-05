import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export default function DarkModeToggle() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <button
      onClick={toggle}
      aria-label="Rejimni almashtirish"
      className="glass relative flex h-10 w-[68px] items-center rounded-full px-1 transition-colors"
    >
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient shadow-glow"
        animate={{ x: isDark ? 0 : 30 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {isDark ? (
          <Moon size={16} className="text-night-950" />
        ) : (
          <Sun size={16} className="text-night-950" />
        )}
      </motion.div>
    </button>
  );
}
