import {
	IPost,
	IPostComment,
	TPostCommentInput,
} from '@social-media-app/shared';
import { InfiniteData, useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import queryKeys from '../constants/reactQueryKeys';
import { addPostCommentQuery } from '../queries/postComments';
import { currentUserState } from '../recoil/atoms';

//TODO fix optimistic updates
const useAddPostComment = (postId?: string) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('current user not found');

	const params = useParams();
	const timelineOwnerId = params.userId ?? currentUser.id;

	const queryKey = [queryKeys.postComments, postId];

	const mutate = (commentInput: TPostCommentInput) =>
		addPostCommentQuery(commentInput, postId);

	return useMutation(mutate, {
		onMutate: async (commentInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value
			const previousConversation =
				queryClient.getQueryData<IPostComment[]>(queryKey);

			// Optimistically update to the new value
			const date = new Date();
			const newComment: IPostComment = {
				...commentInput,
				id: Math.random().toString(),
				author: {
					id: currentUser.id,
					userName: currentUser.userName,
					avatar: currentUser.avatar,
				},
				likes: [],
				dislikes: [],
				createdAt: date,
				updatedAt: date,
			};

			//TODO account for the case where old is empty
			queryClient.setQueryData<IPostComment[]>(queryKey, (old) =>
				old ? [newComment].concat(old) : [newComment]
			);

			// Return a context object with the snapshot value
			return { previousConversation };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousConversation);
		},

		//add the comment id to the post
		onSuccess: ({ id: postCommentId }) => {
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.timeline(timelineOwnerId),
				(old) => {
					old?.pages.every((page) =>
						page.every((post) =>
							post.id === postId ? !post.comments.push(postCommentId) : true
						)
					);
					return old;
				}
			);
		},
	});
};
export default useAddPostComment;
