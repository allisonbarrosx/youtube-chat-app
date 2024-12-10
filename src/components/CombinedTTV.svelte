<script lang="ts">
  import { onMount } from 'svelte';
  import { chatStore } from '../stores/store';
  // @ts-ignore
  import tmi from 'tmi.js';

  export let channel: string;

  onMount(() => {
    const client = new tmi.Client({
      channels: [channel],
    });

    client.connect();

    client.on('message', (channel, tags, message) => {
      const emotes = tags.emotes || {}; // Twitch emotes from tags
      const emoteUrls: any = {};

      // Parse emotes into a mapping of text -> image URL
      for (const [id, positions] of Object.entries(emotes)) {
        positions.forEach((pos: string) => {
          const [start, end] = pos.split('-').map(Number);
          const emoteText = message.slice(start, end + 1);
          emoteUrls[emoteText] = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`;
        });
      }
      
      chatStore.addMessage({
        username: tags['display-name'] || 'Unknown',
        message,
        platform: 'twitch',
        uniqueId: Date.now(),
        emotes: emoteUrls,
      });
    });

    return () => {
      client.disconnect();
    };
  });
</script>

<!-- <iframe
  title="combined-ttv-chat"
  src={`https://www.twitch.tv/embed/${channel}/chat?parent=localhost`}
  frameborder="0"
  scrolling="no"
  width="100%"
  height="300px"
></iframe> -->
