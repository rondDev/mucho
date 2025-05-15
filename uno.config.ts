import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
	presets: [presetWind4({ reset: true })],
	rules: [],
	shortcuts: [
		{
			menuBarButton:
				'cursor-pointer transform transition ease-in-out hover:scale-[1.1] hover:translate-y-[-3px] hover:rotate-z-10 hover:color-[#f966abFF] motion-reduce:transition-none motion-reduce:hover:transform-none',
			example: 'm-8',
		},
	],
});
