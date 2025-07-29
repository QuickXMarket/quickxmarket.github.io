export default {
  darkMode: ["class", '[data-theme="dark"]'], // Enable dark mode based on data-theme attribute
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // required
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        ["primary-dull"]: "hsl(var(--color-primary-dull) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        text: "hsl(var(--color-text) / <alpha-value>)",
        card: "hsl(var(--color-card) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
      },
    },
  },
};
