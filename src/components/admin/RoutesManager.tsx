import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2, Clock } from "lucide-react";
import { useRoutes } from "@/hooks/useRoutes";
import { api } from "@/lib/api";
import { Route } from "@/types";

interface FormState {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  travelTime: string;
  frontSeatPrice: string;
  middleSeatPrice: string;
  backSeatPrice: string;
  parcelPrice: string;
}

const emptyForm: FormState = {
  nameUz: "",
  nameRu: "",
  nameEn: "",
  travelTime: "",
  frontSeatPrice: "",
  middleSeatPrice: "",
  backSeatPrice: "",
  parcelPrice: "",
};

export default function RoutesManager() {
  const { t } = useTranslation();
  const { data: routes } = useRoutes(true);
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(route: Route) {
    setEditing(route);
    setForm({
      nameUz: route.nameUz,
      nameRu: route.nameRu,
      nameEn: route.nameEn,
      travelTime: route.travelTime,
      frontSeatPrice: String(route.frontSeatPrice),
      middleSeatPrice: String(route.middleSeatPrice),
      backSeatPrice: String(route.backSeatPrice),
      parcelPrice: String(route.parcelPrice),
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        nameUz: form.nameUz,
        nameRu: form.nameRu,
        nameEn: form.nameEn,
        travelTime: form.travelTime,
        frontSeatPrice: form.frontSeatPrice,
        middleSeatPrice: form.middleSeatPrice,
        backSeatPrice: form.backSeatPrice,
        parcelPrice: form.parcelPrice,
      };

      if (editing) {
        await api.put(`/routes/${editing.id}`, payload);
      } else {
        await api.post("/routes", payload);
      }
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      setModalOpen(false);
    } catch (err: any) {
      setError(
        !err.response
          ? "Server bilan aloqa yo'q. Backend ishlab turganini tekshiring."
          : err.response.data?.message || `Xatolik (${err.response.status})`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/routes/${id}`);
      queryClient.invalidateQueries({ queryKey: ["routes"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t("admin.menu.routes")}</h2>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} /> {t("admin.addRoute")}
        </button>
      </div>

      {error && !modalOpen && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes?.map((route) => (
          <div key={route.id} className="glass-card overflow-hidden">
            <div className="flex items-center justify-between bg-brand-gradient-cool p-4">
              <p className="font-display font-bold text-night-950">{route.nameUz}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-night-950/70">
                <Clock size={13} /> {route.travelTime || "—"}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/50">
                {route.frontSeatPrice.toLocaleString()} / {route.middleSeatPrice.toLocaleString()} /{" "}
                {route.backSeatPrice.toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(route)} className="btn-secondary flex-1 !py-1.5 text-xs">
                  <Pencil size={13} /> {t("admin.edit")}
                </button>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="glass flex flex-1 items-center justify-center gap-1.5 rounded-full !py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={13} /> {t("admin.delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-night-950/80 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  {editing ? t("admin.editRoute") : t("admin.addRoute")}
                </h3>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setError("");
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <input
                  placeholder="Nomi (UZ) — masalan: Toshkent - Samarqand"
                  value={form.nameUz}
                  onChange={(e) => setForm({ ...form, nameUz: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Название (RU)"
                  value={form.nameRu}
                  onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Name (EN)"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="input-field"
                />
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs text-white/50">
                    <Clock size={13} /> Yo'l davomiyligi (masalan: "3 soat 30 daqiqa")
                  </label>
                  <input
                    placeholder="3 soat 30 daqiqa"
                    value={form.travelTime}
                    onChange={(e) => setForm({ ...form, travelTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={t("routesSection.frontSeat")}
                    value={form.frontSeatPrice}
                    onChange={(e) => setForm({ ...form, frontSeatPrice: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder={t("routesSection.middleSeat")}
                    value={form.middleSeatPrice}
                    onChange={(e) => setForm({ ...form, middleSeatPrice: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder={t("routesSection.backSeat")}
                    value={form.backSeatPrice}
                    onChange={(e) => setForm({ ...form, backSeatPrice: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder={t("routesSection.parcel")}
                    value={form.parcelPrice}
                    onChange={(e) => setForm({ ...form, parcelPrice: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <button onClick={handleSave} disabled={saving} className="btn-primary mt-6 w-full">
                {saving ? <Loader2 size={16} className="animate-spin" /> : t("admin.save")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
