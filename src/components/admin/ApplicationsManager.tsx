import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, FileText, Image as ImageIcon } from "lucide-react";
import { api, assetUrl } from "@/lib/api";
import { DriverApplication } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-300",
  APPROVED: "bg-cyan-500/20 text-cyan-300",
  REJECTED: "bg-red-500/20 text-red-300",
};

export default function ApplicationsManager() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const { data: applications } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await api.get<DriverApplication[]>("/applications");
      return data;
    },
  });

  async function approve(id: string) {
    setError("");
    try {
      await api.post(`/applications/${id}/approve`);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "Tasdiqlashda xatolik yuz berdi");
    }
  }

  async function reject(id: string) {
    setError("");
    try {
      await api.post(`/applications/${id}/reject`);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "Rad etishda xatolik yuz berdi");
    }
  }

  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-bold text-white">{t("admin.menu.applications")}</h2>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {applications?.map((app) => (
          <div key={app.id} className="glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold text-white">{app.fullName}</p>
                <p className="text-sm text-white/50">
                  {app.carName} · {app.experience} {t("common.years")} · {app.phone}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[app.status]}`}>
                {t(`admin.status${app.status.charAt(0) + app.status.slice(1).toLowerCase()}`)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {app.carPhotos.map((photo, i) => (
                <a key={i} href={assetUrl(photo)} target="_blank" rel="noreferrer">
                  <img src={assetUrl(photo)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                </a>
              ))}
              {app.receiptImage && (
                <a
                  href={assetUrl(app.receiptImage)}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex h-16 w-16 items-center justify-center rounded-xl text-cyan-300"
                >
                  <ImageIcon size={20} />
                </a>
              )}
              {app.receiptPdf && (
                <a
                  href={assetUrl(app.receiptPdf)}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex h-16 w-16 items-center justify-center rounded-xl text-cyan-300"
                >
                  <FileText size={20} />
                </a>
              )}
            </div>

            {app.status === "PENDING" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => approve(app.id)}
                  className="btn-primary flex-1 !py-2 text-sm"
                >
                  <Check size={15} /> {t("admin.approve")}
                </button>
                <button
                  onClick={() => reject(app.id)}
                  className="glass flex flex-1 items-center justify-center gap-1.5 rounded-full !py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <X size={15} /> {t("admin.reject")}
                </button>
              </div>
            )}
          </div>
        ))}

        {applications?.length === 0 && (
          <p className="text-center text-white/50">{t("driversSection.empty")}</p>
        )}
      </div>
    </div>
  );
}
