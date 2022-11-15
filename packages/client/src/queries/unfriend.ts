import { axiosInstance } from '../services/axios';

const unfriendQuery = async (userId?: string): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/users/${userId}/unfollow`,
		undefined,
		{ withCredentials: true }
	);
	return data;
};

export default unfriendQuery;
