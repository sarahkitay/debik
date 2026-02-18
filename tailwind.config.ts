import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        paper: "#F5F1E8",
        charcoal: "#524F4A",
        library: "#7A8B7F",
        terracotta: "#D4A896",
        oxblood: "#A65E4D",
        ivory: "#FFFDF7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        label: ["var(--font-label)", "Georgia", "serif"],
      },
      fontSize: {
        base: "clamp(16px, 1.125vw, 18px)",
      },
      lineHeight: {
        body: "1.75",
        tight: "1.1",
        snug: "1.3",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        "section": "120px",
        "section-mobile": "80px",
        "gutter": "32px",
        "margin-mobile": "24px",
      },
      borderRadius: {
        card: "4px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(44, 40, 35, 0.08)",
        "card-hover": "0 8px 32px rgba(44, 40, 35, 0.12)",
      },
      transitionDuration: {
        accordion: "450ms",
      },
      transitionTimingFunction: {
        accordion: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        nav: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
