/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#C8102E', // Tanznews Red
          dark: '#A10D24',
          light: '#F44336',
        },
        accent: {
          DEFAULT: '#222', // Deep black for header/footer
          light: '#333',
        },
        background: {
          DEFAULT: '#fff',
          muted: '#f7f7f7',
        },
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(0,0,0,0.08)',
        header: '0 2px 4px 0 rgba(0,0,0,0.04)',
      },
      borderRadius: {
        xl: '1rem',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

