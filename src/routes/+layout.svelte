<script>
  	import '../css/app.css';
    import '../css/bootstrap-utilities.scss';
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
</style>