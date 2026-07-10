import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Palet Kemenkop — mayor (teal) & minor (hijau)
        brand: {
          DEFAULT: '#065366',
          dark: '#04404f',
          light: '#0b6a82',
          50: '#eaf3f5',
          100: '#cfe4e8',
        },
        leaf: {
          DEFAULT: '#5faf78',
          dark: '#4a9463',
          light: '#7cc394',
          50: '#eef7f1',
          100: '#d7edde',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(6,83,102,.06), 0 8px 24px rgba(6,83,102,.06)',
      },
    },
  },
  plugins: [],
};

export default config;
