import { IPostComment } from '@social-media-app/shared';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema<IPostComment>({
	author: {
		id: String,
		avatar: String,
		userName: String,
	},
	text: String,
	likes: [String],
	dislikes: [String],
	comments: [String],
});

export default model('PostComment', UserSchema);
