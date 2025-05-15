import { db } from '$lib/db/database';
import { s3Client } from '$lib/s3';
import { logger } from '$lib/stores/logger';
import { bytesToSize } from '$lib/utils';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	return await getMetadata(params.slug);
};

async function getMetadata(filename: string) {
	try {
		const fileData = await db
			.selectFrom('files')
			.innerJoin('users', 'users.id', 'files.userId')
			.where('fileName', '=', filename)
			.select([
				'files.createdAt',
				'files.bucket',
				'files.key',
				'users.username',
			])
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
		return {
			fileName: filename,
			size: bytesToSize(file.ContentLength || 0),
			contentType: file.ContentType,
			uploadedAt: fileData.createdAt,
			uploader: fileData.username,
		};
	} catch (e) {
		logger.error('[api/files | catch]', e);
		return {
			files: {},
			error: e,
		};
	}
}
