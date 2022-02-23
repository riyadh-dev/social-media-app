import axios from 'axios';
import { useQuery } from 'react-query';
import { ICurrentUser as IUser } from '../../interfaces';

const server_domain = 'http://localhost:4000/api';

const getUsersByIds = async (
	userIds: string[] | undefined
): Promise<IUser[]> => {
	if (!userIds) Promise.reject(new Error('Invalid id'));
	const { data } = await axios.post(`${server_domain}/users/list`, userIds, {
		withCredentials: true,
	});
	return data;
};

const useUsers = (userIds: string[] = []) =>
	useQuery(['users', ...userIds], () => getUsersByIds(userIds), {
		enabled: Boolean(userIds.length),
	});

export default useUsers;
