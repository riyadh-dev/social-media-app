import { useQuery } from 'react-query';
import queryKeys from '../constants/reactQueryKeys';
import { searchUsersByUserNameQuery } from '../queries/users';

const useSearchUsersByUserName = (searchTerm?: string) =>
	useQuery(
		queryKeys.searchUsers(searchTerm),
		() => searchUsersByUserNameQuery(searchTerm),
		{ enabled: Boolean(searchTerm && searchTerm.length > 2) }
	);

export default useSearchUsersByUserName;
