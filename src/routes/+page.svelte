<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import Icon from '@iconify/svelte';

  const { data } = $props();
  const stats = $derived(data.data);
</script>

{#if data.user}
  <div class="h-[100vh] flex items-center justify-center">
    <div class="grid grid-cols-2 gap-8">
      <div class="flex flex-col w-64 h-36 rounded-lg border border-[#888888]">
        <div class="flex items-center mt-4 ml-4">
          <Icon
            icon="gravity-ui:clock"
            height="24px"
            width="24px"
            class={`color-white menuBarButton`}
            mode="svg"
          />
          <p class="text-lg ml-2">Your files</p>
        </div>
        <p class="text-4xl mr-6 ml-auto mb-6 mt-auto">{stats?.userTotal}</p>
      </div>
      <div class="flex flex-col w-64 h-36 rounded-lg border border-[#888888]">
        <div class="flex items-center mt-4 ml-4">
          <Icon
            icon="gravity-ui:clock"
            height="24px"
            width="24px"
            class={`color-white menuBarButton`}
            mode="svg"
          />
          <p class="text-lg ml-2">Total size of your files</p>
        </div>
        <!-- NOTE: Might like to make number and denominator seperate so we can style denominator differently than the number -->
        <p class="text-4xl mr-6 ml-auto mb-6 mt-auto">{stats?.userSize}</p>
      </div>
      <div class="flex flex-col w-64 h-36 rounded-lg border border-[#888888]">
        <div class="flex items-center mt-4 ml-4">
          <Icon
            icon="gravity-ui:clock"
            height="24px"
            width="24px"
            class={`color-white menuBarButton`}
            mode="svg"
          />
          <p class="text-lg ml-2">Total files</p>
        </div>
        <p class="text-4xl mr-6 ml-auto mb-6 mt-auto">{stats?.total}</p>
      </div>
      <div class="flex flex-col w-64 h-36 rounded-lg border border-[#888888]">
        <div class="flex items-center mt-4 ml-4">
          <Icon
            icon="gravity-ui:clock"
            height="24px"
            width="24px"
            class={`color-white menuBarButton`}
            mode="svg"
          />
          <p class="text-lg ml-2">Total size of all files</p>
        </div>
        <!-- NOTE: Might like to make number and denominator seperate so we can style denominator differently than the number -->
        <p class="text-4xl mr-6 ml-auto mb-6 mt-auto">{stats?.totalSize}</p>
      </div>
    </div>
  </div>
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
