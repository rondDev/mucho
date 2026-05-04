import { fail, redirect } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import type { Action, Actions, PageServerLoad } from './$types';
import * as argon2 from 'argon2';

import { db } from '$lib/db/database';
import { createId } from '@paralleldrive/cuid2';
import pino from 'pino';
import { logger } from '$lib/stores/logger';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
};

const register: Action = async ({ request }) => {
  try {
    const registrationEnabled = await db
      .selectFrom('globals')
      .where('key', '=', 'registrationEnabled')
      .select(['key', 'value'])
      .executeTakeFirst();
    if (registrationEnabled.value === 'false') {
      return fail(400, { registrationdisabled: true });
    }
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    // TODO: Introduce enable/disable registration

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
      .where('users.username', '=', username)
      .executeTakeFirst();
    if (user) {
      return fail(400, { user: true });
    }

    // TODO: Add password requirements
    const userId = createId();
    const registered = await db
      .insertInto('users')
      .values({
        id: userId,
        username: username,
        password: await argon2.hash(password)
      })
      .executeTakeFirstOrThrow();

    await db
      .insertInto('file_upload_keys')
      .values({
        id: createId(),
        uploadKey: uuidv4(),
        userId: userId
      })
      .execute();
  } catch (e) {
    logger.error(e, '[register | +page.server.ts | catch]');
  }

  throw redirect(303, '/login?justRegistered=true');
};

export const actions: Actions = { register };
