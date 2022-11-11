import { IPostComment, TPostCommentInput } from '@social-media-app/shared';
import { axiosInstance } from '../services/axios';

export const addPostCommentQuery = async (
	comment: TPostCommentInput,
	postId: string | undefined
): Promise<IPostComment> => {
	if (!postId) Promise.reject(new Error('Invalid ids'));
	const { data } = await axiosInstance.post(
		`/posts/comments/${postId}`,
		comment,
		{ withCredentials: true }
	);
	return data;
};
