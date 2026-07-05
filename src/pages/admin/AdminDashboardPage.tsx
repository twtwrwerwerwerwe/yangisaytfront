import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutGrid,
  Route as RouteIcon,
  Users,
  FileText,
  Sparkles,
  Bell,
  LogOut,
  Car,
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useAdminStore } from "@/store/useAdminStore";
import { api } from "@/lib/api";
import { Notification } from "@/types";
import StatsGrid from "@/components/admin/StatsGrid";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import RoutesManager from "@/components/admin/RoutesManager";
import DriversManager from "@/components/admin/DriversManager";
import ApplicationsManager from "@/components/admin/ApplicationsManager";
import PromotionsManager from "@/components/admin/PromotionsManager";
import NotificationsPanel from "@/components/admin/NotificationsPanel";

type Tab = "dashboard" | "heroSlides" | "routes" | "drivers" | "applications" | "promotions" | "notifications";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);
  const username = useAdminStore((s) => s.username);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get<Notification[]>("/notifications");
      return data;
    },
    refetchInterval: 15000,
  });
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const menuItems: { key: Tab; icon: any }[] = [
    { key: "dashboard", icon: LayoutGrid },
    { key: "heroSlides", icon: ImageIcon },
    { key: "routes", icon: RouteIcon },
    { key: "drivers", icon: Users },
    { key: "applications", icon: FileText },
    { key: "promotions", icon: Sparkles },
    { key: "notifications", icon: Bell },
  ];

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="force-dark relative min-h-screen bg-night-950">
      <div className="pointer-events-none fixed inset-0 bg-aurora-gradient opacity-50" />

      <div className="relative z-10 flex min-h-screen">
        {/* Mobile backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-night-950/70 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside
          className={`glass fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 p-5 transition-transform lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient">
                <Car size={18} className="text-night-950" />
              </div>
              <span className="font-display text-sm font-extrabold text-white">
                COMFORT <span className="gradient-text">TAXI</span>
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white/60 lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setTab(item.key);
                  setSidebarOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  tab === item.key ? "bg-brand-gradient text-night-950" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <item.icon size={17} />
                {t(`admin.menu.${item.key}`)}
                {item.key === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-5 left-5 right-5">
            <div className="mb-3 glass rounded-xl px-4 py-3 text-xs text-white/60">
              {t("admin.username")}: <span className="text-white">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut size={15} /> {t("admin.logout")}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <header className="glass sticky top-0 z-30 flex items-center justify-between border-b border-white/10 px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="text-white lg:hidden">
              <Menu size={22} />
            </button>
            <h1 className="font-display text-lg font-bold text-white">{t("admin.dashboard")}</h1>
            <div className="relative">
              <Bell size={20} className="text-white/70" />
              {unreadCount > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
          </header>

          <main className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "dashboard" && <StatsGrid />}
                {tab === "heroSlides" && <HeroSlidesManager />}
                {tab === "routes" && <RoutesManager />}
                {tab === "drivers" && <DriversManager />}
                {tab === "applications" && <ApplicationsManager />}
                {tab === "promotions" && <PromotionsManager />}
                {tab === "notifications" && <NotificationsPanel />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
