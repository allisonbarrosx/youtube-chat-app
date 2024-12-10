<script lang="ts">
  import { onMount } from "svelte";
  import tmi from 'tmi.js';
  import { chatStore } from "../../stores/store";
  import { fetchYoutubeLiveChatMessages } from "$lib/YoutubeFetchMessages";
  import { fetchTwitchLiveChatMessages } from "$lib/TwitchFetchMessages";
  import { fly } from "svelte/transition";
    import { linear } from "svelte/easing";

  let userChannel   = "fazliveaíbx";
  let twitchChannel = "sadixbx";

  const ttvIcon =
    "https://api.iconify.design/ant-design:twitch-outlined.svg?color=%23888888";
  const ytIcon =
    "https://api.iconify.design/ant-design:youtube-filled.svg?color=%23888888";

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
  
  $: console.log('messages: ', messages)

  onMount(() => {
    const client = new tmi.Client({
      channels: [twitchChannel],
    });

    client.connect();

    fetchYoutubeLiveChatMessages(userChannel);
    fetchTwitchLiveChatMessages(client);

    return () => {
      chatStore.reset();
      client.disconnect();
    };
  });
</script>

<div id="combined-messages" bind:this={messagesContainer}>
  <ul>
    {#each messages as { username, message, platform, uniqueId }}
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
        />
        <strong>{username}</strong>:&nbsp;
        {@html message}
      </li>
    {/each}
  </ul>
</div>

<style>

  #combined-messages {
    height: 100dvh;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  #combined-messages ul {
    list-style: none;
  }

  #combined-messages ul li {
    padding-block: 0.25rem;
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
