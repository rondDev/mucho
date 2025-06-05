import { redirect, type Cookies } from "@sveltejs/kit";

export function GET({ cookies, locals }: { cookies: Cookies, locals: App.Locals }) {
	// eat the cookie
	cookies.set("session", "", {
		path: "/",
		expires: new Date(0),
	});

	// set locals user to null to avoid issues
	locals.user = null;

	// redirect the user
	throw redirect(302, "/login");
}
