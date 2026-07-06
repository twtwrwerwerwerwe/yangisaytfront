import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, SquarePlus, X, Smartphone, Sparkles } from "lucide-react";
import {
  getDeferredPrompt,
  clearDeferredPrompt,
  isAppInstalled,
  onInstallPromptAvailable,
  BeforeInstallPromptEvent,
} from "@/lib/pwaInstall";

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function InstallAppButton() {
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone() || isAppInstalled()) return;

    // Covers the case where beforeinstallprompt already fired before this
    // component mounted (e.g. during the loading screen).
    if (getDeferredPrompt()) setVisible(true);

    // Covers the case where it fires later, after mount.
    const unsubscribe = onInstallPromptAvailable(() => setVisible(true));

    // iOS Safari never fires beforeinstallprompt — show our own button anyway.
    if (isIos()) setVisible(true);

    function handleInstalled() {
      setVisible(false);
    }
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleClick() {
    if (isIos()) {
      setShowIosSheet(true);
      return;
    }
    const prompt = getDeferredPrompt();
    if (!prompt) return;
    await (prompt as BeforeInstallPromptEvent).prompt();
    const { outcome } = await (prompt as BeforeInstallPromptEvent).userChoice;
    if (outcome === "accepted") setVisible(false);
    clearDeferredPrompt();
  }

  if (!visible || dismissed) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="animated-border relative rounded-full"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="relative flex items-center gap-2.5 overflow-hidden rounded-full bg-night-900 px-5 py-3.5 text-sm font-display font-semibold text-white shadow-glow"
          >
            <span className="absolute inset-0 bg-brand-gradient bg-200% opacity-90 animate-gradient-shift" />
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex text-night-950"
            >
              <Download size={18} strokeWidth={2.5} />
            </motion.span>
            <span className="relative text-night-950">Ilovani yuklab oling</span>
            <Sparkles size={13} className="relative text-night-950/60" />
          </motion.button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="glass absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-white/70 hover:text-white"
            aria-label="Yopish"
          >
            <X size={12} />
          </button>
        </motion.div>
      </motion.div>

      {/* iOS instructions sheet */}
      <AnimatePresence>
        {showIosSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIosSheet(false)}
            className="fixed inset-0 z-[95] flex items-end justify-center bg-night-950/70 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="animated-border w-full max-w-sm rounded-3xl bg-night-900 p-6 sm:mb-0"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient">
                    <Smartphone size={17} className="text-night-950" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Ilovani telefoningizga o'rnating
                  </h3>
                </div>
                <button
                  onClick={() => setShowIosSheet(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <ol className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    1
                  </span>
                  <span className="flex items-center gap-1.5">
                    Pastdagi <Share size={15} className="text-cyan-300" /> "Ulashish" tugmasini bosing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    2
                  </span>
                  <span className="flex items-center gap-1.5">
                    <SquarePlus size={15} className="text-cyan-300" /> "Bosh ekranga qo'shish" ni tanlang
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    3
                  </span>
                  <span>Tayyor! Endi Comfort Taxi bosh ekraningizda alohida ilova sifatida ochiladi.</span>
                </li>
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
