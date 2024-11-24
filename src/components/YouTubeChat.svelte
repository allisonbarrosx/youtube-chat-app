<script lang="ts">
	import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

  import '../css/app.css';

	export let user: string;
	export let useYTStudioURL = false;

	let iframeContainer: HTMLDivElement;

	const hostname = browser && window.location.hostname;
	const theme = (browser && localStorage.getItem('theme')) || 'dark';
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

	function goBackHome(): void {
		goto('/');
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
		document.getElementById('template-goHome')?.addEventListener('click' , () => goto('/'));
	}

	async function setup(): Promise<void> {
		if (browser) {
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

	document.body.classList.add(theme);
	setup();
</script>

<div>
	<span class="spinner"></span>
	<div class="icons-bar">
		<button on:click={goBackHome} aria-label="Go back to home" class="pointer btn-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#888888" d="M10.671 2.843a2 2 0 0 1 2.658 0l3.934 3.497l.25-1.504a1 1 0 1 1 1.973.328L19.03 7.91l2.635 2.343a1 1 0 0 1-1.328 1.494l-.464-.412l-.787 7.864A2 2 0 0 1 17.095 21H6.905a2 2 0 0 1-1.99-1.801l-.786-7.864l-.465.412a1 1 0 0 1-1.328-1.494zM5.957 9.71q.028.092.038.191l.91 9.1h10.19l.91-9.1q.01-.1.038-.19L12 4.337z"/></g></svg>
			<span class="tooltip">Home</span>
		</button>
		<button on:click={handleThemeChange} aria-label="Theme changer" class="pointer btn-tooltip">
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="#888888" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.7 7.7 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.3 7.3 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675"/><path fill="#888888" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.33 2.33 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.33 2.33 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.33 2.33 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.33 2.33 0 0 1-2.588 0z"/></svg>
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
			<button id="template-goHome" class="button bg-danger" aria-label="Go back to home">
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
