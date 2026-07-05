import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night-900">
      <div className="pointer-events-none absolute inset-0 bg-aurora-gradient opacity-70" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-6 h-20 w-20">
          <motion.div
            className="absolute inset-0 rounded-2xl bg-brand-gradient bg-200% animate-gradient-shift"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.svg
            viewBox="0 0 64 64"
            className="relative h-20 w-20 p-3"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.path
              d="M8 40 L12 26 Q13 22 18 22 H40 Q45 22 46 26 L50 40 V46 Q50 48 48 48 H46 Q44 48 44 46 V44 H16 V46 Q16 48 14 48 H12 Q10 48 10 46 Z"
              fill="#0B0E1E"
              stroke="white"
              strokeWidth="1.5"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="17" cy="44" r="3.5" fill="white" />
            <circle cx="41" cy="44" r="3.5" fill="white" />
          </motion.svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          COMFORT <span className="gradient-text">TAXI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-2 text-sm text-white/50"
        >
          Yo'lga tayyorlanmoqda...
        </motion.p>

        <div className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-brand-gradient bg-200% animate-gradient-shift"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.9, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400/60"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
