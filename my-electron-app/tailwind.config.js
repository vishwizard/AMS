/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: "#121212",  // Background color
        darktext: "#eaeaea", // Light grey for text
        darkaccent: "#EBAD73", // Accent color (for buttons, highlights, etc.)
        darkcard: "#282828",  // For cards, modals, etc.
        hoverColor: "#F4C8A0",
        bglight: "#F3E5AB",
        lightcard: "#fff9f0",

        // bglight: "#fffaf0",
        // Ivory: "#FFFFF0",
        // Eggshell: "#F0EAD6",
        // Cream: "#FFFDD0",
        // Bone: "#E3DAC9",
        // Pearl: "#EAE0C8",
        // Vanilla: "#F3E5AB",
        // Snow: "#FFFAFA",
        // Alabaster: "#F2F0E6",
        // Chalk: "#F4F4F4",
        // Seashell: "#FFF5EE",
      },
    },
  },
  plugins: [],
};
