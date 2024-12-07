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

    client.on('message', (channel: any, tags: { [x: string]: any; }, message: any) => {
      chatStore.addMessage({
        username: tags['display-name'] || 'Unknown',
        message,
        platform: 'twitch',
      });
    });

    return () => {
      client.disconnect();
    };
  });
</script>

<iframe
  title="combined-ttv-chat"
  src={`https://www.twitch.tv/embed/${channel}/chat?parent=localhost`}
  frameborder="0"
  scrolling="no"
  width="100%"
  height="300px"
></iframe>
