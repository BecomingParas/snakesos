/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f1a1c",
        foreground: "#FFFFFF",
        card: "#182329",
        account: {
          card: "#11181d",
        },
        primary: {
          DEFAULT: "#2ECC71",
          hover: "#27AE60",
        },
        warning: {
          DEFAULT: "#F39C12",
          card: "#2e3225",
        },
        active: {
          card: "#0e2a25",
        },
        slate: {
          dark: "#121A1F",
          light: "#2C3E50",
        },
        border: "#2a3a40",
        muted: {
          DEFAULT: "#2C3E50",
          foreground: "#95A5A6",
        },
        destructive: "#E74C3C",
        success: "#2ECC71",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}