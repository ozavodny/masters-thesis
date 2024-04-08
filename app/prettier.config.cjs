/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  semi: false,
  singleQuote: true,
  tabWidth: 4
};

module.exports = config;
