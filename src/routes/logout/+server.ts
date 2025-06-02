import { redirect } from "@sveltejs/kit";

export function GET({ cookies }) {
	// eat the cookie
	cookies.set("session", "", {
		path: "/",
		expires: new Date(0),
	});

	// redirect the user
	throw redirect(302, "/login");
}
