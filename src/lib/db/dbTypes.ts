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
}

export interface UsersTable {
  id: Generated<string>;
  createdAt: Generated<Date>;
  updatedAt: Date;
  email: string;
  password: string;
  description: string | null;
  prefs: JSONColumnType<Record<string | number | symbol, never>>;
  profilePicture: Generated<string>;
  sessionJwt: string;
  sessionId: string;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface SessionsTable {
  createdAt: Generated<Date>;
  updatedAt: Date;
  userId: string;
  expire: Date;
  ip: string;
}

export type Session = Selectable<SessionsTable>;
export type NewSession = Insertable<SessionsTable>;
export type SessionUpdate = Updateable<SessionsTable>;
