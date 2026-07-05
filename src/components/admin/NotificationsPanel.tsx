import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Notification } from "@/types";

export default function NotificationsPanel() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get<Notification[]>("/notifications");
      return data;
    },
    refetchInterval: 15000,
  });

  async function markAllRead() {
    await api.post("/notifications/read-all");
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t("admin.menu.notifications")}</h2>
        <button onClick={markAllRead} className="btn-secondary !py-2 !px-4 text-sm">
          <CheckCheck size={15} /> {t("admin.markAllRead")}
        </button>
      </div>

      <div className="space-y-2">
        {notifications?.map((n) => (
          <div
            key={n.id}
            className={`glass-card flex items-center gap-3 p-4 ${!n.isRead ? "border-cyan-400/30" : ""}`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${!n.isRead ? "bg-brand-gradient" : "glass"}`}>
              <Bell size={15} className={!n.isRead ? "text-night-950" : "text-white/60"} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90">{n.titleUz}</p>
              <p className="text-xs text-white/40">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            {!n.isRead && <span className="h-2 w-2 rounded-full bg-cyan-400" />}
          </div>
        ))}
        {notifications?.length === 0 && (
          <p className="text-center text-white/50">{t("admin.noNotifications")}</p>
        )}
      </div>
    </div>
  );
}
