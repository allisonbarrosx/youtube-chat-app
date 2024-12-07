<script>
  export let onClick;
  const buttonText = 'Open Combined';
</script>

<button class="button p-2" data-text="Open Chat" on:click={onClick}>
  <span class="actual-text">&nbsp;{buttonText}&nbsp;</span>
  <span aria-hidden="true" class="hover-text">&nbsp;{buttonText}&nbsp;</span>
</button>

<style>
  /* === removing default button style ===*/
.button {
  margin: 0;
  height: auto;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* button styling */
.button {
  --border-right: 6px;
  --text-stroke-color: rgba(255,255,255,0.6);
  --animation-color: #37FF8B;
  --fs-size: 2em;
  letter-spacing: 3px;
  text-decoration: none;
  font-size: var(--fs-size);
  font-family: "Arial";
  position: relative;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1px var(--text-stroke-color);
}
/* this is the text, when you hover on button */
.hover-text {
  position: absolute;
  box-sizing: border-box;
  content: attr(data-text);
  color: var(--animation-color);
  width: 0%;
  inset: 0;
  border-right: var(--border-right) solid var(--animation-color);
  overflow: hidden;
  transition: 0.5s;
  -webkit-text-stroke: 1px var(--animation-color);
  white-space: nowrap;
}
/* hover */
.button:hover .hover-text {
  width: 100%;
  filter: drop-shadow(0 0 23px var(--animation-color));
  padding: 0.5rem !important;
}
</style>