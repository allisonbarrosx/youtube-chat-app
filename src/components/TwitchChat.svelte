<script lang="ts">
  import { browser } from "$app/environment";
  import { Theme } from "../shared/constants";
  // import type { ThemeType } from "../shared/constants";
  import "../css/app.css";
  import { onMount } from "svelte";

  export let user: string | null | undefined;
  export let containerWidth: string = '100dvw';

  let iframeContainer: HTMLDivElement;

  const hostname = browser ? window.location.hostname : "";
  const theme = browser ? (localStorage.getItem("theme") ?? "dark") : "dark";

  /**
   *  ?darkpopout // darkmode
   *  <iframe src="https://www.twitch.tv/embed/<channel>/chat?parent=<parent>"
        height="<height>"
        width="<width>">
      </iframe>
  */

  async function setupChatIframe(): Promise<boolean> {
    if (!user) return false;

    const url = `https://www.twitch.tv/embed/${user}/chat?parent=${hostname}${theme === Theme.DARK ? "&darkpopout" : ""}`;

    const iframeTemplate = document.getElementById(
      "iframe-template",
    ) as HTMLTemplateElement | null;

    console.log('iframeTemplate: ', iframeTemplate)

    if (!iframeTemplate) {
      console.error("Iframe template not found.");
      return false;
    }

    const clone = iframeTemplate.content.cloneNode(true) as DocumentFragment;
    const iframe = clone.querySelector("iframe");
    if (!iframe) {
      console.error("Iframe element missing in template.");
      return false;
    }

    iframe.src = url;
    iframeContainer.appendChild(clone);

    return true;
  }

  /**
   * Setup the "No User" template.
   */
  function setupNoUser(): void {
    const noUserTemplate = document.getElementById(
      "no-user-template",
    ) as HTMLTemplateElement | null;
    if (!noUserTemplate) {
      console.error("No-user template not found.");
      return;
    }

    iframeContainer.appendChild(noUserTemplate.content.cloneNode(true));
  }

  /**
   * Initial setup function to configure the application.
   */
  async function setup(): Promise<void> {
    if (!browser) return;

    document.body.classList.add(theme);

    if (!user) {
      setupNoUser();
    } else {
      document.title = `${user} - Twitch Live Chat`;
      await setupChatIframe();
    }

    document.querySelector(".spinner")?.remove();
  }

  
  onMount(() => {
    // Initialize the application
    setup();
  })
</script>

<div>
  <span class="spinner"></span>

  <template id="iframe-template">
    <iframe
      title="twitch-chat"
      frameborder="0"
      class="chat-iframe"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      style="--containerWidth: {containerWidth}"
    ></iframe>
  </template>

  <template id="no-user-template">
    <h1 class="text">No user provided</h1>
  </template>

  <div bind:this={iframeContainer}></div>
</div>

<style>
  .chat-iframe {
    width: var(--containerWidth);
    height: 100dvh;
    border: none;
    display: block;
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
