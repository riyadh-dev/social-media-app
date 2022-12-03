import { IPost } from '@social-media-app/shared/src';
import { InfiniteData, useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { dislikePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

//TODO optimistic update is a bit slow find a better implementation: maybe tag each post with its page index or use a map
const useDislikePost = (dislikedPost?: TPaginatedPost) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	return useMutation(() => dislikePostQuery(dislikedPost?.id), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts']);

			// Snapshot the previous value
			const prevTimelinePosts = queryClient.getQueryData(
				queryKeys.posts('timeline', currentUser?.id)
			);
			const prevLikedPosts = queryClient.getQueryData(
				queryKeys.posts('liked', currentUser?.id)
			);

			// Optimistically update to the new value
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.posts('timeline', currentUser?.id),
				(old) => {
					if (dislikedPost) {
						const post = old?.pages[dislikedPost.page][dislikedPost.index];
						post?.dislikes.push(currentUser.id);
						const index = post?.likes.indexOf(currentUser.id);
						if (typeof index === 'number' && index !== -1)
							post?.likes.splice(index, 1);
					}
					return old;
				}
			);

			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.posts('liked', currentUser?.id),
				(old) => {
					if (dislikedPost)
						old?.pages[dislikedPost.page].splice(dislikedPost.index, 1);
					return old;
				}
			);

			// Return a context object with the snapshot value
			return { prevLikedPosts, prevTimelinePosts };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(
				queryKeys.posts('timeline', currentUser?.id),
				context?.prevTimelinePosts
			);
			queryClient.setQueryData(
				queryKeys.posts('timeline', currentUser?.id),
				context?.prevLikedPosts
			);
		},
	});
};

export default useDislikePost;
