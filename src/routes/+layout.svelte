<script>
  	import '../css/app.css';
    import 'bootstrap/dist/css/bootstrap-utilities.css';
    import 'bootstrap/dist/css/bootstrap-grid.css';
    import { browser } from '$app/environment';
    import IconsBar from '$lib/IconsBar.svelte';

    const theme = (browser && localStorage.getItem('theme')) || 'dark';
    
    document.body.classList.add(theme);
</script>

<main>
  <div class="icons-header">
    <IconsBar />
  </div>
  <div class="main-content">
    <slot /> <!-- This is where child pages render -->
  </div>
</main>

<style>
  :global(html),
  :global(body) {
    --theme-bg: #f0f0f0;
    --theme-bg-foreground: #0f0f0f;

    margin: 0;
    padding: 0;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--theme-bg);
    color: var(--theme-bg-foreground);
  }
  
  :global(.dark) {
    --theme-bg: #0f0f0f;
    --theme-bg-foreground: #f0f0f0;
  }

  .icons-header {
    height: 5dvh;
  }
  .main-content {
    height: 95dvh;
  }
</style>