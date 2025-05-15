import { db } from '$lib/db/database';
import { s3Client } from '$lib/s3';
import { logger } from '$lib/stores/logger';
import { bytesToSize } from '$lib/utils';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { fail, type Actions, type Action, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, locals, url }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }
  try {
    const offsetParam = url.searchParams.get('offset');
    const offset = (() => {
      if (offsetParam && offsetParam.length < 1) {
        return 0;
      }
      try {
        const n = Number.parseInt(offsetParam || '0');
        return n;
      } catch (e) {
        logger.error('[api/files | offset]', e);
        return 0;
      }
    })();
    const cookie = cookies.get('session');
    const user = await db
      .selectFrom('sessions')
      .where('sessionToken', '=', cookie)
      .select(['userId'])
      .executeTakeFirst();
    if (!user) {
      return {
        error: 'User not found',
      };
    }
    const fileData = await db
      .selectFrom('files')
      .where('userId', '=', user.userId)
      .selectAll()
      .orderBy('updatedAt', 'desc')
      .limit(10)
      .offset(offset * 10 || 0)
      .execute();

    if (!fileData) {
      return {
        error: 'File not found',
      };
    }

    const files = [];

    for (const f of fileData) {
      const fileData = await db
        .selectFrom('files')
        .where('fileName', '=', f.fileName)
        .selectAll()
        .executeTakeFirst();

      if (!fileData) {
        return {
          error: 'File not found',
        };
      }

      const file = await s3Client.send(
        new GetObjectCommand({
          Bucket: fileData.bucket,
          Key: fileData.key,
        }),
      );
      files.push({
        fileName: f.fileName,
        size: bytesToSize(file.ContentLength || 0),
        contentType: file.ContentType,
        updatedAt: f.updatedAt,
      });
    }
    return {
      files: files,
    };
  } catch (e) {
    logger.error('[api/files | catch]', e);
    return {
      files: {},
      error: e,
    };
  }
};

// TODO: fix remove
// const remove: Action = async ({ request }) => {
//   const data = await request.formData();
//   const fileName = data.get('file');
//
//   if (typeof fileName !== 'string' || !fileName) {
//     return fail(400, { invalid: true });
//   }
//   const del = await db.file.delete({
//     where: {
//       fileFullName: fileName,
//     },
//   });
//   fs.rmSync(path.join(process.cwd(), del.url));
//   redirect(303, '/files');
// };

export const actions: Actions = {};
