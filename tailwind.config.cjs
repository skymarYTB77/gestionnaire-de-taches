/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter, sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          light: '#6dd5ed',
          DEFAULT: '#2193b0',
        },
        secondary: {
          light: '#667eea',
          DEFAULT: '#764ba2',
        },
        success: {
          light: '#00b09b',
          DEFAULT: '#96c93d',
        },
        error: {
          light: '#ff0844',
          DEFAULT: '#ffb199',
        },
        info: {
          light: '#00f260',
          DEFAULT: '#0575e6',
        },
        warning: {
          light: '#ff416c',
          DEFAULT: '#ff4b2b',
        },
        dark: {
          bg: '#171923',
          card: 'rgba(23, 25, 35, 0.95)',
        },
        neutral: {
          text: '#a0aec0',
        },
      },
      backgroundImage: {
        'primary-gradient': 'var(--primary-gradient)',
        'save-gradient': 'var(--save-gradient)',
        'accept-gradient': 'var(--accept-gradient)',
        'delete-gradient': 'var(--delete-gradient)',
        'export-gradient': 'var(--export-gradient)',
        'reject-gradient': 'var(--reject-gradient)',
      },
    },
  },
  plugins: [],
};