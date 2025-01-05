<script lang="ts">
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import CombinedButton from "$lib/CombinedButton.svelte";

  let useYTStudioURL = false;
  let inputYoutubeUserAt: string | null;
  let inputTwitchUser: string | null;
  // let inputYoutubeUserAt = "fazliveaíbx";
  // let inputTwitchUser = "sadixbx";

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

  const openCombinedReadOnly = () => {
    if (!inputTwitchUser && !inputYoutubeUserAt) return;
    let rest = "";
    rest = rest
      .concat(`?twitchUser=${inputTwitchUser}`)
      .concat(`&youtubeUser=${inputYoutubeUserAt}`);
    goto(`/main/combined-chats-readonly${rest}`);
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
</script>

<main id="home">
  <div class="w-auto">
    <div class="d-flex flex-xl-row flex-column mb-2">
      <div class="mb-4 px-4 youtube-section w-lg-50 w-100">
        <div class="eight mb-4">
          <h1>Youtube Live Chat</h1>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <input
            id="ytVidID"
            type="text"
            placeholder="Youtube User"
            class="form-control"
            class:required={!inputYoutubeUserAt}
            bind:value={inputYoutubeUserAt}
          />
          <span class="input-border input-border-alt"></span>
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
        <button class="btn btn-danger yt w-100" on:click={openChatVid}>Open Youtube Chat
        </button>
      </div>
      <div class="mb-4 px-4 twitch-section w-lg-50 w-100">
        <div class="eight mb-4">
          <h1>Twitch Live Chat</h1>
        </div>
        <div class="mb-4">
          <input
            id="twitchUserId"
            type="text"
            placeholder="Twitch User"
            class="form-control"
            class:required={!inputTwitchUser}
            bind:value={inputTwitchUser}
          />
          <span class="input-border input-border-alt"></span>
        </div>
        <button class="btn btn-purple w-100" on:click={openTwitchChat}>Open Twitch Chat
        </button>
      </div>
    </div>
    <div class="vstack gap-2 col-md-5 mx-auto">
      <button type="button" class="btn btn-primary" on:click={openCombinedChats}>Open Both Chats</button>
      <button type="button" class="btn btn-primary" on:click={openCombinedReadOnly}>Open Combined Readonly</button>
    </div>
  </div>
  <!-- <div class="fixed-bottom mb-4">
    <button class="button bg-danger" on:click={handleClearCookies}>
      <span class="button-content">🗑 Clear Data</span>
    </button>
  </div> -->
  <div class="fixed-bottom m-4">
    <div class="hstack gap-3 mx-auto">
      <div class="ms-auto"></div>
      <div class="p-2">First item</div>
      <div class="p-2">Second item</div>
      <div class="p-2">Third item</div>
      <div class="me-auto"></div>
    </div>
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
