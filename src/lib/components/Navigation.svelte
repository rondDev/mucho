<script lang="ts">
import Icon from '@iconify/svelte';
import { page } from '$app/state';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="fixed bottom-10px w-fit flex gap-10px bg-[#09090b] border border-[#252525] py-[16px] px-[24px] rounded-12px left-[50%] transform-translate-x-[-50%] user-drag-none"
  ondragstart={() => {
    return false;
  }}
>
  <a href="/">
    <Icon
      icon="gravity-ui:house"
      height="32px"
      width="32px"
      class={`color-[#575757] menuBarButton ${page.url.pathname === "/" ? "active" : ""}`}
      mode="svg"
    />
  </a>
  <a href="/files">
    <Icon
      icon="tabler:stack"
      height="32px"
      width="32px"
      class={`color-[#575757] menuBarButton ${page.url.pathname === "/files" ? "active" : ""}`}
      mode="svg"
    />
  </a>
  <a href="/config">
    <Icon
      icon="tabler:settings"
      height="32px"
      width="32px"
      class={`color-[#575757] menuBarButton ${page.url.pathname === "/config" ? "active" : ""}`}
      mode="svg"
    />
  </a>
  <div class="self-center w-1px h-16px bg-[#3f3f3f]"></div>
  <a href="/account">
    <Icon
      icon="material-symbols:account-circle"
      height="32px"
      width="32px"
      class={`color-[#575757] menuBarButton ${page.url.pathname === "/account" ? "active" : ""}`}
      mode="svg"
    />
  </a>
</div>

<style>
  :global(.active) {
    color: #f966abff !important;
    filter: drop-shadow(0px 0px 4px #f966abff);
  }
</style>
