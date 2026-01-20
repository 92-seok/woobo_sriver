/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    // Tailwind의 기본 리셋(Preflight)을 끕니다.
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

