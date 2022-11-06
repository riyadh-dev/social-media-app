import { useQuery } from 'react-query';
import { TUiUser as IUser } from '../../common/interfaces';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const getUser = async (userId: string | undefined): Promise<IUser> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.get(`${server_domain}/users/${userId}`, {
		withCredentials: true,
	});
	return data;
};

const useUser = (userId: string | undefined) =>
	useQuery(['user', userId], () => getUser(userId), {
		enabled: Boolean(userId),
	});

export default useUser;
