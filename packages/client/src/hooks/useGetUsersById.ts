import { useQuery } from 'react-query';
import { getUsersByIdsQuery } from '../queries/users';

const useGetUsersById = (userIds: string[] = [], queryKey: string | string[]) =>
	useQuery(queryKey, () => getUsersByIdsQuery(userIds), {
		enabled: Boolean(userIds.length > 0),
	});

export default useGetUsersById;
