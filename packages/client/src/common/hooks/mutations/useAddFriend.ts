import axios from 'axios';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { queryClient } from '../../..';
import { currentUserState } from '../../../recoil/states';

const server_domain = 'http://localhost:4000/api';

const addFriend = async (userId: string | undefined): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axios.put(
		`${server_domain}/users/${userId}/follow`,
		undefined,
		{ withCredentials: true }
	);
	return data;
};

const useAddFriend = (userId: string | undefined = undefined) => {
	const setCurrentUser = useRecoilState(currentUserState)[1];
	const newFriendId = useParams().id ?? userId;

	return useMutation(addFriend, {
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
			queryClient.invalidateQueries(['users']);
			setCurrentUser((prev) => {
				if (!prev) return null;
				const followings = newFriendId
					? [...prev.followings, newFriendId]
					: prev.followings;

				return {
					...prev,
					followings,
				};
			});
		},
	});
};

export default useAddFriend;
