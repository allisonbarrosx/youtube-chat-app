import { get } from "svelte/store";
import { proxies, type ChatMessage } from "../shared/constants";
import { chatStore, youtubeLiveInfoStore } from "../stores/store";

async function fetchYoutubeMessages(videoId: string): Promise<void> {
  try {
    const chatResponse = await fetch(
      `/api/youtube-messages?videoId=${videoId}`,
    );

    const data = await chatResponse.json();

    data.forEach((item: ChatMessage) => {
      const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      chatStore.addMessage({
        username: item.author,
        message: item.message,
        platform: "youtube",
        uniqueId: item.messageId,
        usernameColor: randomColor
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
    youtubeLiveInfoStore.setStatusChannel(false);
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

    youtubeLiveInfoStore.setStatusChannel(true);
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
  console.log('youtubeLiveInfo', youtubeLiveInfo)

  if (youtubeLiveInfo === undefined || youtubeLiveInfo.liveId === undefined) {
    const ytInfo = await getLiveVideoId(userChannel);
    ytInfo && youtubeLiveInfoStore.addLiveId((ytInfo as { liveId: string }).liveId );
  }

  youtubeLiveInfo?.liveId && await fetchYoutubeMessages(youtubeLiveInfo.liveId);
}

export { getLiveVideoId, fetchYoutubeMessages, fetchYoutubeLiveChatMessages };
