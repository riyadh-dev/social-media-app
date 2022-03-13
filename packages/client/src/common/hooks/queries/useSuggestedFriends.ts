import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { ICurrentUser } from '../../interfaces';
import useIntersectionObserver from '../useIntersectionObserver';

const server_domain = 'http://localhost:4000/api';

const getSuggestedFriends = async (
	date: number = Date.now()
): Promise<ICurrentUser[]> => {
	const { data } = await axios.get(`${server_domain}/users/list/${date}`, {
		withCredentials: true,
	});
	return data;
};

const useSuggestedFriends = () => {
	const getSuggestedFriendsQuery = useInfiniteQuery(
		['users', 'suggested friends'],
		({ pageParam }) => getSuggestedFriends(pageParam),
		{
			getNextPageParam: (lastPage) =>
				lastPage.length
					? Date.parse(lastPage[lastPage.length - 1].createdAt)
					: undefined,
		}
	);
	const intersectionItemRef = useIntersectionObserver({
		onIntersection: getSuggestedFriendsQuery.fetchNextPage,
		enable: !getSuggestedFriendsQuery.isLoading,
	});

	return {
		intersectionItemRef,
		...getSuggestedFriendsQuery,
	};
};

export default useSuggestedFriends;
