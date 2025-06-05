import { redirect, type Cookies } from "@sveltejs/kit";

export function GET({ cookies, locals }: { cookies: Cookies, locals: App.Locals }) {
	// eat the cookie
	cookies.set("session", "", {
		path: "/",
		expires: new Date(0),
	});

	// redirect the user
	throw redirect(302, "/login");
}
