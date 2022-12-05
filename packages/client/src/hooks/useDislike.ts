import { cloneDeep, pull } from 'lodash';
import { InfiniteData, useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { dislikePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

const useDislikePost = (postId: string, page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	const { pathname } = useLocation();
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline';
	const queryKey = queryKeys.posts(listType, currentUser.id);

	return useMutation(() => dislikePostQuery(postId), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts']);

			// Snapshot the previous value
			const prevTimelinePosts =
				queryClient.getQueryData<InfiniteData<TPaginatedPost[]>>(queryKey);

			const prevPost = prevTimelinePosts
				? cloneDeep(prevTimelinePosts.pages[page][index])
				: undefined;

			// Optimistically update to the new value
			queryClient.setQueryData<InfiniteData<TPaginatedPost[]> | undefined>(
				queryKey,
				(old) => {
					if (old) {
						const post = old.pages[page][index];
						post.dislikes.push(currentUser.id);
						pull(post.likes, currentUser.id);
						if (listType === 'liked') old.pages[page].splice(index, 1);
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
