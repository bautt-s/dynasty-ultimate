import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold':'#eeb127',

        'QB':'#ff2a6d',
        'WR':'#58a7ff',
        'RB':'#00ceb8',
        'TE':'#ffae58',
        'K':'#bd66ff',
        'Budget':'#7947d4',
        'DEF':'#fff67a',
        'DL':'#ff795a',
        'LB':'#6d7df5',
        'DB':'#ff7cb6',
        'BN':'#b6d0eb',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
