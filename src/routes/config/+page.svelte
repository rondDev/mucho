<script lang="ts">
import { PUBLIC_DOMAIN } from '$env/static/public';
import Navigation from '$lib/components/Navigation.svelte';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import vitesseDark from 'shiki/themes/vitesse-dark.mjs';
import json from 'shiki/langs/json.mjs';

const { data } = $props();

let showRaw = $state(true);

// TODO: Add randomize toggle
const randomizeFileNames = false;

const config = {
	Version: '15.0.0',
	DestinationType:
		'ImageUploader, TextUploader, FileUploader, URLShortener, URLSharingService',
	RequestMethod: 'POST',
	RequestURL: `${PUBLIC_DOMAIN}/api/upload`,
	Headers: {
		origin: `${PUBLIC_DOMAIN}`,
	},
	Body: 'MultipartFormData',
	Arguments: {
		key: `${data.user.uploadKey}`,
		name: '{filename}',
		randomize_filename: randomizeFileNames,
	},
	FileFormName: 'd',
	URL: '{json:url}',
};
const configRef = JSON.stringify(config, null, 2);

function downloadConfig() {
	const blob = new Blob([JSON.stringify(config, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${PUBLIC_DOMAIN}.sxcu`;
	link.click();
}

const shiki = createHighlighterCoreSync({
	engine: createJavaScriptRegexEngine(),
	// Implement your import theme.
	themes: [vitesseDark],
	// Implement your imported and supported languages.
	langs: [json],
});

shiki.loadLanguageSync(json);
shiki.loadThemeSync(vitesseDark);
const shikiCode = shiki.codeToHtml(configRef, {
	lang: 'json',
	theme: 'vitesse-dark',
});
</script>
<Navigation />
<div class="flex flex-col gap-6 ml-16 mr-16 mt-16">
  <p class="self-start">ShareX Config</p>
  <p>This page gives you a configuration that you can use in <a href="https://getsharex.com/"
      class="text-blue">ShareX</a> to upload
    screenshots. It is also possible to upload from other methods as long as it's in the same format, which will say
    multi-part form where `d` is the file and `key` is your upload key.</p>
  <div class="flex gap-3 self-end">
    <button class="bg-[#09090b] border border-[#27272a] p-3 rounded-md text-sm font-semibold cursor-pointer"
      onclick={() => { showRaw = !showRaw; console.log(showRaw)}}>Show
      raw config</button>
    <button class="bg-[#057a55] p-3 rounded-md text-sm font-semibold cursor-pointer"
      onclick={() => {downloadConfig()}}>Download</button>
  </div>
  {#if showRaw}
    <div class="w-full text-xs">
      {@html shikiCode}
    </div>
  {/if}
</div>
