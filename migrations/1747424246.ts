import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('files')
		.addColumn('stub', 'text', (col) => col.notNull())
		.execute();
}
