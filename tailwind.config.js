/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Burgundy & Stone Brand Colour Palette
        ivory: {
          DEFAULT: '#F6F3EF',
          50: '#FDFCFB',
          100: '#F6F3EF', // Warm Ivory
          200: '#EDE7E0',
          300: '#E4DDD3',
          400: '#D9D1C7',
        },
        charcoal: {
          DEFAULT: '#342C2D', // Espresso Charcoal
          50: '#F7F6F6',
          100: '#EAE8E8',
          200: '#D4D0D1',
          300: '#A9A2A3',
          400: '#6A6162',
          500: '#4D4344',
          600: '#342C2D', // Espresso Charcoal Headings & Body
          700: '#2A2324',
          800: '#1F1A1B',
          900: '#141111',
        },
        burgundy: {
          DEFAULT: '#783F46', // Deep Burgundy Primary Accent
          50: '#FAF5F6',
          100: '#F4EBEC',
          200: '#E9D6D9',
          300: '#D8B6BB',
          400: '#A05962',
          500: '#783F46', // Deep Burgundy
          600: '#623339', // Refined Hover state
          700: '#522A2F', // Active/Deep state
          800: '#402024',
          900: '#2E171A',
        },
        taupe: {
          DEFAULT: '#B59A8C', // Dusty Taupe
          50: '#FAF8F7',
          100: '#F3EFEA',
          200: '#E6DCD5',
          300: '#D5C4B9',
          400: '#B59A8C', // Dusty Taupe Accent
          500: '#9B7F71',
          600: '#816659',
          700: '#644E44',
        },
        stone: {
          DEFAULT: '#D9D1C7', // Stone Beige
          50: '#FAF9F8',
          100: '#F4F2EF',
          200: '#EAE6E1',
          300: '#D9D1C7', // Stone Beige borders & separators
          400: '#C7BDAD',
          500: '#B0A391',
          600: '#938573',
          700: '#726656',
        },
        // Backward-compatibility token mapping to ensure all existing elements seamlessly adapt:
        lavender: {
          50: '#FAF5F6',
          100: '#F4EBEC',
          200: '#E7E2DA',
          300: '#D9D1C7', // Stone Beige
          400: '#B59A8C', // Dusty Taupe
          500: '#783F46', // Deep Burgundy
          600: '#623339',
          700: '#522A2F',
          800: '#402024',
          900: '#342C2D',
          DEFAULT: '#783F46',
        },
        violet: {
          50: '#FAF5F6',
          100: '#F4EBEC',
          200: '#E9D6D9',
          300: '#B59A8C', // Dusty Taupe
          400: '#9B7F71',
          500: '#783F46', // Deep Burgundy
          600: '#783F46', // Deep Burgundy Primary Button
          700: '#623339', // Darker Burgundy Hover
          800: '#522A2F',
          900: '#342C2D', // Espresso Charcoal
          DEFAULT: '#783F46',
        },
        mint: {
          50: '#FAF8F7',
          100: '#F4F2EF',
          200: '#E7E2DA',
          300: '#D9D1C7', // Stone Beige
          400: '#B59A8C', // Dusty Taupe
          500: '#783F46',
          600: '#623339',
          DEFAULT: '#B59A8C',
        },
        peach: {
          50: '#FDFCFB',
          100: '#F6F3EF',
          200: '#EAE6E1',
          300: '#D9D1C7', // Stone Beige
          400: '#B59A8C',
          500: '#783F46',
          DEFAULT: '#D9D1C7',
        },
        offwhite: '#F6F3EF', // Warm Ivory
        darktext: '#342C2D', // Espresso Charcoal
        surface: {
          light: '#FFFFFF',
          dark: '#2A2324',
          darker: '#1F1A1B',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(52, 44, 45, 0.05), 0 2px 8px rgba(52, 44, 45, 0.03)',
        'premium': '0 8px 24px -4px rgba(120, 63, 70, 0.08), 0 2px 6px -1px rgba(52, 44, 45, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(120, 63, 70, 0.12), 0 4px 12px -2px rgba(52, 44, 45, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
