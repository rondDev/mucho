<script lang="ts">
  import { page } from '$app/state';
  import Navigation from '$lib/components/Navigation.svelte';
  import { Toaster } from 'svelte-french-toast';

  let selected = $derived(page.url.pathname);
  let { children } = $props();
</script>

<div class="flex w-[100vw] min-h-[100vh]">
  <Toaster />
  <div
    class="flex flex-col justify-center w-[30vw] h-[100vh] border-r text-md sticky top-0"
  >
    <p class="mx-3 p-2 text-3xl font-semibold">Settings</p>
    <a
      href="/account/details"
      class="relative mt-8 pr-2 py-3 pl-8 px-4"
      class:selectedbg={selected.startsWith('/account/details')}
      >Account details
      <div class:selected={selected.startsWith('/account/details')}></div>
    </a>
    <a
      href="/account/sessions"
      class:selectedbg={selected.startsWith('/account/sessions')}
      class="relative mt-8 pr-2 py-3 pl-8 px-4"
      >Sessions

      <div class:selected={selected.startsWith('/account/sessions')}></div>
    </a>
    <div class="mx-6 mt-8 border-t border-white drop-shadow-xl"></div>
    <a
      href="/account/danger-zone"
      class:selectedbg={selected.startsWith('/account/danger-zone')}
      class="color-red relative mt-8 pr-2 py-3 pl-8 px-4"
      >Danger zone

      <div class:selected={selected.startsWith('/account/danger-zone')}></div>
    </a>
  </div>
  <div class="w-[70vw] h-full p-16">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>
<Navigation />

<style>
  .selected {
    background-color: #f966abff;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
  }

  .selectedbg {
    background-color: #252525;
  }

  a:hover {
    background-color: #202020;
  }
</style>
