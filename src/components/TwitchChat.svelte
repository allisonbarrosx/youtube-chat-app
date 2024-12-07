<script lang="ts">
  import { browser } from "$app/environment";
  import { Theme } from "../shared/constants";
  import { proxies } from "../shared/constants";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import "../css/app.css";

  export let user: string | null | undefined;

  let iframeURL: string | null;
  let successfulFoundLive: boolean;

  const hostname = browser ? window.location.hostname : "localhost";
  const theme = browser ? (localStorage.getItem("theme") ?? "dark") : "dark";

  async function setupIframeURL(index = 0): Promise<boolean> {
    if (!user) return false;
    // const url = `https://www.twitch.tv/popout/${user}/chat?popout=${theme === Theme.DARK ? "&darkpopout" : ""}`;
    try {
        const response = await fetch(
          `${proxies[index]}${encodeURIComponent(`https://www.twitch.tv/embed/${user}/chat?parent=${hostname}`)}`,
        );
        return response.ok;
    } catch (error) {
      console.warn(`Proxy ${index} failed: ${error}`);
      if (index >= proxies.length) return false;
      else return setupIframeURL(index + 1);
    } 
  }

  /**
   * Initial setup function to configure the application.
   */
  async function setup(): Promise<void> {
    if (!browser) return;

    document.body.classList.add(theme);

    if (user) {
      document.title = `${user} - Twitch Live Chat`;
      successfulFoundLive = await setupIframeURL();
      if (successfulFoundLive) {
        iframeURL = `https://www.twitch.tv/embed/${user}/chat?parent=${hostname}${theme === Theme.DARK ? "&darkpopout" : ""}`;
      }
    }

    document.querySelector(".spinner-wrapper-ttv")?.remove();
  }

  function goBackHome(): void {
    goto("/");
  }
  
  onMount(() => {
    // Initialize the application
    setup();
  })
</script>

<div class="h-100 { iframeURL && successfulFoundLive ? 'd-flex justify-content-end' : '' }">
  {#if (!iframeURL && successfulFoundLive == undefined)}
    <div class="spinner-wrapper-ttv dvh-90 d-flex justify-content-center align-items-center">
      <span class="spinner"></span>
    </div>
  {:else if (iframeURL && successfulFoundLive)}
  <!-- style="--containerWidth: {containerWidth}" -->
    <iframe
      id="ttv-chat-iframe"
      title="twitch-chat"
      src={iframeURL}
      frameborder="0"
      class="chat-iframe"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      allowtransparency={true}
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
    ></iframe>
  {/if}

  {#if !user}
    <template id="no-user-template">
      <h1 class="text">No user provided</h1>
    </template>
  {/if}

  {#if (successfulFoundLive === false)}
      <div class="dvh-90 d-flex flex-column justify-content-center align-items-center">
        <h1 class="text d-flex justify-content-center mb-4">No Live Found</h1>
        <div class="d-flex justify-content-center mb-4">
          <button
            id="template-goHome"
            class="button"
            aria-label="Go back to home"
            on:click={goBackHome}
          >
            <span class="button-content">Home</span>
          </button>
        </div>
      </div>
  {/if}
</div>

<style>
  .chat-iframe {
    /* width: var(--containerWidth); */
    width: calc(100% - 10px);
    height: 100%;
    border: none;
    display: block;
    position: relative;
    z-index: 999;
  }

  .text {
    font-family: sans-serif;
    color: var(--theme-bg-foreground);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 5px solid var(--theme-bg-foreground);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: fixed;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
