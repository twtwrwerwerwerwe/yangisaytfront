import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Car, Phone, MapPin, Send, Instagram, Facebook, ShieldCheck } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className="relative z-10 mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient">
                <Car size={18} className="text-night-950" />
              </div>
              <span className="font-display text-base font-extrabold text-white">
                COMFORT <span className="gradient-text">TAXI</span>
              </span>
            </div>
            <p className="text-sm text-white/60">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <button onClick={() => scrollTo("home")} className="hover:text-cyan-300 transition-colors">
                  {t("nav.home")}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("routes")} className="hover:text-cyan-300 transition-colors">
                  {t("nav.routes")}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("drivers")} className="hover:text-cyan-300 transition-colors">
                  {t("nav.drivers")}
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("about")} className="hover:text-cyan-300 transition-colors">
                  {t("nav.about")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-cyan-300" />
                +998 95 287 16 66
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="text-cyan-300" />
                {t("footer.addressValue")}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              {t("footer.followUs")}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://t.me/akramjonov777"
                aria-label="Telegram"
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-cyan-300"
              >
                <Send size={16} />
              </a>
              <a
                href="https://www.instagram.com/akramjonov.web?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Instagram"
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-cyan-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.instagram.com/akramjonov.web?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Facebook"
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:text-cyan-300"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} Comfort Taxi. {t("footer.rights")}
          </span>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-white/30 transition-colors hover:text-cyan-300"
          >
            <ShieldCheck size={12} /> Admin panelga o'tish
          </Link>
        </div>
      </div>
    </footer>
  );
}
