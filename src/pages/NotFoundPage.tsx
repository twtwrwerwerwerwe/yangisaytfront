import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home, Car } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
      <motion.div
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-gradient bg-200% shadow-glow animate-gradient-shift"
      >
        <Car size={40} className="text-night-950" />
      </motion.div>
      <h1 className="mt-8 font-display text-6xl font-extrabold text-white">404</h1>
      <p className="mt-3 font-display text-xl font-bold text-white">{t("common.notFoundTitle")}</p>
      <p className="mt-2 max-w-sm text-white/60">{t("common.notFoundText")}</p>
      <Link to="/" className="btn-primary mt-8">
        <Home size={16} /> {t("common.goHome")}
      </Link>
    </div>
  );
}
