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

		const file = s3Client.file(fileData.key);
		const fileStat = await s3Client.stat(fileData.key);
		if (!file) {
			return {
				error: 'No file found',
			};
		}
		const response = new Response(await file.bytes());
		response.headers.set('Content-Type', fileStat.type || '');
		return response;
	} catch (e) {
		return {
			error: e,
		};
	}
}
