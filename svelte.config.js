import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter() },
	alias: {
		$lib: './src/lib',
		'$lib/*': './src/lib/*',
		$components: './src/components',
		'$components/*': './src/components/*',
	},
};

export default config;
