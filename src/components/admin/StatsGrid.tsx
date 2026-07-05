import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Route as RouteIcon, Users, ShoppingBag, FileText, Sparkles, Clock, Image as ImageIcon } from "lucide-react";
import { useStats } from "@/hooks/useStats";

export default function StatsGrid() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useStats();

  const cards = [
    { key: "routes", icon: RouteIcon, value: stats?.totalRoutes, color: "from-violet-500 to-violet-700" },
    { key: "drivers", icon: Users, value: stats?.totalDrivers, color: "from-cyan-400 to-cyan-600" },
    { key: "orders", icon: ShoppingBag, value: stats?.totalOrders, color: "from-amber-400 to-amber-600" },
    { key: "applications", icon: FileText, value: stats?.totalApplications, color: "from-magenta-400 to-magenta-500" },
    { key: "promotions", icon: Sparkles, value: stats?.totalPromotions, color: "from-violet-400 to-cyan-400" },
    { key: "pending", icon: Clock, value: stats?.pendingApplications, color: "from-amber-300 to-magenta-400" },
    { key: "heroSlides", icon: ImageIcon, value: stats?.totalHeroSlides, color: "from-cyan-300 to-violet-500" },
  ] as const;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="glass-card flex items-center gap-4 p-6"
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} shadow-glow`}>
            <card.icon size={22} className="text-night-950" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/50">{t(`admin.stats.${card.key}`)}</p>
            <p className="font-display text-2xl font-extrabold text-white">
              {isLoading ? "—" : (card.value ?? 0).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
