// Constants for theme values
const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const;

type ThemeType = keyof typeof Theme;

const proxies = [
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy/?quest=",
  "https://api.allorigins.win/get?url=",
];

export {
  Theme,
  proxies
};

export type { ThemeType };
