<script lang="ts">
import Navigation from '$lib/components/Navigation.svelte';
import 'virtual:uno.css';
</script>

<div
  class="bg-[#09090b] text-[#fafafa] absolute min-h-[100vh] min-w-[100vw] bg-[#09090b] text-[#fafafa]"
>
  <Navigation />
  <slot />
</div>
