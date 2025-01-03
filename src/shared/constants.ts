// Constants for theme values
const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const;

type ThemeType = keyof typeof Theme;

// "https://corsproxy.io/?",
const proxies = [
  "https://api.codetabs.com/v1/proxy/?quest=",
  "https://api.allorigins.win/get?url=",
];
const proxiesTtv = [
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

interface YoutubeChatResponse {
	id: string;
	etag: string;
	authorDetails: {
		displayName: any;
		profileImageUrl: any;
	};
	snippet: {
		displayMessage: any;
		publishedAt: string;
	};
}

type EmojiData = {
  [key: string]: string;
};


export {
  Theme,
  proxies,
  proxiesTtv,
  eventNames
};

export type { ThemeType, ChatMessage, YoutubeChatResponse, EmojiData };
