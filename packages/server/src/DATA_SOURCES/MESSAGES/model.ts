import { IChatMessage } from '@social-media-app/shared';
import { model, Schema } from 'mongoose';

const messageSchema = new Schema<IChatMessage>(
	{
		senderId: String,
		targetId: String,
		text: String,
		status: { type: String, default: 'sent' },
	},
	{
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true,
	}
);

export default model('message', messageSchema);
