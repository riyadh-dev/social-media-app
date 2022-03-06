import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { IPost } from '../../interfaces';
import useIntersectionObserver from '../useIntersectionObserver';

const server_domain = 'http://localhost:4000/api';

const getTimeline = async (
	userId: string | undefined,
	date: number = Date.now()
): Promise<IPost[]> => {
	if (!userId) Promise.reject(new Error('Invalid id'));
	const { data } = await axios.get(
		`${server_domain}/posts/timeline/${userId}/${date}`,
		{
			withCredentials: true,
		}
	);
	return data;
};

const useTimeline = (userId: string | undefined) => {
	const postInfiniteQuery = useInfiniteQuery(
		['posts', 'timeline', userId],
		({ pageParam }) => getTimeline(userId, pageParam),
		{
			getNextPageParam: (lastPage) =>
				lastPage.length
					? Date.parse(lastPage[lastPage.length - 1].createdAt)
					: undefined,
			enabled: Boolean(userId),
		}
	);
	const intersectionItemRef = useIntersectionObserver({
		onIntersection: postInfiniteQuery.fetchNextPage,
		enable: !postInfiniteQuery.isLoading,
	});

	return {
		intersectionItemRef,
		...postInfiniteQuery,
	};
};

export default useTimeline;
