import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".drag-none": {
                    "-webkit-user-drag": "none",
                    "-khtml-user-drag": "none",
                    "-moz-user-drag": "none",
                    "-o-user-drag": "none",
                    "user-drag": "none",
                },
            });
        }),
    ],
};
