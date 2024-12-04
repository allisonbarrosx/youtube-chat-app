<script lang="ts">
  import YouTubeChat from "../../components/YouTubeChat.svelte";
  import TwitchChat from "../../components/TwitchChat.svelte";
  import { page } from "$app/stores";

  // Access the query parameters
  $: twitchUser = $page.url.searchParams.get("twitchUser");
  $: youtubeUser = $page.url.searchParams.get("youtubeUser");
  $: useYTStudioURL = $page.url.searchParams.get("useYTStudioURL") === "true";

  // const containerWidth = '50dvw';
  let iframe1Width = 50; // Initial width of the first iframe
  let iframe2Width = 50; // Initial width of the second iframe

  // Handler to adjust iframe widths when resizing
  const handleResize = (e: { clientX: number; }) => {
    if (!isResizing) return; // Only adjust widths if resizing is active

    const newWidth = ((e.clientX / window.innerWidth) * 100); // Calculate percentage width
    iframe1Width = newWidth;
    iframe2Width = 100 - newWidth;
  };

  // Flag to check if resizing is active
  let isResizing = false;

  // Start resizing
  const startResize = () => {
    isResizing = true;
    // Add mousemove and mouseup listeners to the document
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize, { once: true });
    // Prevent text selection and other default behaviors while dragging
    document.body.style.userSelect = 'none';
  };

  // Stop resizing
  const stopResize = () => {
    isResizing = false;
    // Remove mousemove listener from document
    document.removeEventListener('mousemove', handleResize);
    // Restore text selection behavior
    document.body.style.userSelect = '';
  };
</script>

<div class="d-flex">
  <div class="resizeable-chat" style="flex-basis: {iframe1Width}%;">
    <YouTubeChat bind:user={youtubeUser} {useYTStudioURL}/>

  </div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="resizer" on:mousedown={startResize}></div>
  <div class="resizeable-chat" style="flex-basis: {iframe2Width}%;">
    <TwitchChat bind:user={twitchUser} />
  </div>
</div>

<style>
  .resizeable-chat {
    /* resize: horizontal; */
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    overflow: hidden;
    /* transition: flex-basis 0.1s ease-in-out; */
  }

  .resizer {
    width: 10px;
    cursor: ew-resize;
    background-color: #aaa;
    /* position: absolute; */
    top: 0;
    bottom: 0;
    z-index: 10;
  }
</style>
