import { IPost } from '@social-media-app/shared';
import { InfiniteData, useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost, TPaginatedPostsType } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { updatePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

export const useUpdatePost = (
	page: number,
	index: number,
	postType: TPaginatedPostsType
) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('current user not found');

	const queryKey = queryKeys.posts(postType, currentUser.id);
	return useMutation(updatePostQuery, {
		// When mutate is called:
		onMutate: async ({ postId, postInput }) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value
			const previousPostsPages =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(queryKey);

			// Optimistically update to the new value
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKey,
				(old) => {
					const post = old?.pages[page][index];
					if (post) {
						post.description = postInput.description;
						post.img = postInput.img;
					}
					return old;
				}
			);

			// Return a context object with the snapshot value
			return { previousPostsPages };
		},

		//TODO do not work cause am mutating old
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousPostsPages);
		},
	});
};

export const useDeletePost = () => {
	throw new Error('not yet implemented');
};
