/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: {
          cyan: '#00f3ff',
          pink: '#ff00ff',
          purple: '#b500ff',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
