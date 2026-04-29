/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",  // ← esta línea es crucial
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}