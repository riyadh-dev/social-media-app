import { model, Schema } from 'mongoose';
import { IFriendRequest } from '@social-media-app/shared';

const friendRequestModel = new Schema<IFriendRequest>(
	{
		recipient: String,
		requester: String,
		status: {
			type: String,
			default: 'pending',
		},
	},
	{
		versionKey: false,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

export default model('friendRequest', friendRequestModel);
