import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { queryClient } from '../..';
import { currentUserState } from '../../recoil/states';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const addRemove = async (userId: string | undefined): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`${server_domain}/users/${userId}/unfollow`,
		undefined,
		{ withCredentials: true }
	);
	return data;
};

const useAddRemove = () => {
	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const newFriendId = useParams().id;

	return useMutation(addRemove, {
		onSuccess: () => {
			queryClient.invalidateQueries(['posts']);
			setCurrentUser((prev) => {
				if (!prev) return null;
				const followings = newFriendId
					? prev.followings.filter((id) => id !== newFriendId)
					: prev.followings;
				return { ...prev, followings };
			});
			console.log(currentUser);
		},
	});
};

export default useAddRemove;
