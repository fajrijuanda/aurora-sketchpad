/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#34E4EA',
                    DEFAULT: '#00F0FF', // Cyan/Turquoise
                    dark: '#00B8C4',
                },
                secondary: {
                    light: '#E6C85D',
                    DEFAULT: '#FFD700', // Gold/Yellow
                    dark: '#C4A600',
                },
                glass: {
                    low: 'rgba(255, 255, 255, 0.1)',
                    medium: 'rgba(255, 255, 255, 0.15)',
                    high: 'rgba(255, 255, 255, 0.25)',
                    border: 'rgba(255, 255, 255, 0.3)',
                },
                dark: {
                    bg: '#121212',
                    surface: '#1E1E1E',
                    text: '#E0E0E0',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: 1, boxShadow: '0 0 20px #00F0FF' },
                    '50%': { opacity: .5, boxShadow: '0 0 10px #00F0FF' },
                }
            }
        },
    },
    plugins: [],
}
