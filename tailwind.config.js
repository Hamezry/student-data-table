/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      default: {
        white: "#FFFFFF",
        offwhite: "#f6f6f6",
        green: "#46C35F",
        grey: "#616161",
        black: "#343434",
        navy_blue: "#0D7590",
      },

      fontFamily: {
        texts: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

