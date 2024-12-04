<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  let useYTStudioURL = false;
  let inputYoutubeUserAt = "fazliveaíbx";

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      inputYoutubeUserAt = text;
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
    }
  };

  const openChatVid = () => {
		if (!inputYoutubeUserAt) return;
		goto(
			`/youtube-chat?user=${inputYoutubeUserAt}&useYTStudioURL=${useYTStudioURL}`,
		);
  };

  const handleClearCookies = () => {
    if (browser) {
      window.clearCookies();
    }
  };

	const handleThemeChange = () => {
		if (browser) {
			const currentTheme = localStorage.getItem('theme') || 'dark';
			document.body.classList.toggle('dark');
			localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
		}
	}
</script>

<main id="home">
  <div class="w-auto">
		<div class="icons-bar">
			<button on:click={handleThemeChange} aria-label="Theme changer" class="pointer btn-tooltip">
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="#888888" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.7 7.7 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.3 7.3 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675"/><path fill="#888888" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.33 2.33 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.33 2.33 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.33 2.33 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.33 2.33 0 0 1-2.588 0z"/></svg>
				<span class="tooltip">Change Theme</span>
			</button>
		</div>
    <div class="eight mb-4">
      <h1>Youtube Live Chat</h1>
    </div>
    <div>
      <label for="ytVidID" class="d-flex mb-2">
        Paste Your Channel @ without the @:
      </label>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="form-control">
          <input
            id="ytVidID"
            type="text"
            placeholder="Paste Your Channel @"
            class="input input-alt"
						class:required={!inputYoutubeUserAt}
            bind:value={inputYoutubeUserAt}
          />
          <span class="input-border input-border-alt"></span>
        </div>
        <button type="button" class="button" on:click={handlePaste}>
          <span class="button-content">⎘ Paste</span>
        </button>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <input
          type="checkbox"
          bind:checked={useYTStudioURL}
          class="ui-checkbox"
        />
        <span class="ms-2 text-sm font-medium text-gray-600"
          >Use YouTube Studio URL (uses slightly more resources)</span
        >
      </div>
      <button class="button w-100" on:click={openChatVid}>
        <span class="button-content">Open</span>
      </button>
    </div>
  </div>
  <div class="fixed-bottom mb-4">
    <button class="button bg-danger" on:click={handleClearCookies}>
      <span class="button-content">🗑 Clear Data</span>
    </button>
  </div>
</main>

<style>
  h1 {
    position: relative;
    padding: 0;
    margin: 0;
    font-family: "Raleway", sans-serif;
    font-weight: 300;
    font-size: 40px;
    -webkit-transition: all 0.4s ease 0s;
    -o-transition: all 0.4s ease 0s;
    transition: all 0.4s ease 0s;
  }

  .eight h1 {
    text-align: center;

    text-transform: uppercase;
    font-size: 26px;
    letter-spacing: 1px;

    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 16px 0;
    grid-gap: 22px;
  }

  .eight h1:after,
  .eight h1:before {
    content: " ";
    display: block;
    border-bottom: 2px solid #ccc;
    background-color: transparent;
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

	.icons-bar button {
		background-color: transparent;
		border: none;
	}

	.icons-bar svg {
		width: 32px;
		height: 32px;
		color: var(--theme-bg-foreground);
	}
</style>
