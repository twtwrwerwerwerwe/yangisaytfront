import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOrderModalStore } from "@/store/useOrderModalStore";
import { useHeroSlides } from "@/hooks/useHeroSlides";
import { useLocalized } from "@/hooks/useLocalized";
import { useTypewriterLoop } from "@/hooks/useTypewriterLoop";
import { assetUrl } from "@/lib/api";

export default function Hero() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const openOrder = useOrderModalStore((s) => s.open);
  const { data: slides } = useHeroSlides();
  const pick = useLocalized();

  const hasSlides = !!slides && slides.length > 0;

  const next = useCallback(() => {
    if (!hasSlides) return;
    setIndex((i) => (i + 1) % slides!.length);
  }, [hasSlides, slides]);

  const prev = () => {
    if (!hasSlides) return;
    setIndex((i) => (i - 1 + slides!.length) % slides!.length);
  };

  useEffect(() => {
    if (!hasSlides) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, hasSlides]);

  useEffect(() => {
    setIndex(0);
  }, [slides?.length]);

  function scrollToRoutes() {
    document.getElementById("routes")?.scrollIntoView({ behavior: "smooth" });
  }

  const headingSegments = useMemo(
    () => [
      { text: `${t("hero.titleLine1")} ` },
      { text: t("hero.titleLine2"), className: "gradient-text" },
    ],
    [t]
  );
  const { rendered } = useTypewriterLoop(headingSegments);

  const currentSlide = hasSlides ? slides![index] : null;

  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden pt-10">
      <AnimatePresence mode="sync">
        {currentSlide ? (
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 -z-10"
          >
            <img
              src={assetUrl(currentSlide.image)}
              alt={pick(currentSlide, "title")}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/70 to-night-900/40" />
            <div className="absolute inset-0 bg-aurora-gradient opacity-60" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 -z-10 bg-night-900">
            <div className="absolute inset-0 bg-aurora-gradient" />
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-eyebrow"
          >
            {t("hero.eyebrow")}
          </motion.span>

          <h1 className="mt-6 min-h-[3.4em] font-display text-3xl font-extrabold leading-[1.15] text-white sm:min-h-[2.3em] sm:text-5xl sm:leading-[1.05] lg:text-6xl">
            {rendered.map((seg, i) => (
              <span key={i} className={seg.className}>
                {seg.revealed}
              </span>
            ))}
            <span className="animate-pulse-glow text-cyan-300">|</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-base text-white/70 sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button onClick={scrollToRoutes} className="btn-primary">
              {t("hero.cta")}
            </button>
            <button onClick={() => openOrder()} className="btn-secondary">
              {t("hero.ctaOrder")}
            </button>
          </motion.div>

          {/* Compact slide switcher — visible on mobile/tablet where the side panel is hidden */}
          {hasSlides && (
            <div className="mt-8 flex items-center gap-3 lg:hidden">
              <button
                onClick={prev}
                className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                aria-label="Oldingi"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex flex-1 items-center gap-2">
                {slides!.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-7 bg-brand-gradient" : "w-3 bg-white/20"
                    }`}
                    aria-label={`Slayd ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                aria-label="Keyingi"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {hasSlides && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex lg:items-end"
          >
            <div className="glass-card w-full p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide!.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xs uppercase tracking-widest text-cyan-300">
                    {t("routesSection.eyebrow")}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">
                    {pick(currentSlide!, "title")}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {slides!.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-8 bg-brand-gradient" : "w-4 bg-white/20"
                      }`}
                      aria-label={`Slayd ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="glass flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                    aria-label="Oldingi"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={next}
                    className="glass flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105"
                    aria-label="Keyingi"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-violet-600/30 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-10 top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
