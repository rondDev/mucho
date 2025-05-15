import { json } from '@sveltejs/kit';

export function GET() {
	return json({
		version: '1.0',
		type: 'photo',
		author_url: '',
		provider_url: '',
		author_name: '',
		provider_name: '',
	});
}
