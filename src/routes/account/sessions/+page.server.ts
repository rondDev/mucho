import { db } from "$lib/db/database";
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit";

export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) {
		redirect(303, "/login")
	}
	// TODO: Add ip and potentially user-agent
	const sessions = await db
		.selectFrom('sessions')
		.where('userId', '=', locals.user.id)
		.select(['id', 'createdAt', 'updatedAt', 'expire'])
		.execute();
	// id: "e4k6jupems2a2f1qp3bge9tk",
	//     sessionToken: "743fe0d9aebdb0a907db9e077d53a61fb3433683b879565af5d067efa5e5313d",
	//     createdAt: 2025-05-28T07:43:17.028Z,
	//     updatedAt: 2025-05-28T07:43:17.028Z,
	//     userId: "zxb2aodgmpl04mr4fg3mkieh",
	//     expire: 2025-06-27T07:43:17.005Z,
	//     ip: null,
	console.log(sessions);
	return {
		user: locals.user,
		sessions
	};
}
