import chalk from 'chalk';
import mongoose from 'mongoose';
import { logError } from '../common/utils';
import { MONGODB_URI } from './secrets';

//TODO use in messaging app
export const setMongoosePlugin = () =>
	mongoose.plugin((schema: mongoose.Schema) => {
		const toObjectOption: mongoose.ToObjectOptions = {
			versionKey: false,
			virtuals: true,
			transform(doc, ret) {
				//TODO better solution
				ret.createdAt = (ret.createdAt as Date).getTime();
				delete ret._id;
			},
		};

		schema.set('timestamps', true);
		schema.set('toJSON', toObjectOption);
		schema.set('toObject', toObjectOption);
	});

export const connectDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log(chalk.green('Connected To DB'));
	} catch (error) {
		if (error instanceof Error) logError(error.message);
	}
};

export const disconnectDB = () => mongoose.disconnect();

export const clearDB = async () => {
	console.log(chalk.red('Clearing DB...'));
	await mongoose.connection.db.dropDatabase();
};
