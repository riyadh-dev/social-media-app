import { IPost } from '@social-media-app/shared/src';
import { InfiniteData, useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { likePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

//optimistic updates
const useLikePost = (likedPost?: TPaginatedPost) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	return useMutation(() => likePostQuery(likedPost?.id), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts']);

			// Snapshot the previous value
			const prevTimelinePosts = queryClient.getQueryData(
				queryKeys.posts('timeline', currentUser?.id)
			);

			// Optimistically update to the new value
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.posts('timeline', currentUser.id),
				(old) => {
					if (likedPost) {
						const post = old?.pages[likedPost.page][likedPost.index];
						post?.likes.push(currentUser.id);
						const index = post?.dislikes.indexOf(currentUser.id);
						if (typeof index === 'number' && index !== -1)
							post?.dislikes.splice(index, 1);
					}

					return old;
				}
			);

			// Return a context object with the snapshot value
			return { prevTimelinePosts };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(
				queryKeys.posts('timeline', currentUser?.id),
				context?.prevTimelinePosts
			);
		},
	});
};

export default useLikePost;
