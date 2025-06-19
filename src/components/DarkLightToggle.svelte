<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  const currentTheme = () =>
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  let isDark = $state(false);

  const setTheme = () => {
    const theme = currentTheme();
    isDark = theme == "dark";
    switch (theme) {
      case "dark":
        document.documentElement.dataset.theme = "dark";
        break;
      case "light":
        document.documentElement.dataset.theme = "light";
        break;
    }
  };

  onMount(() => {
    setTheme();
    document.addEventListener("astro:after-swap", setTheme);
  });

  const toggleTheme = () => {
    const newTheme = currentTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme();
  };
</script>

<label class="swap swap-rotate" for="theme-toggle" aria-hidden="true">
  <input
    id="theme-toggle"
    name="theme-toggle"
    type="checkbox"
    bind:checked={isDark}
    onchange={toggleTheme}
  />
  <Icon class="text-2xl swap-off" icon="mingcute:moon-stars-line" />
  <Icon class="text-2xl swap-on" icon="mingcute:sun-line" />
  <span class="size-0 opacity-0">Toggle theme</span>
</label>
