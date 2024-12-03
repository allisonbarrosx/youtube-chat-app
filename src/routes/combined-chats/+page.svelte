<script lang="ts">
  import YouTubeChat from "../../components/YouTubeChat.svelte";
  import TwitchChat from "../../components/TwitchChat.svelte";
  import { page } from "$app/stores";

  // Access the query parameters
  $: twitchUser = $page.url.searchParams.get("twitchUser");
  $: youtubeUser = $page.url.searchParams.get("youtubeUser");
  $: useYTStudioURL = $page.url.searchParams.get("useYTStudioURL") === "true";

  const containerWidth = '50dvw';
</script>

<div class="d-flex">
  <div class="resizeable-chat">
    <YouTubeChat bind:user={youtubeUser} {useYTStudioURL} {containerWidth}/>
  </div>
  <div class="resizeable-chat">
    <TwitchChat bind:user={twitchUser} {containerWidth}/>
  </div>
</div>

<style>
  .resizeable-chat {
    overflow: hidden;
    /* resize: horizontal; */
    width: 50dvw;
  }
</style>
