<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
	import { Theme } from "../shared/constants";
  import { proxies } from "../shared/constants";
	import type { ThemeType } from "../shared/constants";

import '../css/app.css';

export let user: string | undefined;
export let useYTStudioURL = false;

let iframeContainer: HTMLDivElement;

  const hostname = browser ? window.location.hostname : "";
  const theme = browser ? (localStorage.getItem("theme") ?? "dark") : "dark";

/**
 * Fetch the liveId of a YouTube channel.
 * @param userChannel - The YouTube channel ID or username.
 * @param index - The proxy index to use for fetching.
 * @returns The liveId or null if not found.
 */
async function getLiveId(userChannel: string, index = 0): Promise<{ liveId: string | null }> {
  if (index >= proxies.length) {
    console.error('All proxies failed.');
    return { liveId: null };
  }

  try {
    const response = await fetch(
      `${proxies[index]}${encodeURIComponent(`https://www.youtube.com/${userChannel}/live`)}`
    );

    const contentType = response.headers.get('content-type') ?? '';
    const html = contentType.includes('application/json')
      ? (await response.json()).contents
      : await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const canonicalLink = doc.querySelector('link[rel="canonical"]');
    const url = canonicalLink?.getAttribute('href');
    const videoIdMatch = url?.match(/v=([^&]+)/);

    if (!videoIdMatch?.[1]) {
      throw new Error('No video ID found.');
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

  const currentTheme = (localStorage.getItem('theme') as ThemeType) ?? Theme.DARK;
  const newTheme = currentTheme === Theme.DARK.toLocaleLowerCase() ? Theme.LIGHT : Theme.DARK;

  const iframe = document.querySelector<HTMLIFrameElement>('iframe');
  if (iframe) {
    iframe.src = iframe.src.replace(currentTheme, newTheme);
  }

  document.body.classList.toggle(Theme.DARK);
  localStorage.setItem('theme', newTheme);
}

/**
 * Redirect the user back to the homepage.
 */
function goBackHome(): void {
  goto('/');
}

/**
 * Setup the chat iframe for live streaming.
 * @returns True if successful, otherwise false.
 */
async function setupChatIframe(): Promise<boolean> {
  const { liveId } = await getLiveId(user ?? '');
  if (!liveId) return false;

  const url = `https://${useYTStudioURL ? 'studio.youtube.com' : 'www.youtube.com'}/live_chat?v=${liveId}&is_popout=1&embed_domain=${hostname}&theme=${theme}`;

  const iframeTemplate = document.getElementById('iframe-template') as HTMLTemplateElement | null;
  if (!iframeTemplate) {
    console.error('Iframe template not found.');
    return false;
  }

  const clone = iframeTemplate.content.cloneNode(true) as DocumentFragment;
  const iframe = clone.querySelector('iframe');
  if (!iframe) {
    console.error('Iframe element missing in template.');
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
  const noUserTemplate = document.getElementById('no-user-template') as HTMLTemplateElement | null;
  if (!noUserTemplate) {
    console.error('No-user template not found.');
    return;
  }

  iframeContainer.appendChild(noUserTemplate.content.cloneNode(true));
}

/**
 * Setup the "No Live" template.
 */
function setupNoLive(): void {
  const noLiveTemplate = document.getElementById('no-live-template') as HTMLTemplateElement | null;
  if (!noLiveTemplate) {
    console.error('No-live template not found.');
    return;
  }

  iframeContainer.appendChild(noLiveTemplate.content.cloneNode(true));
  document.getElementById('template-goHome')?.addEventListener('click', goBackHome);
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

    document.querySelector(".spinner-wrapper-yt")?.remove();
  }

// Initialize the application
setup();

</script>

<div class="h-100">
  <div class="spinner-wrapper-yt dvh-90 d-flex justify-content-center align-items-center">
    <span class="spinner"></span>
  </div>
  <template id="iframe-template">
    <!-- style="--containerWidth: {containerWidth}" -->
    <iframe
      id="yt-chat-iframe"
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
    <div class="dvh-90 d-flex flex-column justify-content-center align-items-center">
      <h1 class="text d-flex justify-content-center mb-4">No Live Found</h1>
      <div class="d-flex justify-content-center mb-4">
        <button
          id="template-goHome"
          class="button bg-danger"
          aria-label="Go back to home"
        >
          <span class="button-content">Home</span>
        </button>
      </div>
    </div>
  </template>

  <div class="w-100 h-100" bind:this={iframeContainer}></div>
</div>

<style>

  .chat-iframe {
    /* width: var(--containerWidth); */
    width: 100%;
    height: 100%;
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
