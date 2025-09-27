/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        'primary-light': '#38bdf8',
        'primary-dark': '#0284c7',
        dark: '#0b0f19',
        'dark-light': '#1a1f2e',
        'dark-lighter': '#2d3748',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 1s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0b0f19 0%, #1a1f2e 30%, #2d3748 70%, #0b0f19 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'button-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #0891b2 100%)'
      }
    }
  },
  plugins: []
};

