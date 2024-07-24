/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      loos: ['"Loos Normal"', 'sans-serif'],
      goozette: ['Goozette', 'sans-serif'],
    },
    colors: {
      black: '#000000',
      black1: '#121313',
      black17: '#131217',
      black1F: '#FAFAFC',
      black3B: '#222D3B',
      black5B: '#3F475B',
      black5E: '#434F5E',
      black43B: '#30343B',
      blueDarker: '#00456C',
      blueLighter: '#80C5EC',
      gray: '#8F90A6',
      gray2: '#F2F2F5',
      gray3: '#8F90A6',
      gray4: '#7B7B7B',
      gray5: 'rgba(63, 71, 91, 0.5)',
      gray6: 'rgba(63, 71, 91, 0.20)',
      gray7: '#8F90A6',
      gray8: '#C7C9D9',
      white: '#fff',
      green: '#87E97C',
      green1: '#05A660',
      red: '#FF7070',
      red1: '#FF005A',
      error: '#ff4d4f',
      primary: '#008AD8',
      blue6C: '#00456C',
      //
      newBlack: '#252531',
    },
    screens: {
      sm: '576px',
      // => @media (min-width: 576px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '992px',
      // => @media (min-width: 992px) { ... }

      xl: '1200px',
      // => @media (min-width: 1200px) { ... }

      '2xl': '1600px',
      // => @media (min-width: 1600px) { ... }
    },
  },
  plugins: [],
};
