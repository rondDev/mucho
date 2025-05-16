import { db } from '$lib/db/database';
import { s3Client } from '$lib/s3';
import { logger } from '$lib/stores/logger';
import { bytesToSize } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	return await getMetadata(params.slug);
};

async function getMetadata(filename: string) {
	try {
		const fileData = await db
			.selectFrom('files')
			.innerJoin('users', 'users.id', 'files.userId')
			.where('stub', '=', filename)
			.select([
				'files.createdAt',
				'files.bucket',
				'files.key',
				'files.stub',
				'users.username',
			])
			.executeTakeFirst();

		if (!fileData) {
			throw redirect(404, '/');
		}

		const file = s3Client.file(fileData.key);
		const fileStat = await s3Client.stat(fileData.key);
		return {
			fileName: filename,
			size: bytesToSize(fileStat.size || 0),
			contentType: fileStat.type,
			uploadedAt: fileData.createdAt,
			uploader: fileData.username,
			stub: fileData.stub,
		};
	} catch (e) {
		logger.error('[api/files | catch]', e);
		return {
			files: {},
			error: e,
		};
	}
}
