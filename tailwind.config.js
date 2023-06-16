/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/main/webapp/*.{html,js}', './src/main/webapp/app/**/*.{html,js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f5fe',
          100: '#dce8fd',
          200: '#c1d7fc',
          300: '#96bffa',
          400: '#659df5',
          500: '#4d81f1',
          600: '#2b59e5',
          700: '#2346d2',
          800: '#233aaa',
          900: '#213687',
          950: '#192252',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
