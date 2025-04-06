/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit400 : ["Outfit_400Regular"],
        outfit500 : ["Outfit_500Medium"],
        outfit600 : ["Outfit_600SemiBold"],
        outfit700 : ["Outfit_700Bold"],
      }
    },
  },
  plugins: [],
}