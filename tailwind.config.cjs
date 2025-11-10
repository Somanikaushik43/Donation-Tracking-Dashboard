module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        'pink-glow':'#ff6ec7',
        'blue-glow':'#06b6d4',
      },
      boxShadow:{
        'glow-sm': '0 6px 18px rgba(99,102,241,0.12)',
        'glow-lg': '0 20px 50px rgba(99,102,241,0.12)',

      }
    },
  },
  plugins: [],
}
