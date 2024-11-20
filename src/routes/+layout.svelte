<script>
  	import '../css/app.css';
    import 'bootstrap/dist/css/bootstrap-utilities.css';
    import 'bootstrap/dist/css/bootstrap-grid.css';
</script>

<main>
  <slot /> <!-- This is where child pages render -->
</main>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.dark) {
    --theme-bg: #f0f0f0;
    --theme-bg-foreground: #0f0f0f;
  }
</style>