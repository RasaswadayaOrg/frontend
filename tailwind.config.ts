import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable manual dark mode toggling
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7C3AED", // Violet 600
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
          950: "#2E1065",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex)"], // Body font
        heading: ["var(--font-outfit)"], // Heading font
        ui: ["var(--font-inter)"], // UI elements
      },
    },
  },
  plugins: [],
};
export default config;
