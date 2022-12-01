import { IPost } from '@social-media-app/shared/src';
import { InfiniteData, useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import queryKeys from '../constants/reactQueryKeys';
import { dislikePostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

//TODO optimistic update is a bit slow find a better implementation: maybe tag each post with its page index or use a map
const useDislikePost = (postId?: string) => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	return useMutation(() => dislikePostQuery(postId), {
		// When mutate is called:
		onMutate: async () => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(['posts']);

			// Snapshot the previous value
			const prevTimelinePosts = queryClient.getQueryData(
				queryKeys.timeline(currentUser?.id)
			);
			const prevLikedPosts = queryClient.getQueryData(
				queryKeys.likedPosts(currentUser?.id)
			);

			// Optimistically update to the new value
			//TODO get rid of this Christmas tree
			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.timeline(currentUser?.id),
				(old) =>
					!old
						? undefined
						: {
								pageParams: old.pageParams,
								pages: old.pages.map((page) =>
									page.map((post) => {
										if (post.id === postId) {
											post.dislikes.push(currentUser.id);
											post.likes.splice(
												post.dislikes.indexOf(currentUser.id),
												1
											);
										}
										return post;
									})
								),
						  }
			);

			queryClient.setQueryData<InfiniteData<IPost[]> | undefined>(
				queryKeys.likedPosts(currentUser?.id),
				(old) =>
					!old
						? undefined
						: {
								pages: old?.pages?.map((page) =>
									page.filter((post) => post.id !== postId)
								),
								pageParams: old?.pageParams ?? [],
						  }
			);

			// Return a context object with the snapshot value
			return { prevLikedPosts, prevTimelinePosts };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(
				queryKeys.timeline(currentUser?.id),
				context?.prevTimelinePosts
			);
			queryClient.setQueryData(
				queryKeys.likedPosts(currentUser?.id),
				context?.prevLikedPosts
			);
		},
	});
};

export default useDislikePost;
