import { redirect } from '@sveltejs/kit';

export function load({ locals }: { locals: App.Locals }) {
  if (!locals.user) {
    throw redirect(301, '/login');
  }
  return {
    user: locals.user,
  };
}
