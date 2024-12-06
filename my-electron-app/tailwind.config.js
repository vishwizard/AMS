/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#121212",  // Background color
        darktext: "#eaeaea", // Light grey for text
        darkaccent: "#EBAD73", // Accent color (for buttons, highlights, etc.)
        darkcard: "#282828",  // For cards, modals, etc.
        hoverColor: "#F4C8A0",
      },
    },
  },
  plugins: [],
};
