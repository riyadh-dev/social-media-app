import { useQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { getOnlineUsersIdsQuery } from '../queries/users';

const useGetOnlineUsersIds = () =>
	useQuery(queryKeys.activeFriends, getOnlineUsersIdsQuery);

export default useGetOnlineUsersIds;
