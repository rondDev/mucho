import { fail, redirect } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import type { Action, Actions, PageServerLoad } from './$types';

import { db } from '$lib/db/database';
import { NODE_ENV } from '$env/static/private';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { createId } from '$lib/cuid';
import { logger } from '$lib/stores/logger';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
	if (url.searchParams.get('justRegistered')) {
		return {
			justRegistered: true,
		};
	}
};

const login: Action = async ({ cookies, request }) => {
	const data = await request.formData();
	const username = data.get('username');
	const password = data.get('password');

	if (
		typeof username !== 'string' ||
		typeof password !== 'string' ||
		!username ||
		!password
	) {
		return fail(400, { invalid: true });
	}

	const user = await db
		.selectFrom('users')
		.where('username', '=', username)
		.selectAll()
		.executeTakeFirst();

	if (!user) {
		return fail(400, { credentials: true });
	}

	const passwordMatches = await argon2.verify(user.password, password);

	if (!passwordMatches) {
		return fail(400, { credentials: true });
	}

	// TODO: set max amount of sessions
	const session = await createSession(generateSessionToken(), user.id);

	cookies.set('session', session.sessionToken, {
		// send cookie for every page
		path: '/',
		// server side only cookie so you can't use `document.cookie`
		httpOnly: true,
		// only requests from same site can send cookies
		// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
		sameSite: 'strict',
		// only sent over HTTPS in production
		secure: process.env.NODE_ENV === 'production',
		// set cookie to expire after a month
		expires: session.expiresAt,
	});

	// redirect the user
	throw redirect(303, '/');
};

export interface Session {
	id: string;
	sessionToken: string;
	userId: string;
	expiresAt: Date;
}

async function createSession(token: string, userId: string): Promise<Session> {
	try {
		const data = new TextEncoder().encode(token);
		const sha = await sha256(data);
		const sessionToken = encodeHex(sha);
		const session: Session = {
			id: createId(),
			sessionToken: sessionToken,
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		};
		await db
			.insertInto('sessions')
			.values({
				id: session.id,
				sessionToken: session.sessionToken,
				userId: session.userId,
				expire: session.expiresAt,
				//TODO: Potentially add IP, need to get real IP behind Cloudflare DNS
			})
			.execute();
		return session;
	} catch (e) {
		logger.error('[api/login | createSession]', e);
		return { id: '', sessionToken: '', userId: '', expiresAt: new Date() };
	}
}

function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export const actions: Actions = { login };
