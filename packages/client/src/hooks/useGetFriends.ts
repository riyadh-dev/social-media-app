import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import queryKeys from '../constants/reactQueryKeys';
import { getFriendsIdsQuery, getUsersByIdsQuery } from '../queries/users';
import { currentUserState } from '../recoil/atoms';

export const useGetCurrentUserFriendsIds = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	return useQuery(queryKeys.friendsIds, getFriendsIdsQuery, {
		initialData: currentUser.friends,
		onSuccess(data) {
			setCurrentUser((prev) => (prev ? { ...prev, friends: data } : null));
		},
	});
};

const useGetCurrentUserFriends = () => {
	const currentUser = useRecoilValue(currentUserState);
	if (!currentUser) throw new Error('you are not logged in');

	const { data: friendsIds } = useGetCurrentUserFriendsIds();

	return useQuery(
		queryKeys.friends(currentUser.id),
		() => getUsersByIdsQuery(friendsIds),
		{ enabled: Boolean(friendsIds?.length) }
	);
};

export default useGetCurrentUserFriends;
