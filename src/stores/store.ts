import { writable } from 'svelte/store';

interface ChatMessage {
  username: string;
  message: string;
  platform: 'youtube' | 'twitch';
}

function createChatStore() {
  const { subscribe, update } = writable<ChatMessage[]>([]);

  return {
    subscribe,
    addMessage: (msg: ChatMessage) =>
      update((messages) => [...messages, msg].slice(-100)), // Keep the last 100 messages
  };
}

export const chatStore = createChatStore();
