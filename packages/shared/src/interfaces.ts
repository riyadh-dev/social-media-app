import { TChatMessageStatus, TFriendRequestStatus } from './types';

export interface IUser {
	id: string;
	avatar?: string;
	userName: string;
	email: string;
	password: string;
	friends: string[];
	likedPosts: string[];
	dislikedPosts: string[];
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IFriendRequest {
	id: string;
	requester: string;
	recipient: string;
	status: TFriendRequestStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface IChatMessage {
	id: string;
	senderId: string;
	targetId: string;
	text: string;
	status: TChatMessageStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface IPost {
	id: string;
	author: {
		id: string;
		username: string;
		profilePicture: string;
	};
	description: string;
	img: string;
	likes: string[];
	dislikes: string[];
	comments: string[];
	createdAt: string;
	updatedAt: string;
}

export interface IPostComment {
	id: string;
	author: {
		id: string;
		username: string;
		profilePicture: string;
	};
	text: string;
	likes: string[];
	dislikes: string[];
	comments: string[];
	createdAt: string;
	updatedAt: string;
}

export interface IChatMessageTypingAction {
	type: 'chat-typing-started' | 'chat-typing-stopped';
	payload: { userId: string };
}

export interface IChatMessageAction {
	type: 'chat-message';
	payload: IChatMessage;
}
