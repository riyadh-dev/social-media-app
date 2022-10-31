import { IFriendRequest } from '@social-media-app/shared';

export type TFriendRequestInput = Omit<
	IFriendRequest,
	'id' | 'createdAt' | 'updatedAt'
>;
