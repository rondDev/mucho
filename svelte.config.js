import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			dynamic_origin: true,
		}),
	},
	alias: {
		$lib: './src/lib',
		'$lib/*': './src/lib/*',
		$components: './src/components',
		'$components/*': './src/components/*',
	},
};

export default config;
