import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, SquarePlus, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

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
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    // Android / desktop Chrome & Edge fire this when the app is installable
    function handleBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // iOS Safari never fires beforeinstallprompt — show our own instructions instead
    if (isIos()) {
      setVisible(true);
    }

    window.addEventListener("appinstalled", () => setVisible(false));

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleClick() {
    if (isIos()) {
      setShowIosSheet(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible || dismissed) return null;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-brand-gradient bg-200% px-4 py-3 text-sm font-display font-semibold text-night-950 shadow-glow animate-gradient-shift sm:px-5"
      >
        <motion.span
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <Download size={17} />
        </motion.span>
        <span className="hidden sm:inline">Ilovani yuklab oling</span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-night-950/10"
          aria-label="Yopish"
        >
          <X size={13} />
        </span>
      </motion.button>

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
              className="glass-card w-full max-w-sm p-6 sm:mb-0"
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
