/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        panel: "#12161F",
        line: "#232837",
        accent: "#5EEAD4",
        accent2: "#818CF8",
        warn: "#FBBF24",
        danger: "#FB7185",
        muted: "#7C8496",
      },
      fontFamily: {
        display: ["'JetBrains Mono'", "monospace"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
