<script lang="ts">
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
import { logger } from '$lib/stores/logger';
import { PUBLIC_DOMAIN } from '$env/static/public';
import toast, { Toaster } from 'svelte-french-toast';
import Navigation from '$lib/components/Navigation.svelte';

type fileType = {
	fileName: string;
	size: string;
	updatedAt: string;
	contentType: string;
	key: string;
};
const { data } = $props();

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

function calculate(file: fileType) {
	try {
		return timeAgo.format(Date.parse(file.updatedAt), 'round');
	} catch (e) {
		logger.error('[files.vue | calculate]', e, file);
		return '';
	}
}
</script>

<Toaster />
<Navigation />
<div
  class="h-full max-w-full rounded-lg m-12 xl:m-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-gradient-to-br from-[#04102D] to-[#020817] text-white justify-items-center"
>
  {#each data.files as file}
    <div
      class="border border-[#27272a] p-5 w-[90%] sm:w-[42vw] lg:w-[28vw] rounded-xl"
    >
      <div class="h-[5rem] flex flex-col gap-2">
        <p class="text-md font-bold truncate" alt={file.fileName}>{file.fileName}</p>
        <div class="flex justify-between">
          <p class="text-xs lg:text-sm">Uploaded {calculate(file)}</p>
          <p class="text-xs lg:text-sm">{file.size}</p>
        </div>
      </div>
      <a class="flex justify-center h-[10rem] lg:h-[10rem] xl:h-[13rem]" href={`${PUBLIC_DOMAIN}/api/file/${file.fileName}`} target="_blank">
        <img
          class="flex object-contain h-full"
          src={`${PUBLIC_DOMAIN}/api/file/${file.fileName}`}
        />
      </a>
      <div class="flex my-2 lg:h-[4rem] items-center justify-between">
        <form action="?/remove" method="POST">
          <input type="hidden" name="file" value={file.key} />
        <!-- TODO: implement functionality for delete -->
          <button
          class="p-2 xl:w-[6rem] h-[2rem] rounded-lg self-center border border-red-500 text-red-500 text-xs lg:text-sm flex justify-center items-center cursor-pointer"
        >
          Delete
          </button>
        </form>
        <button
          onclick={() => {
              navigator.clipboard.writeText(
                `${PUBLIC_DOMAIN}/${file.fileName}`,
              );
              toast.success('Link copied to clipboard');
            }}
          class="p-2 xl:w-[6rem] h-[2rem] rounded-lg self-center border border-blue-400
                text-blue-400 text-xs lg:text-sm flex justify-center items-center cursor-pointer"
        >
          Copy link
        </button>
      </div>
    </div>
  {/each}
</div>
