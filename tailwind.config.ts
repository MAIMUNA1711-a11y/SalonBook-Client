import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2a1b2e",
        plum: { DEFAULT: "#5b2a5e", dark: "#44204a", soft: "#efe3f0" },
        petal: { DEFAULT: "#c9577b", dark: "#a8416a", soft: "#fbe9ef" },
        sage: { DEFAULT: "#4f8577", soft: "#e3efea" },
        mist: "#f8f4f7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
