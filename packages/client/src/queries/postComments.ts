import { IPostComment, TPostCommentInput } from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const addPostCommentQuery = async (
	commentInput: TPostCommentInput,
	postId?: string
): Promise<IPostComment> => {
	if (!postId) Promise.reject(new Error('Invalid ids'));
	const { data } = await axiosInstance.post(
		`/posts/comments/${postId}`,
		commentInput,
		{ withCredentials: true }
	);
	return data;
};

export const getPostCommentQuery = async (
	commentIds?: string[]
): Promise<IPostComment[]> => {
	if (!commentIds) Promise.reject(new Error('Invalid ids'));
	const { data } = await axiosInstance.post(
		'/posts/comments/list/',
		commentIds,
		{ withCredentials: true }
	);
	return data;
};
