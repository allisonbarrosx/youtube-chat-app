<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import tmi from "tmi.js";
  import emojiData from '$lib/youtube-default-emotes.json';
  import { chatStore, combinedChatsConfigStore, youtubeLiveInfoStore } from "../../../stores/store";
  import { sevenTVEmotesStore } from '../../../stores/emotesStore';
  import { fetchYoutubeLiveId, fetchYoutubeMessagesFromApi } from "$lib/YoutubeFetchMessages";
  import { fetch7TVEmotes, fetchTwitchLiveChatMessages } from "$lib/TwitchFetchMessages";
  import {
    eventStore,
    startEventInterval,
    stopEventInterval,
  } from "../../../stores/eventStore";
  import { eventNames, type EmojiData } from "../../../shared/constants";
  import { fade } from "svelte/transition";

  $: twitchUser = $page.url.searchParams.get("twitchUser") ?? "";
  $: youtubeUser = $page.url.searchParams.get("youtubeUser") ?? "";

  const ttvIcon =
    "https://api.iconify.design/ant-design:twitch-outlined.svg?color=%236610f2";
  const ytIcon =
    "https://api.iconify.design/ant-design:youtube-filled.svg?color=%23dc3545";

  $: messages = $chatStore;
  $: ytInfoStore = $youtubeLiveInfoStore;
  
  let messagesContainer: HTMLElement;

  $: messagesWrapperSize = $combinedChatsConfigStore.useTwitchChatSize ? '23rem' : '100%';

  $: if (messages && messagesContainer)
    setTimeout(() => scrollToBottom(messagesContainer), 50);

  const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight + 8, behavior: "smooth" }); // + 8 padding
  };

  $: if (
    $eventStore &&
    ytInfoStore.isChannelLive !== false &&
    ytInfoStore.isFetching == false
  ) {
    fetchYoutubeMessagesFromApi();
  }

  function resetStores() {
    chatStore.reset();
    youtubeLiveInfoStore.reset();
    combinedChatsConfigStore.reset();
  }

  async function configure7TVEmotes(twitchUser: string) {
		if ($sevenTVEmotesStore.channel !== null && $sevenTVEmotesStore.emotes !== null) return;
		const emotes = await fetch7TVEmotes(twitchUser);
		sevenTVEmotesStore.setChannelEmotes(twitchUser, emotes);
		// this store will be reset only when tab/screen is closed
	}

  function renderMessageWithEmotes(message: string, emotes: { [key: string]: string } | undefined) {
		if (!emotes) return message;
		let words = message.split(' ');
		return words
			.map((word) =>
				emotes[word] ? `<img src="${emotes[word]}" alt="${word}" class="emote" />` : word
			)
			.join(' ');
	}

  function renderYoutubeMessageWithEmotes(message: string) {
		return message.replace(/:(\w+(-\w+)*):/g, (match, emojiKey) => {
			// Check if the emojiKey exists in the emojiData
			const emojiUrl = (emojiData as EmojiData)[emojiKey];
			return emojiUrl ? `<img src="${emojiUrl}" alt="${emojiKey}" class="emote" />` : match;
		});
	}

  onMount(() => {
    let client: tmi.Client;

    if (twitchUser) {
      client = new tmi.Client({
        channels: [twitchUser],
      });

      client.connect();
      configure7TVEmotes(twitchUser);
      fetchTwitchLiveChatMessages(client);
    }

    if (youtubeUser) {
			fetchYoutubeLiveId(youtubeUser).then(async () => {
				startEventInterval(eventNames.youtube);
			});
		}

    return () => {
      client && client.disconnect();
      stopEventInterval();
      resetStores();
    };
  });
</script>

{#if twitchUser === "" && youtubeUser === ""}
  <div
    class="dvh-90 d-flex flex-column justify-content-center align-items-center"
  >
    <h1 class="text d-flex justify-content-center mb-4 text-danger">
      No User Provided
    </h1>
  </div>
{:else}
  <div id="combined-messages" bind:this={messagesContainer}>
    <ul style="--messagesWrapperSize: {messagesWrapperSize}">
      {#each messages as { username, message, platform, uniqueId, usernameColor, emotes } (uniqueId)}
        <li
          class="message"
          id={uniqueId.toString()}
          in:fade={{ duration: 200 }}
          out:fade={{ duration: 200 }}
        >
          <img
            src={platform === "youtube" ? ytIcon : ttvIcon}
            alt={platform}
            width="16"
            height="16"
            class="align-self-baseline"
          />
          <span
            class="chat-username ms-1 align-self-baseline text-nowrap fw-medium"
            style="--userNameColor: {usernameColor}">{username}</span
          >:&nbsp;
          {@html platform === 'youtube'
						? renderYoutubeMessageWithEmotes(message)
						: renderMessageWithEmotes(message, emotes)}
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  
  .chat-username {
    color: var(--userNameColor);
    text-shadow: 1px 1px 1px var(--text-shadow-color);
  }

  #combined-messages {
    display: block;
    /* height: 98%; */
    max-height: 98%;
    overflow-y: auto;
    overflow-x: hidden;
    margin-inline: 10px;
  }

  #combined-messages ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
    max-width: var(--messagesWrapperSize);
  }

  #combined-messages ul li {
    padding-block: 0.25rem;
  }

  :global(.emoji) {
    width: 20px;
    height: 20px;
  }
</style>
