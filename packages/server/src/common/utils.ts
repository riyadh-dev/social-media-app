import chalk from 'chalk';
import { MongoServerError } from 'mongodb';

export const logError = (message: string) => console.error(chalk.red(message));
export const isMongoServerError = (error: Error): error is MongoServerError =>
	error.name === 'MongoServerError';
