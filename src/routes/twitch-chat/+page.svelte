<script lang="ts">
  import { page } from '$app/stores';
    import TwitchChat from '../../components/TwitchChat.svelte';

  // Access the query parameters
  $: user = $page.url.searchParams.get('user');
  
</script>
<TwitchChat {user} />