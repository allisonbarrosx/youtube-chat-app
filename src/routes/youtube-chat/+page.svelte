<script>
	import YouTubeChat from "../../components/YouTubeChat.svelte";
  import { page } from '$app/stores';

  // Access the query parameters
  $: user = $page.url.searchParams.get('user');
  $: useYTStudioURL = $page.url.searchParams.get('useYTStudioURL');
  
</script>
<YouTubeChat {user} {useYTStudioURL}/>