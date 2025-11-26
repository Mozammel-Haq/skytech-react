import formsPlugin from '@tailwindcss/forms'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

const colors = {
  primary: '#0ea5a4',
  secondary: '#2563EB',
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#0ea5a4',
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        xl: '2.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
        info: colors.info,
        'surface-light': '#ffffff',
        'surface-dark': '#0f172a',
        neutral: colors.neutral,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        120: '30rem',
      },
      boxShadow: {
        soft: '0 20px 40px -24px rgba(15, 23, 42, 0.25)',
        subtle: '0 10px 30px -20px rgba(15, 23, 42, 0.2)',
      },
      maxWidth: {
        prose: '72ch',
      },
      screens: {
        xs: '480px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, rgba(14,165,164,1) 0%, rgba(37,99,235,1) 100%)',
      },
    },
  },
  plugins: [formsPlugin, typographyPlugin, aspectRatioPlugin],
}
