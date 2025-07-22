/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "light",
      "dark", 
      {
        "apex": {
          "primary": "#ff6600",       // apex-orange
          "secondary": "#00d4ff",     // apex-blue  
          "accent": "#9933ff",        // apex-purple
          "neutral": "#0f0f0f",       // apex-dark
          "base-100": "#0f0f0f",      // Dark background
          "base-200": "#1a1a1a",      // Slightly lighter dark
          "base-300": "#2d2d2d",      // Card backgrounds
          "base-content": "#f5f5f5",  // apex-light text
          "info": "#00d4ff",          // apex-blue for info
          "success": "#00ff88",       // Green for success states
          "warning": "#ffaa00",       // Orange for warnings
          "error": "#ff3333",         // apex-red for errors
        }
      }
    ],
    darkTheme: "apex",
    base: true,
    styled: true,
    utils: true,
  },
}

module.exports = config;