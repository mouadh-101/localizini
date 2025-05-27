import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))", // Will update this in globals.css step
        input: "hsl(var(--input))", // Will update this in globals.css step
        ring: "hsl(var(--ring))", // Will update this in globals.css step
        background: "hsl(var(--background))", // Will be brand-background
        foreground: "hsl(var(--foreground))", // Will be brand-text
        'brand-primary': "#004D40",
        'brand-secondary': "#48D1CC",
        'brand-background': "#E6FFFA",
        'brand-text': "#032539",
        'brand-accent-medium': "#26A69A",
        'brand-accent-dark': "#00796B",
        primary: { // Keeping for now, might remove if not used by components
          DEFAULT: "#004D40", 
          foreground: "#FFFFFF",
        },
        secondary: { // Keeping for now, might remove if not used by components
          DEFAULT: "#48D1CC", 
          foreground: "#032539", // Ensure contrast with bright mint
        },
        // New teal palette from the image - keeping for now, might be useful
        teal: {
          50: "#E6F7F7",
          100: "#B3EEEE",
          200: "#80E5E5",
          300: "#4DDCDC",
          400: "#26A69A",
          500: "#1C768F",
          600: "#186B7A",
          700: "#145A65",
          800: "#104950",
          900: "#0C383B",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        lg: '0.75rem', // var(--radius) was 0.5rem, so this is larger
        md: '0.5rem',  // This is the old var(--radius)
        sm: '0.25rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 4px rgba(0,0,0,0.05)',
        'soft-md': '0 4px 8px rgba(0,0,0,0.07)',
        'soft-lg': '0 8px 16px rgba(0,0,0,0.07)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
