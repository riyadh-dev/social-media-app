import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { queryClient } from '..';
import { TUiUser } from '../common/types';
import queryKeys from '../constants/reactQueryKeys';
import unfriendQuery from '../queries/unfriend';
import { chatBoxesState, currentUserState } from '../recoil/atoms';

const useUnfriend = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	const [chatBoxes, setChatBoxes] = useRecoilState(chatBoxesState);

	const queryKey = queryKeys.friends(currentUser.id);
	return useMutation(unfriendQuery, {
		onMutate: async (targetId) => {
			// Cancel any outgoing refetch (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries(queryKey);

			// Snapshot the previous value
			const prevFriends = queryClient.getQueryData<TUiUser[]>(queryKey);
			const prevFriendsIds = queryClient.getQueryData<string[]>(
				queryKeys.friendsIds
			);
			const prevCurrentUser = currentUser;
			const prevChatBoxes = chatBoxes;

			// Optimistically update to the new value
			queryClient.setQueryData<TUiUser[] | undefined>(queryKey, (old) =>
				old?.filter((friend) => friend.id !== targetId)
			);
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				(old) => old?.filter((friendId) => friendId !== targetId)
			);
			setCurrentUser((prev) =>
				prev
					? {
							...prev,
							friends: prev?.friends.filter(
								(friendId) => friendId !== targetId
							),
					  }
					: null
			);

			setChatBoxes((prev) => {
				const { minimized, open } = prev;
				minimized.delete(targetId ?? '');
				open.delete(targetId ?? '');
				return { minimized, open };
			});

			// Return a context object with the snapshot value
			return { prevFriends, prevCurrentUser, prevChatBoxes, prevFriendsIds };
		},

		// If the mutation fails, use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData<TUiUser[] | undefined>(
				queryKey,
				context?.prevFriends
			);
			queryClient.setQueryData<string[] | undefined>(
				queryKeys.friendsIds,
				context?.prevFriendsIds
			);
			setCurrentUser(context?.prevCurrentUser ?? null);
			setChatBoxes(
				context?.prevChatBoxes ?? { minimized: new Map(), open: new Map() }
			);
		},
	});
};

export default useUnfriend;
