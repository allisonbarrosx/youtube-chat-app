import { writable } from "svelte/store";

interface ChatMessage {
  username: string;
  message: string;
  platform: "youtube" | "twitch";
  uniqueId: number | string;
  emotes?: { [key: string]: string }; // Map emote text to image URL
  usernameColor: string | undefined;
}

interface YoutubeLiveInfo {
  liveId: string | null;
  isChannelLive?: boolean;
}

function createChatStore() {
  const { subscribe, update, set } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    addMessage: (msg: ChatMessage) => {
      update((messages) => {
        // Prevent duplicates
        const isDuplicate = messages.some(
          (m) =>
            m.username === msg.username &&
            m.message === msg.message &&
            m.uniqueId === msg.uniqueId,
        );

        if (!isDuplicate) {
          // TODO: Make it parameterizable
          return [...messages, msg].slice(-100); // Keep the last 50 messages // 
        }

        return messages;
      });

      // TODO: Make it parameterizable
      // setTimeout(() => {
      //   update((messages) =>
      //     messages.filter((m) => m.uniqueId !== msg.uniqueId),
      //   );
      // }, 15000); // 15 seconds of screen time KEKW
    },
    reset: () => set([]),
    set: (value: ChatMessage[]) => set(value),
  };
}

function createYoutubeLiveInfo() {
  const { subscribe, update } = writable<YoutubeLiveInfo>();

  return {
    subscribe,
    addLiveId: (liveId: string) => {
      update((ytLiveInfo) => {
        ytLiveInfo = { liveId };
        return ytLiveInfo;
      });
    },
    setStatusChannel: (status: boolean) => update((ytLiveInfo) => ytLiveInfo = { liveId: null, isChannelLive: status })
  };
}

export const chatStore = createChatStore();
export const youtubeLiveInfoStore = createYoutubeLiveInfo();
