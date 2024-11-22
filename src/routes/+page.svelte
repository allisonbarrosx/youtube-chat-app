<script>
// @ts-nocheck
	import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

	let useYTStudioURL = false;
	let inputYoutubeUserAt = 'fazliveaíbx';

	const handlePaste = async () => {
		try {
			const text = await navigator.clipboard.readText();
			inputYoutubeUserAt = text;
		} catch (err) {
			console.error('Failed to read clipboard: ', err);
		}
	};

	const openChatVid = () => {
		goto(`/youtube-chat?user=${inputYoutubeUserAt}&useYTStudioURL=${useYTStudioURL}`);
	};

  const handleClearCookies = () => {
    if (browser) {
      window.electron.clearCookies();
    }
  }
</script>

<main id="home">
	<div class="w-auto">
		<div class="eight">
			<h1>Style Eight</h1>
		</div>
		<div>
			<label for="ytVidID" class="d-flex mb-2"> Paste Your Channel @ without the @: </label>
			<div class="d-flex justify-content-between align-items-center mb-2">
				<div class="form-control">
					<input
						id="ytVidID"
						type="text"
						placeholder="Paste Your Channel @"
						class="input input-alt"
						bind:value={inputYoutubeUserAt}
					/>
					<span class="input-border input-border-alt"></span>
				</div>
				<button type="button" class="button" on:click={handlePaste}>
					<span class="button-content">⎘ Paste</span>
				</button>
			</div>
			<div class="d-flex justify-content-between align-items-center mb-4">
				<input type="checkbox" bind:checked={useYTStudioURL} class="ui-checkbox" />
				<span class="ms-2 text-sm font-medium text-gray-600"
					>Use YouTube Studio URL (uses slightly more resources)</span
				>
			</div>
			<button class="button w-100" on:click={() => openChatVid()}>
				<span class="button-content">Open</span>
			</button>
		</div>
	</div>
	<div class="fixed-bottom mb-4">
		<button class="button bg-danger" on:click={() => handleClearCookies()}>
			<span class="button-content">🗑 Clear Data</span>
		</button>
	</div>
</main>

<style>
	.eight h1 {
  text-align:center;
 
  text-transform:uppercase;
  font-size:26px; letter-spacing:1px;
  
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 16px 0;
  grid-gap: 22px;
}

.eight h1:after,.eight h1:before {
  content: " ";
  display: block;
  border-bottom: 2px solid #ccc;
  background-color:#f8f8f8;
}
</style>
