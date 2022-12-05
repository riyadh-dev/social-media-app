import { cloneDeep } from 'lodash';
import { InfiniteData, useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import { TPaginatedPost } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import { deletePostQuery, updatePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

export const useUpdatePost = (page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('current user not found');

	const { pathname } = useLocation();
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline';

	const queryKey = queryKeys.posts(listType, currentUser.id);
	return useMutation(updatePostQuery, {
		// When mutate is called:
		onMutate: async ({ postId, postInput }) => {
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
						const post = old?.pages[page][index];
						post.description = postInput.description;
						post.img = postInput.img;
					}
					return old;
				}
			);

			// Return a context object with the snapshot value
			return { prevPost };
		},

		//TODO do not work cause am mutating old
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<InfiniteData<TPaginatedPost[]> | undefined>(
				queryKey,
				(old) => {
					const prevPost = context?.prevPost;
					if (prevPost && old) {
						old.pages[prevPost.page][prevPost.index] = prevPost;
					}
					return old;
				}
			);
		},
	});
};

export const useDeletePost = (page: number, index: number) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('current user not found');

	const { pathname } = useLocation();
	const listType = pathname.includes('/posts/liked') ? 'liked' : 'timeline';

	const queryKey = queryKeys.posts(listType, currentUser.id);
	return useMutation(deletePostQuery, {
		// When mutate is called:
		onMutate: async (postId) => {
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
					if (old) old.pages[page].splice(index, 1);
					return old;
				}
			);

			// Return a context object with the snapshot value
			return { prevPost };
		},

		//TODO do not work cause am mutating old
		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<InfiniteData<TPaginatedPost[]> | undefined>(
				queryKey,
				(old) => {
					const prevPost = context?.prevPost;
					if (prevPost && old)
						old.pages[prevPost.page].splice(prevPost.index, 0, prevPost);
					return old;
				}
			);
		},
	});
};
