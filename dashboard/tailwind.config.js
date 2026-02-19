/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    cyan: '#76E2F4', // Primary Action
                    blue: '#184E77', // Accent / Headers
                    bg: '#EDEDED',   // Background
                    dark: '#0A0A0A', // Text
                    link: '#0E334F',
                }
            },
            fontFamily: {
                sans: ['Ubuntu', 'sans-serif'],
            },
            borderRadius: {
                'brand': '100px', // For buttons
            }
        },
    },
    plugins: [],
}
