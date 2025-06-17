/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',       // Indigo Blue
        secondary: '#10B981',     // Emerald Green
        accent: '#8B5CF6',        // Violet / Purple
        background: '#FFFFFF',    // Light Background
        dark: '#1E293B',          // Dark Mode Background
        text: {
          primary: '#111827',     // Charcoal
          secondary: '#6B7280',   // Cool Gray
        },
        error: '#EF4444',         // Red
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        heading1: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        fadeInUp: "fadeInUp 0.8s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
