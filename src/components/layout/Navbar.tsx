import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Menu, X, Car, Home, MapPinned, Users, Info, UserPlus, ShoppingBag } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import { useOrderModalStore } from "@/store/useOrderModalStore";

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const openOrder = useOrderModalStore((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scrollToSection(id: string) {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  const navLinks = [
    { label: t("nav.home"), icon: Home, action: () => scrollToSection("home") },
    { label: t("nav.routes"), icon: MapPinned, action: () => scrollToSection("routes") },
    { label: t("nav.drivers"), icon: Users, action: () => scrollToSection("drivers") },
    { label: t("nav.about"), icon: Info, action: () => scrollToSection("about") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen ? "glass shadow-glass" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient bg-200% shadow-glow transition-transform animate-gradient-shift group-hover:scale-105">
            <Car size={20} className="text-night-950" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-white">
            COMFORT <span className="gradient-text">TAXI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/become-driver"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {t("nav.becomeDriver")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
          <button onClick={() => openOrder()} className="btn-primary hidden lg:inline-flex !px-5 !py-2.5 text-sm">
            {t("nav.orderTaxi")}
          </button>
          <button
            className="glass relative z-[60] rounded-full p-2.5 text-white lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menyu"
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-bleed premium panel with icons */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="space-y-1.5 px-5 pb-6 pt-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  onClick={link.action}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white/90 transition-colors hover:bg-white/10 active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-cyan-300">
                    <link.icon size={17} />
                  </span>
                  <span className="font-medium">{link.label}</span>
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.25 }}
              >
                <Link
                  to="/become-driver"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-white/90 transition-colors hover:bg-white/10 active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-amber-400">
                    <UserPlus size={17} />
                  </span>
                  <span className="font-medium">{t("nav.becomeDriver")}</span>
                </Link>
              </motion.div>

              <div className="!mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Sozlamalar
                </span>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  openOrder();
                }}
                className="btn-primary !mt-4 w-full"
              >
                <ShoppingBag size={16} /> {t("nav.orderTaxi")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
