/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5576D9',     
          light: '#FFFFFFC4',     
        },
        heading: '#1B3276',        
        secondary: '#FDECE1',
        primaryStart: '#5576D9',
        primaryEnd: '#294DB6',      
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        '8xl': '1536px',  
        '9xl': '1600px',  
        'figma': '1589px', 
      },
    },
  },
  plugins: [],
};

export default config;
