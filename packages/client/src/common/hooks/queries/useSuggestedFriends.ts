import { useInfiniteQuery } from 'react-query';
import { axiosInstance } from '../../../services/axios';
import { ICurrentUser } from '../../interfaces';
import useIntersectionObserver from '../useIntersectionObserver';

const server_domain = 'http://localhost:4000/api';

const getSuggestedFriends = async (
	date: number = Date.now()
): Promise<ICurrentUser[]> => {
	const { data } = await axiosInstance.get(
		`${server_domain}/users/list/${date}`,
		{
			withCredentials: true,
		}
	);
	return data;
};

//TODO check if js date => JSON => js date is valid
const useSuggestedFriends = () => {
	const getSuggestedFriendsQuery = useInfiniteQuery(
		['users', 'suggested friends'],
		({ pageParam }) => getSuggestedFriends(pageParam),
		{
			getNextPageParam: (lastPage) =>
				lastPage.length ? lastPage[lastPage.length - 1].createdAt : undefined,
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
