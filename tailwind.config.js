module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#6be585',
        'primary-dark': '#58cb73',
        background: '#f0f0f0',
        'blue-500': '#3b82f6',
        'white': '#ffffff',
        'gray-200': '#e5e7eb',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'fiberglass-start': '#f0f0f0',
        'fiberglass-middle': '#e0e0e0',
        'fiberglass-end': '#f0f0f0',
      },
    },
  },
  plugins: [],
}