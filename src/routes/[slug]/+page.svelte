<script lang="ts">
  import Icon from '@iconify/svelte';
  import { PUBLIC_DOMAIN } from '$env/static/public';
  import { relativeTime } from '$lib/utils';
  const { data } = $props();
  const { fileName, size, contentType, uploadedAt, uploader, stub } =
    $state(data);
</script>

<svelte:head>
  {#if contentType && contentType.includes('image')}
    <link
      rel="alternate"
      type="application/json+oembed"
      href={`${PUBLIC_DOMAIN}/api/oembed`}
    />
    <meta property="og:image" content={`${PUBLIC_DOMAIN}/api/file/${stub}`} />
    <!-- <meta property="og:image:width" content={`${""}`} /> -->
    <!-- <meta property="og:image:height" content={`${""}`} /> -->
    <meta name="twitter:card" content="summary_large_image" />
  {/if}
  {#if contentType && contentType.includes('video')}
    property="og:video" content={`${PUBLIC_DOMAIN}/api/file/${stub}`} />
    <meta property="og:type" content="video" />
    <!-- <meta property="og:video:width" content={`${""}`} /> -->
    <!-- <meta property="og:video:height" content={`${""}`} /> -->
    <meta
      property="twitter:player"
      content={`${PUBLIC_DOMAIN}/api/files/${stub}`}
    />
    <meta property="twitter:card" content="player" />
  {/if}
  <meta name="twitter:image" content={`${PUBLIC_DOMAIN}/api/file/${stub}`} />
</svelte:head>
<div class="h-screen w-screen overflow-y-scroll pb-8">
  <div class="flex items-center justify-center">
    <div class="m-20">
      {#if stub && contentType && contentType.includes('image')}
        <img
          draggable="false"
          src={`${PUBLIC_DOMAIN}/api/file/${stub}`}
          alt={fileName}
        />
      {/if}
      {#if stub && contentType && contentType.includes('video')}
        <video
          autoplay
          loop
          muted
          controls
          src={`${PUBLIC_DOMAIN}/api/file/${stub}`}
        ></video>
      {/if}
    </div>
  </div>
  <div class="flex flex-col items-center justify-center gap-6 mb-8 pb-8">
    <div
      class="rounded-lg border border-[#1E293B] shadow-sm flex justify-center items-center m-8 md:m-0 md:ml-0 md:mr-0 p-8 md:p-0 md:w-[600px] w-[350px] md:h-52 h-fit"
    >
      <div class="text-center grow h-full p-0">
        <div
          class="flex flex-col md:flex-row justify-center items-center md:h-full h-min pt-6 pb-6 gap-10 md:gap-0"
        >
          <div
            class="flex flex-col justify-evenly items-center mx-4 grow gap-2 h-full w-1/2"
          >
            <p
              class="sm:text-lg md:text-2xl text-xs text-wrap overflow-hidden break-words m-2 w-full"
            >
              {fileName}
            </p>
            <a
              href={`/api/file/${stub}`}
              class="w-2/3 flex justify-evenly items-center border py-2 border-blue-600 rounded-md lt-md:text-xs lt-md:w-[65%]"
            >
              <Icon icon="material-symbols:download" height="1em" mode="svg" />
              Download
            </a>
          </div>
          <div
            class="shrink-0 bg-[#1E293B] h-[1px] w-full md:h-full md:w-[1px]"
          ></div>
          <div
            class="grid grid-cols-2 grid-rows-2 ml-auto mt-auto grow gap-6 m-9 h-full w-full"
          >
            <div
              class="flex flex-col justify-evenly text-md lt-md:text-xs items-center"
            >
              <Icon icon="lucide:webhook" height="1.4em" mode="svg" />
              <p class="text-[10px]">SIZE</p>
              <p>{size}</p>
            </div>
            <div
              class="flex flex-col justify-evenly text-md lt-md:text-xs items-center"
            >
              <Icon icon="lucide:clock-1" height="1.4em" mode="svg" />
              <p class="text-[10px]">UPLOAD TIME</p>
              <p>{relativeTime(uploadedAt?.toString() || '')}</p>
            </div>
            <div
              class="flex flex-col justify-evenly text-md lt-md:text-xs items-center"
            >
              <Icon icon="lucide:file-digit" height="1.4em" mode="svg" />
              <p class="text-[10px]">MIMETYPE</p>
              <p>{contentType}</p>
            </div>
            <div
              class="flex flex-col justify-evenly text-md lt-md:text-xs items-center"
            >
              <Icon icon="lucide:contact" height="1.4em" mode="svg" />
              <p class="text-[10px]">UPLOADED BY</p>
              <p>{uploader}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
