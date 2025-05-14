import type {
	Generated,
	Insertable,
	JSONColumnType,
	Selectable,
	Updateable,
} from 'kysely';

export interface Database {
	users: UsersTable;
	sessions: SessionsTable;
	file_upload_keys: UploadKeysTable;
}

export interface UsersTable {
	id: Generated<string>;
	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
	email: string | null;
	username: string;
	password: string;
	description: string | null;
	prefs: JSONColumnType<Record<string | number | symbol, never>> | null;
	profilePicture: Generated<string>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface SessionsTable {
	id: string;
	sessionToken: string;
	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
	userId: string;
	expire: Date;
}

export type Session = Selectable<SessionsTable>;
export type NewSession = Insertable<SessionsTable>;
export type SessionUpdate = Updateable<SessionsTable>;

export interface UploadKeysTable {
	id: string;
	uploadKey: string;
	userId: string;
	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
}

export type UploadKeys = Selectable<UploadKeysTable>;
export type NewUploadKeys = Insertable<UploadKeysTable>;
export type UploadKeysUpdate = Updateable<UploadKeysTable>;
