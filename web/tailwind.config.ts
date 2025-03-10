import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Sentient",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        sentient: ["Sentient", "serif"],
      },
      colors: {
        background: "#DCD7C9",
        primary: "#2C3930",
        secondary: "#A27B5C",
      },
    },
  },
  plugins: [],
} satisfies Config;
