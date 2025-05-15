import { GetObjectCommand } from '@aws-sdk/client-s3';
import { db } from '$lib/db/database';
import { s3Client } from '$lib/s3';

export async function GET({ params }) {
  try {
    const fileUrl = params.filename;
    if (!fileUrl) {
      return {
        error: 'No file url specified',
      };
    }
    const fileData = await db
      .selectFrom('files')
      .where('fileName', '=', fileUrl)
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
    const s = file.Body?.transformToWebStream();
    if (!s) {
      return {
        error: 'No file found',
      };
    }
    const response = new Response(s);
    response.headers.set('Content-Type', file.ContentType || '');
    return response;
  } catch (e) {
    return {
      error: e,
    };
  }
}
