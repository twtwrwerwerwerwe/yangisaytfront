/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--c-fg) / <alpha-value>)",
        night: {
          950: "#05060F",
          900: "rgb(var(--c-page) / <alpha-value>)",
          850: "rgb(var(--c-surface1) / <alpha-value>)",
          800: "rgb(var(--c-surface2) / <alpha-value>)",
          700: "#1C2350",
        },
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        cyan: {
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
        },
        amber: {
          300: "#FFD873",
          400: "#FFC53D",
          500: "#FFB800",
        },
        magenta: {
          400: "#F472B6",
          500: "#EC4899",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "'Sora'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(circle at 15% 20%, rgba(139,92,246,0.35), transparent 40%), radial-gradient(circle at 85% 15%, rgba(34,211,238,0.30), transparent 45%), radial-gradient(circle at 50% 90%, rgba(236,72,153,0.25), transparent 45%)",
        "brand-gradient": "linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #FFB800 100%)",
        "brand-gradient-cool": "linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(139,92,246,0.35)",
        "glow-cyan": "0 0 40px rgba(34,211,238,0.35)",
        "glow-amber": "0 0 40px rgba(255,184,0,0.35)",
        glass: "0 8px 32px rgba(0,0,0,0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(2deg)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1, filter: "drop-shadow(0 0 6px currentColor)" },
          "50%": { opacity: 0.6, filter: "drop-shadow(0 0 14px currentColor)" },
        },
        "border-spin": {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
