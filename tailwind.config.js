/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #6B9BD1)',
        secondary: 'var(--color-secondary, #B19CD9)',
        accent: '#7EC8A3',
        tertiary: '#F4A6C1',
        'bg-light': '#F8F9FA',
        'bg-dark': '#1A1A1A',
        'text-dark': '#2D3436',
        'text-light': '#F5F5F5',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
