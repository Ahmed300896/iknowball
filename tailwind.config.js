/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#0a0e1a',
        surface: '#0d1224',
        surface2: '#141b30',
        gold: '#c9a84c',
        goldbright: '#e0c068',
        border: '#1e2540',
        border2: '#2a3354',
        textmain: '#ffffff',
        textsub: '#8b93ab',
        textmuted: '#6b7494',
        win: '#3ddc84',
        loss: '#e24b4a',
        silver: '#b8bcc8',
        bronze: '#cd7f32',
      },
    },
  },
  plugins: [],
}
