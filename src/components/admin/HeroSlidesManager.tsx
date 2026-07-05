import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, X, Loader2, GripVertical } from "lucide-react";
import { useHeroSlides } from "@/hooks/useHeroSlides";
import { api, assetUrl } from "@/lib/api";
import { HeroSlide } from "@/types";

interface FormState {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  order: string;
  image: File | null;
}

const emptyForm: FormState = { titleUz: "", titleRu: "", titleEn: "", order: "0", image: null };

export default function HeroSlidesManager() {
  const { t } = useTranslation();
  const { data: slides } = useHeroSlides(true);
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, order: String((slides?.length || 0) + 1) });
    setError("");
    setModalOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditing(slide);
    setForm({
      titleUz: slide.titleUz,
      titleRu: slide.titleRu,
      titleEn: slide.titleEn,
      order: String(slide.order),
      image: null,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("titleUz", form.titleUz);
      fd.append("titleRu", form.titleRu);
      fd.append("titleEn", form.titleEn);
      fd.append("order", form.order);
      if (form.image) fd.append("image", form.image);

      if (editing) {
        await api.put(`/hero-slides/${editing.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/hero-slides", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
      setModalOpen(false);
    } catch (err: any) {
      if (!err.response) {
        setError("Server bilan aloqa yo'q. Backend ishlab turganini tekshiring.");
      } else {
        setError(
          err.response.data?.message ||
            `Xatolik (${err.response.status}). Ma'lumotlar bazasida "HeroSlide" jadvali mavjudligini tekshiring — kerak bo'lsa "npx prisma db push" ni ishga tushiring.`
        );
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/hero-slides/${id}`);
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
    } catch (err: any) {
      setError(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t("admin.menu.heroSlides")}</h2>
        <button onClick={openAdd} className="btn-primary !py-2 !px-4 text-sm">
          <Plus size={16} /> {t("admin.addHeroSlide")}
        </button>
      </div>
      <p className="mb-5 text-sm text-white/50">
        Bosh sahifadagi katta rasm-slaydlar shu yerdan boshqariladi. "Tartib" raqami kichik bo'lgan
        slayd birinchi ko'rsatiladi.
      </p>

      {error && !modalOpen && (
        <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides
          ?.slice()
          .sort((a, b) => a.order - b.order)
          .map((slide) => (
            <div key={slide.id} className="glass-card overflow-hidden">
              <div className="relative h-32 bg-brand-gradient-cool">
                {slide.image && (
                  <img src={assetUrl(slide.image)} alt={slide.titleUz} className="h-full w-full object-cover" />
                )}
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-night-950/70 px-2 py-1 text-[10px] font-semibold text-white">
                  <GripVertical size={11} /> #{slide.order}
                </span>
                {!slide.isActive && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-500/80 px-2 py-1 text-[10px] font-semibold text-white">
                    Nofaol
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-display font-bold text-white">{slide.titleUz}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => openEdit(slide)} className="btn-secondary flex-1 !py-1.5 text-xs">
                    <Pencil size={13} /> {t("admin.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="glass flex flex-1 items-center justify-center gap-1.5 rounded-full !py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={13} /> {t("admin.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}

        {slides?.length === 0 && (
          <p className="col-span-full text-center text-white/50">{t("routesSection.empty")}</p>
        )}
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
                  {editing ? t("admin.editHeroSlide") : t("admin.addHeroSlide")}
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
                  placeholder="Yo'nalish nomi (UZ) — masalan: Toshkent - Samarqand"
                  value={form.titleUz}
                  onChange={(e) => setForm({ ...form, titleUz: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Название (RU)"
                  value={form.titleRu}
                  onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                  className="input-field"
                />
                <input
                  placeholder="Name (EN)"
                  value={form.titleEn}
                  onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                  className="input-field"
                />
                <div>
                  <label className="mb-1 block text-xs text-white/50">Tartib raqami (kichik = birinchi)</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">
                    Rasm {editing ? "(o'zgartirmasangiz eskisi qoladi)" : "(shart)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                    className="input-field file:mr-3 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-night-950"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving || (!editing && !form.image)}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : t("admin.save")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
