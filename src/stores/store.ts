import { writable } from 'svelte/store';

interface ChatMessage {
  username: string;
  message: string;
  platform: 'youtube' | 'twitch';
  uniqueId: number | string;
  emotes?: { [key: string]: string }; // Map emote text to image URL
}

interface YoutubeLiveInfo {
  liveId: string;
}

function createChatStore() {
  const { subscribe, update, set } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    addMessage: (msg: ChatMessage) => {
      update((messages) => {
        // Prevent duplicates by checking unique message + timestamp
        const isDuplicate = messages.some(
          (m) =>
            m.username === msg.username &&
            m.message === msg.message &&
            m.uniqueId === msg.uniqueId
        );

        if (!isDuplicate) {
          return [...messages, msg].slice(-50); // Keep the last 50 messages
        }

        return messages;
      });
    },
    reset: () => set([]),
    set: (value: ChatMessage[]) => set(value)
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
  };
}

export const chatStore = createChatStore();
export const youtubeLiveInfoStore = createYoutubeLiveInfo();
