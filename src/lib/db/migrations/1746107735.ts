import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('file_upload_keys')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('uploadKey', 'text', (col) => col.notNull().unique())
    .addColumn('userId', 'text', (col) => col.notNull().references('users.id'))
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .execute();
}
