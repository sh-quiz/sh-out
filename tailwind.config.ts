import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)"],
                mono: ["var(--font-mono)"],
                syne: ["var(--font-syne)"],
                michroma: ["var(--font-michroma)"],
                orbitron: ["var(--font-orbitron)"],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "blitz-yellow": "#FFD700",
                "voltage-blue": "#00F2FF",
                "deep-void": "#0B0E14",
                "carbon-grey": "#1C212B",
                "static-white": "#F0F4F5",
                "danger-red": "#FF3E3E",
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
            },
        },
    },
    plugins: [],
};
export default config;
