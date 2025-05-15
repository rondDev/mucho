import {
	S3_ACCESS_KEY,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_KEY,
} from '$env/static/private';
import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
	endpoint: S3_ENDPOINT || '',
	credentials: {
		accessKeyId: S3_ACCESS_KEY || '',
		secretAccessKey: S3_SECRET_KEY || '',
	},
	region: S3_REGION || 'us-east-1',
	forcePathStyle: true,
});
