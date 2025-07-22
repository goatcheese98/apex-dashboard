/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apex Legends inspired colors
        'apex-orange': 'var(--color-apex-orange)',
        'apex-blue': 'var(--color-apex-blue)',
        'apex-red': 'var(--color-apex-red)',
        'apex-purple': 'var(--color-apex-purple)',
        'apex-dark': 'var(--color-apex-dark)',
        'apex-light': 'var(--color-apex-light)',
      },
      animation: {
        'dock-expand': 'dock-expand 0.3s ease-out',
        'dock-contract': 'dock-contract 0.3s ease-in',
        'card-lift': 'card-lift 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'card-unveil': 'card-unveil 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'dock-expand': {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'dock-contract': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        'card-lift': {
          '0%': { transform: 'translateY(0) translateZ(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px) translateZ(50px)', opacity: '0.9' },
        },
        'card-unveil': {
          '0%': { transform: 'translateY(20px) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}