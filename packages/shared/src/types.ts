import {
	IChatMessage,
	IChatMessageAction,
	IChatMessageTypingAction,
	IFriendRequest,
	IFriendRequestAction,
	IPost,
	IPostComment,
	IUser,
	IUserConnectionAction,
} from './interfaces';

export type TChatMessageStatus = 'pending' | 'sent' | 'received' | 'viewed';
export type TFriendRequestStatus = 'pending' | 'accepted' | 'rejected';
export type TWebSocketAction =
	| IChatMessageAction
	| IChatMessageTypingAction
	| IUserConnectionAction
	| IFriendRequestAction;

export type TUpdateUserInput = Pick<
	IUser,
	'userName' | 'avatar' | 'email' | 'password'
>;
export type TLoginInput = Pick<IUser, 'password' | 'email'>;
export type TSignUpInput = Pick<
	IUser,
	'userName' | 'email' | 'password' | 'avatar'
>;

export type TFriendRequestInput = Pick<
	IFriendRequest,
	'requester' | 'recipient'
>;

export type TChatMessageInput = Pick<
	IChatMessage,
	'targetId' | 'text' | 'senderId'
>;

export type TPostInput = Pick<IPost, 'img' | 'description'>;

export type TPostCommentInput = Pick<IPostComment, 'text'>;
