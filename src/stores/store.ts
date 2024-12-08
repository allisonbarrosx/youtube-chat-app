import { writable } from 'svelte/store';

interface ChatMessage {
  username: string;
  message: string;
  platform: 'youtube' | 'twitch';
  uniqueId: number | string;
  emotes?: { [key: string]: string }; // Map emote text to image URL
}

function createChatStore() {
  const { subscribe, update } = writable<ChatMessage[]>([]);

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
          return [...messages, msg].slice(-100); // Keep the last 100 messages
        }

        return messages;
      });
    },
  };
}

export const chatStore = createChatStore();
