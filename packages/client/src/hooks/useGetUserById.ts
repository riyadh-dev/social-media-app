import { useQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { getUserByIdsQuery } from '../queries/users';

const useGetUserById = (userId?: string) =>
	useQuery(queryKeys.user(userId), () => getUserByIdsQuery(userId));

export default useGetUserById;
