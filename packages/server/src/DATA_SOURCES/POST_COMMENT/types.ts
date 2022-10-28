import { IPostComment } from './interfaces';

export type TPostCommentDB = Omit<
	IPostComment,
	'_id' | 'createdAt' | 'updatedAt'
>;

export type TPostCommentInput = Omit<
	TPostCommentDB,
	'likes' | 'dislikes' | 'author'
>;
