import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: "#020617",
          light: "#0f172a",
        },
        gold: {
          DEFAULT: "#fbbf24",
          dark: "#d97706",
          light: "#fef3c7",
        },
        primary: {
          DEFAULT: "#020617", // Overriding to Midnight
          light: "#0f172a",
          dark: "#01040a",
        },
        secondary: {
          DEFAULT: "#fbbf24", // Overriding to Gold
          light: "#fef3c7",
          dark: "#d97706",
        },
        background: "#020617",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        urdu: ["var(--font-noto-nastaliq)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '3rem',
      },
      animation: {
        'reveal': 'reveal-up 1s cubic-bezier(0.19, 1, 0.22, 1) forwards',
      },
      keyframes: {
        'reveal-up': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;