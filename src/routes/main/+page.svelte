<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
    import CombinedButton from "$lib/CombinedButton.svelte";

  let useYTStudioURL = false;
  let inputYoutubeUserAt = "fazliveaíbx";
  let inputTwitchUser = "sadixbx";

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
      `/main/youtube-chat?user=${inputYoutubeUserAt}&useYTStudioURL=${useYTStudioURL}`,
    );
  };

  const openTwitchChat = () => {
    if (!inputTwitchUser) return;
    goto(`/main/twitch-chat?user=${inputTwitchUser}`);
  };

  const openCombinedChats = () => {
    if (!inputTwitchUser && inputYoutubeUserAt) return;
    goto(
      `/main/combined-chats?twitchUser=${inputTwitchUser}&youtubeUser=${inputYoutubeUserAt}&useYTStudioURL=${useYTStudioURL}`,
    );
  };

  const handleClearCookies = () => {
    if (browser) {
      window.clearCookies();
    }
  };

  // const handleThemeChange = () => {
  //   if (browser) {
  //     const currentTheme = localStorage.getItem("theme") || "dark";
  //     document.body.classList.toggle("dark");
  //     localStorage.setItem("theme", currentTheme === "dark" ? "light" : "dark");
  //   }
  // };
</script>

<main id="home">
  <div class="w-auto">
    <div class="d-flex flex-xl-row flex-column mb-2">
      <div class="mb-4 px-4 youtube-section w-lg-50 w-100">
        <div class="eight mb-4">
          <h1>Youtube Live Chat</h1>
        </div>
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
        <div class="d-flex align-items-center mb-4">
          <input
            type="checkbox"
            bind:checked={useYTStudioURL}
            class="ui-checkbox"
          />
          <span class="ms-2 text-sm font-medium text-gray-600"
            >Use YouTube Studio URL (uses slightly more resources)</span
          >
        </div>
        <button class="button yt w-100" on:click={openChatVid}>
          <span class="button-content">Open</span>
        </button>
      </div>
      <div class="mb-4 px-4 twitch-section w-lg-50 w-100">
        <div class="eight mb-4">
          <h1>Twitch Live Chat</h1>
        </div>
        <label for="twitchUserId" class="d-flex mb-2">
          Paste Your Twtich Channel:
        </label>
        <div class="mb-2">
          <div class="form-control">
            <input
              id="twitchUserId"
              type="text"
              placeholder="Paste Your Twitch"
              class="input input-alt"
              class:required={!inputTwitchUser}
              bind:value={inputTwitchUser}
            />
            <span class="input-border input-border-alt"></span>
          </div>
        </div>
        <button class="button w-100" on:click={openTwitchChat}>
          <span class="button-content">Open</span>
        </button>
      </div>
    </div>
  </div>
  <div class="fixed-bottom mb-4">
    <div class="mb-4 px-4 combined-chats">
      <button class="button" on:click={() => goto('/main/ttv-yt-combined?youtubeUser=penguinz0&twitchUser=sadixbx')}>
        <span class="button-content">Combied togeris</span>
      </button>
    </div>
    <div class="mb-4 px-4 combined-chats">
      <CombinedButton onClick={openCombinedChats}/>
    </div>
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
</style>
