/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  important: "#__next",
  theme: {
    extend: {
      colors: {
        primary: "#568124",
      },
    },
  },
  plugins: [],
};
