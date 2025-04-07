/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit100 : ["Outfit_100Thin"],
        outfit200 : ["Outfit_200ExtraLight"],
        outfit300 : ["Outfit_300Light"],
        outfit400 : ["Outfit_400Regular"],
        outfit500 : ["Outfit_500Medium"],
        outfit600 : ["Outfit_600SemiBold"],
        outfit700 : ["Outfit_700Bold"],
        outfit800 : ["Outfit_800BExtraBold"],
        outfit900 : ["Outfit_900Black"],
      }
    },
  },
  plugins: [],
}