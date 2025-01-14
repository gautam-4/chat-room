/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "../../apps/web/app/**/*.{js,jsx,ts,tsx}",
        "../../apps/web/components/**/*.{js,jsx,ts,tsx}",
        "../../packages/*/src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}