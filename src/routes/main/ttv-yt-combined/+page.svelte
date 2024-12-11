<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import tmi from 'tmi.js';
  import { chatStore } from "../../../stores/store";
  import { fetchYoutubeLiveChatMessages } from "$lib/YoutubeFetchMessages";
  import { fetchTwitchLiveChatMessages } from "$lib/TwitchFetchMessages";
  import { fly } from "svelte/transition";
  import { linear } from "svelte/easing";
  import { eventStore, startEventInterval, stopEventInterval } from "../../../stores/eventStore";
  import { eventNames } from "../../../shared/constants";

  $: twitchUser = $page.url.searchParams.get("twitchUser") ?? '';
  $: youtubeUser = $page.url.searchParams.get("youtubeUser") ?? '';

  const ttvIcon =
    "https://api.iconify.design/ant-design:twitch-outlined.svg?color=%236610f2";
  const ytIcon =
    "https://api.iconify.design/ant-design:youtube-filled.svg?color=%23dc3545";

  $: messages = $chatStore;

  let messagesContainer: HTMLElement;

  $: if (messages && messagesContainer)
    setTimeout(() => scrollToBottom(messagesContainer), 50);

  const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight + 8, behavior: "smooth" }); // + 8 padding
  };

  // function autoHideMessage(el: HTMLElement) {
  //   const uniqueId = el.getAttribute("id") ?? '';
  //   setTimeout(() => {
  //     $chatStore = $chatStore.filter((message) => message.uniqueId !== uniqueId);
  //   }, 3000);
  // }
  
  // $: console.log('messages: ', messages)

  $: if ($eventStore) {
    fetchYoutubeLiveChatMessages(youtubeUser);
  }

  onMount(() => {
    let client: tmi.Client;

    if (twitchUser || youtubeUser) {
      client = new tmi.Client({
        channels: [twitchUser],
      });
  
      client.connect();
      startEventInterval(eventNames.youtube)
      fetchTwitchLiveChatMessages(client);
    }

    return () => {
      chatStore.reset();
      client && client.disconnect();
      stopEventInterval();
    };
  });
</script>

{#if (twitchUser === '' && youtubeUser === '')}
  <div class="dvh-90 d-flex flex-column justify-content-center align-items-center">
    <h1 class="text d-flex justify-content-center mb-4 text-danger">No User Provided</h1>
  </div>
{:else}
  <div id="combined-messages" bind:this={messagesContainer}>
    <ul>
      {#each messages as { username, message, platform, uniqueId, usernameColor }}
        <li
          class="message"
          id={uniqueId.toString()}
          in:fly={{ x: 200, duration: 250, easing: linear }}
          out:fly={{ x: -200, duration: 250, easing: linear }}
          >
          <!-- use:autoHideMessage -->
          <img
            src={platform === "youtube" ? ytIcon : ttvIcon}
            alt={platform}
            width="16"
            height="16"
            class="align-self-baseline"
          />
          <span class="chat-username ms-1 align-self-baseline text-nowrap fw-medium" style="--userNameColor: {usernameColor}">{username}</span>:&nbsp;
          {@html message}
        </li>
      {/each}
    </ul>
  </div>
{/if}


<style>

  .chat-username {
    color: var(--userNameColor);
    text-shadow: 0 0 0.2em var(--userNameColor);
  }

  #combined-messages {
    display: block;
    height: 98%;
    overflow-y: hidden;
    overflow-x: hidden;
    margin-inline: 10px;
  }

  #combined-messages ul {
    list-style: none;
  }

  #combined-messages ul li {
    padding-block: 0.25rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #combined-messages ul {
    display: flex;
    /* flex-direction: column-reverse; */
    flex-direction: column;
  }

  /* .message {
    transition: opacity 0.5s ease;
  } */

  :global(.emoji) {
    width: 20px;
    height: 20px;
  }
</style>
