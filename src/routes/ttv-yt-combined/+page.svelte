<script lang="ts">
  import { onMount } from "svelte";
  import CombinedTtv from "../../components/CombinedTTV.svelte";
  import CombinedYt from "../../components/CombinedYT.svelte";
  import { chatStore } from "../../stores/store";

  let apiKey: string;

  let videoId = 'yt77rMnmD0g';
  let twitchChannel = 'necros';

  const ttvIcon = 'https://api.iconify.design/ant-design:twitch-outlined.svg?color=%23888888';
  const ytIcon = 'https://api.iconify.design/ant-design:youtube-filled.svg?color=%23888888'

  $: messages = $chatStore;
  let messagesContainer: HTMLElement | null;
  
  function renderMessage(message: string, emotes: { [key: string]: string } = {}) {
    let renderedMessage = message;

    Object.entries(emotes).forEach(([emoteText, emoteUrl]) => {
      const regex = new RegExp(`\\b${emoteText}\\b`, 'g');
      renderedMessage = renderedMessage.replace(
        regex,
        `<img src="${emoteUrl}" alt="${emoteText}" width="20" height="20" />`
      );
    });

    return renderedMessage;
  }

  onMount(async () => {

    const response = await fetch('/api');
    const data = await response.json();
    apiKey = data.apiKey;

    messagesContainer = document.getElementById('combined-messages');
    if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
  })
</script>

<div style="visibility: hidden; height: 0; width: 0;">
  {#if (apiKey !== undefined)}
  <CombinedYt {apiKey} {videoId} />
  {/if}
  <CombinedTtv channel={twitchChannel} />
</div>

<div id="combined-messages" bind:this={messagesContainer}>
  <ul>
    {#each messages as { username, message, platform, emotes }}
      <li>
        <img
          src={platform === 'youtube' ? ytIcon : ttvIcon}
          alt={platform}
          width="16"
          height="16"
        />
        <strong>{username}</strong>: 
        {@html renderMessage(message, emotes)}
      </li>
    {/each}
  </ul>
</div>

<style>
  #combined-messages {
    height: 80dvh;
    overflow-y: auto;
  }
</style>