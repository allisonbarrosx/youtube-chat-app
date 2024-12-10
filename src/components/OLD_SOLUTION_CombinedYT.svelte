<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore } from '../stores/store';
    import { json } from '@sveltejs/kit';

  export let apiKey: string;
  export let videoId: string;

  onMount(() => {
    const interval = 5000; // YouTube chat poll interval
    let timeout: ReturnType<typeof setTimeout>;

    async function fetchChat() {
      try {

        // Step 1: Get Live Chat ID
        const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=liveStreamingDetails&key=${apiKey}`
        );

        const videoData: any = await videoResponse.json();
        const liveChatId = videoData.items?.[0]?.liveStreamingDetails?.activeLiveChatId;

        if (!liveChatId) {
            return json({ error: 'No live chat found for this video' }, { status: 404 });
        }

        // Step 2: Fetch Live Chat Messages
        const chatResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${apiKey}`
        );

        const data = await chatResponse.json();
        
        data.items.forEach((item: any) => {
          const messageText = item.snippet.textMessageDetails?.messageText || '';
          const emotes: { [key: string]: string } = {};

          // Extract custom emotes (emoji) from the message
          if (item.snippet.textMessageDetails?.messageTextRuns) {
            item.snippet.textMessageDetails.messageTextRuns.forEach((run: any) => {
              if (run.emoji) {
                const shortcut = run.emoji.shortcuts[0]; // e.g., ":smile:"
                const url = run.emoji.thumbnails[0].url; // Image URL
                emotes[shortcut] = url;
              }
            });
          }

          chatStore.addMessage({
            username: item.authorDetails.displayName,
            message: messageText,
            platform: 'youtube',
            uniqueId: item.etag,
            emotes, // Add YouTube-specific emotes
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
