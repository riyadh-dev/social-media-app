import { useQuery } from 'react-query';
import { TUiUser as IUser } from '../../common/interfaces';
import { axiosInstance } from '../../services/axios';

const server_domain = 'http://localhost:4000/api';

const getUsersByIds = async (
	userIds: string[] | undefined
): Promise<IUser[]> => {
	if (!userIds) Promise.reject(new Error('Invalid id'));
	const { data } = await axiosInstance.post(
		`${server_domain}/users/list`,
		userIds,
		{
			withCredentials: true,
		}
	);
	return data;
};

const useUsers = (userIds: string[] = []) =>
	useQuery(['users', 'friends list'], () => getUsersByIds(userIds), {
		enabled: Boolean(userIds.length),
	});

export default useUsers;