import { get } from "svelte/store";
import {
  proxies,
  type ChatMessage,
  type YoutubeChatResponse,
} from "../shared/constants";
import { chatStore, youtubeLiveInfoStore } from "../stores/store";

async function fetchYoutubeMessages(videoId: string): Promise<void> {
  try {
    // const chatResponse = await fetch(
    //   `/api/youtube-messages?videoId=${videoId}`,
    // );
    const chatResponse = await fetch(
      `https://youtube-puppeteer-messages.vercel.app/?videoId=${videoId}`,
    );

    const data = await chatResponse.json();

    data.forEach((item: ChatMessage) => {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      chatStore.addMessage({
        username: item.author,
        message: item.message,
        platform: "youtube",
        uniqueId: item.messageId,
        usernameColor: randomColor,
      });
    });
  } catch (error) {
    console.error("YouTube Chat API Error:", error);
  }
}

async function getLiveVideoId(
  userChannel: string,
  index = 0,
): Promise<{ liveId: string | null } | boolean> {
  if (index >= proxies.length) {
    console.error("All proxies failed.");
    return false;
  }

  try {
    const response = await fetch(
      `${proxies[index]}${encodeURIComponent(`https://www.youtube.com/${userChannel}/live`)}`,
    );

    const contentType = response.headers.get("content-type") ?? "";
    const html = contentType.includes("application/json")
      ? (await response.json()).contents
      : await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const canonicalLink = doc.querySelector('link[rel="canonical"]');
    const url = canonicalLink?.getAttribute("href");
    const videoIdMatch = url?.match(/v=([^&]+)/);

    if (!videoIdMatch?.[1]) {
      throw new Error("No video ID found.");
    }

    return { liveId: videoIdMatch[1] };
  } catch (error) {
    console.warn(`Proxy ${index} failed: ${error}`);
    return getLiveVideoId(userChannel, index + 1);
  }
}

async function fetchYoutubeLiveChatMessages(
  userChannel: string,
): Promise<void | boolean> {
  const youtubeLiveInfo = get(youtubeLiveInfoStore);
  console.log("youtubeLiveInfo", youtubeLiveInfo);

  if (
    youtubeLiveInfo.isChannelLive === true &&
    youtubeLiveInfo.liveId !== null
  ) {
    youtubeLiveInfoStore.setIsFetchingData(true);
    await fetchYoutubeMessages(youtubeLiveInfo.liveId);
    youtubeLiveInfoStore.setIsFetchingData(false);
    return;
  }

  const ytInfo = await getLiveVideoId(userChannel);
  if (ytInfo) {
    youtubeLiveInfoStore.addLiveId((ytInfo as { liveId: string }).liveId);
    youtubeLiveInfoStore.setStatusChannel(true);
  }
}

async function fetchYoutubeLiveId(userChannel: string) {
  const ytInfo = await getLiveVideoId(userChannel);
  if (ytInfo) {
    youtubeLiveInfoStore.addLiveId((ytInfo as { liveId: string }).liveId);
    youtubeLiveInfoStore.setStatusChannel(true);
  }
}

async function fetchYoutubeMessagesFromApi() {
  const youtubeLiveInfo = get(youtubeLiveInfoStore);
  try {
    const response = await fetch(
      `https://chats-overlay.vercel.app/api/live-chat?videoId=${youtubeLiveInfo.liveId}`,
    );
    const data = await response.json();
    if (data.error) {
      console.log("Error while getting live chat messages: ", data.error);
    } else {
      data.forEach((item: YoutubeChatResponse) => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        chatStore.addMessage({
          username: item.authorDetails.displayName,
          message: item.snippet.displayMessage,
          platform: "youtube",
          uniqueId: item.id,
          usernameColor: randomColor,
        });
      });
    }
  } catch (err) {
    console.log("Error while getting live chat messages: ", err);
  }
}

export {
  getLiveVideoId,
  fetchYoutubeMessages,
  fetchYoutubeLiveChatMessages,
  fetchYoutubeLiveId,
  fetchYoutubeMessagesFromApi,
};
