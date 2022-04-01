module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
          'accent-primary':     '#77BB3F',
          'accent-secondary':   '#F6EDD9',
          'background-primary': '#F5FBEE',
          'text-primary':       '#82976D'
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
