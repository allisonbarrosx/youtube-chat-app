<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore } from '../stores/store';

  export let apiKey: string;
  export let videoId: string;

  onMount(() => {
    const interval = 5000; // YouTube chat poll interval
    let timeout: ReturnType<typeof setTimeout>;

    async function fetchChat() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${videoId}&part=snippet,authorDetails&key=${apiKey}`
        );
        const data = await response.json();

        data.items.forEach((item: any) => {
          chatStore.addMessage({
            username: item.authorDetails.displayName,
            message: item.snippet.textMessageDetails.messageText,
            platform: 'youtube',
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

<iframe
  title="yt-combined"
  src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`}
  frameborder="0"
  allowfullscreen
  width="100%"
  height="300px"
></iframe>
