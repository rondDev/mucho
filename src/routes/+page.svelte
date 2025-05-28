<script lang="ts">
  import Navigation from "$lib/components/Navigation.svelte";

  const { data } = $props();
</script>

{#if data.user}
  <Navigation />
{:else}
  <div
    class="help w-full h-[100vh] flex flex-col gap-4 justify-center items-center bg-gradient-to-br from-cyan-300 to-pink-500"
  >
    <div class="flex flex-col gap-2 relative">
      <p class="text-[6rem] ml-0">mucho</p>
      <p class="absolute bottom-1 left-1">Screenshot uploader and manager</p>
    </div>
    <div>
      <a href="/login" class="bg-orange p-3 rounded-md">Login</a>
    </div>
  </div>
{/if}
