import { model, Schema } from 'mongoose';
import { TPostDB } from './types';

const UserSchema = new Schema<TPostDB>(
	{
		author: {
			id: String,
			profilePicture: String,
			username: String,
		},
		description: String,
		img: String,
		likes: [String],
		dislikes: [String],
		comments: [String],
	},
	{ timestamps: true, versionKey: false }
);

export default model('Post', UserSchema);
