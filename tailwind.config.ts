import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F7F4",
        foreground: "#151515",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#151515",
        },
        border: "#E7E4DF",
        muted: {
          DEFAULT: "#F0EBE2",
          foreground: "#85817B",
        },
        secondary: {
          DEFAULT: "#F0EBE2",
          foreground: "#151515",
        },
        ring: "#151515",
        silk: {
          bg: "#F8F7F4",
          surface: "#FFFFFF",
          cream: "#F0EBE2",
          black: "#151515",
          charcoal: "#242424",
          grey: "#85817B",
          border: "#E7E4DF",
          beige: "#C9BBA7",
          pink: "#D7B4B4",
          blue: "#9BAFC1",
          olive: "#888A78",
          // Dark admin palette
          dark: {
            bg: "#121212",
            surface: "#1a1a1a",
            card: "#222222",
            border: "#2e2e2e",
            text: "#f0f0f0",
            muted: "#999999",
          }
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: ".2em",
        tighter: "-.05em",
      },
    },
  },
  plugins: [],
};
export default config;
