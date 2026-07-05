import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { UserPlus, TrendingUp, Clock } from "lucide-react";

export default function BecomeDriverBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] bg-brand-gradient bg-200% p-10 animate-gradient-shift sm:p-14"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-night-950/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-night-950">
              {t("becomeDriverSection.eyebrow")}
            </span>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-night-950 sm:text-4xl">
              {t("becomeDriverSection.title")}
            </h2>
            <p className="mt-4 max-w-lg text-night-950/80">{t("becomeDriverSection.subtitle")}</p>
            <Link
              to="/become-driver"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-night-950 px-7 py-3.5 font-display font-semibold text-white shadow-glass transition-transform hover:scale-105"
            >
              <UserPlus size={18} />
              {t("becomeDriverSection.cta")}
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { icon: TrendingUp, label: "Barqaror daromad" },
              { icon: Clock, label: "Qulay ish grafigi" },
            ].map((item, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-3 rounded-2xl bg-night-950/15 px-5 py-4 backdrop-blur-sm"
              >
                <item.icon size={22} className="text-night-950" />
                <span className="font-medium text-night-950">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
