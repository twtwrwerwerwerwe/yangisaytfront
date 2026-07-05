import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import { api, assetUrl } from "@/lib/api";

interface FormState {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  image: File | null;
}

const emptyForm: FormState = {
  titleUz: "",
  titleRu: "",
  titleEn: "",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  image: null,
};

export default function PromotionsManager() {
  const { t } = useTranslation();
  const { data: promotions } = usePromotions(true);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value) fd.append("image", value as File);
        } else {
          fd.append(key, value as string);
        }
      });
      await api.post("/promotions", fd, { headers: { "Content-Type": "multipart/form-data" } });
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      setModalOpen(false);
      setForm(emptyForm);
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
      await api.delete(`/promotions/${id}`);
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t("admin.menu.promotions")}</h2>
        <button onClick={() => setModalOpen(true)} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} /> {t("admin.addPromotion")}
        </button>
      </div>

      {error && !modalOpen && (
        <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions?.map((promo) => (
          <div key={promo.id} className="glass-card overflow-hidden">
            {promo.image && (
              <img src={assetUrl(promo.image)} alt={promo.titleUz} className="h-28 w-full object-cover" />
            )}
            <div className="p-4">
              <p className="font-display font-bold text-white">{promo.titleUz}</p>
              <p className="mt-1 line-clamp-2 text-xs text-white/50">{promo.descriptionUz}</p>
              <button
                onClick={() => handleDelete(promo.id)}
                className="glass mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-xs text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={13} /> {t("admin.delete")}
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
              className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">{t("admin.addPromotion")}</h3>
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
                  placeholder="Sarlavha (UZ)"
                  value={form.titleUz}
                  onChange={(e) => setForm({ ...form, titleUz: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Заголовок (RU)"
                  value={form.titleRu}
                  onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Title (EN)"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  className="input-field"
                />
                <textarea
                  placeholder="Tavsif (UZ)"
                  value={form.descriptionUz}
                  onChange={(e) => setForm({ ...form, descriptionUz: e.target.value })}
                  className="input-field"
                  rows={2}
                />
                <textarea
                  placeholder="Описание (RU)"
                  value={form.descriptionRu}
                  onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })}
                  className="input-field"
                  rows={2}
                />
                <textarea
                  placeholder="Description (EN)"
                  value={form.descriptionEn}
                  onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
                  className="input-field"
                  rows={2}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
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
