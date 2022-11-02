import { InfiniteData, useMutation } from 'react-query';
import { queryClient } from '../../..';
import { axiosInstance } from '../../../services/axios';
import { IPostComment } from '../../interfaces';

const server_domain = 'http://localhost:4000/api';

interface ICommentInput {
	text: string;
}

const addPostComment = async (
	comment: ICommentInput,
	postId: string | undefined
): Promise<IPostComment> => {
	if (!postId) Promise.reject(new Error('Invalid ids'));
	const { data } = await axiosInstance.post(
		`${server_domain}/posts/comments/${postId}`,
		comment,
		{ withCredentials: true }
	);
	return data;
};

const useAddPostComment = (postId: string | undefined) =>
	useMutation<IPostComment, unknown, ICommentInput>(
		(comment) => addPostComment(comment, postId),
		{
			onSuccess: async (postComment) => {
				await queryClient.cancelQueries('postComments');

				const userId = queryClient
					.getQueryCache()
					.findAll(['posts', 'timeline'], { active: true })[0].queryKey[2];

				queryClient.setQueryData<InfiniteData<IPostComment[]> | undefined>(
					['posts', 'timeline', userId],
					(old) => {
						old?.pages[0].forEach((post) => {
							if (post._id !== postId) return;
							post.comments.push(postComment._id);
						});
						return old;
					}
				);

				queryClient.setQueryData<IPostComment[] | undefined>(
					['postComments', postId],
					(old) => (old ? [postComment, ...old] : undefined)
				);
			},
		}
	);

export default useAddPostComment;
