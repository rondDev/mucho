import { db } from "$lib/db/database";
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit";
import * as argon2 from 'argon2';

export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) {
		redirect(303, "/login")
	}
	return {
		user: locals.user,
	};
}


const updateUsername: Action = async ({ cookies, locals, request }) => {
	const data = await request.formData();
	const username = data.get('username');

	if (typeof username !== 'string' || !username) {
		return fail(400, {
			error: {
				type: "input-format"
				, message: "Error in input, correct it and try again."
			}
		});
	}

	if (locals.user && locals.user.username !== username) {
		const exists = await db
			.selectFrom('users')
			.select(['username'])
			.where('username', '=', username)
			.execute();
		if (exists.length > 0) {
			return fail(400, {
				error: {
					type: "username",
					message: "Username is taken, please choose another."
				}
			})
		}
		await db.updateTable('users').set({ username }).where('id', '=', locals.user.id).execute()
		return {
			successUsername: true
		}
	}
}


const updatePassword: Action = async ({ cookies, locals, request }) => {
	const data = await request.formData();
	const oldpassword = data.get('oldpassword');
	const newpassword = data.get('newpassword');

	if (typeof oldpassword !== 'string' || typeof newpassword !== 'string' || !oldpassword || !newpassword) {
		return fail(400, {
			error: {
				type: "input-format"
				, message: "Error in input, correct it and try again."
			}
		});
	}

	if (oldpassword === newpassword) {
		return fail(400, {
			error: {
				type: "password",
				message: "New password is same as old"
			}
		})
	}

	if (!locals.user) {
		redirect(300, '/login')
	}

	await db.updateTable('users').set({ password: await argon2.hash(newpassword) }).where('id', '=', locals.user.id).execute()
	return {
		successPassword: true
	}
}

export const actions: Actions = { updateUsername, updatePassword };
