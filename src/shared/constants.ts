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

const eventNames = {
  youtube: 'fetchYoutubeMessages'
}

// Define the response type for live chat messages
interface ChatMessage {
  author: string;
  message: string;
  messageId: string;
}

export {
  Theme,
  proxies,
  eventNames
};

export type { ThemeType, ChatMessage };
