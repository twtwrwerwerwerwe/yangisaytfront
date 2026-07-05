import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import { useLocalized } from "@/hooks/useLocalized";
import { assetUrl } from "@/lib/api";

export default function PromotionsSection() {
  const { data: promotions } = usePromotions();
  const pick = useLocalized();
  const { t } = useTranslation();

  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <Sparkles size={18} className="text-amber-400" />
        <h3 className="font-display text-xl font-bold text-white">Aksiyalar</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo, i) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="animated-border overflow-hidden rounded-3xl bg-night-850"
          >
            {promo.image && (
              <img
                src={assetUrl(promo.image)}
                alt={pick(promo, "title")}
                className="h-32 w-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
            <div className="p-5">
              <p className="font-display text-base font-bold text-white">{pick(promo, "title")}</p>
              <p className="mt-2 text-sm text-white/60">{pick(promo, "description")}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
