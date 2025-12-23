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
        gang: {
          ggg: '#10b981', // green
          mmm: '#ef4444', // red
          bbb: '#3b82f6', // blue
          ppp: '#a855f7', // purple
        }
      },
    },
  },
  plugins: [],
};
export default config;
