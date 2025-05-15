import {
	S3_ACCESS_KEY,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_KEY,
} from '$env/static/private';
import { S3Client } from 'bun';

export const s3Client = new S3Client({
	bucket: S3_BUCKET || 'image',
	endpoint: S3_ENDPOINT || '',
	accessKeyId: S3_ACCESS_KEY || '',
	secretAccessKey: S3_SECRET_KEY || '',
	region: S3_REGION || 'us-east-1',
});
