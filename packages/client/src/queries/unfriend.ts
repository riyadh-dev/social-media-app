import { axiosInstance } from '../services/axios';

const unfriend = async (userId: string | undefined): Promise<string> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.put(
		`/users/${userId}/unfollow`,
		undefined,
		{ withCredentials: true }
	);
	return data;
};

export default unfriend;
