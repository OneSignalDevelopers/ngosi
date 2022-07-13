module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      'display': ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
          'accent-primary':     '#72BDA3',
          'accent-secondary':   '#94E8B4',
          'background-primary': '#F1F1F1',
      },
      textColor: {
        'primary': '#6864b4'
      }
    }
  },
  variants: {
    extend: {}
  },
    plugins: [
        require('@tailwindcss/typography'),
    ]
}
