// Constants for theme values
const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const;

type ThemeType = keyof typeof Theme;

export {
  Theme
};

export type { ThemeType };
