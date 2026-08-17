import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Listing type badge colors
    "bg-green-800",
    "text-green-100",
    "bg-blue-800",
    "text-blue-100",
    "bg-orange-800",
    "text-orange-100",
    "bg-purple-800",
    "text-purple-100",
    "bg-red-800",
    "text-red-100",

    // Listing status badge colors (if you have dynamic status colors)
    "bg-green-100",
    "text-green-700",
    "bg-blue-100",
    "text-blue-700",
    "bg-gray-100",
    "text-gray-500",
    "bg-yellow-100",
    "text-yellow-700",

    // Bid status badge colors
    "bg-amber-100",
    "text-amber-700",
    "bg-red-100",
    "text-red-600",
    "bg-gray-400",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#1a6b3c",
          light: "#e8f5ee",
        },
        accent: "#f59e0b",
        muted: "#6b7280",
        info: {
          DEFAULT: "#007BFF",
          100: "#2196F3",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
