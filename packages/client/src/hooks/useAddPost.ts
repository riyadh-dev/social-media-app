import { IPost } from '@social-media-app/shared/src';
import { InfiniteData, useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '..';
import queryKeys from '../constants/reactQueryKeys';
import { addPostQuery } from '../queries/posts';
import { currentUserState } from '../recoil/atoms';

const useAddPost = () => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('current user not found');

	const queryKey = queryKeys.posts('timeline', currentUser.id);
	return useMutation(addPostQuery, {
		// When mutate is called:
		onMutate: async (newPostInput) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value
			const previousConversation =
				queryClient.getQueryData<InfiniteData<IPost[]>>(queryKey);

			// Optimistically update to the new value
			const date = new Date();
			const newPost: IPost = {
				...newPostInput,
				id: Math.random().toString(),
				author: {
					id: currentUser.id,
					userName: currentUser.userName,
					avatar: currentUser.avatar,
				},
				likes: [],
				dislikes: [],
				comments: [],
				createdAt: date,
				updatedAt: date,
			};

			//TODO account for the case where old is empty
			queryClient.setQueryData<InfiniteData<IPost[]>>(queryKey, (old) => ({
				pages: old?.pages ? [[newPost]].concat(old.pages) : [[newPost]],
				pageParams: old?.pageParams ?? [],
			}));

			// Return a context object with the snapshot value
			return { previousConversation };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(queryKey, context?.previousConversation);
		},

		// Always refetch after error or success:
		onSettled: (data, err, newMessage) => {
			queryClient.invalidateQueries(queryKey);
		},
	});
};

export default useAddPost;
