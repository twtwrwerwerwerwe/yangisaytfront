import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Building2, Code2, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  const { t } = useTranslation();

  const cards = [
    { icon: Building2, title: t("about.companyTitle"), text: t("about.companyText") },
    { icon: Code2, title: t("about.founderTitle"), text: t("about.founderText") },
    { icon: ShieldCheck, title: t("about.adminTitle"), text: t("about.adminText") },
  ];

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="section-eyebrow">{t("about.eyebrow")}</span>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {t("about.title")}
        </h2>
      </motion.div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="glass-card p-7"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
              <card.icon size={22} className="text-night-950" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/60">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
