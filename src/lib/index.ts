// place files you want to import through the `$lib` alias in this folder.
import type { Logger, LoggerOptions } from 'pino';

export enum ServerEnvironment {
	DEV = 0,
	PREV = 1,
	STG = 2,
	PROD = 3,
}

export type PinoLogger = Logger & {
	setLogLevel?: (NODE_ENV: ServerEnvironment) => LoggerOptions['level'];
};
