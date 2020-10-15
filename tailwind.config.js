module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "accent-1": "#333",
        dark: {
          900: "#1f2325",
        },
      },
      gridTemplateRows: {
        layout: "1fr auto",
      },
    },
  },
  variants: {},
  plugins: [],
};
