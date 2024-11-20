<script lang="ts">
	import { browser } from '$app/environment';

  import '../css/app.css';

	export let user: string;
	export let useYTStudioURL = false;

	let iframeContainer: HTMLDivElement;

	const hostname = browser && window.location.hostname;
	const theme = (browser && localStorage.getItem('theme')) ?? 'dark';
	const proxies = [
		'https://corsproxy.io/?',
		'https://api.codetabs.com/v1/proxy/?quest=',
		'https://api.allorigins.win/get?url='
	];

	/**
	 * Get the liveId of a youtube channel
	 * @param {string} userChannel - The userChannel
	 * @returns {Promise<{ liveId: string | null }>} - The liveId of the channel
	 */
	async function getLiveId(userChannel: string, index = 0): Promise<{ liveId: string | null; }> {
		try {
			if (index >= proxies.length) return { liveId: null };
			const html = await fetch(
				`${proxies[index]}${encodeURIComponent(`https://www.youtube.com/${userChannel}/live`)}`
			).then(async (v) => {
				const contentType = v.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					const json = await v.json();
					return json.contents;
				} else {
					return v.text();
				}
			});

			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');

			const linkElement = doc.querySelector('link[rel="canonical"]');
			const url = linkElement?.getAttribute('href');
			const videoIdMatch = url?.match(/v=([^&]+)/);

			if (!videoIdMatch?.[1]) {
				throw new Error('No video id found');
			}

			return { liveId: videoIdMatch[1] };
		} catch (error) {
			return getLiveId(userChannel, index + 1);
		}
	}

	function handleThemeChange(): void {
		if (browser) {
			const currentTheme = localStorage.getItem('theme') || 'dark';

			const iframe = document.querySelector('iframe');
			if (iframe) {
				iframe.src =
					currentTheme === 'dark'
						? iframe.src.replace('dark', 'light')
						: iframe.src.replace('light', 'dark');
			}

			document.body.classList.toggle('dark');

			localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
		}
	}

	async function setupChatIframe(): Promise<boolean | undefined> {
		const { liveId } = await getLiveId(user);
		if (!liveId) return false;

		const url = `https://${useYTStudioURL === true ? `studio.youtube.com` : `www.youtube.com`}/live_chat?v=${liveId}&is_popout=1&embed_domain=${hostname}&theme=${theme}`;

		const iframeTemplate = (document.getElementById('iframe-template') as HTMLTemplateElement);
		if (!iframeTemplate) return;
		
		const clone = iframeTemplate.content.cloneNode(true);
		const iframe = (clone as HTMLElement).querySelector('iframe') ?? { src: '' };
		iframe.src = url;

		iframeContainer.appendChild(clone);

		return true;
	}

	function setupNoUser(): void {
		const noUserTemplate = (document.getElementById('no-user-template') as HTMLTemplateElement);
		if (!noUserTemplate) return;
		iframeContainer.appendChild(noUserTemplate.content.cloneNode(true));
	}

	function setupNoLive(): void {
		const noLiveTemplate = (document.getElementById('no-live-template') as HTMLTemplateElement);
		if (!noLiveTemplate) return;
		iframeContainer.appendChild(noLiveTemplate.content.cloneNode(true));
	}

	async function setup(): Promise<void> {
		if (browser) {
			document.body.classList.toggle('dark', theme !== 'dark');
			if (!user) {
				setupNoUser();
				document?.querySelector('.spinner')?.remove();
			} else {
				document.title = `${user} - Youtube Live Chat`;
				const success = await setupChatIframe();
				if (!success) {
					setupNoLive();
					document?.querySelector('.spinner')?.remove();
				}

				document?.querySelector('iframe')?.addEventListener('load', () => {
					document?.querySelector('.spinner')?.remove();
				});
			}
		}
	}

	setup();
</script>

<div>
	<span class="spinner"></span>
	<div class="icons-bar">
		<button on:click={() => handleThemeChange()} aria-label="Handle Theme Change">
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="#888888" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.7 7.7 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.3 7.3 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675"/><path fill="#888888" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.33 2.33 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.33 2.33 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.33 2.33 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.33 2.33 0 0 1-2.588 0z"/></svg>
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
		<h1 class="text">No Live Found</h1>
	</template>

	<div bind:this={iframeContainer}></div>
</div>

<style>
	
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
