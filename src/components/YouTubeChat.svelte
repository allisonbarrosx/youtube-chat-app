<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
	import { Theme } from "../shared/constants";
	import type { ThemeType } from "../shared/constants";

  import "../css/app.css";

  export let user: string | null | undefined;
  export let useYTStudioURL: boolean;

  let iframeContainer: HTMLDivElement;

  const hostname = browser ? window.location.hostname : "";
  const theme = browser ? (localStorage.getItem("theme") ?? "dark") : "dark";
  const proxies = [
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy/?quest=",
    "https://api.allorigins.win/get?url=",
  ];

  /**
   * Fetch the liveId of a YouTube channel.
   * @param userChannel - The YouTube channel ID or username.
   * @param index - The proxy index to use for fetching.
   * @returns The liveId or null if not found.
   */
  async function getLiveId(
    userChannel: string,
    index = 0,
  ): Promise<{ liveId: string | null }> {
    if (index >= proxies.length) {
      console.error("All proxies failed.");
      return { liveId: null };
    }

    try {
      const response = await fetch(
        `${proxies[index]}${encodeURIComponent(`https://www.youtube.com/${userChannel}/live`)}`,
      );

      const contentType = response.headers.get("content-type") ?? "";
      const html = contentType.includes("application/json")
        ? (await response.json()).contents
        : await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const canonicalLink = doc.querySelector('link[rel="canonical"]');
      const url = canonicalLink?.getAttribute("href");
      const videoIdMatch = url?.match(/v=([^&]+)/);

      if (!videoIdMatch?.[1]) {
        throw new Error("No video ID found.");
      }

      return { liveId: videoIdMatch[1] };
    } catch (error) {
      console.warn(`Proxy ${index} failed: ${error}`);
      return getLiveId(userChannel, index + 1);
    }
  }

  /**
   * Toggle the current theme and update the page accordingly.
   */
  function handleThemeChange(): void {
    if (!browser) return;

    const currentTheme =
      (localStorage.getItem("theme") as ThemeType) ?? Theme.DARK;
    const newTheme =
      currentTheme === Theme.DARK.toLocaleLowerCase()
        ? Theme.LIGHT
        : Theme.DARK;

    const iframe = document.querySelector<HTMLIFrameElement>("iframe");
    if (iframe) {
      iframe.src = iframe.src.replace(currentTheme, newTheme);
    }

    document.body.classList.toggle(Theme.DARK);
    localStorage.setItem("theme", newTheme);
  }

  /**
   * Redirect the user back to the homepage.
   */
  function goBackHome(): void {
    goto("/");
  }

  /**
   * Setup the chat iframe for live streaming.
   * @returns True if successful, otherwise false.
   */
  async function setupChatIframe(): Promise<boolean> {
    const { liveId } = await getLiveId(user ?? "");
    if (!liveId) return false;

    const url = `https://${useYTStudioURL ? "studio.youtube.com" : "www.youtube.com"}/live_chat?v=${liveId}&is_popout=1&embed_domain=${hostname}&theme=${theme}`;

    const iframeTemplate = document.getElementById(
      "iframe-template",
    ) as HTMLTemplateElement | null;
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
   * Setup the "No Live" template.
   */
  function setupNoLive(): void {
    const noLiveTemplate = document.getElementById(
      "no-live-template",
    ) as HTMLTemplateElement | null;
    if (!noLiveTemplate) {
      console.error("No-live template not found.");
      return;
    }

    iframeContainer.appendChild(noLiveTemplate.content.cloneNode(true));
    document
      .getElementById("template-goHome")
      ?.addEventListener("click", goBackHome);
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
      document.title = `${user} - YouTube Live Chat`;
      const success = await setupChatIframe();
      if (!success) {
        setupNoLive();
      }
    }

    document.querySelector(".spinner")?.remove();
  }

  // Initialize the application
  setup();
</script>

<div>
  <span class="spinner"></span>
  <div class="icons-bar">
    <button
      on:click={goBackHome}
      aria-label="Go back to home"
      class="pointer btn-tooltip"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...$$props}
        ><g fill="none" fill-rule="evenodd"
          ><path
            d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"
          /><path
            fill="#888888"
            d="M10.671 2.843a2 2 0 0 1 2.658 0l3.934 3.497l.25-1.504a1 1 0 1 1 1.973.328L19.03 7.91l2.635 2.343a1 1 0 0 1-1.328 1.494l-.464-.412l-.787 7.864A2 2 0 0 1 17.095 21H6.905a2 2 0 0 1-1.99-1.801l-.786-7.864l-.465.412a1 1 0 0 1-1.328-1.494zM5.957 9.71q.028.092.038.191l.91 9.1h10.19l.91-9.1q.01-.1.038-.19L12 4.337z"
          /></g
        ></svg
      >
      <span class="tooltip">Home</span>
    </button>
    <button
      on:click={handleThemeChange}
      aria-label="Theme changer"
      class="pointer btn-tooltip"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...$$props}
        ><path
          fill="#888888"
          d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.7 7.7 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.3 7.3 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675"
        /><path
          fill="#888888"
          d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.33 2.33 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.33 2.33 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.33 2.33 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.33 2.33 0 0 1-2.588 0z"
        /></svg
      >
      <span class="tooltip">Change Theme</span>
    </button>
  </div>

  <template id="iframe-template">
    <iframe
      title="yt-chat"
      frameborder="0"
      class="chat-iframe"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </template>

  <template id="no-user-template">
    <h1 class="text">No user provided</h1>
  </template>

  <template id="no-live-template">
    <h1 class="text mb-4">No Live Found</h1>
    <div class="d-flex justify-content-center mb-4">
      <button
        id="template-goHome"
        class="button bg-danger"
        aria-label="Go back to home"
      >
        <span class="button-content">Home</span>
      </button>
    </div>
  </template>

  <div bind:this={iframeContainer}></div>
</div>

<style>
  .pointer {
    cursor: pointer;
  }

  .chat-iframe {
    width: 100dvw;
    height: 100dvh;
    border: none;
    display: block;
  }

  .text {
    font-family: sans-serif;
    color: var(--theme-bg-foreground);
  }

  .icons-bar {
    position: absolute;
    top: 0;
    right: 50px;
    height: 48px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .spinner + .icons-bar {
    display: none;
  }

  /* .icons-bar a {
		display: flex;
	} */

  .icons-bar button {
    background-color: transparent;
    border: none;
  }

  .icons-bar svg {
    width: 32px;
    height: 32px;
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
