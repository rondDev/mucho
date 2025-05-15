import type { Database } from './dbTypes'; // this is the Database interface we defined earlier
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import {
	DB_DATABASE,
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_PORT,
	DB_MAXCONCURRENT,
} from '$env/static/private';

const dialect = new PostgresDialect({
	pool: new Pool({
		database: DB_DATABASE,
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASSWORD,
		port: Number.parseInt(DB_PORT || '5432'),
		max: Number.parseInt(DB_MAXCONCURRENT || '10'),
	}),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
	dialect,
});
