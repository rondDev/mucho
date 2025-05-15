import { s3Client } from '$lib/s3';
import cryptoRandomString from 'crypto-random-string';
import { db } from '$lib/db/database';
import { createId } from '$lib/cuid';
import mime from 'mime-types';
import { json } from '@sveltejs/kit';
import { bytesToSize } from '$lib/utils';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { S3_BUCKET } from '$env/static/private';
import { logger } from '$lib/stores/logger';

export async function POST({ request }) {
	try {
		const formDataBody = await request.formData();
		const uploadKey = String(formDataBody.get('key'));
		const fileInput = formDataBody.get('d') as File;
		const randomizeFilename = String(formDataBody.get('name')) === 'true';
		if (!fileInput) {
			return json({
				error: 'No file data provided',
			});
		}

		if (!uploadKey) {
			return json(
				{
					error: 'Unauthorized',
				},
				{ status: 401 },
			);
		}
		const fileObject: {
			name: string;
			type: string | undefined;
			contenttype: string;
		} = {
			name: fileInput.name,
			type: fileInput.type,
			contenttype: mime.lookup(fileInput.name || '') || '',
		};
		if (!fileObject) {
			return {
				error: "Couldn't parse a file object or no files were provided",
			};
		}

		const user = await db
			.selectFrom('users')
			.innerJoin('file_upload_keys as file', 'file.userId', 'users.id')
			.where('file.uploadKey', '=', uploadKey)
			.select(['users.id', 'username'])
			.executeTakeFirst();

		if (!user) {
			logger.error('[api/upload] Upload key invalid');
			return {
				error: 'Upload key invalid',
			};
		}

		const fileNameRand = cryptoRandomString({
			length: 12,
			type: 'alphanumeric',
		});
		// NOTE: Might need to add file extension to the random name
		const fileName = randomizeFilename
			? `${fileNameRand}.${mime.extension(fileObject.name)}`
			: fileObject.name;
		const fileKey = `${user.username}/${fileName}`;

		const file = await s3Client.write(fileKey, await fileInput.bytes(), {
			type: fileObject.type,
		});
		// TODO: rework how to name files, currently only random name shows
		await db
			.insertInto('files')
			.values({
				id: createId(),
				fileName: fileNameRand,
				fileSize: bytesToSize(fileInput.size),
				mimeType: fileObject.contenttype,
				bucket: process.env.S3_BUCKET || 'image',
				key: fileKey,
				userId: user.id,
			})
			.execute();
		return json({
			url: `${PUBLIC_DOMAIN}/${fileNameRand}`,
		});
	} catch (e) {
		logger.error('[api/upload | catch]', e);
		return json({
			error: e,
		});
	}
}
