<script lang="ts">
    import CombinedTtv from "../../components/CombinedTTV.svelte";
    import CombinedYt from "../../components/CombinedYT.svelte";
  import { chatStore } from "../../stores/store";

  let apiKey = 'AIzaSyDU2CktKPgaXWNOtg_sJcrkAbgXlyCQ8LI';
  let videoId = '9tWSe08TDMU';
  let twitchChannel = 'mount';

  const ttvIcon = 'https://api.iconify.design/ant-design:twitch-outlined.svg?color=%23888888';
  const ytIcon = 'https://api.iconify.design/ant-design:youtube-filled.svg?color=%23888888'

  $: messages = $chatStore;
</script>

<div>
  <CombinedYt {apiKey} {videoId} />
  <CombinedTtv channel={twitchChannel} />
</div>

<ul>
  {#each messages as { username, message, platform }}
    <li>
      <img
        src={platform === 'youtube' ? ytIcon : ttvIcon}
        alt={platform}
        width="16"
        height="16"
      />
      <strong>{username}</strong>: {message}
    </li>
  {/each}
</ul>
