// prettier.config.js
export default {
  tailwindFunctions: ["cva", "twMerge"],
  plugins: ["prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
