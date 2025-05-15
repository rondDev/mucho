import type { Handle, RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db/database';

async function getUser(session: string, event: RequestEvent) {
	const user = await db
		.selectFrom('users')
		.innerJoin('sessions', 'sessions.userId', 'users.id')
		.innerJoin('file_upload_keys', 'file_upload_keys.userId', 'users.id')
		.where('sessions.sessionToken', '=', session)
		.select(['users.username', 'file_upload_keys.uploadKey', 'users.id'])
		.executeTakeFirst();
	if (user) {
		event.locals.user = user;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api')) {
		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods':
						'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
				},
			});
		}

		const response = await resolve(event);
		if (event.url.pathname.startsWith('/api')) {
			response.headers.append('Access-Control-Allow-Origin', '*');
			return response;
		}
	}
	const { cookies, url } = event;
	const session = cookies.get('session');

	if (session) {
		await getUser(session, event);
	}

	if (!event.locals.user && !url.pathname.includes('api'))
		cookies.delete('session', { path: '/' });

	const response = await resolve(event);

	response.headers.append('cache-control', 'no-store');
	response.headers.append('vary', 'cookie');

	return response;
};
