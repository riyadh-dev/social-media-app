import { cloneDeep, pull } from 'lodash';
import { InfiniteData, useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { dislikePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

const useDislikePost = (dislikedPost?: TPaginatedPost) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	const { pathname } = useLocation();
	const listType = pathname === '/favorites' ? 'liked' : 'timeline';
	const queryKey = queryKeys.posts(listType, currentUser.id);

	console.log(pathname);

	return useMutation(() => dislikePostQuery(dislikedPost?.id), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts']);

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(queryKey);

			const prevPost =
				dislikedPost && prevTimelinePosts
					? cloneDeep(
							prevTimelinePosts.pages[dislikedPost.page][dislikedPost.index]
					  )
					: undefined;

			// Optimistically update to the new value
			queryClient.setQueryData<InfiniteData<TPaginatedPost[]> | undefined>(
				queryKey,
				(old) => {
					if (dislikedPost && old) {
						const post = old.pages[dislikedPost.page][dislikedPost.index];
						post.dislikes.push(currentUser.id);
						pull(post.likes, currentUser.id);
						if (listType === 'liked')
							old.pages[dislikedPost.page].splice(dislikedPost.index, 1);
					}

					return old;
				}
			);

			// Return a context object with the snapshot value
			return { prevPost };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<InfiniteData<TPaginatedPost[]> | undefined>(
				queryKey,
				(old) => {
					const prevPost = context?.prevPost;
					if (prevPost && old) {
						listType === 'timeline'
							? (old.pages[prevPost.page][prevPost.index] = prevPost)
							: old.pages[prevPost.page].splice(prevPost.index, 0, prevPost);
					}
					return old;
				}
			);
		},
	});
};

export default useDislikePost;
