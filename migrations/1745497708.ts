import { type Kysely, sql } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('email', 'text')
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('password', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('prefs', 'json')
    .addColumn('profilePicture', 'text', (col) =>
      col.defaultTo(
        'https://images.unsplash.com/vector-1744035321374-a3bd0eb41df3?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ),
    )
    .execute();

  await db.schema
    .createTable('sessions')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('sessionToken', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('userId', 'text', (col) => col.notNull().references('users.id'))
    .addColumn('expire', 'timestamptz', (col) => col.notNull())
    .addColumn('ip', 'text')
    .execute();

  await db.schema
    .createTable('globals')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('key', 'text', (col) => col.notNull())
    .addColumn('value', 'text')
    .addColumn('group', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('files')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().unique())
    .addColumn('title', 'text')
    .addColumn('fileName', 'text', (col) => col.notNull())
    .addColumn('fileSize', 'text', (col) => col.notNull())
    .addColumn('mimeType', 'text', (col) => col.notNull())
    .addColumn('bucket', 'text', (col) =>
      col.notNull().defaultTo('image-uploader'),
    )
    .addColumn('key', 'text', (col) => col.notNull())
    // Use createdAt as "upload time"
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`))
    .addColumn('userId', 'text', (col) => col.notNull().references('users.id'))
    // Run cron over files with expire every x minutes and delete
    .addColumn('expire', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('files').execute();
}
