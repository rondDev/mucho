<script lang="ts">
import Navigation from '$lib/components/Navigation.svelte';

const { data } = $props();
</script>
{#if data.user}
  <Navigation />
{:else}
  Hi
{/if}
