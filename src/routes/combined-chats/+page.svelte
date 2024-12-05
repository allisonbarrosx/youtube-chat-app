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

  
  let isResizing = false; // Flag to track resizing state

  const handleResize = (e: { clientX: number; }) => {
      if (!isResizing) return; // Only adjust widths if resizing is active

      const newWidth = ((e.clientX / window.innerWidth) * 100); // Calculate percentage width
      iframe1Width = newWidth;
      iframe2Width = 100 - newWidth;
    };

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

    document.addEventListener('mousemove', handleResize);
  
    document.addEventListener('mouseup', (event) => {
      if (isResizing) {
        isResizing = false;
      }
    });
</script>

<div class="d-flex">
  <div id="youtube-wrapper" class="resizeable-chat" style="flex-basis: {iframe1Width}%;">
    <YouTubeChat bind:user={youtubeUser} {useYTStudioURL}/>
    <div
      class="iframe-overlay {isResizing ? 'active' : ''}"
    ></div>
  </div>
  <div id="twitch-wrapper" class="resizeable-chat" style="flex-basis: {iframe2Width}%;">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="resizer" on:mousedown={() => startResize()}></div>
    <TwitchChat bind:user={twitchUser} />
    <div
      class="iframe-overlay {isResizing ? 'active' : ''}"
    ></div>
  </div>
</div>

<style>
  .resizeable-chat {
    overflow: hidden; 
    height: 95dvh; 
  }

  .resizer {
    width: 10px;
    cursor: ew-resize;
    background-color: #aaa;
    position: absolute;
    /* top: 0; */
    bottom: -7px;
    z-index: 10;
    height: 95dvh;
  }

  .iframe-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0); /* Transparent overlay */
    z-index: 20;
    pointer-events: none; /* Prevent interaction with overlay */
  }

  .iframe-overlay.active {
    pointer-events: all; /* Block interactions with the iframe */
  }
</style>
