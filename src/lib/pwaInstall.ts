export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Listener = (e: BeforeInstallPromptEvent) => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<Listener>();

// This runs once, as soon as this module is first imported — which happens
// during initial script evaluation, well before React mounts or the loading
// screen finishes. Chrome/Edge can fire beforeinstallprompt very early, so
// attaching the listener inside a component's useEffect (which only runs
// after mount) can miss it entirely. Module-level registration doesn't.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    listeners.forEach((cb) => cb(deferredPrompt as BeforeInstallPromptEvent));
  });

  window.addEventListener("appinstalled", () => {
    installed = true;
    deferredPrompt = null;
  });
}

export function getDeferredPrompt() {
  return deferredPrompt;
}

export function clearDeferredPrompt() {
  deferredPrompt = null;
}

export function isAppInstalled() {
  return installed;
}

/** Subscribe to be notified once the install prompt becomes available. Returns an unsubscribe function. */
export function onInstallPromptAvailable(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
