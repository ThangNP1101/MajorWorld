import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9f7575',
          50: '#faf7f7',
          100: '#f5efef',
          200: '#e8d7d7',
          300: '#dbbfbf',
          400: '#c18f8f',
          500: '#9f7575',
          600: '#8f6969',
          700: '#775858',
          800: '#5f4646',
          900: '#4e3939',
        },
        background: '#FAFAFA',
        border: '#E5E5E5',
      },
    },
  },
  plugins: [],
}
export default config

