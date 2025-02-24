import type { Config } from "tailwindcss";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "from-blue-500", "to-blue-600",
    "from-emerald-500", "to-emerald-600",
    "from-purple-500", "to-purple-600",
    "from-red-500", "to-red-600",
    "from-yellow-500", "to-yellow-600",
    "from-indigo-500", "to-indigo-600",
    "from-pink-500", "to-pink-600",
    "from-teal-500", "to-teal-600",
    "from-cyan-500", "to-cyan-600",
    "from-orange-500", "to-orange-600",
    "from-green-500", "to-green-600",
    "from-rose-500", "to-rose-600",
    "from-fuchsia-500", "to-fuchsia-600",
    "from-sky-500", "to-sky-600",
    "from-lime-500", "to-lime-600",
    "from-amber-500", "to-amber-600",
    "from-gray-500", "to-gray-600",
    "from-slate-500", "to-slate-600",
    "from-violet-500", "to-violet-600",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
