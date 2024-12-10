<script lang="ts">
  import { onMount, tick } from "svelte";
  import CombinedTtv from "../../components/CombinedTTV.svelte";
  import CombinedYt from "../../components/CombinedYT.svelte";
  import { chatStore } from "../../stores/store";

  let apiKey: string;

  let videoId = 'ZN9NLiS3NDU';
  let twitchChannel = 'loud_coringa';

  const ttvIcon = 'https://api.iconify.design/ant-design:twitch-outlined.svg?color=%23888888';
  const ytIcon = 'https://api.iconify.design/ant-design:youtube-filled.svg?color=%23888888'

  $: messages = $chatStore;
  let messagesContainer: HTMLElement;
 
  $: if (messages && messagesContainer) setTimeout(() => scrollToBottom(messagesContainer), 50);
  
  const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight + 8, behavior: 'smooth' }); // + 8 padding
  }; 

  onMount(async () => {
    const response = await fetch('/api');
    const data = await response.json();
    apiKey = data.apiKey;
  })
  
</script>

<div style="visibility: hidden; height: 0; width: 0;">
  {#if (apiKey !== undefined)}
  <CombinedYt {videoId} />
  {/if}
  <CombinedTtv channel={twitchChannel} />
</div>

<div id="combined-messages" bind:this={messagesContainer}>
  <ul>
    {#each messages as { username, message, platform }}
      <li class="message">
        <img
          src={platform === 'youtube' ? ytIcon : ttvIcon}
          alt={platform}
          width="16"
          height="16"
        />
        <strong>{username}</strong>: 
        {@html message}
      </li>
    {/each}
  </ul>
</div>

<style>
  #combined-messages {
    height: 80dvh;
    overflow-y: auto;
  }

  #combined-messages ul li {
    padding-block: .25rem;
  }

  #combined-messages ul {
    display: flex;
    flex-direction: column;
  }

  :global(.emoji) {
    width: 20px;
    height: 20px;
  }
</style>