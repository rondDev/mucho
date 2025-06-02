import { db } from '$lib/db/database';
import { s3Client } from '$lib/s3';
import { logger } from '$lib/stores/logger';
import { bytesToSize } from '$lib/utils';

export async function load({ locals }: { locals: App.Locals }) {
	if (!locals.user) {
		return {
			user: undefined,
		};
	}
	const data = await getData(locals)
	return {
		user: locals.user,
		data
	};
}


async function getData(locals: App.Locals) {
	try {
		const log = logger.child({ location: "+page.server.ts", context: { user: locals.user } })
		const userFileCount = await db
			.selectFrom('files')
			.select([(c) => c.fn.count('id').as('count')])
			.where('userId', '=', locals.user.id)
			.executeTakeFirstOrThrow();
		// log.debug({ msg: 'userFileCount', content: userFileCount });

		if (!userFileCount.count) {
			return {
				error: 'Could not get amount of files for user',
			};
		}

		const totalFileCount = await db
			.selectFrom('files')
			.select([(c) => c.fn.count('id').as('count')])
			.executeTakeFirstOrThrow();
		// log.debug('totalFileCount', totalFileCount);

		const userCount = await db
			.selectFrom('users')
			.select([(c) => c.fn.count('id').as('count')])
			.executeTakeFirstOrThrow();

		if (!totalFileCount) {
			return {
				error: 'Could not get amount of total files',
			};
		}

		const allObjects = await s3Client.list({});

		let totalSize = 0;
		let totalUserSize = 0;
		if (allObjects.contents) {
			for (const o of allObjects.contents) {
				if (o.size) {
					totalSize += o.size;
					if (o.key.startsWith(locals.user.username)) {
						totalUserSize += o.size;
					}
				}
			}
		}

		// log.debug({
		// 	msg: "Return object", content: {
		// 		returnObject: {
		// 			userTotal: userFileCount.count,
		// 			total: totalFileCount.count,
		// 			userSize: bytesToSize(totalUserSize),
		// 			totalSize: bytesToSize(totalSize),
		// 			userCount: userCount.count,
		// 		}
		// 	}
		// });

		return {
			userTotal: userFileCount.count,
			total: totalFileCount.count,
			userSize: bytesToSize(totalUserSize),
			totalSize: bytesToSize(totalSize),
			userCount: userCount.count,
		};

		// const fileData = await db
		//   .selectFrom('files')
		//   .where('fileName', '=', fileUrl)
		//   .selectAll()
		//   .executeTakeFirst();
		//
		// if (!fileData) {
		//   return {
		//     error: 'File not found',
		//   };
		// }
		//
		// const file = await s3Client.send(
		//   new GetObjectCommand({
		//     Bucket: fileData.bucket,
		//     Key: fileData.key,
		//   }),
		// );
		// const s = file.Body?.transformToWebStream();
		// if (!s) {
		//   return {
		//     error: 'No file found',
		//   };
		// }
		// return sendStream(event, s);
	} catch (e) {
		logger.child({ location: "+page.server.ts", context: { user: locals.user } }).error(e)
		return {
			error: e,
		};
	}
};
