import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { api, assetUrl } from "@/lib/api";
import { Driver } from "@/types";

interface FormState {
  fullName: string;
  carName: string;
  experience: string;
  phone: string;
  photo: File | null;
}

const emptyForm: FormState = { fullName: "", carName: "", experience: "", phone: "", photo: null };

export default function DriversManager() {
  const { t } = useTranslation();
  const { data: drivers } = useDrivers(true);
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(driver: Driver) {
    setEditing(driver);
    setForm({
      fullName: driver.fullName,
      carName: driver.carName,
      experience: String(driver.experience),
      phone: driver.phone,
      photo: null,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("carName", form.carName);
      fd.append("experience", form.experience);
      fd.append("phone", form.phone);
      if (form.photo) fd.append("photo", form.photo);

      if (editing) {
        await api.put(`/drivers/${editing.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/drivers", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
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
      await api.delete(`/drivers/${id}`);
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t("admin.menu.drivers")}</h2>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} /> {t("admin.addDriver")}
        </button>
      </div>

      {error && !modalOpen && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {drivers?.map((driver) => (
          <div key={driver.id} className="glass-card p-5 text-center">
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-brand-gradient">
              {driver.photo && (
                <img src={assetUrl(driver.photo)} alt={driver.fullName} className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-3 font-display text-sm font-bold text-white">{driver.fullName}</p>
            <p className="text-xs text-white/50">{driver.carName}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => openEdit(driver)} className="btn-secondary flex-1 !py-1.5 text-xs">
                <Pencil size={13} />
              </button>
              <button
                onClick={() => handleDelete(driver.id)}
                className="glass flex flex-1 items-center justify-center rounded-full !py-1.5 text-xs text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={13} />
              </button>
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
              className="glass-card w-full max-w-md p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">
                  {editing ? t("admin.editDriver") : t("admin.addDriver")}
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
                  placeholder={t("driverForm.fullName")}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder={t("driverForm.carName")}
                  value={form.carName}
                  onChange={(e) => setForm({ ...form, carName: e.target.value })}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder={t("driverForm.experience")}
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder={t("driverForm.phone")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
                  className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-night-950"
                />
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
