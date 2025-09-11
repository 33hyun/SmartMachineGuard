/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // src 아래 모든 파일에서 클래스 탐색
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}