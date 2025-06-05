import type { Handle, RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db/database';
import { sql } from 'kysely';

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

async function updateSessionsAccess(session: string) {
	const result = await db.updateTable('sessions').set({ updatedAt: sql`NOW()` }).where('sessionToken', '=', session).executeTakeFirst()
}

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url } = event;
	const session = cookies.get('session');

	if (session) {
		await getUser(session, event);
	}

	if (!event.locals.user && !url.pathname.includes('api'))
		cookies.delete('session', { path: '/' });

	// TODO: Rework session updates to limit amount of Database calls
	updateSessionsAccess(session || '')
	const response = await resolve(event);

	response.headers.append('cache-control', 'no-store');
	response.headers.append('vary', 'cookie');

	return response;
};
