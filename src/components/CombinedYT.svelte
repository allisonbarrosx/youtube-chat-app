<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore } from '../stores/store';
    import type { ChatMessage } from '../shared/constants';

  export let videoId: string;

  onMount(() => {
    const interval = 5000; // YouTube chat poll interval
    let timeout: ReturnType<typeof setTimeout>;

    async function fetchChat() {
      try {
        
        // Step 1: Fetch Live Chat Messages
        const chatResponse = await fetch(
            `/api/youtube-messages?videoId=${videoId}`
        );

        const data = await chatResponse.json();
        
        data.forEach((item: ChatMessage) => {
          chatStore.addMessage({
            username: item.author,
            message: item.message,
            platform: 'youtube',
            uniqueId: item.messageId,
          });
        });

      } catch (error) {
        console.error('YouTube Chat API Error:', error);
      }

      timeout = setTimeout(fetchChat, interval);
    }

    fetchChat();

    return () => clearTimeout(timeout);
  });
</script>