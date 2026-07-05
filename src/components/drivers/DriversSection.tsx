import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Phone, Car, Star, RefreshCw } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";
import { assetUrl } from "@/lib/api";

export default function DriversSection() {
  const { t } = useTranslation();
  const { data: drivers, isLoading, isError, refetch, isFetching } = useDrivers();

  return (
    <section id="drivers" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="section-eyebrow">{t("driversSection.eyebrow")}</span>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {t("driversSection.title")}
        </h2>
        <p className="mt-4 text-white/60">{t("driversSection.subtitle")}</p>
      </motion.div>

      {isLoading && (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer-skeleton h-72 rounded-3xl" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="mt-14 flex flex-col items-center gap-3 text-center">
          <p className="text-white/50">Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-secondary !py-2 !px-5 text-sm"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Qayta urinish
          </button>
        </div>
      )}

      {!isLoading && !isError && (!drivers || drivers.length === 0) && (
        <p className="mt-14 text-center text-white/50">{t("driversSection.empty")}</p>
      )}

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {drivers?.map((driver, i) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="animated-border overflow-hidden rounded-3xl bg-night-850 p-5 text-center"
          >
            <div className="mx-auto h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/10">
              {driver.photo ? (
                <img
                  src={assetUrl(driver.photo)}
                  alt={driver.fullName}
                  className="h-full w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brand-gradient font-display text-2xl font-bold text-night-950">
                  {driver.fullName.charAt(0)}
                </div>
              )}
            </div>
            <p className="mt-4 font-display text-base font-bold text-white">{driver.fullName}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-white/60">
              <Car size={14} className="text-cyan-300" /> {driver.carName}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-amber-400">
              <Star size={12} fill="currentColor" /> {driver.experience} {t("driversSection.experience")}
            </p>
            <a
              href={`tel:${driver.phone}`}
              className="btn-secondary mt-4 w-full !py-2 text-sm"
            >
              <Phone size={14} /> {t("driversSection.call")}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
