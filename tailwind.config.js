/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "off-white": "#FAF8F5",
        canvas: {
          DEFAULT: "#FAF8F5",
          subtle: "#F5F1EB",
          dark: "#EDE6DC",
        },
        charcoal: {
          DEFAULT: "#1E1E1E",
          muted: "#555555",
          light: "#777777",
          border: "#E5E1DA",
        },
        terracotta: {
          50: "#FAF0EB",
          100: "#F5DFD5",
          200: "#EBBFA9",
          300: "#E19E7D",
          400: "#DC8C68",
          DEFAULT: "#D87A53",
          500: "#D87A53",
          600: "#C15E34",
          700: "#9A4522",
          800: "#743015",
          900: "#4D1D0B",
        },
        sand: {
          50: "#FAF6EF",
          100: "#F4ECD9",
          200: "#E9D8B1",
          300: "#DEC489",
          400: "#D9B679",
          DEFAULT: "#D4A86A",
          500: "#D4A86A",
          600: "#BC8A45",
          700: "#936A2F",
          800: "#6B4B1E",
          900: "#432D10",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#FFFFFF",
          elevated: "#FCFBF9",
          border: "rgba(30, 30, 30, 0.08)",
        },
        jharkhand: {
          forest: "#2D6A4F",
          ochre: "#D97706",
          crimson: "#DC2626",
          water: "#0284C7",
          tribal: "#8C482B",
        }
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.04)",
        card: "0 8px 30px rgba(216, 122, 83, 0.08)",
        elevated: "0 12px 35px rgba(0, 0, 0, 0.06)",
        floating: "0 18px 45px rgba(216, 122, 83, 0.14)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
