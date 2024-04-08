/** @type {import('tailwindcss').Config} */
const config = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                highlight: '0 0 5px 5px rgba(0, 0, 0, 0.3)'
            }
        },
    },
    // @ts-expect-error require("daisyui") doesn't have the correct type
    plugins: [require('@tailwindcss/typography'), require("daisyui")],
};

module.exports = config;
