import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        border: {
          DEFAULT: "var(--border)",
          primary: "var(--border-primary)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        background: {
          DEFAULT: "var(--background)",
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          tertiary: "var(--background-tertiary)",
        },
        foreground: "var(--foreground)",
        text: {
          DEFAULT: "var(--text-default)",
          lighter: "var(--text-lighter)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      spacing: {
        sm1: "var(--spacing-sm1)",
        sm2: "var(--spacing-sm2)",
        sm3: "var(--spacing-sm3)",
        md1: "var(--spacing-md1)",
        md2: "var(--spacing-md2)",
        md3: "var(--spacing-md3)",
        lg1: "var(--spacing-lg1)",
        lg2: "var(--spacing-lg2)",
        lg3: "var(--spacing-lg3)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      fontSize: {
        h1: "var(--font-size-h1)",
        h2: "var(--font-size-h2)",
        h3: "var(--font-size-h3)",
        h4: "var(--font-size-h4)",
        base: "var(--font-size-base)",
        sm: "var(--font-size-sm)",
        xs: "var(--font-size-xs)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
