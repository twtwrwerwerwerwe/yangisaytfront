import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, RefreshCw } from "lucide-react";
import { useRoutes } from "@/hooks/useRoutes";
import { useLocalized } from "@/hooks/useLocalized";
import { useOrderModalStore } from "@/store/useOrderModalStore";
import { assetUrl } from "@/lib/api";

export default function RoutesSection() {
  const { t } = useTranslation();
  const { data: routes, isLoading, isError, refetch, isFetching } = useRoutes();
  const pick = useLocalized();
  const openOrder = useOrderModalStore((s) => s.open);

  return (
    <section id="routes" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="section-eyebrow">{t("routesSection.eyebrow")}</span>
        <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {t("routesSection.title")}
        </h2>
        <p className="mt-4 text-white/60">{t("routesSection.subtitle")}</p>
      </motion.div>

      {isLoading && (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shimmer-skeleton h-80 rounded-3xl" />
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

      {!isLoading && !isError && (!routes || routes.length === 0) && (
        <p className="mt-14 text-center text-white/50">{t("routesSection.empty")}</p>
      )}

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes?.map((route, i) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="animated-border group relative overflow-hidden rounded-3xl bg-night-850"
          >
            <div className="relative h-44 overflow-hidden">
              {route.image ? (
                <img
                  src={assetUrl(route.image)}
                  alt={pick(route, "name")}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              ) : (
                <div className="h-full w-full bg-brand-gradient-cool" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-night-850 via-night-850/20 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white">
                <MapPin size={16} className="text-cyan-300" />
                <span className="font-display text-lg font-bold">{pick(route, "name")}</span>
              </div>
            </div>

            <div className="space-y-2 p-5">
              <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                <div className="glass rounded-xl px-3 py-2">
                  <p>{t("routesSection.frontSeat")}</p>
                  <p className="font-semibold text-white">
                    {route.frontSeatPrice.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
                <div className="glass rounded-xl px-3 py-2">
                  <p>{t("routesSection.backSeat")}</p>
                  <p className="font-semibold text-white">
                    {route.backSeatPrice.toLocaleString()} {t("common.currency")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openOrder(route.id)}
                className="btn-primary mt-3 w-full !py-2.5 text-sm"
              >
                {t("routesSection.order")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {routes && routes.length > 0 && (
        <div className="mt-14 overflow-hidden">
          <div className="flex animate-marquee gap-6 opacity-70">
            {[...routes, ...routes].map((route, i) => (
              <div
                key={i}
                className="glass flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm text-white/70"
              >
                <MapPin size={14} className="text-amber-400" />
                {pick(route, "name")} · {route.frontSeatPrice.toLocaleString()} {t("common.currency")}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
