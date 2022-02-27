import { model, Schema } from 'mongoose';
import { TPostCommentDB } from './types';

const UserSchema = new Schema<TPostCommentDB>(
	{
		author: {
			id: String,
			profilePicture: String,
			username: String,
		},
		text: String,
		likes: [String],
		dislikes: [String],
		comments: [String],
	},
	{ timestamps: true, versionKey: false }
);

export default model('PostComment', UserSchema);
