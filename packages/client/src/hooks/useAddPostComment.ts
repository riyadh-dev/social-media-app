import { IPostComment, TPostCommentInput } from '@social-media-app/shared';
import { InfiniteData, useMutation } from 'react-query';
import { queryClient } from '..';
import { addPostComment } from '../queries/postComments';

const useAddPostComment = (postId: string | undefined) =>
	useMutation<IPostComment, unknown, TPostCommentInput>(
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
							if (post.id !== postId) return;
							post.comments.push(postComment.id);
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
