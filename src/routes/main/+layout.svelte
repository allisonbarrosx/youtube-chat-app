<script>
  import "bootstrap";
  import "../../css/app.scss";
  import { browser } from "$app/environment";
  import IconsBar from "$lib/IconsBar.svelte";

  const theme = (browser && localStorage.getItem("theme")) || "dark";

  if (
    !document.body.classList.contains("light") &&
    !document.body.classList.contains("dark")
  ) {
    document.body.classList.add(theme);
  }
</script>

<main>
  <div class="icons-header">
    <IconsBar />
  </div>
  <div class="main-content">
    <slot />
    <!-- This is where child pages render -->
  </div>
</main>

<style>
  .main-content {
    height: 94dvh;
  }
</style>
